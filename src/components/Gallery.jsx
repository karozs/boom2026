import { motion } from 'framer-motion';

const images = [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60", // Party crowd
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60", // DJ
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=60", // Festival visuals
    "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=500&auto=format&fit=crop&q=60", // Confetti
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&auto=format&fit=crop&q=60", // Lights
    "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500&auto=format&fit=crop&q=60", // Lasers
];

const Gallery = () => {
    return (
        <section className="py-24 bg-black overflow-hidden relative">
            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-16 text-center">
                    GALERÍA <span className="text-neon-blue">VISUAL</span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((src, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
                            className="relative aspect-square overflow-hidden rounded-xl border border-white/5 cursor-pointer group"
                        >
                            <img src={src} alt="Event visual" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-neon-pink/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold tracking-widest bg-black/50 px-3 py-1 rounded backdrop-blur-sm">VIEW</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default Gallery;
