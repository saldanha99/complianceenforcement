
import React from 'react';
import { Award, Briefcase, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const Expert: React.FC<{ onNavigate?: (page: any) => void }> = ({ onNavigate }) => {
  return (
    <section id="expert" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            <div className="relative h-96 lg:h-auto overflow-hidden">
               <img 
                 src="https://complianceenforcement.com.br/wp-content/webp-express/webp-images/uploads/2025/09/Imagem-do-WhatsApp-de-2025-09-23-as-16.24.45_329322a1.jpg.webp" 
                 alt="Taís Oliveira - Especialista" 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900/10"></div>
            </div>

            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-block px-4 py-1 mb-6 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-widest w-fit border border-orange-200">
                A Especialista
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Taís Oliveira: Transformando Compliance em Resultado
              </h2>
              
              <blockquote className="text-slate-600 italic border-l-4 border-orange-500 pl-6 mb-8 text-lg font-medium">
                "Não existe compliance eficaz sem visão estratégica de negócios. Nosso foco é blindar a empresa enquanto ela cresce."
              </blockquote>

              <p className="text-slate-600 mb-8 leading-relaxed text-base">
                Com mais de 10 anos de experiência executiva em Governança, Riscos e Compliance, Taís desenvolveu o exclusivo <strong>Método ARCO®</strong>, que já protegeu mais de R$ 50 milhões em riscos empresariais e impactou positivamente dezenas de clientes.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-slate-900 font-bold text-sm">Expertise Reconhecida</h4>
                        <p className="text-slate-500 text-xs font-medium">GRC, LGPD e Compliance com certificações internacionais de elite.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-slate-900 font-bold text-sm">Visão de ROI</h4>
                        <p className="text-slate-500 text-xs font-medium">Foco absoluto em gerar valor financeiro através da integridade corporativa.</p>
                    </div>
                </div>
              </div>

              <button 
                onClick={() => onNavigate && onNavigate('solucoes')}
                className="self-start inline-flex items-center gap-3 bg-slate-950 text-white hover:bg-orange-600 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group"
              >
                Conheça Nossa Expertise <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
