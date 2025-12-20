import React from 'react';
import QRCode from 'react-qr-code';

const TicketCard = ({ ticket, data, id }) => {
    const getGradient = () => {
        switch (ticket.id || ticket.ticket_id) { // Handle flexibility in data structure
            case 'vip': return 'from-neon-pink/20 to-purple-900/40 border-neon-pink';
            case 'exp': return 'from-amber-500/20 to-yellow-900/40 border-neon-gold';
            default: return 'from-white/10 to-gray-900/40 border-white/20';
        }
    };

    const getTextColor = () => {
        switch (ticket.id || ticket.ticket_id) {
            case 'vip': return 'text-neon-pink';
            case 'exp': return 'text-neon-gold';
            default: return 'text-white';
        }
    };

    const getTicketName = () => {
        return ticket.name || ticket.ticket_name || 'ENTRADA';
    };

    return (
        <div id="printable-ticket" className="relative w-full max-w-sm mx-auto bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform transition-all hover:scale-[1.02] print:transform-none print:shadow-none">
            {/* Top Section */}
            <div className={`p-6 bg-gradient-to-br ${getGradient()} border-b border-dashed border-white/20 relative`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-display font-bold text-white tracking-wider">BOOM!</h3>
                        <p className="text-sm text-gray-300 tracking-[0.2em] uppercase">New Year Draft</p>
                    </div>
                    <div className={`px-3 py-1 rounded border ${(ticket.id === 'vip' || ticket.ticket_id === 'vip') ? 'border-neon-pink text-neon-pink' :
                        (ticket.id === 'exp' || ticket.ticket_id === 'exp') ? 'border-neon-gold text-neon-gold' :
                            'border-white text-white'} text-xs font-bold uppercase`}>
                        2026
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-xs text-gray-400 uppercase">Ticket Type</p>
                    <h2 className={`text-3xl font-display font-black ${getTextColor()} tracking-widest`}>{getTicketName()}</h2>
                </div>

                {/* Decorative circles for perforation - Hide in print if annoying, or keep */}
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-dark-900 rounded-full print:hidden"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-dark-900 rounded-full print:hidden"></div>
            </div>

            {/* Bottom Section */}
            <div className="p-6 bg-dark-800">
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                        <div className="w-full"> {/* Allow full width for name */}
                            <p className="text-[10px] text-gray-500 uppercase">Principal Attendee</p>
                            {/* REMOVED truncate max-w-[150px] to fix user issue */}
                            <p className="text-sm font-bold text-white break-words leading-tight">{data.name}</p>

                            {data.attendees && (
                                <div className="mt-2 text-left">
                                    <p className="text-[10px] text-gray-500 uppercase">Group Members</p>
                                    <p className="text-xs text-gray-300 break-words font-medium">{data.attendees}</p>
                                </div>
                            )}
                        </div>
                        <div className="text-right min-w-[60px]">
                            <p className="text-[10px] text-gray-500 uppercase">Date</p>
                            <p className="text-sm font-bold text-white">31 ENE</p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase">Transaction ID</p>
                            <p className="text-xs font-mono text-gray-400">#{id.toString().slice(-8)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase">Time</p>
                            <p className="text-sm font-bold text-white">10:00 PM</p>
                        </div>
                    </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-2 rounded-xl mx-auto w-32 h-32 flex items-center justify-center mb-4 border border-gray-200">
                    <QRCode
                        value={JSON.stringify({
                            id: id,
                            name: data.name,
                            type: getTicketName(),
                            valid: true
                        })}
                        size={112}
                        level="M" // Medium error correction
                    />
                </div>

                <p className="text-[10px] text-center text-gray-600">Present this digital ticket at the entrance.</p>
            </div>
        </div>
    );
};

export default TicketCard;
