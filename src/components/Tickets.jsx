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
        subtitle: "(SI VIENES SOLANO)",
        price: 0,
        features: [
            { text: "Acceso Libre", highlight: false },
            { text: "Acceso al cubículo instagrameable", highlight: false },
            { text: "Accesorios temáticos de fin de año", highlight: false },
            { text: "Shot de cortesía", highlight: false },
        ],
        recommended: false,
        color: "border-white/10 hover:border-white/30"
    },
    {
        id: "vip",
        name: "VIP",
        subtitle: "(MÁX 5 PERSONAS)",
        price: 50,
        features: [
            { text: "Acceso Libre (Grupo)", highlight: false },
            { text: "50% OFF 1ra Botella (Flor de Caña) o Cóctel Individual", highlight: true },
            { text: "Acceso al cubículo instagrameable", highlight: false },
            { text: "Pulseras", highlight: false },
            { text: "Shot de cortesía", highlight: false },
            { text: "Accesorios temáticos de fin de año", highlight: false }
        ],
        recommended: true,
        color: "border-neon-pink shadow-[0_0_20px_rgba(255,0,255,0.2)] hover:shadow-[0_0_30px_rgba(255,0,255,0.4)]"
    },
    {
        id: "exp",
        name: "BOOM EXP",
        subtitle: "(MÁX 5 PERSONAS)",
        price: 70,
        features: [
            { text: "Acceso Libre", highlight: false },
            { text: "Botella de Cortesía (Flor de Caña) o Cóctel individual + Shot individual de French 75", highlight: true },
            { text: "Acceso al cubículo instagrameable", highlight: false },
            { text: "Pulseras", highlight: false },
            { text: "Shot de cortesía", highlight: false },
            { text: "Accesorios temáticos de fin de año", highlight: false }
        ],
        recommended: false,
        color: "border-neon-gold hover:border-gold-400"
    }
];





const CheckoutModal = ({ ticket, onClose }) => {
    // Steps: 1: Selection, 2: Form, 2.5: Payment Method, 3: Processing, 4: Success/Pending
    const [step, setStep] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dni: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('yape'); // 'yape' or 'efectivo'
    const [paymentProof, setPaymentProof] = useState(null); // Base64 image
    const [paymentProofPreview, setPaymentProofPreview] = useState(null); // Preview URL
    const [transactionId, setTransactionId] = useState('');

    const [attendees, setAttendees] = useState(['', '', '', '']);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAttendeeChange = (index, value) => {
        const newAttendees = [...attendees];
        newAttendees[index] = value;
        setAttendees(newAttendees);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Por favor selecciona una imagen válida');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen es muy grande. Máximo 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentProof(reader.result); // Base64
                setPaymentProofPreview(reader.result); // For preview
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBuy = async () => {
        // Validate payment proof for Yape
        if (paymentMethod === 'yape' && !paymentProof) {
            alert('Por favor sube la captura de tu pago por Yape');
            setStep(2.5);
            return;
        }

        setStep(3);

        try {
            let newId = '';
            const attendeesList = attendees.filter(a => a.trim() !== '').join(', ');

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
                            payment_method: paymentMethod,
                            payment_proof: paymentProof,
                            status: 'pending', // Always pending until admin approves
                            attendees: attendeesList
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
                    payment_method: paymentMethod,
                    payment_proof: paymentProof,
                    status: 'pending',
                    attendees: attendeesList
                };
                sales.unshift(newSale); // Add to beginning
                localStorage.setItem('boom_sales', JSON.stringify(sales));

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            setTransactionId(newId);

            setTimeout(() => {
                setStep(4);
                // No confetti for pending orders
            }, 1000);

        } catch (err) {
            console.error('Error saving sale:', err);
            alert(`Error: ${err.message || 'Hubo un error al procesar el registro.'}`);
            setStep(2.5);
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
                className="bg-dark-900 border border-white/20 rounded-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] shadow-2xl relative"
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
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2.5); }}>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-500" size={18} />
                                <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre Completo (Titular)" className="w-full bg-black border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:border-neon-blue outline-none transition-colors" />
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

                            {/* Group Member Fields for VIP and EXP */}
                            {(ticket.id === 'vip' || ticket.id === 'exp') && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-neon-blue font-bold text-sm mb-3">Integrantes del Grupo (Opcional):</p>
                                    <div className="space-y-3">
                                        {[0, 1, 2, 3].map((index) => (
                                            <div key={index} className="relative">
                                                <input
                                                    value={attendees[index]}
                                                    onChange={(e) => handleAttendeeChange(index, e.target.value)}
                                                    placeholder={`Nombre del integrante #${index + 1}`}
                                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-4 text-sm text-white focus:border-neon-blue outline-none transition-colors"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-gray-500 mt-2">
                                {supabase ?
                                    "* Tus entradas serán enviadas a este correo y número." :
                                    <span className="text-neon-gold">* MODO DEMO: Los datos se guardarán localmente.</span>
                                }
                            </p>

                            <button type="submit" className="w-full mt-6 py-3 bg-neon-pink text-white font-bold rounded-xl hover:bg-neon-purple transition-colors">
                                Continuar al Pago
                            </button>
                            <button onClick={() => setStep(1)} type="button" className="w-full mt-2 py-2 text-gray-400 hover:text-white text-sm">
                                Volver
                            </button>
                        </form>
                    </div>
                )}

                {step === 2.5 && (
                    <div className="p-6">
                        <h3 className="text-2xl font-display font-bold text-white mb-6">Método de Pago</h3>

                        {/* Payment Method Selection */}
                        <div className="space-y-4 mb-6">
                            <label className="block">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="yape"
                                    checked={paymentMethod === 'yape'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="hidden peer"
                                />
                                <div className="flex items-center gap-4 p-4 border-2 border-white/20 rounded-xl cursor-pointer peer-checked:border-neon-purple peer-checked:bg-neon-purple/10 transition-all hover:border-white/40">
                                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">Y</div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold">Yape</h4>
                                        <p className="text-gray-400 text-sm">Pago instantáneo con captura</p>
                                    </div>
                                </div>
                            </label>

                            <label className="block">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="efectivo"
                                    checked={paymentMethod === 'efectivo'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="hidden peer"
                                />
                                <div className="flex items-center gap-4 p-4 border-2 border-white/20 rounded-xl cursor-pointer peer-checked:border-neon-green peer-checked:bg-neon-green/10 transition-all hover:border-white/40">
                                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">S/</div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold">Efectivo</h4>
                                        <p className="text-gray-400 text-sm">Pago en persona</p>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Yape Instructions and Upload */}
                        {paymentMethod === 'yape' && (
                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <CreditCard size={18} />
                                    Instrucciones de Pago
                                </h4>
                                <p className="text-gray-300 text-sm mb-3">
                                    1. Realiza el pago de <span className="font-bold text-neon-green">S/ {ticket.price * quantity}</span> al número:<br />
                                    <span className="font-bold text-white text-lg">977 163 359</span>
                                </p>
                                <p className="text-gray-300 text-sm mb-4">
                                    2. Sube la captura de pantalla de tu pago:
                                </p>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="payment-proof-upload"
                                />
                                <label
                                    htmlFor="payment-proof-upload"
                                    className="block w-full py-3 bg-white/10 border-2 border-dashed border-white/30 rounded-xl text-center cursor-pointer hover:bg-white/20 hover:border-white/50 transition-all"
                                >
                                    {paymentProofPreview ? (
                                        <div className="space-y-2">
                                            <img src={paymentProofPreview} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                                            <p className="text-neon-green text-sm font-bold">✓ Captura cargada - Click para cambiar</p>
                                        </div>
                                    ) : (
                                        <div className="text-gray-300">
                                            <p className="font-bold">📸 Click para subir captura</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG - Máx 5MB</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        )}

                        {/* Efectivo Instructions */}
                        {paymentMethod === 'efectivo' && (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                                <h4 className="text-white font-bold mb-2">📍 Pago en Efectivo</h4>
                                <p className="text-gray-300 text-sm">
                                    Tu orden quedará pendiente hasta que realices el pago en persona.
                                    Te contactaremos para coordinar la entrega y pago de <span className="font-bold text-neon-green">S/ {ticket.price * quantity}</span>.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleBuy}
                            className="w-full py-3 bg-neon-green text-black font-bold rounded-xl hover:bg-green-400 transition-colors shadow-[0_0_15px_rgba(57,255,20,0.4)] flex justify-center items-center gap-2"
                        >
                            <CreditCard size={20} /> Confirmar Orden - S/ {ticket.price * quantity}
                        </button>
                        <button onClick={() => setStep(2)} type="button" className="w-full mt-2 py-2 text-gray-400 hover:text-white text-sm">
                            Volver
                        </button>
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
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="mb-6 w-full"
                        >
                            {/* Pending Icon */}
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center">
                                <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <h3 className="text-2xl font-display font-bold text-white mb-2">
                                ¡Orden Recibida!
                            </h3>
                            <p className="text-yellow-500 font-bold mb-4">
                                Pendiente de Verificación
                            </p>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 text-left">
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
                                    <span className="text-gray-400">ID de Orden:</span>
                                    <span className="font-mono font-bold text-neon-blue">BOOM-{transactionId}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
                                    <span className="text-gray-400">Entrada:</span>
                                    <span className="font-bold text-white">{ticket.name}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
                                    <span className="text-gray-400">Cantidad:</span>
                                    <span className="font-bold text-white">{quantity}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
                                    <span className="text-gray-400">Método de Pago:</span>
                                    <span className="font-bold text-white capitalize">{paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Total:</span>
                                    <span className="font-bold text-neon-green text-xl">S/ {ticket.price * quantity}</span>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                                <p className="text-gray-300 text-sm">
                                    {paymentMethod === 'yape' ? (
                                        <>
                                            Tu pago está siendo verificado. Recibirás tu entrada por correo una vez que sea aprobada.
                                            <br /><br />
                                            <span className="text-yellow-500 font-bold">⏱️ Tiempo estimado: 1-24 horas</span>
                                        </>
                                    ) : (
                                        <>
                                            Nos pondremos en contacto contigo para coordinar el pago en efectivo.
                                            <br /><br />
                                            <span className="text-yellow-500 font-bold">📞 Te contactaremos pronto</span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </motion.div>

                        <div className="space-y-3 w-full">
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-colors"
                            >
                                <MessageCircle size={20} /> Contactar por WhatsApp
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
                        PROMOCIONES
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

                            <h3 className="text-2xl font-display font-bold text-white mb-1">{ticket.name}</h3>
                            {ticket.subtitle && <p className="text-neon-blue text-sm font-bold mb-4 tracking-wider">{ticket.subtitle}</p>}
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">
                                {ticket.price === 0 ? "FREE" : `S/ ${ticket.price}`}
                            </div>

                            <ul className="mb-8 space-y-4 flex-grow">
                                {ticket.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${feat.highlight ? 'bg-yellow-400/20' : 'bg-white/10'}`}>
                                            <Check className={`w-3 h-3 ${feat.highlight ? 'text-yellow-400' : 'text-neon-green'}`} />
                                        </div>
                                        <span className={`text-sm ${feat.highlight ? 'text-yellow-400 font-bold tracking-wide' : ''}`}>
                                            {feat.text}
                                        </span>
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
