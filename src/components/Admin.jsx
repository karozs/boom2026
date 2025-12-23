import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, LayoutDashboard, LogOut, DollarSign, Users, Ticket, AlertTriangle, Search, Eye, X, Printer, Trash2, Check, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Html5QrcodeScanner } from 'html5-qrcode';
import TicketCard from './TicketCard';

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple mock authentication
        if (password === 'admin2026') {
            onLogin();
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[100px]"></div>

            <div className="bg-dark-900 border border-white/10 p-8 rounded-2xl w-full max-w-sm shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Admin Access</h2>
                    <p className="text-gray-400">BOOM! 2026 Control Panel</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña Maestra"
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">Contraseña incorrecta</p>}
                    </div>
                    <button type="submit" className="w-full bg-neon-pink text-white font-bold py-3 rounded-lg hover:bg-neon-purple transition-colors shadow-lg shadow-neon-pink/20">
                        Ingresar
                    </button>
                    <div className="text-center">
                        <Link to="/" className="text-gray-500 text-sm hover:text-white">Volver al sitio</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminDashboard = ({ onLogout }) => {
    const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0, ticketsSold: 0, pendingOrders: 0 });
    const [sales, setSales] = useState([]);
    const [pendingSales, setPendingSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'

    // Ticket Modal State
    const [selectedSale, setSelectedSale] = useState(null);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    // Payment Proof Modal State
    const [selectedProof, setSelectedProof] = useState(null);
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setLoading(true);
        try {
            let data = [];

            if (supabase) {
                // Optimized query with limit and specific columns
                const { data: supabaseData, error } = await supabase
                    .from('boom_sales_2026')
                    .select('id, created_at, name, email, phone, dni, ticket_name, ticket_price, quantity, total_amount, payment_method, payment_proof, status, checked_in, checked_in_at, attendees')
                    .order('created_at', { ascending: false })
                    .limit(500); // Limit to last 500 records for performance

                if (error) throw error;
                data = supabaseData || [];
            } else {
                console.warn('Supabase not connected. Fetching from localStorage.');
                data = JSON.parse(localStorage.getItem('boom_sales') || '[]');
            }

            // Separate pending and approved sales
            const pending = data.filter(sale => sale.status === 'pending');
            const approved = data.filter(sale => sale.status === 'approved');

            setSales(approved);
            setPendingSales(pending);

            // Calculate stats only for approved orders
            const totalRevenue = approved.reduce((acc, sale) => acc + parseFloat(sale.total_amount || sale.total || 0), 0);
            const totalTickets = approved.reduce((acc, sale) => acc + parseInt(sale.quantity), 0);

            setStats({
                totalSales: approved.length,
                totalRevenue,
                ticketsSold: totalTickets,
                pendingOrders: pending.length
            });
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveOrder = async (orderId) => {
        if (!window.confirm('¿Aprobar esta orden? Se generará el ticket para el cliente.')) {
            return;
        }

        try {
            if (supabase) {
                const { error } = await supabase
                    .from('boom_sales_2026')
                    .update({
                        status: 'approved',
                        approved_at: new Date().toISOString(),
                        approved_by: 'admin'
                    })
                    .eq('id', orderId);

                if (error) throw error;
            } else {
                // LocalStorage fallback
                const sales = JSON.parse(localStorage.getItem('boom_sales') || '[]');
                const saleIndex = sales.findIndex(s => s.id === orderId);
                if (saleIndex !== -1) {
                    sales[saleIndex].status = 'approved';
                    sales[saleIndex].approved_at = new Date().toISOString();
                    sales[saleIndex].approved_by = 'admin';
                    localStorage.setItem('boom_sales', JSON.stringify(sales));
                }
            }

            alert('✅ Orden aprobada exitosamente');
            fetchSales(); // Refresh data
        } catch (error) {
            console.error('Error approving order:', error);
            alert('Error al aprobar la orden: ' + error.message);
        }
    };

    const handleRejectOrder = async (orderId) => {
        const reason = window.prompt('Motivo del rechazo (opcional):');
        if (reason === null) return; // User cancelled

        try {
            if (supabase) {
                const { error } = await supabase
                    .from('boom_sales_2026')
                    .update({
                        status: 'rejected',
                        rejection_reason: reason || 'Sin motivo especificado'
                    })
                    .eq('id', orderId);

                if (error) throw error;
            } else {
                // LocalStorage fallback
                const sales = JSON.parse(localStorage.getItem('boom_sales') || '[]');
                const saleIndex = sales.findIndex(s => s.id === orderId);
                if (saleIndex !== -1) {
                    sales[saleIndex].status = 'rejected';
                    sales[saleIndex].rejection_reason = reason || 'Sin motivo especificado';
                    localStorage.setItem('boom_sales', JSON.stringify(sales));
                }
            }

            alert('❌ Orden rechazada');
            fetchSales(); // Refresh data
        } catch (error) {
            console.error('Error rejecting order:', error);
            alert('Error al rechazar la orden: ' + error.message);
        }
    };

    const openTicketModal = (sale) => {
        setSelectedSale(sale);
        setIsTicketModalOpen(true);
    };

    const handleResetData = async () => {
        if (!window.confirm('¿ESTÁS SEGURO? Esto eliminará TODAS las ventas registradas. Esta acción no se puede deshacer.')) {
            return;
        }

        setLoading(true);
        try {
            if (supabase) {
                const { error } = await supabase
                    .from('sales')
                    .delete()
                    .neq('id', 0); // Delete all rows where ID is not 0 (effectively all)

                if (error) {
                    alert('Error al eliminar: Necesitas habilitar la política de DELETE en Supabase.\n\nEjecuta esto en SQL Editor:\nCREATE POLICY "Enable delete for everyone" ON sales FOR DELETE USING (true);');
                    throw error;
                }
            }

            // Also clear local storage
            localStorage.removeItem('boom_sales');
            setSales([]);
            setStats({ totalSales: 0, totalRevenue: 0, ticketsSold: 0 });
            alert('Base de datos reiniciada correctamente.');
        } catch (error) {
            console.error('Error resetting data:', error);
        } finally {
            setLoading(false);
        }
    };

    const salesToDisplay = activeTab === 'pending' ? pendingSales : sales;

    const filteredSales = salesToDisplay.filter(sale =>
        sale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.email && sale.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <nav className="border-b border-white/10 bg-dark-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="text-neon-blue" />
                        <span className="font-display font-bold text-xl tracking-wider">BOOM! ADMIN</span>
                        {!supabase && (
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-500 text-xs font-bold">
                                <AlertTriangle size={12} /> DEMO MODE
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={fetchSales} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                            Refrescar
                        </button>
                        <button onClick={handleResetData} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20 text-xs font-bold uppercase tracking-wider">
                            <Trash2 size={14} /> RESET DB
                        </button>
                        <button onClick={onLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
                            <LogOut size={18} /> Salir
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div
                        onClick={() => setActiveTab('pending')}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group ${activeTab === 'pending' ? 'bg-yellow-500/10 border-yellow-500 hover:bg-yellow-500/20' : 'bg-dark-800 border-white/10 hover:border-yellow-500/50'}`}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertTriangle size={64} className="text-yellow-500" />
                        </div>
                        <h3 className={`text-sm uppercase tracking-widest font-medium mb-1 ${activeTab === 'pending' ? 'text-yellow-500' : 'text-gray-400'}`}>Por Aprobar</h3>
                        <p className={`text-4xl font-bold ${activeTab === 'pending' ? 'text-white' : 'text-yellow-500'}`}>
                            {stats.pendingOrders}
                        </p>
                        {stats.pendingOrders > 0 && (
                            <div className="absolute px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full top-4 right-4 animate-pulse">
                                REQUIERE ATENCIÓN
                            </div>
                        )}
                    </div>

                    <div className="bg-dark-800 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign size={64} />
                        </div>
                        <h3 className="text-gray-400 text-sm uppercase tracking-widest font-medium mb-1">Ingresos Totales</h3>
                        <p className="text-4xl font-bold text-neon-green">S/ {stats.totalRevenue}</p>
                    </div>

                    <div className="bg-dark-800 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Ticket size={64} />
                        </div>
                        <h3 className="text-gray-400 text-sm uppercase tracking-widest font-medium mb-1">Entradas Vendidas</h3>
                        <p className="text-4xl font-bold text-neon-pink">{stats.ticketsSold}</p>
                    </div>

                    <div className="bg-dark-800 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users size={64} />
                        </div>
                        <h3 className="text-gray-400 text-sm uppercase tracking-widest font-medium mb-1">Clientes</h3>
                        <p className="text-4xl font-bold text-neon-blue">{stats.totalSales}</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'pending'
                            ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                            : 'bg-dark-800 text-gray-400 hover:text-white border border-white/10'}`}
                    >
                        Pendientes ({stats.pendingOrders})
                    </button>
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'approved'
                            ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]'
                            : 'bg-dark-800 text-gray-400 hover:text-white border border-white/10'}`}
                    >
                        Aprobados / Historial
                    </button>


                    <button
                        onClick={() => setActiveTab('scanner')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'scanner'
                            ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]'
                            : 'bg-dark-800 text-gray-400 hover:text-white border border-white/10'}`}
                    >
                        Escáner / Puerta
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'content'
                            ? 'bg-neon-blue text-white shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                            : 'bg-dark-800 text-gray-400 hover:text-white border border-white/10'}`}
                    >
                        Gestor de Contenido
                    </button>
                </div>

                {/* Content Area */}
                {activeTab === 'scanner' ? (
                    <ScannerSection sales={sales} fetchSales={fetchSales} />
                ) : activeTab === 'content' ? (
                    <ContentManager />
                ) : (
                    <div className="bg-dark-900 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h3 className="text-xl font-bold text-white">
                                {activeTab === 'pending' ? 'Órdenes por Aprobar' : 'Ventas Aprobadas'}
                            </h3>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black border border-white/20 rounded-xl py-2 pl-10 pr-4 text-white focus:border-neon-pink outline-none transition-colors"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Cliente</th>
                                        <th className="p-4">Email / Info</th>
                                        <th className="p-4">Tipo Entrada</th>
                                        <th className="p-4 text-center">Cant.</th>
                                        <th className="p-4 text-right">Total</th>
                                        <th className="p-4 text-center">Pago</th>
                                        {activeTab === 'pending' && <th className="p-4 text-center">Captura</th>}
                                        {activeTab === 'approved' && <th className="p-4 text-center">Estado</th>}
                                        <th className="p-4 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan="8" className="p-8 text-center text-gray-400">Cargando datos...</td></tr>
                                    ) : filteredSales.length > 0 ? (
                                        filteredSales.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 font-medium text-white flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-xs font-bold">
                                                        {sale.name.charAt(0)}
                                                    </div>
                                                    {sale.name}
                                                    <div className="text-xs text-gray-500">ID: {sale.id}</div>
                                                </td>
                                                <td className="p-4 text-gray-300">
                                                    <div className="flex flex-col">
                                                        <span>{sale.email}</span>
                                                        <span className="text-xs text-gray-500">{sale.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${(sale.ticket_name || sale.ticketName) === 'VIP' ? 'border-neon-pink text-neon-pink' :
                                                        ((sale.ticket_name || sale.ticketName) === 'BOOM! EXP' || (sale.ticket_name || sale.ticketName) === 'BOOM EXP') ? 'border-neon-gold text-neon-gold' :
                                                            'border-gray-500 text-gray-300'
                                                        }`}>
                                                        {sale.ticket_name || sale.ticketName}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center text-gray-300">{sale.quantity}</td>
                                                <td className="p-4 text-right font-bold text-neon-green">S/ {sale.total_amount || sale.total}</td>
                                                <td className="p-4 text-center capitalize text-gray-400">
                                                    {sale.payment_method || 'yape'}
                                                </td>

                                                {activeTab === 'pending' && (
                                                    <td className="p-4 text-center">
                                                        {sale.payment_proof ? (
                                                            <button
                                                                onClick={() => { setSelectedProof(sale); setIsProofModalOpen(true); }}
                                                                className="text-neon-blue hover:text-white text-xs underline"
                                                            >
                                                                <Eye size={18} className="mx-auto" />
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-600">-</span>
                                                        )}
                                                    </td>
                                                )}

                                                {activeTab === 'approved' && (
                                                    <td className="p-4 text-center">
                                                        {sale.checked_in ? (
                                                            <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-500 border border-red-500/50">
                                                                USADO
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-500 border border-green-500/50">
                                                                DISPONIBLE
                                                            </span>
                                                        )}
                                                    </td>
                                                )}

                                                <td className="p-4 text-center">
                                                    {activeTab === 'approved' ? (
                                                        <button
                                                            onClick={() => openTicketModal(sale)}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-neon-purple text-gray-400 hover:text-white transition-all transform hover:scale-110"
                                                            title="Ver Ticket"
                                                        >
                                                            <Ticket size={18} />
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleApproveOrder(sale.id)}
                                                                className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-white transition-all"
                                                                title="Aprobar"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectOrder(sale.id)}
                                                                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                                                                title="Rechazar"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="p-8 text-center text-gray-500">
                                                No hay resultados en esta sección.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* TICKET MODAL */}
            <AnimatePresence>
                {isTicketModalOpen && selectedSale && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-transparent w-full max-w-sm relative"
                        >
                            <button
                                onClick={() => setIsTicketModalOpen(false)}
                                className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full z-50 focus:outline-none"
                            >
                                <X size={24} />
                            </button>

                            <div className="bg-dark-900 rounded-3xl p-1 mb-4 print:mb-0 print:p-0">
                                <TicketCard
                                    ticket={{
                                        name: selectedSale.ticket_name || selectedSale.ticketName,
                                        id: (selectedSale.ticket_name === 'VIP' || selectedSale.ticketName === 'VIP') ? 'vip' :
                                            ((selectedSale.ticket_name === 'BOOM! EXP' || selectedSale.ticketName === 'BOOM! EXP' || selectedSale.ticket_name === 'BOOM EXP' || selectedSale.ticketName === 'BOOM EXP')) ? 'exp' : 'gen'
                                    }}
                                    data={{
                                        name: selectedSale.name,
                                        attendees: selectedSale.attendees
                                    }}
                                    id={selectedSale.id}
                                />
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="w-full py-3 bg-neon-blue text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,255,0.3)] print:hidden"
                            >
                                <Printer size={20} /> Imprimir Ticket
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* PAYMENT PROOF MODAL */}
            <AnimatePresence>
                {isProofModalOpen && selectedProof && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-dark-900 border border-white/20 rounded-2xl w-full max-w-2xl relative overflow-hidden"
                        >
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50">
                                <h3 className="text-xl font-bold text-white">Verificación de Pago</h3>
                                <button
                                    onClick={() => setIsProofModalOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 md:flex gap-6">
                                {/* Image Column */}
                                <div className="md:w-1/2 mb-6 md:mb-0">
                                    <div className="bg-black/50 border border-white/10 rounded-xl p-2 h-full flex items-center justify-center min-h-[300px]">
                                        <img
                                            src={selectedProof.payment_proof}
                                            alt="Comprobante"
                                            className="max-h-[500px] w-full object-contain rounded-lg"
                                        />
                                    </div>
                                    <a
                                        href={selectedProof.payment_proof}
                                        download={`comprobante-${selectedProof.id}.png`}
                                        className="block text-center text-neon-blue text-sm mt-2 hover:underline"
                                    >
                                        Descargar Imagen Original
                                    </a>
                                </div>

                                {/* Details Column */}
                                <div className="md:w-1/2 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-gray-500 text-sm">Cliente</span>
                                            <p className="text-white font-bold text-lg">{selectedProof.name}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-sm">Entrada</span>
                                            <p className="text-white text-lg">
                                                {selectedProof.quantity}x {selectedProof.ticket_name}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-sm">Total a Pagar</span>
                                            <p className="text-neon-green font-bold text-2xl">S/ {selectedProof.total_amount}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-sm">ID Orden</span>
                                            <p className="font-mono text-gray-400">BOOM-{selectedProof.id}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => {
                                                handleRejectOrder(selectedProof.id);
                                                setIsProofModalOpen(false);
                                            }}
                                            className="py-3 rounded-xl border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-all"
                                        >
                                            Rechazar
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleApproveOrder(selectedProof.id);
                                                setIsProofModalOpen(false);
                                            }}
                                            className="py-3 rounded-xl bg-neon-green text-black font-bold hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                                        >
                                            Aprobar Pago
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ScannerSection = ({ sales, fetchSales }) => {
    const [scanResult, setScanResult] = useState(null);
    const [manualId, setManualId] = useState('');
    const [scannerMessage, setScannerMessage] = useState('');
    const [scannerActive, setScannerActive] = useState(true);

    useEffect(() => {
        if (!scannerActive) return;

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                videoConstraints: {
                    facingMode: "environment"
                }
            },
            /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText, decodedResult) {
            scanner.clear();
            setScannerActive(false);
            handleValidateTicket(decodedText);
        }

        function onScanFailure(error) {
            // handle scan failure, usually better to ignore and keep scanning.
            // console.warn(`Code scan error = ${error}`);
        }

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear html5-qrcode scanner. ", error));
        };
    }, [scannerActive]);

    const handleValidateTicket = (dataString) => {
        try {
            // Try to parse JSON (New format)
            let ticketId;
            try {
                const data = JSON.parse(dataString);
                ticketId = data.id;
            } catch (e) {
                // Legacy format or plain text
                ticketId = dataString;
            }

            // Find ticket in sales list
            // IMPORTANT: sales prop might not contain ALL sales if pagination exists, but here we assume it does or we should query DB.
            // For robustness, better to query DB directly if ID found. But sales prop has everything for now.

            // Note: sales passed to this component might be filtered. We should probably use the full fetch or pass allSales. 
            // Current 'sales' prop is whatever AdminDashboard has. AdminDashboard loads ALL sales (no pagination yet).

            const ticket = sales.find(s => s.id.toString() === ticketId.toString());

            if (!ticket) {
                setScanResult({ status: 'error', message: 'TICKET NO ENCONTRADO', details: 'El ID no existe en la base de datos.' });
                return;
            }

            if (ticket.status !== 'approved') {
                setScanResult({
                    status: 'invalid',
                    message: 'TICKET NO VÁLIDO',
                    details: `El estado del ticket es: ${ticket.status.toUpperCase()}`,
                    ticket: ticket
                });
                return;
            }

            if (ticket.checked_in) {
                setScanResult({
                    status: 'used',
                    message: 'TICKET YA USADO',
                    details: `Ingresó el: ${new Date(ticket.checked_in_at).toLocaleTimeString()}`,
                    ticket: ticket
                });
                return;
            }

            setScanResult({
                status: 'valid',
                message: 'TICKET VÁLIDO',
                details: 'Puede ingresar.',
                ticket: ticket
            });

        } catch (err) {
            setScanResult({ status: 'error', message: 'ERROR DE LECTURA', details: err.message });
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        setScannerActive(false); // Stop scanner to show result
        handleValidateTicket(manualId);
    };

    const handleCheckIn = async () => {
        if (!scanResult || !scanResult.ticket) return;

        try {
            const ticketId = scanResult.ticket.id;

            if (supabase) {
                const { error } = await supabase
                    .from('boom_sales_2026')
                    .update({
                        checked_in: true,
                        checked_in_at: new Date().toISOString()
                    })
                    .eq('id', ticketId);

                if (error) throw error;
            } else {
                // LocalStorage Fallback
                const storedSales = JSON.parse(localStorage.getItem('boom_sales') || '[]');
                const index = storedSales.findIndex(s => s.id === ticketId);
                if (index !== -1) {
                    storedSales[index].checked_in = true;
                    storedSales[index].checked_in_at = new Date().toISOString();
                    localStorage.setItem('boom_sales', JSON.stringify(storedSales));
                }
            }

            alert(`✅ INGRESO REGISTRADO: ${scanResult.ticket.name}`);
            setScanResult(null);
            setScannerActive(true);
            setManualId('');
            fetchSales(); // Refresh data

        } catch (error) {
            console.error('Error check-in:', error);
            alert('Error al registrar ingreso');
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setScannerActive(true);
        setManualId('');
    };

    return (
        <div className="bg-dark-900 rounded-2xl border border-white/10 overflow-hidden p-6">
            <h3 className="text-xl font-bold text-white mb-6">Escáner de Tickets</h3>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Scanner Area */}
                <div className="w-full md:w-1/2">
                    {scannerActive ? (
                        <div className="bg-black border-2 border-dashed border-white/20 rounded-xl overflow-hidden relative">
                            <div id="reader" className="w-full"></div>
                            <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500 pointer-events-none">
                                Apunta la cámara al código QR
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-black/50 border border-white/10 rounded-xl p-10 h-64">
                            <p className="text-gray-400 mb-4">Escáner Pausado</p>
                            <button
                                onClick={resetScanner}
                                className="px-6 py-2 bg-neon-blue text-black font-bold rounded-lg hover:bg-white transition-colors"
                            >
                                Escanear Nuevo
                            </button>
                        </div>
                    )}

                    <div className="mt-6">
                        <div className="mb-2 text-sm text-gray-400 uppercase font-bold">Ingreso Manual</div>
                        <form onSubmit={handleManualSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value)}
                                placeholder="Ingrese ID del Ticket"
                                className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-2 text-white focus:border-neon-pink outline-none"
                            />
                            <button type="submit" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg">
                                Verificar
                            </button>
                        </form>
                    </div>
                </div>

                {/* Result Area */}
                <div className="w-full md:w-1/2">
                    {scanResult ? (
                        <div className={`h-full rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 ${scanResult.status === 'valid' ? 'bg-green-500/10 border-green-500' :
                            scanResult.status === 'used' ? 'bg-yellow-500/10 border-yellow-500' :
                                'bg-red-500/10 border-red-500'
                            }`}>
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${scanResult.status === 'valid' ? 'bg-green-500 text-white' :
                                scanResult.status === 'used' ? 'bg-yellow-500 text-black' :
                                    'bg-red-500 text-white'
                                }`}>
                                {scanResult.status === 'valid' ? <Check size={48} /> :
                                    scanResult.status === 'used' ? <AlertTriangle size={48} /> :
                                        <X size={48} />}
                            </div>

                            <h2 className={`text-3xl font-display font-bold mb-2 ${scanResult.status === 'valid' ? 'text-green-500' :
                                scanResult.status === 'used' ? 'text-yellow-500' :
                                    'text-red-500'
                                }`}>
                                {scanResult.message}
                            </h2>

                            <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                                {scanResult.details}
                            </p>

                            {scanResult.ticket && (
                                <div className="bg-black/40 rounded-xl p-4 w-full mb-6 text-left">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-500 text-xs uppercase">Cliente</span>
                                        <span className="text-white font-bold">{scanResult.ticket.name}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-500 text-xs uppercase">Ticket</span>
                                        <span className={`font-bold ${(scanResult.ticket.ticket_name || scanResult.ticket.ticketName) === 'VIP' ? 'text-neon-pink' : 'text-white'
                                            }`}>
                                            {scanResult.ticket.ticket_name || scanResult.ticket.ticketName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-xs uppercase">ID</span>
                                        <span className="font-mono text-gray-400">{scanResult.ticket.id}</span>
                                    </div>
                                </div>
                            )}

                            {scanResult.status === 'valid' && (
                                <button
                                    onClick={handleCheckIn}
                                    className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl text-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-105"
                                >
                                    MARCAR INGRESO
                                </button>
                            )}

                            {(scanResult.status !== 'valid') && (
                                <button
                                    onClick={resetScanner}
                                    className="text-gray-400 hover:text-white underline mt-4"
                                >
                                    Escanear Siguiente
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500 border border-white/10 border-dashed rounded-2xl bg-black/20">
                            <div className="mb-4 opacity-50">
                                <Search size={48} />
                            </div>
                            <p>Esperando lectura...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );


};

const ContentManager = () => {
    const [activeSection, setActiveSection] = useState('lineup'); // lineup, gallery
    const [lineupItems, setLineupItems] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Initial Fetch
    useEffect(() => {
        fetchContent();
    }, [activeSection]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            if (activeSection === 'lineup') {
                const { data, error } = await supabase
                    .from('boom_lineup')
                    .select('*')
                    .order('display_order', { ascending: true });
                if (data) setLineupItems(data);
            } else {
                const { data, error } = await supabase
                    .from('boom_gallery')
                    .select('*')
                    .order('display_order', { ascending: true });
                if (data) setGalleryItems(data);
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file, bucketFolder) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${bucketFolder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('content')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('content')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleUpdateLineupVideo = async (id, file) => {
        if (!file) return;
        setUploading(true);
        try {
            const publicUrl = await handleFileUpload(file, 'videos');

            const { error } = await supabase
                .from('boom_lineup')
                .update({ video_url: publicUrl })
                .eq('id', id);

            if (error) throw error;
            alert('✅ Video actualizado correctamente');
            fetchContent();
        } catch (error) {
            console.error(error);
            alert('Error al subir video: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAddGalleryImage = async (file) => {
        if (!file) return;

        // Check file size (Supabase default limit is 50MB)
        if (file.size > 50 * 1024 * 1024) {
            alert('❌ El archivo es demasiado pesado. El límite es de 50MB para videos.');
            return;
        }

        setUploading(true);
        try {
            console.log("Subiendo archivo:", file.name, file.type, file.size);
            const publicUrl = await handleFileUpload(file, 'gallery');
            const fileType = file.type.startsWith('video/') ? 'video' : 'image';

            const { error: dbError } = await supabase
                .from('boom_gallery')
                .insert([{
                    image_url: publicUrl,
                    title: 'Nuevo Contenido',
                    media_type: fileType
                }]);

            if (dbError) {
                console.error("Error en base de datos:", dbError);
                throw new Error("Error al registrar en la base de datos: " + dbError.message);
            }

            alert(`✅ ${fileType === 'video' ? 'Video' : 'Imagen'} agregado correctamente`);
            fetchContent();
        } catch (error) {
            console.error("Error completo de subida:", error);
            const errorMsg = error.message === 'Failed to fetch'
                ? 'Error de conexión o archivo demasiado grande. Verifica tu internet o usa un video más corto.'
                : error.message;
            alert('Error al subir contenido: ' + errorMsg);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteGalleryImage = async (id) => {
        if (!confirm('¿Eliminar imagen?')) return;
        try {
            await supabase.from('boom_gallery').delete().eq('id', id);
            fetchContent();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-dark-900 rounded-2xl border border-white/10 overflow-hidden p-6">
            <h3 className="text-xl font-bold text-white mb-6">Gestor de Contenido Multimedia</h3>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveSection('lineup')}
                    className={`px-4 py-2 rounded-lg font-bold ${activeSection === 'lineup' ? 'bg-neon-pink text-white' : 'bg-white/5 text-gray-400'}`}
                >
                    Lineup & Videos
                </button>
                <button
                    onClick={() => setActiveSection('gallery')}
                    className={`px-4 py-2 rounded-lg font-bold ${activeSection === 'gallery' ? 'bg-neon-blue text-white' : 'bg-white/5 text-gray-400'}`}
                >
                    Galería de Fotos
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-10">Cargando contenido...</div>
            ) : (
                <>
                    {activeSection === 'lineup' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {lineupItems.map(item => (
                                <div key={item.id} className="bg-black/40 p-4 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-white">{item.name}</h4>
                                            <p className="text-xs text-gray-400">{item.genre_subtitle}</p>
                                        </div>
                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color_gradient}`}></div>
                                    </div>

                                    <div className="mb-4 bg-black rounded-lg h-32 flex items-center justify-center overflow-hidden relative group">
                                        {item.video_url ? (
                                            <video src={item.video_url} className="w-full h-full object-cover" controls />
                                        ) : (
                                            <span className="text-gray-600 text-xs">Sin Video</span>
                                        )}
                                    </div>

                                    <label className="block w-full text-center py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors text-sm text-white">
                                        {uploading ? 'Subiendo...' : 'Subir/Cambiar Video'}
                                        <input
                                            type="file"
                                            accept="video/mp4"
                                            className="hidden"
                                            onChange={(e) => handleUpdateLineupVideo(item.id, e.target.files[0])}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'gallery' && (
                        <div>
                            <div className="mb-6 flex justify-end">
                                <label className="flex items-center gap-2 px-4 py-2 bg-neon-green text-black font-bold rounded-lg cursor-pointer hover:bg-green-400 transition-colors">
                                    <Plus size={20} /> Agregar Multimedia
                                    <input
                                        type="file"
                                        accept="image/*,video/mp4,video/quicktime,image/gif"
                                        className="hidden"
                                        onChange={(e) => handleAddGalleryImage(e.target.files[0])}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {galleryItems.map(item => (
                                    <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden bg-black border border-white/10">
                                        {item.media_type === 'video' ? (
                                            <video
                                                src={item.image_url}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                onMouseOver={e => e.target.play()}
                                                onMouseOut={e => e.target.pause()}
                                            />
                                        ) : (
                                            <img src={item.image_url} alt="Gallery" className="w-full h-full object-cover" />
                                        )}

                                        {/* Media Type Badge */}
                                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase tracking-wider border border-white/10">
                                            {item.media_type || 'image'}
                                        </div>

                                        <button
                                            onClick={() => handleDeleteGalleryImage(item.id)}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {galleryItems.length === 0 && (
                                    <p className="col-span-4 text-center text-gray-500 py-10">No hay imágenes en la galería.</p>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check session on mount (mock)
    useEffect(() => {
        if (localStorage.getItem('admin_session') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('admin_session', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_session');
    };

    return isAuthenticated ? <AdminDashboard onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} />;
}
