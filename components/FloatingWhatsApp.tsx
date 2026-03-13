import React, { useState } from 'react';
import { X } from 'lucide-react';

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // WhatsApp Number configured for the company
  const whatsappNumber = '5512996590801';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      setPhone(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || phone.replace(/\D/g, '').length < 10) return;

    setIsLoading(true);

    try {
      // 1. Send to API
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          company,
          notes: 'Origem: Widget WhatsApp Flutuante',
          status: 'new',
          tags: ['whatsapp-widget']
        })
      });

      // 2. Redirect to WhatsApp
      const firstName = name.split(' ')[0];
      const text = encodeURIComponent(`Olá, me chamo ${firstName}! Estou no site de vocês e gostaria de tirar uma dúvida.`);
      const waUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
      
      window.open(waUrl, '_blank');
      
      // Reset after opening
      setIsOpen(false);
      setName('');
      setPhone('');
      setCompany('');
      
    } catch (err) {
      console.error('Error submitting WA widget lead:', err);
      // Fallback redirect even if API fails
      window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Pop-up Overlay & Form */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-green-500 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-sm">Fale Conosco</h4>
                <p className="text-xs text-green-100">Respondemos rapidinho!</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="p-5 bg-slate-50">
            <p className="text-sm text-slate-600 mb-4 font-medium">
              Preencha os dados abaixo para iniciar a conversa no WhatsApp.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Seu Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-slate-200 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp (com DDD)"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-2.5 rounded-md border border-slate-200 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Nome da Empresa (Opcional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-slate-200 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-md text-sm transition-colors mt-2 flex justify-center items-center gap-2"
              >
                {isLoading ? 'Conectando...' : 'Iniciar Conversa'}
                {!isLoading && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-transform duration-300 hover:scale-110 flex items-center justify-center animate-bounce"
          aria-label="Abrir WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </button>
      )}
    </>
  );
}
