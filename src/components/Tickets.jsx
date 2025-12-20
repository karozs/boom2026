import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, CreditCard, Ticket, User, Mail, Phone, MessageCircle, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabaseClient';
import TicketCard from './TicketCard';

const tickets = [
    {
        id: "gen",
        name: "GENERAL",
        price: 15,
        features: ["Acceso al evento", "Zona General", "Barra pagada", "Experiencia visual 360", "Acceso a Food Court"],
        recommended: false,
        color: "border-white/10 hover:border-white/30"
    },
    {
        id: "vip",
        name: "VIP",
        price: 20,
        features: ["Acceso Fast Pass", "Zona VIP Elevada", "2 Tragos de cortesía", "Baños exclusivos", "Vista preferencial al escenario"],
        recommended: true,
        color: "border-neon-pink shadow-[0_0_20px_rgba(255,0,255,0.2)] hover:shadow-[0_0_30px_rgba(255,0,255,0.4)]"
    },
    {
        id: "exp",
        name: "BOOM! EXP",
        price: 50,
        features: ["All Access sin filas", "Backstage Lounge", "Barra Libre Premium", "Regalo Exclusivo", "Acceso a After Party"],
        recommended: false,
        color: "border-neon-gold hover:border-gold-400"
    }
];



const CheckoutModal = ({ ticket, onClose }) => {
    // Steps: 1: Selection, 2: Form, 3: Processing, 4: Success
    const [step, setStep] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dni: ''
    });
    const [transactionId, setTransactionId] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBuy = async () => {
        setStep(3);

        try {
            let newId = '';

            if (supabase) {
                // Insert into Supabase
                const { data, error } = await supabase
                    .from('boom_sales_2026')
                    .insert([
                        {
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            dni: formData.dni,
                            ticket_name: ticket.name,
                            ticket_price: ticket.price,
                            quantity: quantity,
                            total_amount: ticket.price * quantity,
                            status: 'paid'
                        }
                    ])
                    .select(); // Ensure we select the return data

                if (error) throw error;
                newId = data && data[0] ? data[0].id : Date.now();
            } else {
                // Fallback to LocalStorage (Demo Mode)
                console.warn('Supabase not configured. Saving to localStorage.');
                const sales = JSON.parse(localStorage.getItem('boom_sales') || '[]');
                newId = Date.now();
                const newSale = {
                    id: newId,
                    created_at: new Date().toISOString(),
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    dni: formData.dni,
                    ticket_name: ticket.name,
                    ticket_price: ticket.price,
                    quantity: quantity,
                    total_amount: ticket.price * quantity,
                    status: 'paid'
                };
                sales.unshift(newSale); // Add to beginning
                localStorage.setItem('boom_sales', JSON.stringify(sales));

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            setTransactionId(newId);

            setTimeout(() => {
                setStep(4);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }, 1000);

        } catch (err) {
            console.error('Error saving sale:', err);
            alert(`Error: ${err.message || 'Hubo un error al procesar el registro.'}`);
            setStep(2);
        }
    };

    const getWhatsAppLink = () => {
        const message = `Hola, soy ${formData.name}. He comprado ${quantity} entradas ${ticket.name} para BOOM! 2026. Mi ID de compra es: BOOM-${transactionId}.`;
        return `https://wa.me/51977163359?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-dark-900 border border-white/20 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
                    <X size={24} />
                </button>

                {step === 1 && (
                    <div className="p-6">
                        <h3 className="text-2xl font-display font-bold text-white mb-2">Comprar Entradas</h3>
                        <div className="bg-white/5 p-4 rounded-xl mb-6 border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl font-bold text-neon-blue">{ticket.name}</h4>
                                <span className="text-xl font-bold text-white">S/ {ticket.price}</span>
                            </div>

                            <div className="flex items-center justify-between bg-black rounded-lg p-2 border border-white/10">
                                <span className="text-gray-300 pl-2">Cantidad:</span>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded bg-white/10 text-white hover:bg-white/20">-</button>
                                    <span className="text-xl font-bold w-4 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded bg-white/10 text-white hover:bg-white/20">+</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6 text-lg">
                            <span className="text-gray-400">Total a pagar:</span>
                            <span className="text-2xl font-bold text-neon-green">S/ {ticket.price * quantity}</span>
                        </div>

                        <button onClick={() => setStep(2)} className="w-full py-3 bg-neon-pink text-white font-bold rounded-xl hover:bg-neon-purple transition-colors">
                            Continuar
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-6">
                        <h3 className="text-2xl font-display font-bold text-white mb-6">Tus Datos</h3>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleBuy(); }}>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-500" size={18} />
                                <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre Completo" className="w-full bg-black border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:border-neon-blue outline-none transition-colors" />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                                <input required name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Correo Electrónico" className="w-full bg-black border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:border-neon-blue outline-none transition-colors" />
                            </div>
                            <div className="flex gap-4">
                                <div className="relative w-1/2">
                                    <Phone className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="WhatsApp" className="w-full bg-black border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:border-neon-blue outline-none transition-colors" />
                                </div>
                                <div className="relative w-1/2">
                                    <input required name="dni" value={formData.dni} onChange={handleInputChange} placeholder="DNI / Pasaporte" className="w-full bg-black border border-white/20 rounded-lg py-3 px-4 text-white focus:border-neon-blue outline-none transition-colors" />
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                {supabase ?
                                    "* Tus entradas serán enviadas a este correo y número." :
                                    <span className="text-neon-gold">* MODO DEMO: Los datos se guardarán localmente.</span>
                                }
                            </p>

                            <button type="submit" className="w-full mt-6 py-3 bg-neon-green text-black font-bold rounded-xl hover:bg-green-400 transition-colors shadow-[0_0_15px_rgba(57,255,20,0.4)] flex justify-center items-center gap-2">
                                <CreditCard size={20} /> Pagar S/ {ticket.price * quantity}
                            </button>
                            <button onClick={() => setStep(1)} type="button" className="w-full mt-2 py-2 text-gray-400 hover:text-white text-sm">
                                Volver
                            </button>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mb-6"></div>
                        <h3 className="text-xl font-bold text-white mb-2">Procesando Compra...</h3>
                        <p className="text-gray-400">Validando datos y guardando registro...</p>
                    </div>
                )}

                {step === 4 && (
                    <div className="p-8 flex flex-col items-center justify-center text-center bg-dark-900 overflow-y-auto max-h-[80vh]">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="mb-8 w-full"
                        >
                            <div className="flex items-center justify-center gap-2 mb-4 text-neon-green print:hidden">
                                <Check size={20} />
                                <span className="font-bold">¡Compra Exitosa!</span>
                            </div>
                            <TicketCard ticket={ticket} data={formData} id={transactionId} />
                        </motion.div>

                        <div className="space-y-3 w-full print:hidden">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                            >
                                <Printer size={20} /> Imprimir Entrada
                            </button>
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-colors"
                            >
                                <MessageCircle size={20} /> Confirmar por WhatsApp
                            </a>
                            <button onClick={onClose} className="w-full py-3 bg-transparent text-gray-400 hover:text-white text-sm">
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const Tickets = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);

    return (
        <section className="py-24 bg-black relative min-h-screen">
            {/* Background glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 pt-10">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold text-white mb-4"
                    >
                        ENTRADAS
                    </motion.h2>
                    <p className="text-gray-400 text-lg">Precios en moneda local (S/). ¡Asegura tu lugar!</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tickets.map((ticket, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ y: -10 }}
                            className={`relative bg-dark-800 rounded-3xl p-8 border ${ticket.color} flex flex-col transition-all duration-300 h-full`}
                        >
                            {ticket.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-pink text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg tracking-wider">
                                    MÁS VENDIDO
                                </div>
                            )}

                            <h3 className="text-2xl font-display font-bold text-white mb-2">{ticket.name}</h3>
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">
                                S/ {ticket.price}
                            </div>

                            <ul className="mb-8 space-y-4 flex-grow">
                                {ticket.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-neon-green" />
                                        </div>
                                        <span className="text-sm">{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => setSelectedTicket(ticket)}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${ticket.recommended ? 'bg-neon-pink text-white hover:bg-neon-purple shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                Comprar Ahora
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedTicket && (
                    <CheckoutModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Tickets;
