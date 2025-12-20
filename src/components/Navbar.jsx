import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Sobre el evento', path: '/about' },
        { name: 'Lineup', path: '/lineup' },
        { name: 'Experiencia', path: '/experience' },
        { name: 'Ubicación', path: '/location' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || isOpen ? 'bg-black/95 backdrop-blur-md py-4 border-b border-white/10' : 'bg-black/50 backdrop-blur-sm py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex flex-col group">
                    <div className="flex items-center gap-2 mb-[-4px]">
                        <img
                            src="https://scontent.flim1-2.fna.fbcdn.net/v/t39.30808-6/600454131_122097729453179831_5236885036250711855_n.jpg?_nc_cat=110&cb2=99be929b-bd9a46d7&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=GT2smus70jYQ7kNvwFpGKm_&_nc_oc=AdkatIza_-qGqtH5ifBDAuQ2gRyXR2oeHJLOeNcBU6l5zu8bIwtJAyoyrAxz-Tg4rAg&_nc_zt=23&_nc_ht=scontent.flim1-2.fna&_nc_gid=Ize0mw5OHt2MOXU_iSB6Lw&oh=00_AflsXS8qBLE-fHZLPr3UXxAqtLhV4nZIX-xdNcg8ZJSoBQ&oe=694CAC8E"
                            alt="CKR Experiences Logo"
                            className="h-8 md:h-10 object-contain rounded-full"
                        />
                        <span className="text-[10px] md:text-xs text-neon-blue font-bold tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                            CKR EXPERIENCES PRESENTS
                        </span>
                    </div>
                    <span className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue tracking-wider group-hover:opacity-80 transition-opacity">
                        THE LAST NIGHT 2025
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`transition-colors font-medium text-sm tracking-wide uppercase relative group ${isActive(link.path) ? 'text-neon-blue' : 'text-gray-300 hover:text-neon-blue'}`}
                        >
                            {link.name}
                            {isActive(link.path) && (
                                <motion.div layoutId="underline" className="absolute left-0 top-full mt-1 w-full h-[2px] bg-neon-blue" />
                            )}
                        </Link>
                    ))}
                    <Link to="/tickets" className="px-6 py-2 bg-transparent border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_10px_rgba(255,0,255,0.2)] hover:shadow-[0_0_20px_rgba(255,0,255,0.6)]">
                        Comprar Entradas
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }} // Full height for Better UX
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black fixed inset-0 top-[70px] z-40 overflow-y-auto"
                    >
                        <div className="flex flex-col items-center py-8 space-y-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-2xl font-display ${isActive(link.path) ? 'text-neon-blue' : 'text-white hover:text-neon-blue'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/tickets"
                                onClick={() => setIsOpen(false)}
                                className="px-8 py-3 bg-neon-pink text-white font-bold rounded-full shadow-[0_0_15px_rgba(255,0,255,0.5)]"
                            >
                                Comprar Entradas
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
