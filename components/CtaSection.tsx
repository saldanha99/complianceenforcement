
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const CtaSection: React.FC<{ onStartQuiz: () => void }> = ({ onStartQuiz }) => {
  return (
    <section id="contato" className="py-16 bg-white scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 p-10 md:p-16 text-center shadow-2xl shadow-orange-900/20">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Sua empresa está segura?
            </h2>
            <p className="text-orange-50 text-lg mb-10 max-w-2xl mx-auto">
              Leve 2 minutos para responder 5 perguntas e receba um diagnóstico imediato de maturidade em Compliance e LGPD.
            </p>
            
            <button 
              onClick={onStartQuiz}
              className="inline-flex bg-white text-orange-600 hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg items-center gap-2 mx-auto"
            >
              Fazer Diagnóstico Agora
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
