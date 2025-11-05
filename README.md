# Glass Bridge Trial - 3D Interactive Game

A minimalist 3D game where you navigate across a suspended glass bridge by choosing between safe and fragile tiles. Test your luck and reach the other side!

## Features

- **3D Graphics**: Built with Three.js for smooth 3D rendering
- **Interactive Gameplay**: Hover to preview tiles, click to step
- **Dynamic Audio**: Procedural sound effects for hover, success, and failure
- **Smooth Animations**: Character movement, tile breaking, and falling effects
- **Responsive Design**: Works on desktop and mobile devices
- **Progressive Difficulty**: 10 steps to complete the bridge

## How to Play

1. Open `index.html` in a modern web browser
2. Click "Start Game" to begin
3. Hover over tiles to preview them (they will highlight)
4. Click on a tile to step on it
5. **Safe tiles** support your character and let you continue
6. **Fragile tiles** break and cause you to fall
7. Complete all 10 steps to reach the other side and win!

## Game Mechanics

- **Hover Effect**: Tiles highlight when you hover over them with a subtle creaking sound
- **Safe Tile**: Plays a tap sound and shows "Stable" message
- **Fragile Tile**: Breaks with a shattering sound and triggers game over
- **Progressive Steps**: Each successful step presents a new pair of tiles
- **Victory**: Reach the end to see the victory screen

## Technical Details

- **Renderer**: Three.js (WebGL)
- **Audio**: Web Audio API for procedural sound generation
- **Animations**: Custom easing functions for smooth movement
- **Materials**: Physical-based materials with reflections for glass effect
- **Lighting**: Ambient + directional lights with shadows

## Files

- `index.html` - Main game HTML structure
- `styles.css` - Styling and responsive design
- `game.js` - Game logic, Three.js setup, and interactions

## Browser Compatibility

Requires a modern browser with WebGL and Web Audio API support:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Controls

- **Mouse**: Hover to preview, click to select tiles
- **Buttons**: UI buttons for starting, retrying, and progressing

Enjoy the challenge and good luck crossing the bridge!