import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Sparkles, Clock, PartyPopper } from 'lucide-react';

const features = [
    {
        icon: <Calendar className="w-8 h-8 text-neon-blue" />,
        title: "31 de Diciembre",
        description: "La última noche del año se celebra en grande. Despide el 2025 y recibe el 2026 con la mejor energía."
    },
    {
        icon: <MapPin className="w-8 h-8 text-neon-pink" />,
        title: "EL PAMPINITO - VALLE DE PAMPAS",
        description: "Un espacio único transformado especialmente para esta noche mágica en el corazón de Huancavelica."
    },
    {
        icon: <Users className="w-8 h-8 text-neon-gold" />,
        title: "Para Todos",
        description: "Entrada GENERAL gratuita si vienes solo, o elige VIP y BOOM EXP para vivir la experiencia completa con tu grupo."
    },
    {
        icon: <Sparkles className="w-8 h-8 text-neon-purple" />,
        title: "Experiencias Únicas",
        description: "Cubículo instagrameable, zona neón, cócteles exclusivos y momentos que quedarán en tu memoria."
    },
    {
        icon: <Clock className="w-8 h-8 text-neon-green" />,
        title: "Toda la Noche",
        description: "Desde las 10:00 PM hasta que el cuerpo aguante. Una noche épica sin límites."
    },
    {
        icon: <PartyPopper className="w-8 h-8 text-yellow-400" />,
        title: "Ambiente Explosivo",
        description: "Música variada, efectos visuales, apagón de luces y la mejor vibra para cerrar el año."
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
                        className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
                    >
                        SOBRE EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">EVENTO</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed mb-4"
                    >
                        <span className="text-neon-pink font-bold text-2xl">THE LAST NIGHT 2025</span> es más que una fiesta de Año Nuevo.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 max-w-3xl mx-auto text-base leading-relaxed"
                    >
                        Es la celebración que marca el inicio de tu mejor año. Una noche donde la música, las luces,
                        los cócteles y la energía se fusionan para crear recuerdos inolvidables.
                        Ven solo o con tu grupo, pero ven listo para vivir la experiencia más explosiva de Pampas.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-neon-purple/50 transition-all hover:bg-white/5 group hover:-translate-y-2 duration-300"
                        >
                            <div className="bg-white/5 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 font-display">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-block bg-gradient-to-r from-neon-pink/10 to-neon-purple/10 border border-neon-pink/30 rounded-2xl p-8 backdrop-blur-sm">
                        <p className="text-white text-xl font-bold mb-2">
                            🎉 ¡No te quedes fuera de la fiesta del año!
                        </p>
                        <p className="text-gray-300 text-sm">
                            Asegura tu entrada ahora y prepárate para una noche épica
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-r from-neon-purple/5 to-neon-blue/5 -skew-y-6 pointer-events-none blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl pointer-events-none"></div>
        </section>
    );
};

export default About;
