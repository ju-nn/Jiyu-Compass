// Simple sound effects using Web Audio API
// These are minimal beep sounds generated programmatically to avoid external dependencies

export type SoundType = 'achievement' | 'levelUp' | 'gacha' | 'click' | 'rare' | 'epic' | 'legendary';

class SoundEffectManager {
    private audioContext: AudioContext | null = null;
    private volume: number = 0.3;
    private isMuted: boolean = false;
    private isInitialized: boolean = false;

    constructor() {
        // Load mute state from localStorage
        const savedMute = localStorage.getItem('soundEffectsMuted');
        this.isMuted = savedMute === 'true';
    }

    private initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        this.isInitialized = true;
    }

    private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
        if (this.isMuted || !this.isInitialized) return;

        try {
            if (!this.audioContext) this.initAudioContext();
            if (!this.audioContext) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Failed to play sound:', error);
        }
    }

    private playChord(frequencies: number[], duration: number) {
        frequencies.forEach(freq => this.playTone(freq, duration));
    }

    public play(soundType: SoundType) {
        if (!this.isInitialized) {
            this.initAudioContext();
        }

        switch (soundType) {
            case 'achievement':
                // Happy ascending notes
                setTimeout(() => this.playTone(523.25, 0.1), 0);    // C5
                setTimeout(() => this.playTone(659.25, 0.1), 100);  // E5
                setTimeout(() => this.playTone(783.99, 0.2), 200);  // G5
                break;

            case 'levelUp':
                // Triumphant fanfare
                setTimeout(() => this.playChord([261.63, 329.63, 392.00], 0.15), 0);   // C4-E4-G4
                setTimeout(() => this.playChord([293.66, 369.99, 440.00], 0.15), 150); // D4-F#4-A4
                setTimeout(() => this.playChord([329.63, 415.30, 493.88], 0.3), 300);  // E4-G#4-B4
                break;

            case 'gacha':
                // Spinning sound
                this.playTone(440, 0.05, 'square');
                setTimeout(() => this.playTone(466.16, 0.05, 'square'), 50);
                setTimeout(() => this.playTone(493.88, 0.05, 'square'), 100);
                break;

            case 'rare':
                // Blue rare sound
                setTimeout(() => this.playTone(523.25, 0.1), 0);
                setTimeout(() => this.playTone(659.25, 0.15), 100);
                break;

            case 'epic':
                // Purple epic sound
                setTimeout(() => this.playTone(523.25, 0.1), 0);
                setTimeout(() => this.playTone(659.25, 0.1), 100);
                setTimeout(() => this.playTone(783.99, 0.2), 200);
                break;

            case 'legendary':
                // Gold legendary sound - most impressive
                setTimeout(() => this.playChord([523.25, 659.25], 0.1), 0);
                setTimeout(() => this.playChord([659.25, 783.99], 0.1), 100);
                setTimeout(() => this.playChord([783.99, 987.77], 0.15), 200);
                setTimeout(() => this.playChord([1046.50, 1318.51], 0.3), 350);
                break;

            case 'click':
                // Subtle click
                this.playTone(800, 0.03, 'square');
                break;

            default:
                break;
        }
    }

    public setVolume(newVolume: number) {
        this.volume = Math.max(0, Math.min(1, newVolume));
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('soundEffectsMuted', String(this.isMuted));
        return this.isMuted;
    }

    public getMuted() {
        return this.isMuted;
    }

    public initialize() {
        // Call this on first user interaction to enable audio
        if (!this.isInitialized) {
            this.initAudioContext();
        }
    }
}

export const soundEffectManager = new SoundEffectManager();
