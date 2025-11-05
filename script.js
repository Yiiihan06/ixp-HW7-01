// Audio elements
const audioElements = {
    lantern: document.getElementById('audio-lantern'),
    footprints: document.getElementById('audio-footprints'),
    webs: document.getElementById('audio-webs')
};

// Path elements
const paths = document.querySelectorAll('.path');
const pathLantern = document.getElementById('path-lantern');
const pathFootprints = document.getElementById('path-footprints');
const pathWebs = document.getElementById('path-webs');

// Outcome elements
const outcomeOverlay = document.getElementById('outcome-overlay');
const outcomeText = document.getElementById('outcome-text');
const outcomeButton = document.getElementById('outcome-button');
const bloodSplash = document.getElementById('blood-splash');

// State management
let isInteractionLocked = false;
let currentlyPlayingAudio = null;

// Map paths to their audio
const pathAudioMap = {
    'path-lantern': audioElements.lantern,
    'path-footprints': audioElements.footprints,
    'path-webs': audioElements.webs
};

// Initialize audio volumes
Object.values(audioElements).forEach(audio => {
    audio.volume = 0.5;
});

/**
 * Stop all currently playing audio
 */
function stopAllAudio() {
    Object.values(audioElements).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    currentlyPlayingAudio = null;
}

/**
 * Play audio for a specific path
 * @param {HTMLAudioElement} audio - The audio element to play
 */
function playAudio(audio) {
    // Stop any currently playing audio first
    stopAllAudio();

    // Play the new audio
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.log('Audio play prevented:', err);
        });
        currentlyPlayingAudio = audio;
    }
}

/**
 * Dim all paths except the hovered one
 * @param {HTMLElement} hoveredPath - The path being hovered
 */
function dimOtherPaths(hoveredPath) {
    paths.forEach(path => {
        if (path !== hoveredPath) {
            path.classList.add('dimmed');
        }
    });
}

/**
 * Reset all paths to default brightness
 */
function resetPathBrightness() {
    paths.forEach(path => {
        path.classList.remove('dimmed');
    });
}

/**
 * Handle mouse enter on a path
 * @param {Event} event - The mouse enter event
 */
function handlePathHover(event) {
    if (isInteractionLocked) return;

    const path = event.currentTarget;
    const pathId = path.id;
    const audio = pathAudioMap[pathId];

    // Highlight this path and dim others
    dimOtherPaths(path);

    // Play the associated audio
    playAudio(audio);
}

/**
 * Handle mouse leave from a path
 * @param {Event} event - The mouse leave event
 */
function handlePathLeave(event) {
    if (isInteractionLocked) return;

    // Reset all paths to default brightness
    resetPathBrightness();

    // Stop all audio
    stopAllAudio();
}

/**
 * Handle path click
 * @param {Event} event - The click event
 */
function handlePathClick(event) {
    if (isInteractionLocked) return;

    const path = event.currentTarget;
    const pathId = path.id;

    // Lock further interactions
    isInteractionLocked = true;

    // Disable hover logic on all paths
    paths.forEach(p => p.classList.add('disabled'));

    // Stop all audio
    stopAllAudio();

    // Determine outcome based on clicked path
    if (pathId === 'path-webs') {
        // Safe outcome (Path 3)
        showSafeOutcome();
    } else {
        // Death outcome (Path 1 or Path 2)
        showDeathOutcome();
    }
}

/**
 * Show safe outcome
 */
function showSafeOutcome() {
    // Set outcome text and button
    outcomeText.textContent = 'You escaped!';
    outcomeButton.textContent = 'Continue';

    // Show overlay without blood splash
    setTimeout(() => {
        outcomeOverlay.classList.add('active');
    }, 300);
}

/**
 * Show death outcome with blood splash animation
 */
function showDeathOutcome() {
    // Trigger blood splash animation
    bloodSplash.classList.add('active');

    // Set outcome text and button
    outcomeText.textContent = 'You were captured!';
    outcomeButton.textContent = 'Retry';

    // Show overlay after blood splash animation
    setTimeout(() => {
        outcomeOverlay.classList.add('active');
    }, 600);
}

/**
 * Reset the scene for retry
 */
function resetScene() {
    // Hide overlay
    outcomeOverlay.classList.remove('active');
    bloodSplash.classList.remove('active');

    // Re-enable paths
    paths.forEach(p => p.classList.remove('disabled'));

    // Reset interaction lock
    isInteractionLocked = false;

    // Reset path brightness
    resetPathBrightness();

    // Stop all audio
    stopAllAudio();
}

/**
 * Handle outcome button click
 */
function handleOutcomeButtonClick() {
    const buttonText = outcomeButton.textContent;

    if (buttonText === 'Retry') {
        // Reset the scene for another attempt
        resetScene();
    } else if (buttonText === 'Continue') {
        // Progress to next stage (placeholder - could navigate to another page)
        alert('Congratulations! Proceeding to Stage 2...');
        resetScene();
    }
}

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    // Add hover and click listeners to each path
    paths.forEach(path => {
        path.addEventListener('mouseenter', handlePathHover);
        path.addEventListener('mouseleave', handlePathLeave);
        path.addEventListener('click', handlePathClick);
    });

    // Add click listener to outcome button
    outcomeButton.addEventListener('click', handleOutcomeButtonClick);
}

/**
 * Initialize the application
 */
function init() {
    initializeEventListeners();
    console.log('Stage 1: Choose Your Path - Initialized');
}

// Start the application when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
