import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, LayoutDashboard, LogOut, DollarSign, Users, Ticket, AlertTriangle, Search, Eye, X, Printer, Trash2, Check, Plus, Wine, ShoppingCart, Minus } from 'lucide-react';
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

    // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="min-h-screen bg-black text-white font-sans flex">
            {/* SIDEBAR NAVIGATION */}
            <div className={`w-64 bg-dark-900 border-r border-white/10 flex flex-col fixed h-screen z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                {/* Logo Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="text-neon-blue" size={28} />
                        <span className="font-display font-bold text-xl tracking-wider">BOOM! ADMIN</span>
                    </div>
                    {!supabase && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-500 text-xs font-bold">
                            <AlertTriangle size={12} />
                            DEMO MODE
                        </div>
                    )}
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* BOLETERÍA Section */}
                    <div className="mb-6">
                        <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3 px-2">
                            🎫 Boletería
                        </h3>
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'pending'
                                    ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <AlertTriangle size={18} />
                                <span className="flex-1 text-left">Pendientes</span>
                                {stats.pendingOrders > 0 && (
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                        {stats.pendingOrders}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab('approved')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'approved'
                                    ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Ticket size={18} />
                                <span className="flex-1 text-left">Aprobados</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('scanner')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'scanner'
                                    ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Search size={18} />
                                <span className="flex-1 text-left">Escáner / Puerta</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('content')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'content'
                                    ? 'bg-neon-blue text-white shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <LayoutDashboard size={18} />
                                <span className="flex-1 text-left">Gestor Contenido</span>
                            </button>
                        </nav>
                    </div>

                    {/* PUNTO DE VENTA Section */}
                    <div className="mb-6">
                        <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3 px-2">
                            🍷 Punto de Venta
                        </h3>
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('drinks')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'drinks'
                                    ? 'bg-gradient-to-r from-neon-gold to-amber-500 text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Wine size={18} />
                                <span className="flex-1 text-left">Venta de Bebidas</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/10 space-y-2">
                    <button
                        onClick={fetchSales}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        🔄 Refrescar
                    </button>
                    <button
                        onClick={handleResetData}
                        className="w-full px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20 text-xs font-bold uppercase tracking-wider"
                    >
                        <Trash2 size={14} className="inline mr-2" />
                        RESET DB
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Salir
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Button - Always visible */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-dark-900 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors shadow-lg"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 lg:ml-64">

                {/* Top Stats Bar - Only for Ticketing Tabs */}
                {(activeTab === 'pending' || activeTab === 'approved' || activeTab === 'scanner') && (
                    <div className="bg-dark-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
                        <div className="container mx-auto px-4 lg:px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                                <div className="bg-dark-800 p-4 rounded-xl border border-white/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <AlertTriangle size={48} className="text-yellow-500" />
                                    </div>
                                    <h3 className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-1">Por Aprobar</h3>
                                    <p className="text-3xl font-bold text-yellow-500">{stats.pendingOrders}</p>
                                </div>

                                <div className="bg-dark-800 p-4 rounded-xl border border-white/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <DollarSign size={48} />
                                    </div>
                                    <h3 className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-1">Ingresos Totales</h3>
                                    <p className="text-3xl font-bold text-neon-green">S/ {stats.totalRevenue}</p>
                                </div>

                                <div className="bg-dark-800 p-4 rounded-xl border border-white/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Ticket size={48} />
                                    </div>
                                    <h3 className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-1">Entradas Vendidas</h3>
                                    <p className="text-3xl font-bold text-neon-pink">{stats.ticketsSold}</p>
                                </div>

                                <div className="bg-dark-800 p-4 rounded-xl border border-white/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Users size={48} />
                                    </div>
                                    <h3 className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-1">Clientes</h3>
                                    <p className="text-3xl font-bold text-neon-blue">{stats.totalSales}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Container */}
                <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-10">
                    {/* Content Area */}
                    {activeTab === 'scanner' ? (
                        <ScannerSection sales={sales} fetchSales={fetchSales} />
                    ) : activeTab === 'content' ? (
                        <ContentManager />
                    ) : activeTab === 'drinks' ? (
                        <DrinksManager />
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
                            <div className="hidden md:block overflow-x-auto custom-scrollbar pb-4">
                                <table className="w-full text-left min-w-[800px]">
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

                            {/* MOBILE CARD VIEW (Visible only on Mobile) */}
                            <div className="md:hidden space-y-4">
                                {loading ? (
                                    <div className="text-center text-gray-400 py-8">Cargando datos...</div>
                                ) : filteredSales.length > 0 ? (
                                    filteredSales.map((sale) => (
                                        <div key={sale.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden p-4 relative group hover:bg-white/10 transition-colors">
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                                                        {sale.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm">{sale.name}</h4>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-gray-500">ID: {sale.id}</span>
                                                            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${(sale.ticket_name || sale.ticketName) === 'VIP' ? 'border-neon-pink text-neon-pink bg-pink-500/10' : 'border-neon-gold text-neon-gold bg-yellow-500/10'}`}>
                                                                {sale.ticket_name || sale.ticketName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {activeTab === 'approved' && (
                                                    sale.checked_in ? (
                                                        <span className="text-[10px] font-bold text-red-500 border border-red-500/50 px-2 py-0.5 rounded bg-red-500/10">USADO</span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-green-500 border border-green-500/50 px-2 py-0.5 rounded bg-green-500/10">OK</span>
                                                    )
                                                )}
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs mb-4 p-3 bg-black/40 rounded-lg border border-white/5">
                                                <div>
                                                    <span className="block text-gray-500 uppercase text-[10px] mb-0.5">Cantidad</span>
                                                    <span className="text-white font-bold">{sale.quantity} entrada(s)</span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 uppercase text-[10px] mb-0.5">Total Pagar</span>
                                                    <span className="text-neon-green font-bold text-sm">S/ {(parseFloat(sale.total_amount || sale.total || 0)).toFixed(2)}</span>
                                                </div>
                                                <div className="col-span-2 border-t border-white/5 pt-2 mt-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-gray-400">📧</span>
                                                        <span className="text-gray-300 truncate">{sale.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400">📱</span>
                                                        <span className="text-gray-300">{sale.phone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                {activeTab === 'pending' ? (
                                                    <>
                                                        {sale.payment_proof_url ? (
                                                            <button
                                                                onClick={() => { setSelectedProof(sale.payment_proof_url); setIsProofModalOpen(true); }}
                                                                className="flex-1 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg font-bold text-xs flex items-center justify-center gap-1 hover:bg-blue-500 hover:text-white transition-all"
                                                            >
                                                                <Eye size={14} /> Ver Pago
                                                            </button>
                                                        ) : (
                                                            <div className="flex-1 py-2.5 bg-gray-500/10 text-gray-500 border border-gray-500/30 rounded-lg font-bold text-xs flex items-center justify-center gap-1">
                                                                Sin Pago
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={() => handleRejectOrder(sale.id)}
                                                            className="w-10 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>

                                                        <button
                                                            onClick={() => handleApproveOrder(sale.id)}
                                                            className="flex-1 py-2.5 bg-green-500 text-black border border-green-500 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:bg-white hover:border-white transition-all"
                                                        >
                                                            <Check size={16} /> APROBAR
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => openTicketModal(sale)}
                                                        className="w-full py-3 bg-white/10 text-white border border-white/20 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-neon-purple hover:border-neon-purple hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all"
                                                    >
                                                        <Ticket size={16} /> VER TICKET DIGITAL
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-10 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                        No hay resultados
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* TICKET MODAL */}
            <AnimatePresence>
                {isTicketModalOpen && selectedSale && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-dark-900 border border-white/20 rounded-3xl w-full max-w-sm relative overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
                        >
                            {/* Static Header */}
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md z-10 print:hidden">
                                <h3 className="text-lg font-bold text-white">Tickets Generados</h3>
                                <button
                                    onClick={() => setIsTicketModalOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors p-2"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Scrollable Body - This is what prints */}
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar print:overflow-visible print:p-0">
                                <div className="space-y-4 print:space-y-0">
                                    {/* Generate one card per item in quantity */}
                                    {[...Array(parseInt(selectedSale.quantity || 1))].map((_, index) => (
                                        <TicketCard
                                            key={`${selectedSale.id}-${index}`}
                                            ticket={{
                                                name: selectedSale.ticket_name || selectedSale.ticketName,
                                                id: (selectedSale.ticket_name === 'VIP' || selectedSale.ticketName === 'VIP') ? 'vip' :
                                                    ((selectedSale.ticket_name === 'BOOM! EXP' || selectedSale.ticketName === 'BOOM! EXP' || selectedSale.ticket_name === 'BOOM EXP' || selectedSale.ticketName === 'BOOM EXP')) ? 'exp' : 'gen'
                                            }}
                                            data={{
                                                name: selectedSale.name,
                                                attendees: selectedSale.attendees,
                                                created_at: selectedSale.created_at
                                            }}
                                            id={selectedSale.id}
                                            ticketIndex={index}
                                            totalTickets={parseInt(selectedSale.quantity || 1)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Static Footer */}
                            <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-md z-10 print:hidden">
                                <button
                                    onClick={() => window.print()}
                                    className="w-full py-3 bg-neon-blue text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                                >
                                    <Printer size={20} /> Imprimir Todo ({selectedSale.quantity})
                                </button>
                            </div>
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
        </div >
    );
};

const ScannerSection = ({ sales, fetchSales }) => {
    const [scanResult, setScanResult] = useState(null);
    const [manualId, setManualId] = useState('');
    const [scannerActive, setScannerActive] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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

        function onScanSuccess(decodedText) {
            scanner.clear();
            setScannerActive(false);
            handleValidateTicket(decodedText);
        }

        function onScanFailure(error) {
            // Ignorar errores de escaneo rutinarios
        }

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear html5-qrcode scanner. ", error));
        };
    }, [scannerActive]);

    const handleValidateTicket = async (dataString) => {
        if (isVerifying) return; // Prevenir doble validación
        setIsVerifying(true);
        setScanResult(null);

        try {
            // 1. Parsear ID
            let ticketId;
            try {
                const data = JSON.parse(dataString);
                ticketId = data.id;
            } catch (e) {
                ticketId = dataString;
            }

            // 2. Validación Local Inicial (Rápida)
            const ticketLocal = sales.find(s => s.id.toString() === ticketId.toString());

            if (!ticketLocal) {
                setScanResult({ status: 'error', message: 'TICKET NO ENCONTRADO', details: 'El ID no existe en la base de datos local.' });
                setIsVerifying(false);
                return;
            }

            if (ticketLocal.status !== 'approved') {
                setScanResult({
                    status: 'invalid',
                    message: 'TICKET NO VÁLIDO',
                    details: `Estado: ${ticketLocal.status.toUpperCase()}`,
                    ticket: ticketLocal
                });
                setIsVerifying(false);
                return;
            }

            // 3. Validación REMOTA (Supabase) - La Verdad Absoluta
            // Consultamos directamente a la DB para asegurarnos que no ha sido escaneado hace 1 milisegundo desde otro dispositivo
            let isCheckedInDB = ticketLocal.checked_in;
            let checkedInAtDB = ticketLocal.checked_in_at;

            if (supabase) {
                const { data, error } = await supabase
                    .from('boom_sales_2026')
                    .select('checked_in, checked_in_at')
                    .eq('id', ticketId)
                    .single();

                if (!error && data) {
                    isCheckedInDB = data.checked_in;
                    checkedInAtDB = data.checked_in_at;
                }
            }

            if (isCheckedInDB) {
                setScanResult({
                    status: 'used',
                    message: 'TICKET YA USADO',
                    details: `Ingresó: ${new Date(checkedInAtDB).toLocaleTimeString()}`,
                    ticket: ticketLocal
                });
                setIsVerifying(false);
                return;
            }

            // 4. Si pasa todas las validaciones
            setScanResult({
                status: 'valid',
                message: 'TICKET VÁLIDO',
                details: 'Puede ingresar.',
                ticket: ticketLocal
            });

        } catch (err) {
            setScanResult({ status: 'error', message: 'ERROR DE LECTURA', details: err.message });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        setScannerActive(false);
        handleValidateTicket(manualId);
    };

    const handleCheckIn = async () => {
        if (!scanResult || !scanResult.ticket) return;
        if (isProcessing) return; // Bloqueo de doble clic

        setIsProcessing(true);

        try {
            const ticketId = scanResult.ticket.id;

            // Doble check final antes de escribir
            if (supabase) {
                // Actualización atómica condicional: Solo actualiza si checked_in es false
                // Lamentablemente Supabase simple update no es condicional en el mismo paso sin RPC, 
                // pero ya hicimos el check previo. Confiaremos en el update.

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

            // Éxito
            const sound = new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'); // Sonido check positivo genérico
            sound.play().catch(e => console.log("Audio play failed"));

            setScanResult({
                status: 'success',
                message: '¡INGRESO EXITOSO!',
                details: `Bienvenido ${scanResult.ticket.name}`,
                ticket: scanResult.ticket
            });

            // Actualizar lista global
            fetchSales();

            // Auto-reset después de 2 segundos para flujo rápido
            setTimeout(() => {
                resetScanner();
            }, 2000);

        } catch (error) {
            console.error('Error check-in:', error);
            alert('Error al registrar ingreso. Intente nuevamente.');
            setScannerActive(true); // Permitir reintentar
        } finally {
            setIsProcessing(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setScannerActive(true);
        setManualId('');
        setIsVerifying(false);
        setIsProcessing(false);
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
                            {isVerifying ? (
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neon-blue mx-auto mb-4"></div>
                                    <p className="text-neon-blue animate-pulse font-bold">Verificando en Base de Datos...</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-400 mb-4">Escáner Pausado</p>
                                    <button
                                        onClick={resetScanner}
                                        className="px-6 py-2 bg-neon-blue text-black font-bold rounded-lg hover:bg-white transition-colors"
                                    >
                                        Escanear Nuevo
                                    </button>
                                </>
                            )}
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
                                disabled={isVerifying || isProcessing}
                                className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-2 text-white focus:border-neon-pink outline-none disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isVerifying || isProcessing}
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                            >
                                Verificar
                            </button>
                        </form>
                    </div>
                </div>

                {/* Result Area */}
                <div className="w-full md:w-1/2">
                    {scanResult ? (
                        <div className={`h-full rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 ${scanResult.status === 'success' ? 'bg-green-500/20 border-green-500' :
                                scanResult.status === 'valid' ? 'bg-blue-500/10 border-blue-500' :
                                    scanResult.status === 'used' ? 'bg-yellow-500/10 border-yellow-500' :
                                        'bg-red-500/10 border-red-500'
                            }`}>

                            {/* Icon */}
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${scanResult.status === 'success' ? 'bg-green-500 text-black scale-110' :
                                    scanResult.status === 'valid' ? 'bg-blue-500 text-white' :
                                        scanResult.status === 'used' ? 'bg-yellow-500 text-black' :
                                            'bg-red-500 text-white'
                                }`}>
                                {scanResult.status === 'success' ? <Check size={56} /> :
                                    scanResult.status === 'valid' ? <Search size={48} /> :
                                        scanResult.status === 'used' ? <AlertTriangle size={48} /> :
                                            <X size={48} />}
                            </div>

                            <h2 className={`text-3xl font-display font-bold mb-2 ${scanResult.status === 'success' ? 'text-green-500' :
                                    scanResult.status === 'valid' ? 'text-blue-400' :
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
                                        <span className={`font-bold ${(scanResult.ticket.ticket_name || scanResult.ticket.ticketName) === 'VIP' ? 'text-neon-pink' : 'text-white'}`}>
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
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl text-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                                            PROCESANDO...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={28} /> CONFIRMAR INGRESO
                                        </>
                                    )}
                                </button>
                            )}

                            {(scanResult.status !== 'valid' && scanResult.status !== 'success') && (
                                <button
                                    onClick={resetScanner}
                                    className="text-gray-400 hover:text-white underline mt-4"
                                >
                                    Escanear Siguiente
                                </button>
                            )}

                            {/* Botón extra para éxito para acelerar */}
                            {scanResult.status === 'success' && (
                                <button
                                    onClick={resetScanner}
                                    className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
                                >
                                    Escanear Siguiente (Automático en 2s)
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500 border border-white/10 border-dashed rounded-2xl bg-black/20">
                            {isVerifying ? (
                                <div className="text-center animate-pulse">
                                    <Search size={48} className="mx-auto mb-4 text-neon-blue" />
                                    <p className="text-neon-blue">Consultando servidor...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4 opacity-50">
                                        <Search size={48} />
                                    </div>
                                    <p>Esperando lectura...</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );


};

const DrinksManager = () => {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('pos'); // 'pos' or 'history'
    const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0 });
    const [editingPrice, setEditingPrice] = useState(null); // {id, newPrice}
    const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'coctel', 'licor', 'cerveza', 'shot'

    useEffect(() => {
        fetchProducts();
        fetchSales();
    }, []);

    const fetchProducts = async () => {
        try {
            if (supabase) {
                const { data, error } = await supabase
                    .from('boom_products')
                    .select('*')
                    .eq('active', true)
                    .order('category', { ascending: true });

                if (error) {
                    console.warn('Supabase error, using fallback products:', error);
                    // Use fallback products if table doesn't exist
                    setProducts(getFallbackProducts());
                } else {
                    setProducts(data || getFallbackProducts());
                }
            } else {
                setProducts(getFallbackProducts());
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts(getFallbackProducts());
        } finally {
            setLoading(false);
        }
    };

    const getFallbackProducts = () => {
        // Check localStorage first
        const stored = localStorage.getItem('boom_products_fallback');
        if (stored) {
            return JSON.parse(stored);
        }

        // Default products
        const defaultProducts = [
            { id: 1, name: 'Cuba Libre Premium', category: 'coctel', price: 15.00, image_url: 'https://img.freepik.com/fotos-premium/coctel-cuba-libre-vaso-highball-hielo-cascara-lima-paja-limas-frescas-sobre-fondo-negro-mesa_157173-3330.jpg', active: true },
            { id: 2, name: 'Mojito Clásico', category: 'coctel', price: 18.00, image_url: 'https://cdn.craft.cloud/224393fa-1975-4d80-9067-ada3cb5948ca/assets/detail_Skinny_Mojito_4_2022.jpg', active: true },
            { id: 3, name: 'Margarita', category: 'coctel', price: 20.00, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1887&auto=format&fit=crop', active: true },
            { id: 4, name: 'Tequila Sunrise', category: 'coctel', price: 18.00, image_url: 'https://exoticotequila.com/wp-content/uploads/2018/03/TEQUILA_SUNRISE_RC.jpg', active: true },
            { id: 5, name: 'Gin Tonic', category: 'coctel', price: 22.00, image_url: 'https://licoreria247.pe/wp-content/uploads/2020/12/Vodka-vs-Gin.jpg.webp', active: true },
            { id: 6, name: 'Calientito de Maracuyá', category: 'coctel', price: 12.00, image_url: 'https://polleriaslagranja.com/wp-content/uploads/2022/10/La-Granja-Real-Food-Chicken-Jarra-de-Maracuya.png', active: true },
            { id: 7, name: 'Flor de Caña + Coca Cola', category: 'licor', price: 25.00, image_url: 'https://images.rappi.pe/products/237008-1575927253771.png', active: true },
            { id: 8, name: 'Old Time + Guarana', category: 'licor', price: 20.00, image_url: 'https://images.rappi.pe/products/1727659843457_1727659639313_1727659637802.jpg', active: true },
            { id: 9, name: 'Whisky Sour', category: 'coctel', price: 25.00, image_url: 'https://so-sour.com/wp-content/uploads/2024/08/Whisky-Sour.jpg', active: true },
            { id: 10, name: 'Shot de Tequila', category: 'shot', price: 8.00, image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop', active: true },
            { id: 11, name: 'Cerveza Pilsen', category: 'cerveza', price: 8.00, image_url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=2070&auto=format&fit=crop', active: true },
            { id: 12, name: 'Cerveza Cusqueña', category: 'cerveza', price: 10.00, image_url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=2070&auto=format&fit=crop', active: true },
        ];

        localStorage.setItem('boom_products_fallback', JSON.stringify(defaultProducts));
        return defaultProducts;
    };

    const fetchSales = async () => {
        try {
            if (supabase) {
                const { data, error } = await supabase
                    .from('boom_drink_sales')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100);

                if (error) {
                    console.warn('Supabase error, using localStorage:', error);
                    const localSales = JSON.parse(localStorage.getItem('boom_drink_sales_fallback') || '[]');
                    setSales(localSales);
                    calculateStats(localSales);
                } else {
                    setSales(data || []);
                    calculateStats(data || []);
                }
            } else {
                const localSales = JSON.parse(localStorage.getItem('boom_drink_sales_fallback') || '[]');
                setSales(localSales);
                calculateStats(localSales);
            }
        } catch (error) {
            console.error('Error fetching sales:', error);
            const localSales = JSON.parse(localStorage.getItem('boom_drink_sales_fallback') || '[]');
            setSales(localSales);
            calculateStats(localSales);
        }
    };

    const calculateStats = (salesData) => {
        const totalRevenue = salesData.reduce((acc, sale) => acc + parseFloat(sale.total_amount || 0), 0);
        setStats({
            totalSales: salesData.length,
            totalRevenue
        });
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId, delta) => {
        setCart(cart.map(item => {
            if (item.id === productId) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const handleSell = async () => {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        if (!window.confirm(`¿Confirmar venta por S/ ${calculateTotal().toFixed(2)}?`)) {
            return;
        }

        try {
            const salesData = cart.map((item, index) => ({
                id: Date.now() + index, // Generate unique integer ID
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                total_amount: item.price * item.quantity,
                sold_by: 'admin',
                created_at: new Date().toISOString()
            }));

            if (supabase) {
                const { error } = await supabase
                    .from('boom_drink_sales')
                    .insert(salesData);

                if (error) {
                    console.warn('Supabase error, saving to localStorage:', error);
                    // Fallback to localStorage
                    const localSales = JSON.parse(localStorage.getItem('boom_drink_sales_fallback') || '[]');
                    localSales.unshift(...salesData);
                    localStorage.setItem('boom_drink_sales_fallback', JSON.stringify(localSales));
                }
            } else {
                // Save to localStorage
                const localSales = JSON.parse(localStorage.getItem('boom_drink_sales_fallback') || '[]');
                localSales.unshift(...salesData);
                localStorage.setItem('boom_drink_sales_fallback', JSON.stringify(localSales));
            }

            alert('✅ Venta registrada exitosamente');
            setCart([]);
            fetchSales();
        } catch (error) {
            console.error('Error registering sale:', error);
            alert('Error al registrar la venta: ' + error.message);
        }
    };

    const updatePrice = async (productId, newPrice) => {
        const price = parseFloat(newPrice);
        if (isNaN(price) || price < 0) {
            alert('Precio inválido');
            return;
        }

        try {
            // Update in state
            setProducts(products.map(p =>
                p.id === productId ? { ...p, price } : p
            ));

            // Update in localStorage
            const storedProducts = JSON.parse(localStorage.getItem('boom_products_fallback') || '[]');
            const updatedProducts = storedProducts.map(p =>
                p.id === productId ? { ...p, price } : p
            );
            localStorage.setItem('boom_products_fallback', JSON.stringify(updatedProducts));

            // Update in Supabase if available
            if (supabase) {
                const { error } = await supabase
                    .from('boom_products')
                    .update({ price })
                    .eq('id', productId);

                if (error) {
                    console.warn('Supabase update error:', error);
                }
            }

            setEditingPrice(null);
            alert('✅ Precio actualizado');
        } catch (error) {
            console.error('Error updating price:', error);
            alert('Error al actualizar precio');
        }
    };

    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {});

    const categoryColors = {
        'coctel': 'from-pink-500 to-purple-600',
        'licor': 'from-amber-500 to-orange-600',
        'cerveza': 'from-yellow-400 to-amber-500',
        'shot': 'from-red-500 to-pink-600'
    };

    return (
        <div className="bg-dark-900 rounded-2xl border border-white/10 overflow-hidden">
            {/* Header with Stats */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-neon-gold/10 to-amber-500/10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Wine className="text-neon-gold" size={32} />
                        Sistema de Venta de Bebidas
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm mb-1">Ventas Hoy</p>
                        <p className="text-2xl font-bold text-neon-green">{stats.totalSales}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm mb-1">Ingresos Totales</p>
                        <p className="text-2xl font-bold text-neon-gold">S/ {stats.totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="p-6 border-b border-white/10 flex gap-4">
                <button
                    onClick={() => setActiveView('pos')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeView === 'pos'
                        ? 'bg-neon-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                        : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                    <ShoppingCart className="inline mr-2" size={18} />
                    Punto de Venta
                </button>
                <button
                    onClick={() => setActiveView('history')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeView === 'history'
                        ? 'bg-neon-blue text-white shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                        : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                    Historial de Ventas
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeView === 'pos' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Products */}
                        <div className="lg:col-span-2">
                            {/* Category Filter */}
                            <div className="mb-6 flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setCategoryFilter('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${categoryFilter === 'all'
                                        ? 'bg-neon-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    🍹 Todos
                                </button>
                                <button
                                    onClick={() => setCategoryFilter('coctel')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${categoryFilter === 'coctel'
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    🍸 Cocteles
                                </button>
                                <button
                                    onClick={() => setCategoryFilter('licor')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${categoryFilter === 'licor'
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    🥃 Licores
                                </button>
                                <button
                                    onClick={() => setCategoryFilter('cerveza')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${categoryFilter === 'cerveza'
                                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    🍺 Cervezas
                                </button>
                                <button
                                    onClick={() => setCategoryFilter('shot')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${categoryFilter === 'shot'
                                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    🥂 Shots
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-20">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neon-gold border-t-transparent"></div>
                                    <p className="text-gray-400 mt-4">Cargando productos...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(groupedProducts)
                                        .filter(([category]) => categoryFilter === 'all' || category === categoryFilter)
                                        .map(([category, items]) => (
                                            <div key={category}>
                                                <h5 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-bold">
                                                    {category}
                                                </h5>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {items.map(product => (
                                                        <div
                                                            key={product.id}
                                                            onClick={() => !editingPrice && addToCart(product)}
                                                            className="group relative h-40 rounded-xl overflow-hidden border border-white/10 hover:border-neon-gold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] cursor-pointer"
                                                        >
                                                            {/* Image */}
                                                            <div
                                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                                                style={{ backgroundImage: `url(${product.image_url})` }}
                                                            />
                                                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                                            {/* Content */}
                                                            <div className="absolute inset-0 flex flex-col justify-end p-3">
                                                                <h6 className="text-white font-bold text-sm mb-1 line-clamp-2">
                                                                    {product.name}
                                                                </h6>

                                                                {/* Price with Edit */}
                                                                {editingPrice?.id === product.id ? (
                                                                    <div className="flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
                                                                        <span className="text-gray-300 text-xs">S/</span>
                                                                        <input
                                                                            type="number"
                                                                            step="0.01"
                                                                            value={editingPrice.newPrice}
                                                                            onChange={(e) => setEditingPrice({ ...editingPrice, newPrice: e.target.value })}
                                                                            className="w-16 px-1 py-0.5 bg-dark-900 border border-neon-gold rounded text-neon-gold font-bold text-sm"
                                                                            autoFocus
                                                                        />
                                                                        <button
                                                                            onClick={() => updatePrice(product.id, editingPrice.newPrice)}
                                                                            className="px-1.5 py-0.5 bg-green-500 text-black rounded text-xs font-bold"
                                                                        >
                                                                            ✓
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingPrice(null)}
                                                                            className="px-1.5 py-0.5 bg-red-500 text-white rounded text-xs font-bold"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex justify-between items-center">
                                                                        <p className="text-neon-gold font-bold text-lg">
                                                                            S/ {product.price.toFixed(2)}
                                                                        </p>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setEditingPrice({ id: product.id, newPrice: product.price });
                                                                            }}
                                                                            className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-gray-300 hover:text-white transition-colors"
                                                                        >
                                                                            ✏️
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Plus Icon on Hover */}
                                                            {!editingPrice && (
                                                                <div className="absolute top-2 right-2 w-8 h-8 bg-neon-gold text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Plus size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <div className="lg:col-span-1">
                            <div className="bg-black/40 rounded-xl border border-white/10 p-4 sticky top-6">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <ShoppingCart size={20} />
                                    Carrito
                                </h4>

                                {cart.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8 text-sm">
                                        Selecciona productos para vender
                                    </p>
                                ) : (
                                    <>
                                        <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {cart.map(item => (
                                                <div key={item.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h6 className="text-white text-sm font-bold flex-1 pr-2">
                                                            {item.name}
                                                        </h6>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-red-500 hover:text-red-400"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                                className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-white"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="text-white font-bold w-8 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-white"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <p className="text-neon-gold font-bold">
                                                            S/ {(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t border-white/10 pt-4 mb-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-400 text-lg">TOTAL</span>
                                                <span className="text-neon-gold font-bold text-3xl">
                                                    S/ {calculateTotal().toFixed(2)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleSell}
                                                className="w-full py-4 bg-gradient-to-r from-neon-gold to-amber-500 text-black font-bold rounded-xl text-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all transform hover:scale-105"
                                            >
                                                VENDER
                                            </button>
                                            <button
                                                onClick={() => setCart([])}
                                                className="w-full mt-2 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-medium rounded-lg transition-all"
                                            >
                                                Limpiar Carrito
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Sales History */
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Historial de Ventas</h4>
                        {/* DESKTOP TABLE VIEW */}
                        <div className="hidden md:block overflow-x-auto custom-scrollbar pb-4">
                            <table className="w-full text-left min-w-[600px]">
                                <thead className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Fecha</th>
                                        <th className="p-4">Producto</th>
                                        <th className="p-4 text-center">Cant.</th>
                                        <th className="p-4 text-right">Precio Unit.</th>
                                        <th className="p-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {sales.length > 0 ? (
                                        sales.map((sale) => (
                                            <tr key={`desktop-sale-${sale.id}`} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-gray-300 text-sm">
                                                    {new Date(sale.created_at).toLocaleString('es-PE', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="p-4 text-white font-medium">{sale.product_name}</td>
                                                <td className="p-4 text-center text-gray-300">{sale.quantity}</td>
                                                <td className="p-4 text-right text-gray-300">S/ {parseFloat(sale.unit_price).toFixed(2)}</td>
                                                <td className="p-4 text-right font-bold text-neon-green">S/ {parseFloat(sale.total_amount).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                                No hay ventas registradas
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE CARD VIEW */}
                        <div className="md:hidden space-y-3">
                            {sales.length > 0 ? (
                                sales.map((sale) => (
                                    <div key={`mobile-sale-${sale.id}`} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center group hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center font-bold">
                                                <Check size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{sale.product_name}</h4>
                                                <div className="text-xs text-gray-500 flex flex-col">
                                                    <span>{new Date(sale.created_at).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="text-gray-400">Cant: {sale.quantity} x S/ {parseFloat(sale.unit_price).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-neon-green font-bold text-lg">S/ {parseFloat(sale.total_amount).toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-10 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                    No hay ventas registradas
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
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
