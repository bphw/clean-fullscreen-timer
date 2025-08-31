class CountdownTimer {
    constructor() {
        this.minutes = 5;
        this.seconds = 0;
        this.timeLeft = 300; // 5 minutes in seconds
        this.isRunning = false;
        this.intervalId = null;
        this.currentSection = 'minutes'; // 'minutes' or 'seconds'
        this.isBlinking = false;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
        this.loadTheme();
        this.loadStyle();
    }
    
    initializeElements() {
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.statusElement = document.getElementById('statusText');
        this.themeToggle = document.getElementById('themeToggle');
        this.styleToggle = document.getElementById('styleToggle');
        this.chimeSound = document.getElementById('chimeSound');
        this.minutesSection = document.querySelector('.minutes-section');
        this.secondsSection = document.querySelector('.seconds-section');
        this.container = document.querySelector('.container');
    }
    
    initializeEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            // Prevent default behavior for specific keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            this.handleKeyPress(e);
        });
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Style toggle
        this.styleToggle.addEventListener('click', () => this.toggleStyle());
    }
    
    handleKeyPress(e) {
        if (this.isRunning && !['Space', 'KeyR'].includes(e.code)) {
            return; // Only allow space and R when running
        }
        
        switch (e.code) {
            case 'ArrowUp':
                this.adjustTime(1);
                break;
            case 'ArrowDown':
                this.adjustTime(-1);
                break;
            case 'ArrowLeft':
                this.switchSection('minutes');
                break;
            case 'ArrowRight':
                this.switchSection('seconds');
                break;
            case 'Space':
                this.toggleTimer();
                break;
            case 'KeyR':
                this.resetTimer();
                break;
        }
    }
    
    adjustTime(delta) {
        if (this.currentSection === 'minutes') {
            this.minutes = Math.max(0, Math.min(99, this.minutes + delta));
        } else {
            this.seconds = Math.max(0, Math.min(59, this.seconds + delta));
        }
        // Update timeLeft to match minutes and seconds
        this.timeLeft = this.minutes * 60 + this.seconds;
        this.updateDisplay();
    }
    
    switchSection(section) {
        this.currentSection = section;
        this.updateActiveSection();
    }
    
    updateActiveSection() {
        this.minutesSection.classList.toggle('active', this.currentSection === 'minutes');
        this.secondsSection.classList.toggle('active', this.currentSection === 'seconds');
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        if (this.timeLeft <= 0) {
            return;
        }
        
        this.isRunning = true;
        document.body.classList.add('running');
        this.statusElement.textContent = 'Running';
        
        this.intervalId = setInterval(() => {
            this.timeLeft--;
            
            if (this.timeLeft <= 0) {
                this.timerComplete();
                return;
            }
            
            // Check for last 5 seconds
            if (this.timeLeft <= 5 && !this.isBlinking) {
                this.startBlinking();
            }
            
            // Update minutes and seconds for display consistency
            this.minutes = Math.floor(this.timeLeft / 60);
            this.seconds = this.timeLeft % 60;
            this.updateDisplay();
        }, 1000);
    }
    
    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        document.body.classList.remove('running');
        this.statusElement.textContent = 'Paused';
        this.stopBlinking();
    }
    
    resetTimer() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.minutes = 5;
        this.seconds = 0;
        this.timeLeft = 300; // 5 minutes in seconds
        document.body.classList.remove('running');
        this.statusElement.textContent = 'Ready';
        this.stopBlinking();
        this.updateDisplay();
    }
    
    timerComplete() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.minutes = 0;
        this.seconds = 0;
        document.body.classList.remove('running');
        this.statusElement.textContent = 'Time\'s up!';
        this.stopBlinking();
        this.updateDisplay();
        this.playChime();
    }
    
    startBlinking() {
        this.isBlinking = true;
        document.body.classList.add('blink');
    }
    
    stopBlinking() {
        this.isBlinking = false;
        document.body.classList.remove('blink');
    }
    
    playChime() {
        // Create airplane cabin chime sound using Web Audio API
        this.createChimeSound();
    }
    
    createChimeSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create authentic Airbus cabin chime with bass frequencies
            const duration = 3.0;
            const sampleRate = audioContext.sampleRate;
            const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
            const data = buffer.getChannelData(0);
            
            // Generate Airbus cabin chime: distinctive two-tone with bass
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                let sample = 0;
                
                // Bass foundation - continuous low frequency
                if (t < 2.5) {
                    const bassEnvelope = Math.exp(-t * 1.5) * (1 - Math.exp(-t * 10));
                    const bassFreq = 130.81; // C3 - bass note
                    const bass = Math.sin(2 * Math.PI * bassFreq * t) * bassEnvelope * 0.3;
                    sample += bass;
                }
                
                // First chime (high tone) - 0 to 1.0 seconds
                if (t < 1.0) {
                    const envelope1 = Math.exp(-t * 2.5) * (1 - Math.exp(-t * 15));
                    const freq1 = 1046.5; // C6 - high tone
                    const harmonic1 = Math.sin(2 * Math.PI * freq1 * t);
                    const harmonic2 = Math.sin(2 * Math.PI * freq1 * 2 * t) * 0.4;
                    const harmonic3 = Math.sin(2 * Math.PI * freq1 * 3 * t) * 0.2;
                    sample += (harmonic1 + harmonic2 + harmonic3) * envelope1 * 0.5;
                }
                
                // Second chime (lower tone) - 0.4 to 2.2 seconds
                if (t > 0.4 && t < 2.2) {
                    const t2 = t - 0.4;
                    const envelope2 = Math.exp(-t2 * 2.0) * (1 - Math.exp(-t2 * 12));
                    const freq2 = 783.99; // G5 - lower tone
                    const harmonic1 = Math.sin(2 * Math.PI * freq2 * t);
                    const harmonic2 = Math.sin(2 * Math.PI * freq2 * 2 * t) * 0.4;
                    const harmonic3 = Math.sin(2 * Math.PI * freq2 * 3 * t) * 0.2;
                    sample += (harmonic1 + harmonic2 + harmonic3) * envelope2 * 0.5;
                }
                
                // Mid-range warmth
                if (t < 2.0) {
                    const midEnvelope = Math.exp(-t * 2.2) * (1 - Math.exp(-t * 8));
                    const midFreq = 261.63; // C4 - mid tone
                    const mid = Math.sin(2 * Math.PI * midFreq * t) * midEnvelope * 0.2;
                    sample += mid;
                }
                
                // Add reverb effect
                if (t > 0.15) {
                    const delayIndex = Math.floor((t - 0.15) * sampleRate);
                    if (delayIndex < data.length && delayIndex >= 0) {
                        sample += data[delayIndex] * 0.2;
                    }
                }
                
                // Add second reverb for depth
                if (t > 0.3) {
                    const delayIndex2 = Math.floor((t - 0.3) * sampleRate);
                    if (delayIndex2 < data.length && delayIndex2 >= 0) {
                        sample += data[delayIndex2] * 0.1;
                    }
                }
                
                data[i] = Math.max(-1, Math.min(1, sample));
            }
            
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start();
            
        } catch (error) {
            console.log('Audio not supported or blocked');
            // Fallback: try to play the HTML audio element if it exists
            if (this.chimeSound && this.chimeSound.play) {
                this.chimeSound.play().catch(() => {
                    console.log('Fallback audio also failed');
                });
            }
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        const newMinutes = minutes.toString().padStart(2, '0');
        const newSeconds = seconds.toString().padStart(2, '0');
        
        // Trigger flip animation if value changed and in retro mode
        const isRetro = document.documentElement.getAttribute('data-style') === 'retro';
        
        if (isRetro) {
            if (this.minutesElement.textContent !== newMinutes) {
                this.triggerFlipAnimation(this.minutesElement, newMinutes);
            }
            if (this.secondsElement.textContent !== newSeconds) {
                this.triggerFlipAnimation(this.secondsElement, newSeconds);
            }
        } else {
            this.minutesElement.textContent = newMinutes;
            this.secondsElement.textContent = newSeconds;
        }
        
        // Set data attributes for flip effect
        this.minutesElement.setAttribute('data-value', newMinutes);
        this.secondsElement.setAttribute('data-value', newSeconds);
        this.updateActiveSection();
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.themeToggle.querySelector('.theme-icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
    }
    
    toggleStyle() {
        const currentStyle = document.documentElement.getAttribute('data-style');
        const newStyle = currentStyle === 'retro' ? 'default' : 'retro';
        
        document.documentElement.setAttribute('data-style', newStyle);
        this.styleToggle.querySelector('.style-label').textContent = newStyle === 'retro' ? 'Retro' : 'Default';
        
        // Save style preference
        localStorage.setItem('style', newStyle);
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.themeToggle.querySelector('.theme-icon').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    
    triggerFlipAnimation(element, newValue) {
        element.classList.add('flipping');
        
        setTimeout(() => {
            element.textContent = newValue;
        }, 300); // Half way through the animation
        
        setTimeout(() => {
            element.classList.remove('flipping');
        }, 600); // Full animation duration
    }
    
    loadStyle() {
        const savedStyle = localStorage.getItem('style') || 'default';
        document.documentElement.setAttribute('data-style', savedStyle);
        this.styleToggle.querySelector('.style-label').textContent = savedStyle === 'retro' ? 'Retro' : 'Default';
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});

// Handle visibility change to pause timer when tab is not active
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Optionally pause timer when tab is hidden
        // This can be uncommented if desired
        // timer.pauseTimer();
    }
});