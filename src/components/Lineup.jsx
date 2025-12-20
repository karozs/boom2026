import { motion, AnimatePresence } from 'framer-motion';
import { Mic2, Music, Disc, Zap, Headphones, Sparkles, Radio, Play, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { supabase } from '../lib/supabaseClient';

const iconMap = {
    'Music': Music,
    'Mic2': Mic2,
    'Headphones': Headphones,
    'Sparkles': Sparkles,
    'Zap': Zap,
    'Radio': Radio,
    'Disc': Disc,
    'Play': Play
};

const Lineup = () => {
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const { data, error } = await supabase
                .from('boom_lineup')
                .select('*')
                .order('display_order', { ascending: true });

            if (data) setGenres(data);
        } catch (error) {
            console.error('Error fetching lineup:', error);
        }
    };

    const playPreview = (genre) => {
        setSelectedGenre(genre);
    };

    const closeModal = () => {
        setSelectedGenre(null);
    };

    const getIcon = (iconName) => {
        return iconMap[iconName] || Music;
    };

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
                    MÚSICA <span className="text-neon-pink filter drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">EXPLOSIVA</span>
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {genres.map((genre, index) => {
                        const IconComponent = getIcon(genre.icon_name);
                        return (
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
                                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color_gradient} opacity-10 group-hover:opacity-20 transition-all duration-500`}></div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                    {/* Icon Container with Glow */}
                                    <div className={`relative mb-8 p-6 rounded-full bg-gradient-to-br ${genre.color_gradient} bg-opacity-20 backdrop-blur-md group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
                                        <IconComponent size={48} className="text-white relative z-10" />
                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${genre.color_gradient} blur-xl opacity-40 group-hover:opacity-70 transition-opacity`}></div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white font-display mb-2 tracking-wide group-hover:scale-105 transition-transform">
                                        {genre.name}
                                    </h3>

                                    <span className={`inline-block px-3 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider mb-4 text-gray-300 group-hover:text-white group-hover:border-white/50 transition-colors`}>
                                        {genre.genre_subtitle}
                                    </span>

                                    <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                        "{genre.description}"
                                    </p>
                                </div>

                                {/* Bottom Play Button */}
                                <div
                                    onClick={() => playPreview(genre)}
                                    className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent cursor-pointer hover:from-black/90"
                                >
                                    <div className="flex items-center justify-center gap-2 text-white font-bold text-sm uppercase tracking-widest">
                                        <Play size={16} className="fill-current" /> Ver Video
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Video Player Modal */}
            <AnimatePresence>
                {selectedGenre && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all hover:scale-110 border border-white/10"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex flex-col md:flex-row">
                                {/* Video Section */}
                                <div className="w-full md:w-3/4 bg-black flex items-center justify-center">
                                    <video
                                        src={selectedGenre.video_url}
                                        autoPlay
                                        controls
                                        className="w-full max-h-[70vh] object-cover"
                                        poster="/assets/video-placeholder.jpg"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            // Fallback for demo if file missing
                                            // e.target.src = "https://media.istockphoto.com/id/1153671239/video/dj-playing-music-at-mixer-closeup.mp4?s=mp4-640x640-is&k=20&c=L_Qd68l_wXW_X9lSgqL6cQk6c6c6c6c6c6c6c6c6"; 
                                        }}
                                    >
                                        Tu navegador no soporta videos HTML5.
                                    </video>
                                </div>

                                {/* Info Sidebar (Desktop) / Footer (Mobile) */}
                                <div className={`w-full md:w-1/4 bg-gradient-to-b ${selectedGenre.color_gradient} p-8 flex flex-col justify-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/20"></div>
                                    <div className="relative z-10 text-center md:text-left">
                                        {(() => {
                                            const Icon = getIcon(selectedGenre.icon_name);
                                            return <Icon size={48} className="text-white mb-6 mx-auto md:mx-0 opacity-80" />;
                                        })()}
                                        <h3 className="text-2xl md:text-3xl font-bold text-white font-display mb-2 leading-tight">
                                            {selectedGenre.name}
                                        </h3>
                                        <div className="w-12 h-1 bg-white/50 rounded-full mb-4 mx-auto md:mx-0"></div>
                                        <p className="text-white/90 text-sm uppercase tracking-wider mb-6 font-medium">
                                            {selectedGenre.genre_subtitle}
                                        </p>
                                        <p className="text-white/80 text-sm italic">
                                            "{selectedGenre.description}"
                                        </p>
                                    </div>

                                    {/* Decorative circles */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Lineup;
