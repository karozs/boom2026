import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    function calculateTimeLeft() {
        // Target: Jan 31, 2026 22:00:00
        const difference = +new Date("2026-01-31T22:00:00") - +new Date();
        let timeLeft = { días: 0, horas: 0, minutos: 0, seg: 0 };

        if (difference > 0) {
            timeLeft = {
                días: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutos: Math.floor((difference / 1000 / 60) % 60),
                seg: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    }

    const triggerExplosion = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    if (!isMounted) return null; // Avoid hydration mismatch if using SSR (Next.js), though we are on Vite it's safe.

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black pb-20 pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-neon-pink/20 rounded-full blur-[100px] animate-pulse delay-500"></div>
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="container mx-auto px-4 z-10 text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 max-w-full overflow-hidden">
                        <Sparkles className="text-neon-gold w-4 h-4 shrink-0" />
                        <span className="text-neon-gold text-sm font-semibold tracking-wider uppercase truncate">31 de Enero · 10 PM · Pampas, Tayacaja - Huancavelica</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 mb-2 tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        BOOM!
                        <span className="block text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent mt-2 filter drop-shadow-[0_0_10px_rgba(255,0,255,0.4)]">
                            2026
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        El inicio del año que lo cambia todo. <br />
                        <span className="text-white font-medium">Una noche de energía, luz y música explosiva.</span>
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16">
                        <Link
                            to="/tickets"
                            onClick={triggerExplosion}
                            className="w-full md:w-auto cursor-pointer group relative px-8 py-4 bg-neon-pink text-white text-lg font-bold rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:shadow-[0_0_40px_rgba(255,0,255,0.6)] transition-all flex justify-center items-center"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Comprar Entrada
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>

                        <Link
                            to="/experience"
                            className="w-full md:w-auto cursor-pointer px-8 py-4 bg-transparent border border-white/20 text-white text-lg font-medium rounded-full hover:border-neon-blue/50 hover:text-neon-blue transition-all backdrop-blur-sm flex justify-center hover:scale-105 active:scale-95 transform duration-200"
                        >
                            Vivir la experiencia
                        </Link>
                    </div>

                    {/* Countdown */}
                    <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto">
                        {Object.entries(timeLeft).map(([label, value]) => (
                            <div key={label} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 md:p-4 flex flex-col items-center group hover:border-neon-green/50 transition-colors shadow-lg">
                                <span className="text-2xl md:text-5xl font-display font-bold text-white group-hover:text-neon-green transition-colors tabular-nums">
                                    {String(value).padStart(2, '0')}
                                </span>
                                <span className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest mt-1">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-50 hidden md:block"
            >
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <div className="w-1 h-2 bg-white rounded-full mt-2"></div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
