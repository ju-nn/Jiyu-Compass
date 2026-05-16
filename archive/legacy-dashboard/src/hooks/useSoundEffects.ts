import { useEffect, useCallback } from 'react';
import { soundEffectManager, type SoundType } from '../utils/soundEffects';

export const useSoundEffects = () => {
    useEffect(() => {
        // Initialize audio context on mount
        const handleFirstInteraction = () => {
            soundEffectManager.initialize();
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);

        return () => {
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, []);

    const play = useCallback((soundType: SoundType) => {
        soundEffectManager.play(soundType);
    }, []);

    const setVolume = useCallback((volume: number) => {
        soundEffectManager.setVolume(volume);
    }, []);

    const toggleMute = useCallback(() => {
        return soundEffectManager.toggleMute();
    }, []);

    const isMuted = useCallback(() => {
        return soundEffectManager.getMuted();
    }, []);

    return {
        play,
        setVolume,
        toggleMute,
        isMuted
    };
};
