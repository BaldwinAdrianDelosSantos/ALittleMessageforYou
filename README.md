# A Little Message for You 💕

An interactive romantic confession website that tells a cute animated story.

## 🚀 Quick Start

### Run Locally

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. That's it! No server required.

### Customize the Message

Open `js/script.js` and edit the `CONFIG` object:

```javascript
const CONFIG = {
    walkMessage: "Hey...",
    flowerText: "This is for you. 🌷",
    confessionLines: [
        "There's something...",
        "I've been wanting to tell you...",
        "I like you. ♡"
    ],
    messageText: `Your personal message here...`,
    senderName: "Your Name",
    catMessage: "Thank you for reading this.",
    catSpeech: ["pspsps... 🐱", "He really wanted to tell you this."]
};
```

## 📁 Project Structure

```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── cat.json          (cat Lottie animation)
│   ├── music.mp3         (background music)
│   └── music.txt         (music placeholder/instructions)
└── README.md
```

## 🎵 Add Background Music

1. Find a soft instrumental song (royalty-free recommended)
2. Convert it to MP3 format
3. Replace `assets/music.txt` with your file named `music.mp3`
4. Adjust the volume in `js/script.js`:
   ```javascript
   audio.volume = 0.2; // 0.0 to 1.0 (recommended: 0.15-0.25)
   ```

## 🐱 Replace the Cat Animation

The website currently uses a CSS-animated cat as a fallback. To use a Lottie animation:

1. Download a cat Lottie animation from [LottieFiles](https://lottiefiles.com/)
2. Save the JSON file as `assets/cat.json`
3. Open `js/script.js` and uncomment the Lottie loading code in `loadCatAnimation()`:
   ```javascript
   function loadCatAnimation() {
       const catContainer = elements.catContainer;
       
       // Uncomment this if you have lottie-web loaded:
       // lottie.loadAnimation({
       //     container: catContainer,
       //     renderer: 'svg',
       //     loop: true,
       //     autoplay: true,
       //     path: CONFIG.catAnimationSrc
       // });
   }
   ```
4. Include the Lottie library in `index.html`:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
   ```

## 🌐 Deploy to GitHub Pages

1. Create a new GitHub repository (e.g., `ilike-you`)
2. Push all files to the repository
3. Go to **Settings → Pages**
4. Under **Source**, select **Deploy from a branch**
5. Select your branch (usually `main`) and `/root` folder
6. Click **Save**
7. Your site will be live at: `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`

## 📱 Generate QR Code

1. Once your GitHub Pages site is live, copy the URL
2. Go to a QR code generator (e.g., [QR Code Generator](https://www.qr-code-generator.com/))
3. Paste your URL
4. Download the QR code image
5. Print or share it!

## ✨ Features

- 📱 Fully responsive (mobile + desktop)
- 🎭 Animated story progression
- 🌸 Walking character with flower gift
- 💗 Sequential confession text
- 🐱 Interactive cat with Easter eggs
- 🔊 Background music with controls
- 🎨 Floating hearts and petals
- ♿ Accessibility support (reduced motion)
- ⌨️ Keyboard navigation
- 🔄 Replay button

## 🎨 Customization Tips

- **Colors**: Edit CSS variables in `css/style.css` (`--primary`, `--secondary`, `--accent`)
- **Fonts**: Change Google Fonts links in `index.html`
- **Speed**: Adjust timing in `js/script.js` scene functions
- **Particles**: Modify `createHeart()` and `createPetal()` functions

## 📝 Notes

- The website is completely frontend-only (no backend needed)
- All assets use relative paths for GitHub Pages compatibility
- Music starts only after user interaction (browser requirement)
- The cat animation falls back to CSS if Lottie file is missing

## 💖 Credits

Made with love for a special someone.

---

**Enjoy your confession!** ♡
