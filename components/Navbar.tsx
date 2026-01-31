
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Landmark, ShieldCheck, FileCheck, Globe, ArrowRight } from 'lucide-react';
import { Page } from '../App';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const expertiseItems = [
    { id: 'expertise-financeira', label: 'Regulação Financeira', icon: Landmark, desc: 'Bacen, CVM e Anbima para Fintechs.' },
    { id: 'expertise-regulados', label: 'Setores Regulados', icon: ShieldCheck, desc: 'ANP e ANVISA: Saúde e Combustíveis.' },
    { id: 'expertise-lgpd', label: 'LGPD com ROI', icon: FileCheck, desc: 'Privacidade como ativo de negócio.' },
    { id: 'expertise-iso', label: 'ISOs & Selos', icon: Globe, desc: '37001, 37301 e integridade global.' },
  ];

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-slate-950 py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex-shrink-0 transition-transform hover:scale-105">
            <img 
              src="https://complianceenforcement.com.br/wp-content/uploads/2025/12/comp.webp" 
              alt="Logo" className="h-10 w-auto brightness-0 invert" 
            />
          </button>

          <div className="hidden lg:flex items-center space-x-1">
            <button onClick={() => onNavigate('home')} className={`px-4 py-2 text-sm font-bold transition-colors ${currentPage === 'home' ? 'text-orange-500' : 'text-slate-300 hover:text-white'}`}>
              Início
            </button>

            {/* Mega Menu Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <button 
                onClick={() => onNavigate('solucoes')}
                className={`px-4 py-2 text-sm font-bold flex items-center gap-1 transition-colors ${
                  currentPage.includes('expertise') || currentPage === 'solucoes' ? 'text-orange-500' : 'text-slate-300 hover:text-white'
                }`}
              >
                Soluções <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMegaMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Panel - iOS Glass Design */}
              <div 
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
                  showMegaMenu ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <div className="w-[600px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-400"></div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {expertiseItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { onNavigate(item.id as any); setShowMegaMenu(false); }}
                        className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left group/item"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-500 border border-orange-500/20 group-hover/item:bg-orange-600 group-hover/item:text-white transition-colors">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm mb-1 group-hover/item:text-orange-400 transition-colors">{item.label}</h4>
                          <p className="text-slate-400 text-[11px] leading-tight">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inteligência Regulatória</p>
                    <button onClick={() => onNavigate('solucoes')} className="text-orange-500 text-xs font-bold flex items-center gap-2 hover:gap-3 transition-all">
                      Ver todas as soluções <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => onNavigate('sobre')} className={`px-4 py-2 text-sm font-bold transition-colors ${currentPage === 'sobre' ? 'text-orange-500' : 'text-slate-300 hover:text-white'}`}>
              Sobre
            </button>
            <button onClick={() => onNavigate('contato')} className={`px-4 py-2 text-sm font-bold transition-colors ${currentPage === 'contato' ? 'text-orange-500' : 'text-slate-300 hover:text-white'}`}>
              Contato
            </button>
          </div>

          <div className="hidden lg:block">
            <button 
              onClick={() => onNavigate('quiz')}
              className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-900/40 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Diagnóstico de Risco
            </button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-300">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen border-t border-white/5 bg-slate-950' : 'max-h-0'}`}>
        <div className="px-4 py-6 space-y-4">
          <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="block w-full text-left text-white font-bold p-2">Início</button>
          <div className="space-y-2 pl-4">
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Soluções</p>
            {expertiseItems.map(item => (
              <button key={item.id} onClick={() => { onNavigate(item.id as any); setIsOpen(false); }} className="block w-full text-left text-slate-300 text-sm py-2">
                {item.label}
              </button>
            ))}
          </div>
          <button onClick={() => { onNavigate('sobre'); setIsOpen(false); }} className="block w-full text-left text-white font-bold p-2">Sobre</button>
          <button onClick={() => { onNavigate('contato'); setIsOpen(false); }} className="block w-full text-left text-white font-bold p-2">Contato</button>
          <button onClick={() => { onNavigate('quiz'); setIsOpen(false); }} className="w-full bg-orange-600 py-4 rounded-xl text-white font-black uppercase text-xs">Diagnóstico Grátis</button>
        </div>
      </div>
    </nav>
  );
};
