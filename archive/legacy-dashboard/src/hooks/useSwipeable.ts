import { useEffect, useRef, useState } from 'react';

export interface SwipeConfig {
    minSwipeDistance?: number;
    minSwipeVelocity?: number;
    preventDefaultTouchmoveEvent?: boolean;
}

export interface SwipeHandlers {
    onSwipedLeft?: () => void;
    onSwipedRight?: () => void;
    onSwipedUp?: () => void;
    onSwipedDown?: () => void;
}

interface TouchPosition {
    x: number;
    y: number;
    time: number;
}

const defaultConfig: Required<SwipeConfig> = {
    minSwipeDistance: 50,
    minSwipeVelocity: 0.3,
    preventDefaultTouchmoveEvent: false
};

export const useSwipeable = (
    handlers: SwipeHandlers,
    config: SwipeConfig = {}
) => {
    const mergedConfig = { ...defaultConfig, ...config };
    const touchStart = useRef<TouchPosition | null>(null);
    const touchEnd = useRef<TouchPosition | null>(null);
    const [isSwiping, setIsSwiping] = useState(false);

    const handleTouchStart = (e: TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY,
            time: Date.now()
        };
        setIsSwiping(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (mergedConfig.preventDefaultTouchmoveEvent) {
            e.preventDefault();
        }
        touchEnd.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY,
            time: Date.now()
        };

        if (touchStart.current && touchEnd.current) {
            const diffX = Math.abs(touchEnd.current.x - touchStart.current.x);
            const diffY = Math.abs(touchEnd.current.y - touchStart.current.y);

            // If horizontal swipe is dominant, set swiping state
            if (diffX > diffY && diffX > 10) {
                setIsSwiping(true);
            }
        }
    };

    const handleTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;

        const diffX = touchEnd.current.x - touchStart.current.x;
        const diffY = touchEnd.current.y - touchStart.current.y;
        const diffTime = touchEnd.current.time - touchStart.current.time;

        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);

        // Calculate velocity (px/ms)
        const velocityX = absX / diffTime;
        const velocityY = absY / diffTime;

        // Determine if it's a valid swipe
        const isHorizontalSwipe = absX > absY;
        const isVerticalSwipe = absY > absX;

        // Horizontal swipe
        if (isHorizontalSwipe &&
            absX > mergedConfig.minSwipeDistance &&
            velocityX > mergedConfig.minSwipeVelocity) {
            if (diffX > 0) {
                handlers.onSwipedRight?.();
            } else {
                handlers.onSwipedLeft?.();
            }
        }

        // Vertical swipe
        if (isVerticalSwipe &&
            absY > mergedConfig.minSwipeDistance &&
            velocityY > mergedConfig.minSwipeVelocity) {
            if (diffY > 0) {
                handlers.onSwipedDown?.();
            } else {
                handlers.onSwipedUp?.();
            }
        }

        setIsSwiping(false);
        touchStart.current = null;
        touchEnd.current = null;
    };

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: !mergedConfig.preventDefaultTouchmoveEvent });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handlers, mergedConfig]);

    return { ref, isSwiping };
};
