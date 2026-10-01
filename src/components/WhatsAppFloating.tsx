import React, { useState } from 'react';
import { MessageCircle, X, Send, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WhatsAppFloating: React.FC = () => {
  const { 
    isWhatsAppModalOpen, 
    setIsWhatsAppModalOpen, 
    whatsAppInitialMessage, 
    setWhatsAppInitialMessage 
  } = useShop();

  const [message, setMessage] = useState(whatsAppInitialMessage);

  const predefinedTemplates = [
    'Halo Borongin, saya ingin bertanya mengenai produk.',
    'Halo CS Borongin, mohon info promo gratis ongkir hari ini.',
    'Halo, saya mau konfirmasi status pesanan & nomor resi.',
    'Halo, saya ingin mendaftar sebagai reseller / mitra UMKM.'
  ];

  const handleSend = (textToSend?: string) => {
    const text = encodeURIComponent(textToSend || message || 'Halo Borongin, saya ingin bertanya mengenai produk.');
    const whatsappUrl = `https://wa.me/6281234567890?text=${text}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsWhatsAppModalOpen(false);
  };

  return (
    <>
      {/* Floating Button (Bottom Right) */}
      <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
        {!isWhatsAppModalOpen && (
          <div className="mb-2 hidden sm:flex items-center gap-1.5 bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-slate-100 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Butuh Bantuan? Chat WhatsApp</span>
          </div>
        )}

        <button
          onClick={() => setIsWhatsAppModalOpen(!isWhatsAppModalOpen)}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 group focus:outline-none"
          title="Chat WhatsApp Resmi BORONGIN.COM"
          aria-label="Chat WhatsApp"
        >
          {isWhatsAppModalOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-7 h-7 fill-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-emerald-600 rounded-full"></span>
            </div>
          )}
        </button>
      </div>

      {/* WhatsApp Chat Popover Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-[360px] sm:max-w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white relative">
                <MessageCircle className="w-6 h-6 fill-white" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-700 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">CS Official BORONGIN.COM</h4>
                <div className="flex items-center gap-1 text-[11px] text-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  <span>Online · Biasanya membalas dalam 2 menit</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="text-emerald-200 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-50 space-y-3 max-h-[360px] overflow-y-auto">
            {/* Auto Message Bubble */}
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-xs text-slate-800 space-y-1">
              <p className="font-semibold text-emerald-700">Halo Sahabat Borongin! 👋</p>
              <p>Selamat datang di layanan bantuan resmi <strong>BORONGIN.COM</strong>. Ada yang bisa kami bantu seputar produk, promo, atau pengiriman hari ini?</p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                <span>Baru saja</span>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Pertanyaan Cepat:
              </p>
              <div className="space-y-1.5">
                {predefinedTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMessage(template);
                      handleSend(template);
                    }}
                    className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 p-2 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{template}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan Anda untuk CS Borongin..."
                className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none text-slate-800"
              />
              <button
                onClick={() => handleSend()}
                className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
                title="Kirim ke WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Nomor WhatsApp: <strong>+62 812-3456-7890</strong> (Official Service)
            </p>
          </div>

        </div>
      )}
    </>
  );
};
