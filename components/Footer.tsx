
import React from 'react';
import { Linkedin, Instagram, Mail, Phone } from 'lucide-react';
import { Page } from '../App';

interface FooterProps {
  onStartQuiz: () => void;
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartQuiz, onNavigate }) => {
  return (
    <footer className="bg-black border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div>
            <div className="flex items-center gap-2 mb-6">
                <button onClick={() => onNavigate('home')} className="flex items-center transition-opacity hover:opacity-80">
                  <img 
                    src="https://complianceenforcement.com.br/wp-content/uploads/2025/12/comp.webp" 
                    alt="Compliance Enforcement" 
                    className="h-10 w-auto object-contain brightness-0 invert"
                  />
                </button>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Transformando obrigações legais em vantagem competitiva com visão estratégica e foco em resultados reais.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Navegação</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><button onClick={() => onNavigate('home')} className="hover:text-orange-500 transition-colors text-left w-full">Início</button></li>
              <li><button onClick={() => onNavigate('solucoes')} className="hover:text-orange-500 transition-colors text-left w-full">Soluções GRC</button></li>
              <li><button onClick={() => onNavigate('sobre')} className="hover:text-orange-500 transition-colors text-left w-full">Sobre a Empresa</button></li>
              <li><button onClick={() => onNavigate('quiz')} className="hover:text-orange-500 transition-colors text-left w-full">Diagnóstico Premium</button></li>
              <li><button onClick={() => onNavigate('contato')} className="hover:text-orange-500 transition-colors text-left w-full">Fale Conosco</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Atendimento</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-start gap-3">
                <a href="https://wa.me/5512996590801" target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span>+55 12 99659-0801</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <a href="mailto:comercial@complianceenforcement.com.br" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className="break-all">comercial@complianceenforcement.com.br</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Presença Social</h3>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/company/complianceenforcement" target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-colors border border-white/5 shadow-lg">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/complianceenforcement" target="_blank" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-colors border border-white/5 shadow-lg">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-6 text-[10px] text-gray-600 leading-relaxed uppercase tracking-widest font-bold italic">
              A conformidade não é um destino, é uma jornada contínua de integridade.
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 text-center flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold">
          <p>© {new Date().getFullYear()} Compliance Enforcement. Todos os Direitos Estratégicos Reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors uppercase">Políticas</button>
             <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors uppercase">Segurança</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
