import React from 'react';
import { Star } from 'lucide-react';
import { TestimonialProps } from '../types';
import { RevealOnScroll } from './RevealOnScroll';

const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, company, quote, image }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/40 flex flex-col h-full relative group hover:border-orange-200 transition-colors">
    {/* Quote Icon Background */}
    <div className="absolute top-6 right-8 text-7xl text-slate-100 font-serif leading-none select-none group-hover:text-orange-50 transition-colors">"</div>
    
    <div className="flex gap-1 mb-6 relative z-10">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
      ))}
    </div>
    
    <p className="text-slate-600 italic mb-8 flex-grow leading-relaxed text-sm relative z-10">"{quote}"</p>
    
    <div className="flex items-center gap-4 mt-auto relative z-10">
      <img src={image} alt={name} className="w-12 h-12 rounded-full border-2 border-orange-100 object-cover" />
      <div>
        <h4 className="text-slate-900 font-bold text-sm">{name}</h4>
        <div className="text-xs text-orange-600 font-medium">{role}</div>
        <div className="text-xs text-slate-400">{company}</div>
      </div>
    </div>
  </div>
);

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Renato Souza",
      role: "Gerente Jurídico",
      company: "Grupo Vértice",
      quote: "Reduzimos riscos mapeados em R$ 2,1 milhões com a auditoria interna integrada e políticas claras. O Método ARCO® mudou nossa visão.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      name: "Marcelo Trevys",
      role: "CEO",
      company: "Trevys FIDC",
      quote: "Compliance Enforcement levou a governança para o conselho e transformou conformidade em vantagem competitiva real.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    {
      name: "Lucas Schneider",
      role: "Diretor Financeiro",
      company: "TechSolutions",
      quote: "A adequação à LGPD foi conduzida de forma leve e prática. Hoje temos segurança para lidar com dados de clientes internacionais.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop"
    }
  ];

  const clientLogos = [
    "https://complianceenforcement.com.br/wp-content/webp-express/webp-images/uploads/2025/08/Screenshot_2.png.webp",
    "https://complianceenforcement.com.br/wp-content/webp-express/webp-images/uploads/2025/08/images-1.png.webp",
    "https://complianceenforcement.com.br/wp-content/webp-express/webp-images/uploads/2025/08/images.png.webp",
    "https://complianceenforcement.com.br/wp-content/webp-express/webp-images/uploads/2025/08/LOGOTIPO-FARMA-CONDE-.jpg.webp",
    // Adding duplicates of 'images-1' as requested implicitly by user provided list structure, 
    // although generally we'd filter, the carousel looks better with more items.
    "https://complianceenforcement.com.br/wp-content/webp-express/webp-images/uploads/2025/08/images-1.png.webp"
  ];

  return (
    <section id="clientes" className="py-24 bg-slate-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Clientes que confiam em nossa <span className="text-orange-600">Expertise</span>
          </h2>
          <p className="text-slate-500">Compliance que vira ROI, reputação e contratos – na prática.</p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <RevealOnScroll key={idx} delay={idx * 150} className="h-full">
              <TestimonialCard {...t} />
            </RevealOnScroll>
          ))}
        </div>
        
        {/* Infinite Scroll Logo Marquee */}
        <RevealOnScroll className="mt-24 pt-10 border-t border-slate-200">
           <div className="text-center mb-8">
              <h3 className="text-xl text-slate-400 font-medium">Empresas que Confiam em Nosso Trabalho</h3>
           </div>
           
           <div className="relative w-full overflow-hidden mask-linear-gradient">
              <div className="flex animate-scroll w-max hover:[animation-play-state:paused]">
                {/* We double the logos to create the infinite loop effect without gaps */}
                {[...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos].map((logo, idx) => (
                   <div key={idx} className="mx-8 w-40 flex items-center justify-center">
                     <img 
                       src={logo} 
                       alt="Cliente" 
                       className="max-h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110" 
                     />
                   </div>
                ))}
              </div>
              {/* Gradient overlays for smooth fade at edges */}
              <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
              <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
           </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};