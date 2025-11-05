# Stage 1: Choose Your Path - Interactive Narrative Experience

A minimalist interactive scene representing Stage 1 of a narrative experience where users must choose one of three paths, each with unique visual and audio feedback.

## Features

### Three Unique Paths

1. **Path of Lanterns (Left)** - Death Path
   - Visual: Red lanterns with flickering animation
   - Audio: Fire crackling sound (looped on hover)
   - Outcome: Capture/Death

2. **Path of Footsteps (Center)** - Death Path
   - Visual: Footprint trail
   - Audio: Walking footsteps (looped on hover)
   - Outcome: Capture/Death

3. **Path of Webs (Right)** - Safe Path
   - Visual: Spider web patterns
   - Audio: Screaming sound (looped on hover)
   - Outcome: Escape/Safe

### Interactive Behavior

#### Hover Effects
- Hovering over a path highlights it and dims the other two paths
- Associated audio plays immediately and loops
- Only one path can be highlighted at a time
- Leaving the path area resets all paths and stops audio

#### Click Outcomes
- **Safe Outcome (Path 3)**: Shows "You escaped!" with a Continue button
- **Death Outcome (Path 1 or 2)**: Shows blood splash animation and "You were captured!" with a Retry button
- After clicking, hover effects are disabled until reset
- All audio stops on click

### Design Specifications

- **Minimalist Design**: Clean, uncluttered interface
- **Neutral Background**: Low contrast fog/mist gradient
- **Responsive Layout**: Adapts to different screen sizes
- **No Audio Overlap**: Only one sound plays at a time
- **Smooth Animations**: CSS transitions and keyframe animations

## File Structure

```
ixp-HW7-01/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Interactive behavior and logic
├── assets/             # Audio files directory
│   └── AUDIO_README.md # Audio requirements documentation
└── README.md           # This file
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ixp-HW7-01
```

### 2. Add Audio Files

Place the following audio files in the `assets/` directory:
- `fire-crackling.mp3` - for Path 1
- `footsteps.mp3` - for Path 2
- `screaming.mp3` - for Path 3

See `assets/AUDIO_README.md` for detailed audio requirements and free resources.

### 3. Open in Browser

Simply open `index.html` in a modern web browser:

```bash
# Using Python's built-in server
python3 -m http.server 8000

# Or using Node's http-server
npx http-server
```

Then navigate to `http://localhost:8000`

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Technical Implementation

### HTML Structure
- Semantic HTML5
- Three path containers with unique identifiers
- Outcome overlay with blood splash and result display
- Audio elements for each path

### CSS Features
- Flexbox for responsive layout
- CSS Grid for path visual elements
- Keyframe animations for lantern flicker and blood splash
- Media queries for mobile responsiveness
- Custom CSS art for lanterns, footprints, and spider webs

### JavaScript Functionality
- Event-driven architecture
- State management for interaction locking
- Audio control with overlap prevention
- Dynamic class manipulation for visual feedback
- Modular function design for maintainability

## Interaction Rules

1. **One Result Per Cycle**: Only one outcome can trigger per interaction
2. **No Audio Overlap**: Audio stops before new audio plays
3. **Disabled After Click**: Hover effects locked after path selection
4. **Reset Capability**: Retry button resets the entire scene
5. **Visual Feedback**: Clear visual indicators for all states

## Customization

### Changing Path Outcomes

Edit `script.js`, find the `handlePathClick` function:

```javascript
if (pathId === 'path-webs') {
    showSafeOutcome();
} else {
    showDeathOutcome();
}
```

### Adjusting Colors

Edit `style.css` to modify:
- Background gradient colors
- Lantern colors (red by default)
- Text colors
- Button styles

### Modifying Animations

Adjust keyframe animations in `style.css`:
- `@keyframes flicker` - lantern flicker effect
- `@keyframes bloodSplash` - death animation
- `@keyframes fadeIn` - outcome text appearance

## Performance Considerations

- Minimal DOM manipulation
- CSS transforms for smooth animations
- Lazy audio loading
- Optimized event listeners
- No external dependencies

## Future Enhancements

- Add Stage 2 and subsequent stages
- Implement progress saving
- Add narrative text/story elements
- Create different difficulty modes
- Add accessibility features (keyboard navigation, screen reader support)
- Implement sound on/off toggle

## License

This project is created for educational purposes.

## Credits

Created as an interactive experience homework assignment (ixp-HW7-01).