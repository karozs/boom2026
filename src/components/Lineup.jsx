import { motion, AnimatePresence } from 'framer-motion';
import { Mic2, Music, Disc, Zap, Headphones, Sparkles, Radio, Play, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const musicGenres = [
    {
        name: "CUMBIA PERUANA",
        genre: "Cumbia / Tropical",
        color: "from-green-500 to-emerald-600",
        icon: Music,
        description: "Los mejores éxitos de cumbia que harán bailar a todos.",
        youtubeId: "8Yvag1aOVdc",
        startTime: 100,
        endTime: 120
    },
    {
        name: "HUAYNO & FOLKLORE",
        genre: "Música Andina",
        color: "from-red-500 to-orange-600",
        icon: Mic2,
        description: "El ritmo de los Andes que nos representa.",
        youtubeId: "kKu_A19z2j4",
        startTime: 40,
        endTime: 60
    },
    {
        name: "REGGAETON",
        genre: "Urbano Latino",
        color: "from-neon-pink to-purple-600",
        icon: Headphones,
        description: "Los hits más candentes del reggaeton internacional.",
        youtubeId: "EKEjR0rwE_c",
        startTime: 165,
        endTime: 180
    },
    {
        name: "SALSA & MERENGUE",
        genre: "Tropical Latino",
        color: "from-yellow-500 to-amber-600",
        icon: Sparkles,
        description: "Sabor latino para bailar sin parar.",
        youtubeId: "OXgA5RXoLfE",
        startTime: 25,
        endTime: 55
    },
    {
        name: "ELECTRÓNICA",
        genre: "EDM / House",
        color: "from-blue-500 to-cyan-600",
        icon: Zap,
        description: "Beats electrónicos para elevar la energía.",
        youtubeId: "Hn3QKpLWDKo",
        startTime: 30,
        endTime: 60
    },
    {
        name: "ROCK EN ESPAÑOL",
        genre: "Rock Latino",
        color: "from-purple-500 to-pink-600",
        icon: Radio,
        description: "Clásicos del rock que todos cantamos.",
        youtubeId: "BQ3iqq49Ew8",
        startTime: 18,
        endTime: 48
    },
    {
        name: "MÚSICA ROMÁNTICA",
        genre: "Baladas / Pop",
        color: "from-orange-500 to-red-600",
        icon: Disc,
        description: "Las canciones que enamoran y emocionan.",
        youtubeId: "YQGVW-PZ5zg",
        startTime: 52,
        endTime: 120
    },
    {
        name: "FIESTA RETRO",
        genre: "Clásicos 80s-90s",
        color: "from-pink-500 to-rose-600",
        icon: Sparkles,
        description: "Los éxitos que marcaron generaciones.",
        youtubeId: "tF_-oPPXcPk",
        startTime: 180,
        endTime: 195
    },
];

const Lineup = () => {
    const [selectedGenre, setSelectedGenre] = useState(null);
    const playerRef = useRef(null);
    const intervalRef = useRef(null);

    const playPreview = (genre) => {
        setSelectedGenre(genre);
    };

    const closeModal = () => {
        setSelectedGenre(null);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    // Load YouTube IFrame API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }, []);

    // Initialize player when genre is selected
    useEffect(() => {
        if (selectedGenre && window.YT && window.YT.Player) {
            // Small delay to ensure iframe is in DOM
            setTimeout(() => {
                playerRef.current = new window.YT.Player('youtube-player', {
                    events: {
                        onReady: (event) => {
                            event.target.playVideo();

                            // Check current time and stop at endTime
                            intervalRef.current = setInterval(() => {
                                const currentTime = event.target.getCurrentTime();
                                if (currentTime >= selectedGenre.endTime) {
                                    event.target.pauseVideo();
                                    clearInterval(intervalRef.current);
                                }
                            }, 100);
                        },
                        onStateChange: (event) => {
                            // If user manually seeks past endTime, pause
                            if (event.data === window.YT.PlayerState.PLAYING) {
                                const currentTime = event.target.getCurrentTime();
                                if (currentTime >= selectedGenre.endTime) {
                                    event.target.pauseVideo();
                                }
                            }
                        }
                    }
                });
            }, 100);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [selectedGenre]);

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
                    {musicGenres.map((genre, index) => (
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
                            <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-10 group-hover:opacity-20 transition-all duration-500`}></div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                {/* Icon Container with Glow */}
                                <div className={`relative mb-8 p-6 rounded-full bg-gradient-to-br ${genre.color} bg-opacity-20 backdrop-blur-md group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
                                    <genre.icon size={48} className="text-white relative z-10" />
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${genre.color} blur-xl opacity-40 group-hover:opacity-70 transition-opacity`}></div>
                                </div>

                                <h3 className="text-2xl font-bold text-white font-display mb-2 tracking-wide group-hover:scale-105 transition-transform">
                                    {genre.name}
                                </h3>

                                <span className={`inline-block px-3 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider mb-4 text-gray-300 group-hover:text-white group-hover:border-white/50 transition-colors`}>
                                    {genre.genre}
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
                                    <Play size={16} className="fill-current" /> Escuchar Preview
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* YouTube Player Modal */}
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
                            className="relative w-full max-w-4xl bg-dark-800 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-all hover:scale-110"
                            >
                                <X size={24} />
                            </button>

                            {/* Genre Info Header */}
                            <div className={`bg-gradient-to-r ${selectedGenre.color} p-6 text-center`}>
                                <h3 className="text-3xl font-bold text-white font-display mb-2">
                                    {selectedGenre.name}
                                </h3>
                                <p className="text-white/90 text-sm uppercase tracking-wider">
                                    {selectedGenre.genre}
                                </p>
                            </div>

                            {/* YouTube Embed */}
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    id="youtube-player"
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${selectedGenre.youtubeId}?start=${selectedGenre.startTime}&enablejsapi=1`}
                                    title={`${selectedGenre.name} - Preview`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Footer Info */}
                            <div className="p-6 bg-black/40">
                                <p className="text-gray-300 text-center">
                                    {selectedGenre.description}
                                </p>
                                <p className="text-gray-500 text-center text-sm mt-2">
                                    Preview: {Math.floor(selectedGenre.startTime / 60)}:{(selectedGenre.startTime % 60).toString().padStart(2, '0')} - {Math.floor(selectedGenre.endTime / 60)}:{(selectedGenre.endTime % 60).toString().padStart(2, '0')}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Lineup;
