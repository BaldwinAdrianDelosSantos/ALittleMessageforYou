/* ============================================
   Configuration - Easy to customize!
   ============================================ */
const CONFIG = {
    introText: "A little something\nfor you...",
    introSubtitle: "I made something just for you ♡",
    walkMessage: "Hey...",
    flowerText: "This is for you. 🌷",
    confessionLines: [
        "There's something...",
        "I've been wanting to tell you...",
        "I like you. ♡"
    ],
    messageText: `I don't really know the perfect way to say this,
so I decided to make something instead.

I've wanted to tell you this for a while.

I may not always know what to say,
but I wanted you to know how I feel.

I like you. ❤️`,
    senderName: "Someone",
    catMessage: "Thank you for reading this.",
    catSpeech: ["pspsps... 🐱", "He really wanted to tell you this."],
    musicSrc: "assets/music.mp3",
    catAnimationSrc: "assets/cat-animation.json",
    roseAnimationSrc: "assets/Rose.json"
};

/* ============================================
   State Management
   ============================================ */
let currentScene = 'intro';
let isTransitioning = false;
let musicEnabled = true;
let catClickCount = 0;
let lastCatInteraction = 0;
let confessionTimeouts = [];
let roseAnimation = null;
let catAnimation = null;

/* ============================================
   DOM Elements
   ============================================ */
const elements = {
    scenes: {
        intro: document.getElementById('scene-intro'),
        walk: document.getElementById('scene-walk'),
        flower: document.getElementById('scene-flower'),
        confession: document.getElementById('scene-confession'),
        message: document.getElementById('scene-message')
    },
    openBtn: document.getElementById('open-btn'),
    musicBtn: document.getElementById('music-btn'),
    musicIcon: document.getElementById('music-icon'),
    themeBtn: document.getElementById('theme-btn'),
    themeIcon: document.getElementById('theme-icon'),
    character: document.getElementById('character'),
    walkMessage: document.getElementById('walk-message'),
    flower: document.getElementById('flower'),
    flowerGlow: document.getElementById('flower-glow'),
    flowerMessage: document.getElementById('flower-message'),
    confessionLines: [
        document.getElementById('confession-line-1'),
        document.getElementById('confession-line-2'),
        document.getElementById('confession-main'),
        document.getElementById('confession-line-3')
    ],
    messageText: document.getElementById('message-text'),
    senderName: document.getElementById('sender-name'),
    replayBtn: document.getElementById('replay-btn'),
    smallCatContainer: document.getElementById('small-cat-container'),
    smallCat: document.getElementById('small-cat'),
    smallCatSpeech: document.getElementById('small-cat-speech'),
    heartsContainer: document.getElementById('hearts-container'),
    petalsContainer: document.getElementById('petals-container'),
    walkingHearts: document.getElementById('walking-hearts')
};

/* ============================================
   Audio Setup
   ============================================ */
let audio = null;

function initAudio() {
    if (audio) return;
    
    try {
        audio = new Audio(CONFIG.musicSrc);
        audio.loop = true;
        audio.volume = 0.2;
        
        const savedMuted = localStorage.getItem('loveConfession_muted');
        if (savedMuted === 'true') {
            musicEnabled = false;
            audio.muted = true;
        }
        
        updateMusicIcon();
    } catch (e) {
        console.warn('Could not initialize audio:', e);
        audio = null;
    }
}

function playMusic() {
    if (!audio) return;
    
    try {
        audio.play().then(() => {
            musicEnabled = true;
            updateMusicIcon();
        }).catch(err => {
            console.warn('Could not play music:', err);
        });
    } catch (e) {
        console.warn('Audio error:', e);
    }
}

function toggleMusic() {
    if (!audio) return;
    
    musicEnabled = !musicEnabled;
    audio.muted = !musicEnabled;
    localStorage.setItem('loveConfession_muted', !musicEnabled);
    updateMusicIcon();
}

function updateMusicIcon() {
    if (!elements.musicIcon) return;
    elements.musicIcon.textContent = musicEnabled ? '🔊' : '🔇';
}

/* ============================================
   Dark Mode
   ============================================ */
function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('loveConfession_theme', newTheme);
    
    if (elements.themeIcon) {
        elements.themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('loveConfession_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    
    if (elements.themeIcon) {
        elements.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

/* ============================================
   Scene Management
   ============================================ */
function goToScene(sceneName) {
    if (isTransitioning) return;
    if (currentScene === sceneName) return;
    
    isTransitioning = true;
    
    const currentSceneEl = elements.scenes[currentScene];
    const nextSceneEl = elements.scenes[sceneName];
    
    if (!currentSceneEl || !nextSceneEl) {
        isTransitioning = false;
        return;
    }
    
    // Hide current scene
    currentSceneEl.classList.remove('active');
    
    // Show next scene
    nextSceneEl.classList.add('active');
    
    currentScene = sceneName;
    
    // Show music and theme buttons after first scene
    if (sceneName !== 'intro') {
        elements.musicBtn.classList.add('visible');
        if (elements.themeBtn) {
            elements.themeBtn.classList.add('visible');
        }
    }
    
    // Trigger scene-specific animations
    setTimeout(() => {
        onSceneEnter(sceneName);
        isTransitioning = false;
    }, 500);
}

function onSceneEnter(sceneName) {
    switch (sceneName) {
        case 'walk':
            startWalkScene();
            break;
        case 'flower':
            startFlowerScene();
            break;
        case 'confession':
            startConfessionScene();
            break;
        case 'message':
            startMessageScene();
            break;
    }
}

/* ============================================
   Scene 2: Walk
   ============================================ */
function startWalkScene() {
    // Show character walking
    setTimeout(() => {
        elements.character.classList.add('walking');
    }, 300);
    
    // Show walk message after character arrives
    setTimeout(() => {
        elements.walkMessage.textContent = CONFIG.walkMessage;
        elements.walkMessage.classList.add('visible');
    }, 4000);
    
    // Create walking hearts
    const walkInterval = setInterval(() => {
        if (currentScene !== 'walk') {
            clearInterval(walkInterval);
            return;
        }
        createHeart(elements.walkingHearts, Math.random() * 100);
    }, 800);
    
    // Transition to flower scene
    setTimeout(() => {
        goToScene('flower');
    }, 7000);
}

/* ============================================
   Scene 3: Flower
   ============================================ */
function startFlowerScene() {
    // Load rose Lottie animation
    loadRoseAnimation();
    
    // Show flower container
    setTimeout(() => {
        elements.flower.classList.add('visible');
        elements.flowerGlow.classList.add('visible');
    }, 300);
    
    // Give flower animation
    setTimeout(() => {
        elements.flower.classList.add('give');
    }, 1500);
    
    // Show flower message
    setTimeout(() => {
        elements.flowerMessage.textContent = CONFIG.flowerText;
        elements.flowerMessage.classList.add('visible');
    }, 2000);
    
    // Create petals
    const petalInterval = setInterval(() => {
        if (currentScene !== 'flower') {
            clearInterval(petalInterval);
            return;
        }
        createPetal();
    }, 400);
    
    // Transition to confession
    setTimeout(() => {
        clearInterval(petalInterval);
        goToScene('confession');
    }, 5000);
}

/* ============================================
   Scene 4: Confession
   ============================================ */
function startConfessionScene() {
    const lines = CONFIG.confessionLines;
    const lineElements = elements.confessionLines;
    
    // Clear any existing timeouts
    confessionTimeouts.forEach(t => clearTimeout(t));
    confessionTimeouts = [];
    
    // Show lines sequentially
    let delay = 500;
    
    lines.forEach((text, index) => {
        const timeout = setTimeout(() => {
            lineElements[index].textContent = text;
            lineElements[index].classList.add('visible');
            
            // Create hearts on main confession
            if (index === 2) {
                const heartInterval = setInterval(() => {
                    if (currentScene !== 'confession') {
                        clearInterval(heartInterval);
                        return;
                    }
                    createHeart(
                        document.getElementById('floating-hearts-confession'),
                        Math.random() * 100
                    );
                }, 300);
            }
        }, delay);
        
        confessionTimeouts.push(timeout);
        delay += 1500;
    });
    
    // Transition to message scene
    const finalTimeout = setTimeout(() => {
        goToScene('message');
    }, delay + 2000);
    confessionTimeouts.push(finalTimeout);
}

/* ============================================
   Scene 5: Message
   ============================================ */
function startMessageScene() {
    elements.senderName.textContent = CONFIG.senderName;
    elements.messageText.textContent = CONFIG.messageText;
    
    setTimeout(() => {
        elements.messageText.parentElement.parentElement.classList.add('visible');
        elements.messageText.classList.add('visible');
        elements.senderName.parentElement.classList.add('visible');
    }, 300);
    
    setTimeout(() => {
        elements.replayBtn.classList.add('visible');
    }, 1500);
    
    // Load small cat animation
    setTimeout(() => {
        loadSmallCatAnimation();
    }, 500);
}

/* ============================================
   Cat Animation
   ============================================ */
function loadRoseAnimation() {
    const roseContainer = document.getElementById('rose-container');
    
    if (roseAnimation) {
        roseAnimation.destroy();
        roseAnimation = null;
    }
    
    if (typeof lottie !== 'undefined') {
        try {
            roseAnimation = lottie.loadAnimation({
                container: roseContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: CONFIG.roseAnimationSrc
            });
            
            roseAnimation.setSpeed(0.5);
            
            roseAnimation.addEventListener('data_failed', () => {
                console.warn('Rose Lottie animation failed to load');
            });
        } catch (e) {
            console.warn('Could not load rose animation:', e);
        }
    } else {
        console.warn('Lottie library not loaded');
    }
}

function loadSmallCatAnimation() {
    const catContainer = elements.smallCatContainer;
    
    if (!catContainer) return;
    
    // Show fallback immediately
    loadCatFallback();
    
    if (catAnimation) {
        catAnimation.destroy();
        catAnimation = null;
    }
    
    // Wait for container to be visible, then load Lottie
    setTimeout(() => {
        if (typeof lottie !== 'undefined') {
            try {
                catAnimation = lottie.loadAnimation({
                    container: catContainer,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: CONFIG.catAnimationSrc
                });
                
                catAnimation.addEventListener('DOMLoaded', () => {
                    // Clear fallback once Lottie loads
                    const fallback = catContainer.querySelector('.small-cat-fallback');
                    if (fallback) {
                        fallback.style.display = 'none';
                    }
                });
                
                catAnimation.addEventListener('data_failed', () => {
                    console.warn('Cat Lottie animation failed to load, using fallback');
                    loadCatFallback();
                });
            } catch (e) {
                console.warn('Could not load cat animation:', e);
                loadCatFallback();
            }
        } else {
            console.warn('Lottie library not loaded, using CSS fallback');
            loadCatFallback();
        }
    }, 300);
}

function loadCatFallback() {
    const catContainer = elements.smallCatContainer;
    catContainer.innerHTML = '<div class="small-cat-fallback">🐱</div>';
}

/* ============================================
   Cat Interaction
   ============================================ */
function handleCatInteraction(e) {
    const now = Date.now();
    if (now - lastCatInteraction < 500) return;
    lastCatInteraction = now;
    
    e.preventDefault();
    
    catClickCount++;
    
    // Create hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createHeart(elements.heartsContainer, 50 + Math.random() * 100);
        }, i * 100);
    }
    
    // Show speech
    const speechIndex = Math.min(catClickCount - 1, CONFIG.catSpeech.length - 1);
    elements.smallCatSpeech.textContent = CONFIG.catSpeech[speechIndex];
    elements.smallCatSpeech.classList.add('visible');
    
    // Bounce animation
    elements.smallCatContainer.classList.remove('bounce');
    elements.smallCatContainer.offsetHeight;
    elements.smallCatContainer.classList.add('bounce');
    
    // Hide speech after delay
    setTimeout(() => {
        elements.smallCatSpeech.classList.remove('visible');
    }, 3000);
    
    // Reset count after a while
    if (catClickCount >= CONFIG.catSpeech.length) {
        setTimeout(() => {
            catClickCount = 0;
        }, 10000);
    }
}

/* ============================================
   Particle Effects
   ============================================ */
function createHeart(container, xPercent) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['♡', '♥', '💕', '💗'][Math.floor(Math.random() * 4)];
    heart.style.left = xPercent + '%';
    heart.style.bottom = '10%';
    heart.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
    heart.style.animationDuration = (3 + Math.random() * 2) + 's';
    heart.style.animationDelay = Math.random() * 0.5 + 's';
    
    container.appendChild(heart);
    
    // Remove after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 5000);
}

function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'floating-petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.top = '-10px';
    petal.style.animationDuration = (5 + Math.random() * 3) + 's';
    petal.style.animationDelay = Math.random() * 0.5 + 's';
    
    elements.petalsContainer.appendChild(petal);
    
    setTimeout(() => {
        if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
        }
    }, 8000);
}

function createTouchHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['♡', '♥', '💕'][Math.floor(Math.random() * 3)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (1 + Math.random() * 0.5) + 'rem';
    heart.style.animationDuration = (2 + Math.random() * 1) + 's';
    
    elements.heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 3000);
}

/* ============================================
   Mouse Parallax
   ============================================ */
function handleMouseMove(e) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const xPercent = (clientX / innerWidth - 0.5) * 2;
    const yPercent = (clientY / innerHeight - 0.5) * 2;
    
    // Move floating hearts slightly
    elements.heartsContainer.style.transform = 
        `translate(${xPercent * 5}px, ${yPercent * 5}px)`;
    
    // Move petals slightly
    elements.petalsContainer.style.transform = 
        `translate(${xPercent * 3}px, ${yPercent * 3}px)`;
}

/* ============================================
   Touch Interaction
   ============================================ */
function handleTouch(e) {
    if (e.target.closest('button')) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    createTouchHeart(touch.clientX, touch.clientY);
}

/* ============================================
   Replay
   ============================================ */
function resetExperience() {
    // Clear all timeouts
    confessionTimeouts.forEach(t => clearTimeout(t));
    confessionTimeouts = [];
    
    // Destroy Lottie animations
    if (roseAnimation) {
        roseAnimation.destroy();
        roseAnimation = null;
    }
    if (catAnimation) {
        catAnimation.destroy();
        catAnimation = null;
    }
    
    // Reset all scenes
    Object.values(elements.scenes).forEach(scene => {
        scene.classList.remove('active', 'blur-out', 'zoom-in');
    });
    
    // Reset elements
    elements.character.classList.remove('walking');
    elements.walkMessage.classList.remove('visible');
    elements.flower.classList.remove('visible', 'give');
    elements.flowerGlow.classList.remove('visible');
    elements.flowerMessage.classList.remove('visible');
    
    elements.confessionLines.forEach(line => {
        line.classList.remove('visible');
        line.textContent = '';
    });
    
    elements.messageText.classList.remove('visible');
    elements.messageText.parentElement.parentElement.classList.remove('visible');
    elements.senderName.parentElement.classList.remove('visible');
    elements.replayBtn.classList.remove('visible');
    
    // Reset small cat
    if (elements.smallCatContainer) {
        elements.smallCatContainer.innerHTML = '';
    }
    if (elements.smallCatSpeech) {
        elements.smallCatSpeech.classList.remove('visible');
    }
    
    // Reset state
    currentScene = 'intro';
    catClickCount = 0;
    
    // Show intro scene
    setTimeout(() => {
        elements.scenes.intro.classList.add('active');
    }, 100);
    
    // Hide music and theme buttons
    elements.musicBtn.classList.remove('visible');
    if (elements.themeBtn) {
        elements.themeBtn.classList.remove('visible');
    }
    
    // Clear particles
    elements.heartsContainer.innerHTML = '';
    elements.petalsContainer.innerHTML = '';
    elements.walkingHearts.innerHTML = '';
}

/* ============================================
   Initialization
   ============================================ */
function init() {
    // Load saved theme
    loadTheme();
    
    // Set up event listeners
    elements.openBtn.addEventListener('click', () => {
        initAudio();
        playMusic();
        goToScene('walk');
    });
    
    elements.musicBtn.addEventListener('click', toggleMusic);
    
    if (elements.themeBtn) {
        elements.themeBtn.addEventListener('click', toggleTheme);
    }
    
    elements.replayBtn.addEventListener('click', resetExperience);
    
    elements.smallCatContainer.addEventListener('click', handleCatInteraction);
    elements.smallCatContainer.addEventListener('touchend', handleCatInteraction);
    
    // Touch interaction for hearts
    document.addEventListener('touchstart', handleTouch, { passive: true });
    
    // Mouse parallax
    document.addEventListener('mousemove', handleMouseMove);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (currentScene === 'intro') {
                elements.openBtn.click();
            }
        }
        
        if (e.key === 'r' || e.key === 'R') {
            if (currentScene === 'cat') {
                resetExperience();
            }
        }
    });
    
    // Auto-generate ambient particles
    setInterval(() => {
        if (currentScene !== 'intro') {
            createPetal();
        }
    }, 3000);
    
    // Set initial scene
    elements.scenes.intro.classList.add('active');
    
    console.log('💕 A Little Message for You - Ready');
    console.log('📝 Edit CONFIG in js/script.js to customize the message');
}

/* ============================================
   Start the app
   ============================================ */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
