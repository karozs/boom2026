import { motion } from 'framer-motion';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Gallery = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchGallery = async () => {
            const { data } = await supabase
                .from('boom_gallery')
                .select('*')
                .order('display_order', { ascending: true });
            if (data) setImages(data);
        };
        fetchGallery();
    }, []);

    return (
        <section className="py-24 bg-black overflow-hidden relative">
            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-16 text-center">
                    GALERÍA <span className="text-neon-blue">VISUAL</span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((item, idx) => (
                        <motion.div
                            key={item.id || idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
                            className="relative aspect-square overflow-hidden rounded-xl border border-white/5 cursor-pointer group"
                        >
                            <img src={item.image_url} alt={item.title || "Event visual"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
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
