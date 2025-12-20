import { motion } from 'framer-motion';
import { Zap, Music, Star } from 'lucide-react';

const features = [
    {
        icon: <Zap className="w-8 h-8 text-neon-blue" />,
        title: "Energía Inmersiva",
        description: "Un ambiente cargado de efectos visuales y sonido de alta fidelidad que recorrerá tu cuerpo."
    },
    {
        icon: <Music className="w-8 h-8 text-neon-pink" />,
        title: "Sonido Futuro",
        description: "Los mejores DJs de la escena electrónica y urbana fusionados en un setlist explosivo."
    },
    {
        icon: <Star className="w-8 h-8 text-neon-gold" />,
        title: "Experiencia VIP",
        description: "Zonas exclusivas con atención premium y la mejor vista del espectáculo."
    }
];

const About = () => {
    return (
        <section id="about" className="py-24 bg-dark-800 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
                    >
                        SOBRE EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">EVENTO</span>
                    </motion.h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        THE LAST NIGHT 2025 no es solo una fiesta. Es la celebración que define tu año.
                        Una fusión de tecnología, arte y música en una ubicación única transformada en un universo neón.
                        Prepárate para vibrar el <span className="text-white font-bold">31 de Diciembre</span>.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-neon-purple/50 transition-all hover:bg-white/5 group hover:-translate-y-2 duration-300"
                        >
                            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 font-display">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-r from-neon-purple/5 to-neon-blue/5 -skew-y-6 pointer-events-none blur-3xl"></div>
        </section>
    );
};

export default About;
