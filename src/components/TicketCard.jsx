import React from 'react';
import QRCode from 'react-qr-code';

const TicketCard = ({ ticket, data, id, ticketIndex = 0, totalTickets = 1 }) => {
    const getGradient = () => {
        switch (ticket.id || ticket.ticket_id) { // Handle flexibility in data structure
            case 'vip': return 'from-neon-pink/20 to-purple-900/40 border-neon-pink';
            case 'exp': return 'from-amber-500/30 to-yellow-600/50 border-neon-gold';
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

    const formatAttendees = (attendeesString) => {
        if (!attendeesString) return null;

        const names = attendeesString.split(',').map(n => n.trim()).filter(n => n);
        return names.map(fullName => {
            const parts = fullName.trim().split(' ');
            if (parts.length === 1) return parts[0];
            // Take first name + initial of last name
            const firstName = parts[0];
            const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
            return `${firstName} ${lastInitial}.`;
        }).join(', ');
    };

    // Get the name for this specific ticket index
    const getAttendeeNameForIndex = () => {
        if (!data.attendees || totalTickets === 1) return data.name;

        const groupMembers = data.attendees.split(',').map(n => n.trim()).filter(n => n);
        const allAttendees = [data.name, ...groupMembers];

        return allAttendees[ticketIndex] || data.name;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    };

    return (
        <div className="printable-ticket relative w-full max-w-sm mx-auto bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl transform transition-all hover:scale-[1.02] print:transform-none print:shadow-none mb-4 print:mb-0">
            {/* Top Section */}
            <div className={`p-6 bg-gradient-to-br ${getGradient()} border-b border-dashed border-white/20 relative`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-display font-bold text-white tracking-wider leading-tight">THE LAST NIGHT</h3>
                        <p className="text-[10px] text-neon-blue tracking-[0.3em] uppercase font-bold">EVENTO PÚBLICO</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className={`px-3 py-1 rounded border ${(ticket.id === 'vip' || ticket.ticket_id === 'vip') ? 'border-neon-pink text-neon-pink' :
                            (ticket.id === 'exp' || ticket.ticket_id === 'exp') ? 'border-neon-gold text-neon-gold' :
                                'border-white text-white'} text-xs font-bold uppercase`}>
                            2025
                        </div>
                        {totalTickets > 1 && (
                            <span className="text-[9px] font-black text-white bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider border border-white/10 whitespace-nowrap shadow-sm">
                                ENTRADA {ticketIndex + 1} DE {totalTickets}
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-xs text-gray-400 uppercase">Ticket Type</p>
                    <h2 className={`text-3xl font-display font-black ${getTextColor()} tracking-widest`}>{getTicketName()}</h2>
                </div>

                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-dark-900 rounded-full print:hidden"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-dark-900 rounded-full print:hidden"></div>
            </div>

            {/* Bottom Section */}
            <div className="p-6 bg-dark-800">
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                        <div className="w-full">
                            <p className="text-[10px] text-gray-500 uppercase">Attendee</p>
                            <p className="text-sm font-bold text-white break-words leading-tight">
                                {getAttendeeNameForIndex()}
                            </p>

                            {ticketIndex === 0 && data.attendees && (
                                <div className="mt-2 text-left">
                                    <p className="text-[10px] text-gray-500 uppercase">Group Members</p>
                                    <p className="text-xs text-gray-300 break-words font-medium leading-snug">
                                        {formatAttendees(data.attendees)}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="text-right min-w-[80px]">
                            <p className="text-[10px] text-gray-500 uppercase">Event Date</p>
                            <p className="text-sm font-bold text-white uppercase">31 DIC 2025</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase">Transaction ID</p>
                                <p className="text-xs font-mono text-gray-400">#{id.toString().slice(-8)}-{ticketIndex + 1}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase">Compra</p>
                                <p className="text-xs text-gray-400">{formatDate(data.created_at)}</p>
                            </div>
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
                            event: 'THE LAST NIGHT 2025',
                            id: id,
                            index: ticketIndex,
                            name: getAttendeeNameForIndex(),
                            type: getTicketName(),
                            valid: true
                        })}
                        size={112}
                        level="M"
                    />
                </div>

                <p className="text-[10px] text-center text-gray-600">Present this digital ticket at the entrance.</p>
            </div>
        </div>
    );
};

export default TicketCard;
