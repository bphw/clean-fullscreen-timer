# Clean Fullscreen Countdown Timer

A clean, modern countdown timer web application with keyboard controls, sound effects, and theme switching capabilities. Inspired by [Full-screen timer](https://github.com/alphakevin/fullscreen-timer).

## Features

✨ **Minimal Keyboard Interface**
- Use arrow keys (↑↓) to adjust time
- Use arrow keys (←→) to switch between minutes and seconds
- Press SPACE to start/stop the timer
- Press R to reset the timer

🔊 **Sound Effects**
- Airplane cabin chime sound when timer reaches 00:00
- Generated using Web Audio API for consistent experience

⚡ **Visual Effects**
- Screen blinks red during the last 5 seconds
- Smooth animations and transitions
- Active section highlighting

🎨 **Theme Support**
- Light and dark theme toggle
- Persistent theme preference
- Modern, clean design

📱 **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Touch-friendly interface
- Optimized for all screen sizes

🤠 ** Retro Style **
- Retro-style timer display
- Classic flip clock effect
- Retro theme with classic colors
- Retro-style controls

## Usage

1. **Setting Time**: Use ↑↓ arrow keys to increase/decrease the selected time unit
2. **Switching Units**: Use ←→ arrow keys to switch between minutes and seconds
3. **Starting Timer**: Press SPACE to start the countdown
4. **Pausing**: Press SPACE again to pause the running timer
5. **Resetting**: Press R to reset the timer to default (5:00)
6. **Theme Toggle**: Click the theme button in the top-right corner

## Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Upload all files (`index.html`, `style.css`, `script.js`, `README.md`)
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" and choose "main" branch
5. Your timer will be available at `https://yourusername.github.io/repositoryname`

## Files Structure

```
countdowntimer/
├── index.html      # Main HTML structure
├── style.css       # Styling and themes
├── script.js       # Timer logic and interactions
└── README.md       # Documentation
```

## Browser Compatibility

- Chrome/Edge 60+
- Firefox 55+
- Safari 11+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Features

- **Web Audio API**: For generating airplane cabin chime sound
- **CSS Custom Properties**: For theme switching
- **Local Storage**: For theme persistence
- **Responsive CSS Grid/Flexbox**: For layout
- **ES6 Classes**: For clean, maintainable code

## License

MIT License - feel free to use and modify as needed.