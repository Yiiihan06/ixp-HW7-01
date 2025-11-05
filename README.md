# 3D Cup and Ball Game

An interactive 3D implementation of the classic cup and ball guessing game, built with Three.js.

## Game Overview

Test your observation skills in this classic street magic trick! Watch as one of three cups hides a ball, then track it as the cups shuffle at increasing speeds. Can you identify which cup contains the ball?

## Features

### Visual Design
- **Minimalist aesthetic** with clean, neutral color palette
- **Soft shadows** and anti-aliasing for smooth, realistic 3D rendering
- **Responsive design** that works on desktop and mobile devices

### 3D Scene
- Realistic **perspective camera** with optimized viewing angle
- **Soft lighting** using ambient and directional lights
- High-quality **shadow mapping** for depth perception
- Detailed 3D models:
  - White matte table surface
  - Coral red ball with smooth material
  - Three composite cups with body, bottom, and rim components

### Game Mechanics
- **6 game states**: intro, shuffling, waiting, revealing, celebrating, sorry
- **Intelligent shuffling algorithm**:
  - Speed increases from 1x to 4x over 5 seconds
  - Smooth ease-in-out animations for cup swaps
  - Arc motion during swaps for realistic movement
- **Interactive raycasting** for precise click detection
- **Fireworks celebration** for correct guesses (6 bursts, 40 particles each)
- **Visual feedback** for both success and failure

### Performance
- Optimized rendering with 60fps animation
- Efficient particle system for fireworks
- Proper memory management (particles auto-remove)
- Responsive to window resizing

## How to Play

1. **Open `index.html`** in a modern web browser
2. **Watch carefully** as the ball is revealed under one cup
3. **Observe** as the cups shuffle (they get faster!)
4. **Click a cup** when the shuffling stops
5. **See if you guessed correctly!**
   - ✓ Correct: Enjoy the fireworks celebration
   - Wrong: The correct cup will be revealed

## Technical Implementation

### Technologies Used
- **Three.js** (r128) - 3D graphics library
- **Vanilla JavaScript** - Game logic and state management
- **CSS3** - UI styling and animations
- **HTML5** - Structure and canvas container

### Key Components

#### 3D Objects
- **Table**: 15×0.3×8 units, white matte material
- **Ball**: 0.35 unit radius sphere, coral red (#ff6b6b)
- **Cups**: Composite groups containing:
  - Inverted cone body (0.6-1.0 radius, 1.5 height)
  - Circular bottom disc (1.0 radius)
  - Torus rim (0.6 radius, 0.04 tube)

#### Shuffling Algorithm
```
Speed Multiplier = 1 + (elapsed / duration) × 3
Swap Interval = 0.8 / speed
Animation: Ease-in-out with arc motion
```

#### Fireworks System
- 6 sequential bursts (400ms apart)
- 40 particles per burst
- 360° radial distribution
- Gravity-affected physics
- Fade-out over 50 frames

## File Structure

```
ixp-HW7-01/
├── index.html          # Complete game implementation
└── README.md          # Documentation (this file)
```

## Browser Compatibility

Works best in modern browsers that support:
- WebGL
- ES6 JavaScript
- CSS3 transforms and transitions

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Running the Game

### Option 1: Direct File Access
Simply open `index.html` in your web browser

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Then open http://localhost:8000 in your browser
```

## Game States Explained

1. **Intro** (3 seconds)
   - Ball is revealed under randomly selected cup
   - Cup lifts and lowers to show position
   - Displays "Watch carefully..."

2. **Shuffling** (5 seconds)
   - Cups swap positions randomly
   - Speed accelerates from 1x to 4x
   - Ball remains hidden

3. **Waiting**
   - Shuffling complete
   - Displays "Click a cup!"
   - Player interaction enabled

4. **Revealing**
   - Selected cup lifts
   - 800ms animation delay

5. **Celebrating** (correct guess)
   - Ball becomes visible
   - Green checkmark displayed
   - Fireworks animation plays
   - New game starts after 3 seconds

6. **Sorry** (wrong guess)
   - "SORRY" message shown
   - Correct cup revealed after 1.5 seconds
   - New game starts after viewing correct answer

## Customization

You can modify these variables in `index.html`:

```javascript
// Shuffle duration (default: 5 seconds)
const shuffleDuration = 5;

// Firework colors
const colors = ['#4caf50', '#2196F3', '#ff9800', '#9c27b0', '#f44336'];

// Cup positions
let cupPositions = [-3, 0, 3];

// Speed multiplier range (1x to 4x)
shuffleSpeed = 1 + (shuffleTime / shuffleDuration) * 3;
```

## Performance Optimization

- **Shadow map resolution**: 2048×2048 (balanced quality/performance)
- **Pixel ratio**: Capped at 2x for high-DPI displays
- **Particle limit**: 240 total (6 bursts × 40 particles)
- **Geometry reuse**: Materials and geometries created once
- **Efficient raycasting**: Only active during waiting state

## Credits

Built following the complete specification for a 3D Cup and Ball Game implementation.

## License

This project is open source and available for educational purposes.