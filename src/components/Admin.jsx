import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, LayoutDashboard, LogOut, DollarSign, Users, Ticket, AlertTriangle, Search, Eye, X, Printer, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
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
    const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0, ticketsSold: 0 });
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Ticket Modal State
    const [selectedSale, setSelectedSale] = useState(null);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setLoading(true);
        try {
            let data = [];

            if (supabase) {
                const { data: supabaseData, error } = await supabase
                    .from('boom_sales_2026')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                data = supabaseData || [];
            } else {
                console.warn('Supabase not connected. Fetching from localStorage.');
                data = JSON.parse(localStorage.getItem('boom_sales') || '[]');
                // Simulate delay
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            setSales(data);

            const totalRevenue = data.reduce((acc, sale) => acc + parseFloat(sale.total_amount || sale.total || 0), 0);
            const totalTickets = data.reduce((acc, sale) => acc + parseInt(sale.quantity), 0);

            setStats({
                totalSales: data.length, // Clientes unicos approx
                totalRevenue,
                ticketsSold: totalTickets
            });
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setLoading(false);
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

    const filteredSales = sales.filter(sale =>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

                {/* Recent Sales Table */}
                <div className="bg-dark-900 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="text-xl font-bold text-white">Ventas Recientes</h3>
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
                                    <th className="p-4 text-right">Fecha</th>
                                    <th className="p-4 text-center">Ver</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="7" className="p-8 text-center text-gray-400">Cargando datos...</td></tr>
                                ) : filteredSales.length > 0 ? (
                                    filteredSales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4 font-medium text-white flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-xs font-bold">
                                                    {sale.name.charAt(0)}
                                                </div>
                                                {sale.name}
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                <div className="flex flex-col">
                                                    <span>{sale.email}</span>
                                                    <span className="text-xs text-gray-500">{sale.phone}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold border ${(sale.ticket_name || sale.ticketName) === 'VIP' ? 'border-neon-pink text-neon-pink' :
                                                    (sale.ticket_name || sale.ticketName) === 'BOOM! EXP' ? 'border-neon-gold text-neon-gold' :
                                                        'border-gray-500 text-gray-300'
                                                    }`}>
                                                    {sale.ticket_name || sale.ticketName}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center text-gray-300">{sale.quantity}</td>
                                            <td className="p-4 text-right font-bold text-neon-green">S/ {sale.total_amount || sale.total}</td>
                                            <td className="p-4 text-right text-gray-500 text-sm">
                                                {new Date(sale.created_at || sale.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => openTicketModal(sale)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-neon-purple text-gray-400 hover:text-white transition-all transform hover:scale-110"
                                                    title="Ver Ticket"
                                                >
                                                    <Ticket size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">
                                            No hay resultados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                                            (selectedSale.ticket_name === 'BOOM! EXP' || selectedSale.ticketName === 'BOOM! EXP') ? 'exp' : 'gen'
                                    }}
                                    data={{ name: selectedSale.name }}
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
