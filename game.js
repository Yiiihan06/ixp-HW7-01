// Glass Bridge 3D Game
class GlassBridgeGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.tiles = [];
        this.player = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredTile = null;
        this.isAnimating = false;
        this.interactionEnabled = false;
        this.currentStep = 0;
        this.totalSteps = 10;
        this.safeTileIndex = 0;
        this.startPlatform = null;

        // Audio contexts
        this.audioContext = null;
        this.hoverSound = null;
        this.isPlayingHover = false;

        this.init();
        this.setupEventListeners();
    }

    init() {
        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

        // Setup camera - slightly tilted top-down view
        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 12);
        this.camera.lookAt(0, 0, 0);

        // Setup renderer
        const canvas = document.getElementById('game-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        const backLight = new THREE.DirectionalLight(0x6699ff, 0.3);
        backLight.position.set(-5, 5, -5);
        this.scene.add(backLight);

        // Create starting platform
        this.createStartPlatform();

        // Start animation loop
        this.animate();
    }

    createStartPlatform() {
        const geometry = new THREE.BoxGeometry(2, 0.2, 1.5);
        const material = new THREE.MeshPhongMaterial({
            color: 0x4444aa,
            transparent: true,
            opacity: 0.7,
            shininess: 100
        });
        this.startPlatform = new THREE.Mesh(geometry, material);
        this.startPlatform.position.set(0, 0, 5);
        this.startPlatform.castShadow = true;
        this.startPlatform.receiveShadow = true;
        this.scene.add(this.startPlatform);

        // Create player on start platform
        this.createPlayer();
        this.player.position.set(0, 0.8, 5);
    }

    createPlayer() {
        // Create emoji as a sprite with canvas texture
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Draw emoji
        ctx.font = '100px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🧍‍♂️', 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

        this.player = new THREE.Sprite(spriteMaterial);
        this.player.scale.set(1, 1, 1);
        this.scene.add(this.player);
    }

    createTilePair(zPosition) {
        const tileGeometry = new THREE.BoxGeometry(1.5, 0.15, 1.5);

        // Left tile
        const leftMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xaaccff,
            transparent: true,
            opacity: 0.4,
            roughness: 0.1,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            reflectivity: 1
        });
        const leftTile = new THREE.Mesh(tileGeometry, leftMaterial);
        leftTile.position.set(-2, 0, zPosition);
        leftTile.castShadow = true;
        leftTile.receiveShadow = true;
        leftTile.userData = {
            side: 'left',
            isSafe: false,
            originalColor: 0xaaccff,
            zPosition: zPosition
        };

        // Right tile
        const rightMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xaaccff,
            transparent: true,
            opacity: 0.4,
            roughness: 0.1,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            reflectivity: 1
        });
        const rightTile = new THREE.Mesh(tileGeometry, rightMaterial);
        rightTile.position.set(2, 0, zPosition);
        rightTile.castShadow = true;
        rightTile.receiveShadow = true;
        rightTile.userData = {
            side: 'right',
            isSafe: false,
            originalColor: 0xaaccff,
            zPosition: zPosition
        };

        // Randomly assign one as safe
        this.safeTileIndex = Math.random() < 0.5 ? 0 : 1;
        if (this.safeTileIndex === 0) {
            leftTile.userData.isSafe = true;
        } else {
            rightTile.userData.isSafe = true;
        }

        // Add glow outline
        this.addGlowOutline(leftTile);
        this.addGlowOutline(rightTile);

        this.scene.add(leftTile);
        this.scene.add(rightTile);

        this.tiles = [leftTile, rightTile];
    }

    addGlowOutline(tile) {
        const outlineGeometry = new THREE.BoxGeometry(1.6, 0.2, 1.6);
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0,
            side: THREE.BackSide
        });
        const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
        outline.visible = false;
        tile.add(outline);
        tile.userData.outline = outline;
    }

    startGame() {
        this.currentStep = 0;
        this.updateStepCounter();

        // Hide start screen
        document.getElementById('start-screen').classList.add('hidden');

        // Create first tile pair
        this.createTilePair(2);
        this.interactionEnabled = true;
    }

    nextStep() {
        this.currentStep++;
        this.updateStepCounter();

        if (this.currentStep >= this.totalSteps) {
            this.victory();
            return;
        }

        // Remove old tiles
        this.tiles.forEach(tile => this.scene.remove(tile));
        this.tiles = [];

        // Create new tile pair
        this.createTilePair(2);
        this.interactionEnabled = true;

        // Hide message
        document.getElementById('message-container').classList.add('hidden');
    }

    updateStepCounter() {
        document.getElementById('current-step').textContent = this.currentStep;
    }

    victory() {
        this.interactionEnabled = false;
        document.getElementById('victory-screen').classList.remove('hidden');

        // Animate player celebrating
        this.animateVictory();
    }

    animateVictory() {
        let startY = this.player.position.y;
        let time = 0;

        const celebrate = () => {
            if (!this.interactionEnabled) {
                time += 0.05;
                this.player.position.y = startY + Math.sin(time * 5) * 0.3;
                this.player.scale.x = 1 + Math.sin(time * 10) * 0.1;
                requestAnimationFrame(celebrate);
            }
        };
        celebrate();
    }

    gameOver() {
        this.interactionEnabled = false;

        // Show red flash
        const flash = document.getElementById('red-flash');
        flash.classList.remove('hidden');
        setTimeout(() => flash.classList.add('hidden'), 500);

        // Show message
        this.showMessage('You fell!', 'retry');

        // Play shatter sound
        this.playShatterSound();
    }

    showMessage(text, buttonType) {
        const messageContainer = document.getElementById('message-container');
        const messageText = document.getElementById('message-text');
        const nextButton = document.getElementById('next-button');
        const retryButton = document.getElementById('retry-button');

        messageText.textContent = text;
        messageContainer.classList.remove('hidden');

        if (buttonType === 'next') {
            nextButton.classList.remove('hidden');
            retryButton.classList.add('hidden');
        } else if (buttonType === 'retry') {
            retryButton.classList.remove('hidden');
            nextButton.classList.add('hidden');
        }
    }

    onTileClick(tile) {
        if (!this.interactionEnabled || this.isAnimating) return;

        this.isAnimating = true;
        this.interactionEnabled = false;
        this.stopHoverSound();
        this.clearHoverEffects();

        const targetX = tile.position.x;
        const targetZ = tile.position.z;

        if (tile.userData.isSafe) {
            // Safe tile - move player
            this.animatePlayerMove(targetX, targetZ, () => {
                this.playSuccessSound();
                this.showMessage('Stable.', 'next');
                this.isAnimating = false;
            });
        } else {
            // Fragile tile - break and fall
            this.animateTileBreak(tile, () => {
                this.animatePlayerFall(targetX, targetZ, () => {
                    this.gameOver();
                    this.isAnimating = false;
                });
            });
        }
    }

    animatePlayerMove(targetX, targetZ, callback) {
        const startX = this.player.position.x;
        const startY = this.player.position.y;
        const startZ = this.player.position.z;
        const jumpHeight = 1.5;
        const duration = 800;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeInOutCubic(progress);

            // Horizontal movement
            this.player.position.x = startX + (targetX - startX) * easeProgress;
            this.player.position.z = startZ + (targetZ - startZ) * easeProgress;

            // Jump arc
            const jumpProgress = Math.sin(progress * Math.PI);
            this.player.position.y = startY + jumpHeight * jumpProgress;

            // Slight bounce on landing
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Final bounce
                this.player.position.y = startY;
                callback();
            }
        };

        animate();
    }

    animatePlayerFall(targetX, targetZ, callback) {
        const startX = this.player.position.x;
        const startY = this.player.position.y;
        const startZ = this.player.position.z;
        const fallDistance = 20;
        const duration = 1500;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeInCubic(progress);

            this.player.position.x = startX + (targetX - startX) * progress;
            this.player.position.z = startZ + (targetZ - startZ) * progress;
            this.player.position.y = startY - fallDistance * easeProgress;

            // Rotation while falling
            this.player.material.rotation = progress * Math.PI * 2;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                callback();
            }
        };

        animate();
    }

    animateTileBreak(tile, callback) {
        const duration = 300;
        const startTime = Date.now();
        const startOpacity = tile.material.opacity;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Fade out and crack effect
            tile.material.opacity = startOpacity * (1 - progress);
            tile.rotation.x = Math.random() * 0.1 - 0.05;
            tile.rotation.z = Math.random() * 0.1 - 0.05;
            tile.position.y -= progress * 0.1;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                tile.visible = false;
                callback();
            }
        };

        animate();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    easeInCubic(t) {
        return t * t * t;
    }

    onMouseMove(event) {
        if (!this.interactionEnabled || this.isAnimating) {
            return;
        }

        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Check intersections with tiles
        const intersects = this.raycaster.intersectObjects(this.tiles);

        if (intersects.length > 0) {
            const newHoveredTile = intersects[0].object;

            if (this.hoveredTile !== newHoveredTile) {
                this.clearHoverEffects();
                this.hoveredTile = newHoveredTile;
                this.applyHoverEffect(this.hoveredTile);
                this.playHoverSound();
            }
        } else {
            if (this.hoveredTile) {
                this.clearHoverEffects();
                this.stopHoverSound();
                this.hoveredTile = null;
            }
        }
    }

    applyHoverEffect(tile) {
        // Brighten the hovered tile
        tile.material.opacity = 0.6;
        tile.material.emissive = new THREE.Color(0x00d4ff);
        tile.material.emissiveIntensity = 0.3;

        // Show outline
        if (tile.userData.outline) {
            tile.userData.outline.visible = true;
            tile.userData.outline.material.opacity = 0.4;
        }

        // Dim other tiles
        this.tiles.forEach(t => {
            if (t !== tile) {
                t.material.opacity = 0.2;
                t.material.emissive = new THREE.Color(0x000000);
            }
        });
    }

    clearHoverEffects() {
        this.tiles.forEach(tile => {
            tile.material.opacity = 0.4;
            tile.material.emissive = new THREE.Color(0x000000);
            tile.material.emissiveIntensity = 0;

            if (tile.userData.outline) {
                tile.userData.outline.visible = false;
                tile.userData.outline.material.opacity = 0;
            }
        });
    }

    onClick(event) {
        if (!this.interactionEnabled || this.isAnimating) {
            return;
        }

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.tiles);

        if (intersects.length > 0) {
            const clickedTile = intersects[0].object;
            this.onTileClick(clickedTile);
        }
    }

    // Audio System
    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playHoverSound() {
        if (this.isPlayingHover) return;

        if (!this.audioContext) {
            this.initAudio();
        }

        this.isPlayingHover = true;

        // Create a subtle creaking sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 200;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);

        oscillator.onended = () => {
            this.isPlayingHover = false;
        };
    }

    stopHoverSound() {
        this.isPlayingHover = false;
    }

    playSuccessSound() {
        if (!this.audioContext) {
            this.initAudio();
        }

        // Create a pleasant tap sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 440;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    playShatterSound() {
        if (!this.audioContext) {
            this.initAudio();
        }

        // Create glass shatter effect
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate white noise with decay
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        filter.type = 'highpass';
        filter.frequency.value = 1000;

        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        source.start(this.audioContext.currentTime);
    }

    reset() {
        // Reset game state
        this.currentStep = 0;
        this.isAnimating = false;
        this.interactionEnabled = false;
        this.updateStepCounter();

        // Remove all tiles
        this.tiles.forEach(tile => this.scene.remove(tile));
        this.tiles = [];

        // Reset player position
        if (this.player) {
            this.player.position.set(0, 0.8, 5);
            this.player.material.rotation = 0;
            this.player.scale.set(1, 1, 1);
        }

        // Hide all UI
        document.getElementById('message-container').classList.add('hidden');
        document.getElementById('victory-screen').classList.add('hidden');

        // Show start screen
        document.getElementById('start-screen').classList.remove('hidden');
    }

    setupEventListeners() {
        // Mouse events
        window.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        window.addEventListener('click', (e) => this.onClick(e), false);

        // Window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // UI buttons
        document.getElementById('start-button').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('next-button').addEventListener('click', () => {
            this.nextStep();
        });

        document.getElementById('retry-button').addEventListener('click', () => {
            this.reset();
        });

        document.getElementById('play-again-button').addEventListener('click', () => {
            this.reset();
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new GlassBridgeGame();
});
