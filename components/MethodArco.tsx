import React from 'react';
import { RevealOnScroll } from './RevealOnScroll';

export const MethodArco: React.FC = () => {
  return (
    <section id="metodo" className="py-24 relative overflow-hidden bg-slate-950 scroll-mt-24">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-900/10 to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <RevealOnScroll className="text-center mb-20">
          <span className="inline-block px-4 py-1 rounded-full bg-slate-900 border border-slate-800 text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
            Metodologia Exclusiva
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Transformamos burocracia em ROI com o <br/>
            <span className="text-orange-600">Método ARCO®</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Não entregamos apenas relatórios. Nossa metodologia proprietária foca em transformar o compliance em um ativo financeiro e estratégico.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { letter: 'A', word: 'ATIVOS', text: 'Mapeamos processos, pessoas e dados valiosos da organização.' },
            { letter: 'R', word: 'RISCOS', text: 'Identificamos gargalos e riscos ocultos que drenam recursos.' },
            { letter: 'C', word: 'COMPLIANCE', text: 'Estruturamos governança sólida alinhada à estratégia do negócio.' },
            { letter: 'O', word: 'OPORTUNIDADES', text: 'Transformamos a conformidade em crescimento sustentável.' },
          ].map((item, idx) => (
            <RevealOnScroll key={idx} delay={idx * 150} className="relative group h-full">
              {/* Hover Glow Effect Background */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-600 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
              
              <div className="relative bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl shadow-black/50 h-full flex flex-col items-center text-center group-hover:border-orange-500/30 transition-all duration-300 z-10">
                {/* Bright Orange Glowing Letters */}
                <span className="text-8xl font-black bg-gradient-to-b from-orange-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-[-1.5rem] block select-none group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all duration-500">
                  {item.letter}
                </span>
                
                <h3 className="text-xl font-bold text-white mt-8 mb-4 group-hover:text-orange-200 transition-colors">{item.word}</h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                  {item.text}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};