import { motion } from 'framer-motion';
import { Lightbulb, Monitor, Clock } from 'lucide-react';

const experiences = [
    {
        title: "Show de Luces",
        desc: "Más de 500 cabezas móviles sincronizadas con la música para crear una atmósfera irreal.",
        icon: <Lightbulb size={32} className="text-neon-blue" />,
    },
    {
        title: "Visuales 360°",
        desc: "Pantallas gigantes y proyecciones inmersivas que rodean la pista de baile.",
        icon: <Monitor size={32} className="text-neon-pink" />,
    },
    {
        title: "Midnight Surprise",
        desc: "Un momento épico a la medianoche con pirotecnia digital y confetti storm.",
        icon: <Clock size={32} className="text-neon-gold" />,
    }
];

const Experience = () => {
    return (
        <section id="experience" className="py-24 bg-dark-900 relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2">
                        <motion.h2
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
                        >
                            LA EXPERIENCIA <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">BOOM!</span>
                        </motion.h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            No es solo música. Es un viaje sensorial diseñado para estimular todos tus sentidos. Desde el momento en que entras, serás parte de un universo paralelo donde la realidad se mezcla con lo digital.
                        </p>
                        <ul className="space-y-6">
                            {experiences.map((item, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                                >
                                    <div className={`p-3 rounded-lg bg-black text-white border border-white/10 shadow-lg`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-1 font-display">{item.title}</h4>
                                        <p className="text-sm text-gray-400">{item.desc}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:w-1/2 relative w-full">
                        {/* Visual Representation of Experience - Abstract shapes/Glow */}
                        <div className="relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-neon-purple/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-black to-neon-blue/20 animate-pulse"></div>
                            {/* Simulated laser beams */}
                            <div className="absolute top-0 left-1/4 w-[2px] h-full bg-neon-pink/50 rotate-12 blur-[2px]"></div>
                            <div className="absolute top-0 right-1/4 w-[2px] h-full bg-neon-blue/50 -rotate-12 blur-[2px]"></div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-white/30 font-display text-4xl md:text-5xl font-black uppercase tracking-widest block transform skew-x-12">IMMERSIVE</span>
                                    <span className="text-white/30 font-display text-4xl md:text-5xl font-black uppercase tracking-widest block transform -skew-x-12">REALITY</span>
                                </div>
                            </div>
                        </div>
                        {/* Decorative blobs */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neon-pink/20 rounded-full blur-[80px] -z-10"></div>
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-neon-blue/20 rounded-full blur-[80px] -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
