import React, { useRef } from 'react';

interface ParticleSystemProps {
    type: 'confetti' | 'stars' | 'coins';
    isActive: boolean;
    onComplete?: () => void;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    life: number;
    maxLife: number;
    rotation: number;
    rotationSpeed: number;
    shape: 'circle' | 'square' | 'star';
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ type, isActive, onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number>(0);

    const createParticles = React.useCallback((particleType: 'confetti' | 'stars' | 'coins') => {
        const particles: Particle[] = [];
        const count = particleType === 'confetti' ? 100 : particleType === 'stars' ? 50 : 30;

        const canvas = canvasRef.current;
        if (!canvas) return particles;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = particleType === 'confetti' ? 3 + Math.random() * 5 : 2 + Math.random() * 3;

            let colors: string[];
            let shapes: Array<'circle' | 'square' | 'star'>;

            if (particleType === 'confetti') {
                colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
                shapes = ['square', 'circle'];
            } else if (particleType === 'stars') {
                colors = ['#FFD700', '#FFA500', '#FFFF00', '#FFE4B5'];
                shapes = ['star'];
            } else {
                colors = ['#FFD700', '#FFA500', '#FF8C00'];
                shapes = ['circle'];
            }

            particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - (particleType === 'confetti' ? 5 : 3),
                color: colors[Math.floor(Math.random() * colors.length)],
                size: particleType === 'coins' ? 8 + Math.random() * 4 : 4 + Math.random() * 6,
                life: 1,
                maxLife: 60 + Math.random() * 60,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                shape: shapes[Math.floor(Math.random() * shapes.length)]
            });
        }

        return particles;
    }, []);

    const drawParticle = React.useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
        ctx.save();
        ctx.globalAlpha = particle.life / particle.maxLife;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        ctx.fillStyle = particle.color;

        if (particle.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (particle.shape === 'square') {
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        } else if (particle.shape === 'star') {
            // Draw star
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const x = Math.cos(angle) * particle.size;
                const y = Math.sin(angle) * particle.size;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                const innerAngle = angle + Math.PI / 5;
                const innerX = Math.cos(innerAngle) * (particle.size / 2);
                const innerY = Math.sin(innerAngle) * (particle.size / 2);
                ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }, []);

    const animate = React.useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current = particlesRef.current.filter(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.3; // Gravity
            particle.rotation += particle.rotationSpeed;
            particle.life--;

            // Draw if still alive
            if (particle.life > 0) {
                drawParticle(ctx, particle);
                return true;
            }
            return false;
        });

        if (particlesRef.current.length > 0) {
            animationFrameRef.current = requestAnimationFrame(animate);
        } else {
            onComplete?.();
        }
    }, [drawParticle, onComplete]);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size to window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    React.useEffect(() => {
        if (isActive) {
            particlesRef.current = createParticles(type);
            animate();
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isActive, type, createParticles, animate]);

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};
