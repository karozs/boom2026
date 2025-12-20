import { motion } from 'framer-motion';
import { Lightbulb, Monitor, Clock, Video, Zap, Sparkles, Aperture } from 'lucide-react';

const experiences = [
    {
        title: "Plataforma 360°",
        desc: "Llévate el mejor recuerdo con videos slow-motion giratorios de alta calidad al instante.",
        icon: <Video size={32} className="text-neon-pink" />,
    },
    {
        title: "Hora Loca LED",
        desc: "Explosión de energía con Robots LED gigantes, CO2 y cotillón premium futurista.",
        icon: <Zap size={32} className="text-neon-blue" />,
    },
    {
        title: "Zona Neón & Glitter",
        desc: "Estaciones de maquillaje flúor y glitter para que brilles toda la noche.",
        icon: <Sparkles size={32} className="text-neon-gold" />,
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
                            No es solo una fiesta, es un universo paralelo. Hemos diseñado cada rincón para que vivas una noche inolvidable llena de momentos "instagrammables".
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
                        {/* 360 Experience Highlight */}
                        <div className="relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-neon-pink/20 group cursor-pointer">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity grayscale hover:grayscale-0 duration-500"></div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-neon-pink blur-xl opacity-50 animate-pulse"></div>
                                    <Aperture size={64} className="text-white relative z-10 animate-[spin_10s_linear_infinite]" />
                                </div>
                                <div className="text-center relative z-10 p-4">
                                    <span className="text-neon-pink font-display text-4xl md:text-5xl font-black uppercase tracking-widest block mb-2 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">
                                        ZONA 360°
                                    </span>
                                    <span className="text-white text-sm tracking-[0.2em] uppercase bg-black/50 px-4 py-2 rounded-full border border-white/20">
                                        Captura el Momento
                                    </span>
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
