class CountdownTimer {
    constructor() {
        this.minutes = 5;
        this.seconds = 0;
        this.totalSeconds = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.currentSection = 'minutes'; // 'minutes' or 'seconds'
        this.isBlinking = false;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
        this.loadTheme();
    }
    
    initializeElements() {
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.statusElement = document.getElementById('statusText');
        this.themeToggle = document.getElementById('themeToggle');
        this.chimeSound = document.getElementById('chimeSound');
        this.minutesSection = document.querySelector('.minutes-section');
        this.secondsSection = document.querySelector('.seconds-section');
        this.container = document.querySelector('.container');
    }
    
    initializeEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Prevent default behavior for arrow keys
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
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
        if (this.minutes === 0 && this.seconds === 0) {
            return;
        }
        
        this.isRunning = true;
        this.totalSeconds = this.minutes * 60 + this.seconds;
        document.body.classList.add('running');
        this.statusElement.textContent = 'Running';
        
        this.intervalId = setInterval(() => {
            this.totalSeconds--;
            
            if (this.totalSeconds <= 0) {
                this.timerComplete();
                return;
            }
            
            // Check for last 5 seconds
            if (this.totalSeconds <= 5 && !this.isBlinking) {
                this.startBlinking();
            }
            
            this.minutes = Math.floor(this.totalSeconds / 60);
            this.seconds = this.totalSeconds % 60;
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
        this.totalSeconds = 0;
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
            
            // Create authentic airplane cabin chime with two-tone ding-dong pattern
            const duration = 2.5;
            const sampleRate = audioContext.sampleRate;
            const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
            const data = buffer.getChannelData(0);
            
            // Generate airplane cabin chime: high tone followed by lower tone
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                let sample = 0;
                
                // First chime (high tone) - 0 to 0.8 seconds
                if (t < 0.8) {
                    const envelope1 = Math.exp(-t * 3) * (1 - Math.exp(-t * 20));
                    const freq1 = 1046.5; // C6 - high tone
                    const harmonic1 = Math.sin(2 * Math.PI * freq1 * t);
                    const harmonic2 = Math.sin(2 * Math.PI * freq1 * 2 * t) * 0.3;
                    const harmonic3 = Math.sin(2 * Math.PI * freq1 * 3 * t) * 0.1;
                    sample += (harmonic1 + harmonic2 + harmonic3) * envelope1 * 0.4;
                }
                
                // Second chime (lower tone) - 0.3 to 2.0 seconds
                if (t > 0.3 && t < 2.0) {
                    const t2 = t - 0.3;
                    const envelope2 = Math.exp(-t2 * 2.5) * (1 - Math.exp(-t2 * 15));
                    const freq2 = 783.99; // G5 - lower tone
                    const harmonic1 = Math.sin(2 * Math.PI * freq2 * t);
                    const harmonic2 = Math.sin(2 * Math.PI * freq2 * 2 * t) * 0.3;
                    const harmonic3 = Math.sin(2 * Math.PI * freq2 * 3 * t) * 0.1;
                    sample += (harmonic1 + harmonic2 + harmonic3) * envelope2 * 0.4;
                }
                
                // Add subtle reverb effect
                if (t > 0.1) {
                    const delayIndex = Math.floor((t - 0.1) * sampleRate);
                    if (delayIndex < data.length && delayIndex >= 0) {
                        sample += data[delayIndex] * 0.15;
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
        this.minutesElement.textContent = this.minutes.toString().padStart(2, '0');
        this.secondsElement.textContent = this.seconds.toString().padStart(2, '0');
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
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.themeToggle.querySelector('.theme-icon').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
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