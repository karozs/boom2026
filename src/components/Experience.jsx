import { motion } from 'framer-motion';
import { Camera, Zap, Lightbulb, Sparkles, Wine } from 'lucide-react';

const experiences = [
    {
        title: "CUBÍCULO INSTAGRAMEABLE",
        desc: "Llévate el mejor recuerdo en un espacio diseñado para capturar momentos únicos",
        icon: <Camera size={32} className="text-neon-pink" />,
    },
    {
        title: "SHOT DE CORTESÍA",
        desc: "Un shot gratis para empezar la noche.",
        icon: <Zap size={32} className="text-neon-blue" />,
    },
    {
        title: "EXPERIENCIA DE CÓCTELES",
        desc: "Una selección especial de sabores para descubrir, disfrutar y brindar.",
        icon: <Wine size={32} className="text-neon-gold" />,
    },
    {
        title: "APAGÓN DE LUCES",
        desc: "Oscuridad total por un segundo…y la fiesta explota.",
        icon: <Lightbulb size={32} className="text-neon-purple" />,
    },
    {
        title: "ZONA NEÓN",
        desc: "Zona de maquillaje para que brilles toda la noche.",
        icon: <Sparkles size={32} className="text-neon-green" />,
    }
];

const drinks = [
    { name: "Cuba Libre Premium", desc: "Ron + Coca Cola + limon", image: "https://img.freepik.com/fotos-premium/coctel-cuba-libre-vaso-highball-hielo-cascara-lima-paja-limas-frescas-sobre-fondo-negro-mesa_157173-3330.jpg", color: "from-amber-500 to-red-600" },
    { name: "Flor de Caña", desc: "Flor de caña premium + Coca Cola", image: "https://images.rappi.pe/products/237008-1575927253771.png", color: "from-yellow-400 to-amber-600" },
    { name: "Old Time", desc: "Old time + Guarana", image: "https://images.rappi.pe/products/1727659843457_1727659639313_1727659637802.jpg", color: "from-pink-300 to-purple-400" },
    { name: "Mojito Clásico", desc: "Ron blanco, menta fresca y lima", image: "https://cdn.craft.cloud/224393fa-1975-4d80-9067-ada3cb5948ca/assets/detail_Skinny_Mojito_4_2022.jpg", color: "from-green-400 to-emerald-600" },
    { name: "Gin Tonic", desc: "Gin premium, tónica y botánicos", image: "https://licoreria247.pe/wp-content/uploads/2020/12/Vodka-vs-Gin.jpg.webp", color: "from-cyan-300 to-blue-500" },
    { name: "Margarita", desc: "Tequila, triple sec y limón", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1887&auto=format&fit=crop", color: "from-yellow-300 to-lime-500" },
    { name: "Tequila Sunrise", desc: "Tequila, jugo de naranja y granadina", image: "https://exoticotequila.com/wp-content/uploads/2018/03/TEQUILA_SUNRISE_RC.jpg", color: "from-orange-500 to-red-500" },
    { name: "Whisky Sour", desc: "Whisky, limón y jarabe de goma", image: "https://so-sour.com/wp-content/uploads/2024/08/Whisky-Sour.jpg", color: "from-amber-300 to-orange-400" },
    { name: "French 75", desc: "Gin, champagne, limón y azúcar", image: "https://images.ctfassets.net/hs93c4k6gio0/Qh3XDKsj9fkaFAPbIcLXR/43bcbac62e7807e55e7a5c91b822e79b/_images_us-cocktails_French75_0412_2.jpg.jpg", color: "from-pink-300 to-purple-400" },
    { name: "Calientitos de Maracuyá", desc: "Maracuyá, Limón, Whisky, Azúcar", image: "https://polleriaslagranja.com/wp-content/uploads/2022/10/La-Granja-Real-Food-Chicken-Jarra-de-Maracuya.png", color: "from-pink-300 to-purple-400" },
];

const Experience = () => {
    return (
        <section id="experience" className="py-24 bg-dark-900 relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
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
                            No es solo una fiesta, es otra experiencia. Pensamos cada detalle para que disfrutes al máximo y te lleves recuerdos perfectos.
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
                                    <Camera size={64} className="text-white relative z-10 animate-[spin_10s_linear_infinite]" />
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

                {/* BAR SECTION */}
                <div className="mt-24 relative">
                    <div className="text-center mb-16">
                        <span className="text-neon-blue tracking-[0.2em] font-bold text-sm uppercase mb-2 block">Premium Drinks</span>
                        <h3 className="text-4xl md:text-5xl font-display font-bold text-white">
                            BARRA <span className="text-neon-pink">EXCLUSIVA</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {drinks.map((drink, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative h-[300px] rounded-2xl overflow-hidden border border-white/10"
                            >
                                {/* Image Background */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${drink.image})` }}
                                ></div>
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6 relative hover:z-20 z-10">
                                    <div className={`w-12 h-1 mb-4 bg-gradient-to-r ${drink.color}`}></div>
                                    <h4 className="text-xl font-bold font-display text-white mb-1 group-hover:scale-105 transition-transform origin-left">{drink.name}</h4>
                                    <p className="text-gray-300 text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity">{drink.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
