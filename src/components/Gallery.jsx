import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const getPrevIndex = () => (currentIndex - 1 + images.length) % images.length;
    const getNextIndex = () => (currentIndex + 1) % images.length;

    if (images.length === 0) return null;

    return (
        <section className="py-24 bg-black overflow-hidden relative">
            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-16 text-center">
                    GALERÍA <span className="text-neon-blue">VISUAL</span>
                </h2>

                {/* Carousel Container with Peek Effect */}
                <div className="relative max-w-7xl mx-auto px-4 md:px-16">
                    <div className="relative flex items-center justify-center gap-4">

                        {/* Previous Image (Peek) - Hidden on mobile */}
                        <div className="hidden md:block w-1/4 opacity-40 hover:opacity-60 transition-opacity cursor-pointer" onClick={prevSlide}>
                            <div className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                                {images[getPrevIndex()].media_type === 'video' ? (
                                    <video
                                        src={images[getPrevIndex()].image_url}
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                    />
                                ) : (
                                    <img
                                        src={images[getPrevIndex()].image_url}
                                        alt="Previous"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Main Image Display */}
                        <div className="relative w-full md:w-1/2 flex-shrink-0">
                            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0"
                                    >
                                        {images[currentIndex].media_type === 'video' ? (
                                            <video
                                                src={images[currentIndex].image_url}
                                                className="w-full h-full object-cover"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                src={images[currentIndex].image_url}
                                                alt={images[currentIndex].title || "Event visual"}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                                        {/* Image Title (if exists) */}
                                        {images[currentIndex].title && (
                                            <div className="absolute bottom-6 left-6 right-6">
                                                <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
                                                    {images[currentIndex].title}
                                                </h3>
                                            </div>
                                        )}

                                        {/* Neon Border Effect */}
                                        <div className="absolute inset-0 border-2 border-neon-blue/20 rounded-2xl pointer-events-none"></div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Next Image (Peek) - Hidden on mobile */}
                        <div className="hidden md:block w-1/4 opacity-40 hover:opacity-60 transition-opacity cursor-pointer" onClick={nextSlide}>
                            <div className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                                {images[getNextIndex()].media_type === 'video' ? (
                                    <video
                                        src={images[getNextIndex()].image_url}
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                    />
                                ) : (
                                    <img
                                        src={images[getNextIndex()].image_url}
                                        alt="Next"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Navigation Arrows - Outside main image */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-neon-blue/80 text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-20 group shadow-lg"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-neon-blue/80 text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-20 group shadow-lg"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                        </button>
                    </div>

                    {/* Slide Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'w-8 bg-neon-blue shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                                    : 'w-2 bg-white/30 hover:bg-white/50'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Counter */}
                    <div className="text-center mt-4 text-white/60 text-sm font-medium">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Gallery;
