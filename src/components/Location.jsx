import { MapPin } from 'lucide-react';

const Location = () => {
    return (
        <section id="location" className="py-24 bg-dark-900 relative">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">UBICACIÓN</h2>

                <div className="relative w-full h-[400px] md:h-[500px] bg-dark-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.8!2d-74.86630570851513!3d-12.401365085937183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDI0JzA0LjkiUyA3NMKwNTEnNTguNyJX!5e0!3m2!1ses!2spe!4v1703010000000!5m2!1ses!2spe"
                    ></iframe>

                    <div className="absolute bottom-6 left-6 right-6 md:auto md:left-6 md:w-auto">
                        <div className="relative z-10 bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-neon-pink/50 text-left flex flex-col gap-2 min-w-[250px] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                            <div className="flex items-center gap-3">
                                <MapPin className="text-neon-pink w-6 h-6" />
                                <div>
                                    <h3 className="text-xl font-bold text-white">Local: EL PAMPINO</h3>
                                    <p className="text-gray-400 text-sm">Pampas, Tayacaja - Huancavelica</p>
                                </div>
                            </div>

                            <a
                                href="https://www.google.com/maps?q=-12.401365085937183,-74.86630570851513"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 w-full py-2 bg-white/10 hover:bg-neon-pink/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/5 hover:border-neon-pink/50 text-center block"
                            >
                                Abrir Mapa
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Location;
