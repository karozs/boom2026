import { motion } from 'framer-motion';
import { Mic2, Music, Disc, Zap, Headphones, Sparkles, Radio, Play } from 'lucide-react';

const artists = [
    {
        name: "NEON RIDER",
        genre: "Synthwave / Electronic",
        color: "from-neon-pink to-purple-600",
        icon: Headphones,
        description: "El rey del synthwave retro-futurista."
    },
    {
        name: "CYBER BASS",
        genre: "Drum & Bass",
        color: "from-neon-blue to-teal-500",
        icon: Zap,
        description: "Bajos que harán temblar el suelo."
    },
    {
        name: "LUNA ECLIPSE",
        genre: "Techno Melodic",
        color: "from-neon-purple to-indigo-600",
        icon: Disc,
        description: "Viaje sonoro a través del cosmos."
    },
    {
        name: "SOLAR FLARE",
        genre: "House Progressive",
        color: "from-neon-gold to-orange-500",
        icon: Sparkles,
        description: "Energía pura y ritmos solares."
    },
];

const Lineup = () => {
    return (
        <section id="lineup" className="py-24 bg-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-display font-bold text-white mb-16 text-center md:text-left"
                >
                    LINEUP <span className="text-neon-pink filter drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">EXPLOSIVO</span>
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {artists.map((artist, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -15, scale: 1.02 }}
                            className="group relative h-[450px] overflow-hidden rounded-3xl bg-dark-800 border border-white/5 hover:border-white/30 transition-all duration-300"
                        >
                            {/* Dynamic Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${artist.color} opacity-10 group-hover:opacity-20 transition-all duration-500`}></div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                {/* Icon Container with Glow */}
                                <div className={`relative mb-8 p-6 rounded-full bg-gradient-to-br ${artist.color} bg-opacity-20 backdrop-blur-md group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
                                    <artist.icon size={48} className="text-white relative z-10" />
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${artist.color} blur-xl opacity-40 group-hover:opacity-70 transition-opacity`}></div>
                                </div>

                                <h3 className="text-2xl font-bold text-white font-display mb-2 tracking-wide group-hover:scale-105 transition-transform">
                                    {artist.name}
                                </h3>

                                <span className={`inline-block px-3 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider mb-4 text-gray-300 group-hover:text-white group-hover:border-white/50 transition-colors`}>
                                    {artist.genre}
                                </span>

                                <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                    "{artist.description}"
                                </p>
                            </div>

                            {/* Bottom Play Button Fake */}
                            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                                <div className="flex items-center justify-center gap-2 text-white font-bold text-sm uppercase tracking-widest">
                                    <Play size={16} className="fill-current" /> Escuchar Preview
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Lineup;
