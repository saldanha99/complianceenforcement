
import React from 'react';
import { Landmark, ShieldCheck, FileCheck, Globe, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';
import { Page } from '../App';

export const RegulatoryExpertise: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Áreas regulatórias em que somos <span className="text-orange-500">experts</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Entregamos GRC, LGPD e conformidade com foco em ROI, reputação e contratos.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <RevealOnScroll delay={100} className="h-full">
            <button 
              onClick={() => onNavigate('expertise-financeira')}
              className="bg-slate-900/60 hover:bg-white/[0.05] border border-slate-800 hover:border-orange-500/50 rounded-2xl p-8 h-full flex flex-col text-left transition-all group"
            >
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6 border border-orange-500/20 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Landmark className="w-6 h-6 text-orange-500 group-hover:text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-6">Regulação financeira</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Bacen', 'CVM', 'Anbima'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-950 border border-orange-900/50 text-orange-200 text-[10px] font-bold rounded-full uppercase tracking-wider">{tag}</span>
                ))}
              </div>
              <ul className="space-y-4 text-slate-400 text-sm mb-8 flex-1">
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></span>Fintechs e Bancos Digitais.</li>
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></span>PLD/FT e Compliance CVM.</li>
              </ul>
              <div className="text-orange-500 text-xs font-bold uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                Ver detalhes <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </RevealOnScroll>

          {/* Card 2 */}
          <RevealOnScroll delay={200} className="h-full">
            <button 
              onClick={() => onNavigate('expertise-regulados')}
              className="bg-slate-900/60 hover:bg-white/[0.05] border border-slate-800 hover:border-orange-500/50 rounded-2xl p-8 h-full flex flex-col text-left transition-all group"
            >
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6 border border-orange-500/20 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6 text-orange-500 group-hover:text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-6">Setores regulados</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {['ANP', 'ANVISA'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-950 border border-orange-900/50 text-orange-200 text-[10px] font-bold rounded-full uppercase tracking-wider">{tag}</span>
                ))}
              </div>
              <ul className="space-y-4 text-slate-400 text-sm mb-8 flex-1">
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></span>Saúde e Farmacêutico.</li>
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></span>Rastreabilidade e BPF.</li>
              </ul>
              <div className="text-orange-500 text-xs font-bold uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                Ver detalhes <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </RevealOnScroll>

          {/* Card 3 */}
          <RevealOnScroll delay={300} className="h-full">
            <button 
              onClick={() => onNavigate('expertise-lgpd')}
              className="bg-slate-900/60 hover:bg-white/[0.05] border border-slate-800 hover:border-orange-500/50 rounded-2xl p-8 h-full flex flex-col text-left transition-all group"
            >
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6 border border-orange-500/20 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <FileCheck className="w-6 h-6 text-orange-500 group-hover:text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-8">LGPD com visão de ROI</h3>
              <ul className="space-y-4 text-slate-400 text-sm mb-8 flex-1">
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></span>Privacy by Design estratégica.</li>
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></span>Playbooks por área de negócio.</li>
              </ul>
              <div className="text-orange-500 text-xs font-bold uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                Ver detalhes <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </RevealOnScroll>

          {/* Card 4 */}
          <RevealOnScroll delay={400} className="h-full">
            <button 
              onClick={() => onNavigate('expertise-iso')}
              className="bg-slate-900/60 hover:bg-white/[0.05] border border-slate-800 hover:border-orange-500/50 rounded-2xl p-8 h-full flex flex-col text-left transition-all group"
            >
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6 border border-orange-500/20 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Globe className="w-6 h-6 text-orange-500 group-hover:text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-6">ISOs & Selos</h3>
              <div className="bg-slate-950/40 p-2 rounded-lg mb-4 text-center">
                <span className="text-white text-[10px] font-bold">Implementação Total</span>
              </div>
              <ul className="space-y-2 text-slate-400 text-[11px] mb-8 flex-1">
                <li className="flex justify-between border-b border-white/5 pb-1"><span>ISO 37301</span><span>Compliance</span></li>
                <li className="flex justify-between border-b border-white/5 pb-1"><span>ISO 37001</span><span>Antissuborno</span></li>
              </ul>
              <div className="text-orange-500 text-xs font-bold uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                Ver detalhes <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
};
