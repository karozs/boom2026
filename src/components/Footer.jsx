import { Instagram, Facebook, ArrowUp, Music } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-dark-900 border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
            {/* Footer animated gradient line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div className="mb-8 md:mb-0 text-center md:text-left">
                        <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-wider">THE LAST NIGHT 2025</h2>
                        <p className="text-gray-500">El futuro comienza hoy. <br /> 31 de Enero · Ciudad Pampas Tayacaja Huancavelica</p>
                    </div>

                    <div className="flex gap-6">
                        <a href="https://www.facebook.com/profile.php?id=61585394943629" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all border border-white/5 hover:border-transparent">
                            <Facebook size={20} />
                        </a>
                        <a href="https://www.instagram.com/ckr_experiences/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-neon-pink hover:scale-110 transition-all border border-white/5 hover:border-transparent">
                            <Instagram size={20} />
                        </a>
                        <a href="https://www.tiktok.com/@ckr.experiences?_r=1&_t=ZS-92NuZFmgYGP" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-black hover:text-neon-blue hover:scale-110 transition-all border border-white/5 hover:border-neon-blue">
                            <Music size={20} />
                        </a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-gray-600 text-sm">
                            © 2025 THE LAST NIGHT. Una producción de <span className="text-neon-blue font-bold">CKR EXPERIENCES</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-600 hover:text-white text-sm transition-colors">Privacidad</a>
                        <a href="#" className="text-gray-600 hover:text-white text-sm transition-colors">Términos</a>
                        <button onClick={scrollToTop} className="flex items-center gap-2 text-neon-pink hover:text-neon-purple transition-colors text-sm uppercase tracking-widest font-bold ml-4">
                            Subir <ArrowUp size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
