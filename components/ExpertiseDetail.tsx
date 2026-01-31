
import React from 'react';
import { 
  Landmark, ShieldCheck, FileCheck, Globe, CheckCircle2, 
  ChevronLeft, ArrowRight, Zap, Target, Lock, BarChart3, ShieldAlert
} from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';
import { Page } from '../App';

type ExpertiseType = 'financeira' | 'regulados' | 'lgpd' | 'iso';

interface ExpertiseDetailProps {
  type: ExpertiseType;
  onNavigate: (page: Page) => void;
}

const contentMap: Record<ExpertiseType, any> = {
  financeira: {
    title: "Regulação Financeira",
    subtitle: "Soluções GRC para o Ecossistema Bancário e Fintechs",
    icon: Landmark,
    heroImage: "https://images.unsplash.com/photo-1550565118-3d143c00368c?q=80&w=2070",
    tags: ['Bacen', 'CVM', 'Anbima'],
    topics: [
      { title: "Due Diligence de integridade", desc: "Análise profunda de parceiros e investidores em rodadas de captação." },
      { title: "PLD/FT & KYC", desc: "Prevenção à Lavagem de Dinheiro e financiamento ao terrorismo com visão de risco." },
      { title: "Suitability e Controles", desc: "Estruturação de processos internos para fundos de investimento e FIDCs." }
    ],
    details: "Atuamos diretamente na adequação documental e evidências para auditorias internas e regulatórias."
  },
  regulados: {
    title: "Setores Regulados",
    subtitle: "Conformidade Técnica para ANP e ANVISA",
    icon: ShieldCheck,
    heroImage: "https://images.unsplash.com/photo-1532187863486-abf51ad95699?q=80&w=2070",
    tags: ['Saúde', 'Combustíveis', 'Pharma'],
    topics: [
      { title: "Rastreabilidade Industrial", desc: "Implementação de BPF (Boas Práticas de Fabricação) e registros sanitários." },
      { title: "Qualificação de Fornecedores", desc: "Auditoria técnica em toda a cadeia logística de insumos críticos." },
      { title: "Defesa de Auto de Infração", desc: "Suporte especializado em processos administrativos regulatórios." }
    ],
    details: "Garantimos a segurança jurídica necessária para operações complexas em mercados sob forte fiscalização."
  },
  lgpd: {
    title: "LGPD com Visão de ROI",
    subtitle: "Privacidade como Diferencial de Mercado",
    icon: FileCheck,
    heroImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070",
    tags: ['Privacy', 'Risk', 'Growth'],
    topics: [
      { title: "Data Mapping Estratégico", desc: "Identificação de fluxos de dados que geram valor para o marketing e vendas." },
      { title: "Privacy by Design", desc: "Implementação de segurança desde a concepção de novos produtos digitais." },
      { title: "Resposta a Incidentes", desc: "Protocolos ágeis para comunicação com a ANPD e titulares." }
    ],
    details: "Não entregamos apenas leis; entregamos playbooks que aceleram o fechamento de contratos B2B."
  },
  iso: {
    title: "ISOs & Selos de Integridade",
    subtitle: "Padronização Global e Reconhecimento de Marca",
    icon: Globe,
    heroImage: "https://images.unsplash.com/photo-1454165833762-02ac4f408d6e?q=80&w=2070",
    tags: ['Compliance', 'ESG', 'ISO'],
    topics: [
      { title: "ISO 37301 e 37001", desc: "Sistemas de gestão de compliance e antissuborno reconhecidos internacionalmente." },
      { title: "ISO 27001 e 27701", desc: "Certificação em segurança da informação e privacidade de dados." },
      { title: "Pró-Ética e GPTW", desc: "Preparação completa para obtenção de selos que elevam o valor da marca." }
    ],
    details: "Criamos o roadmap de evidências necessário para que sua empresa seja auditada e certificada com sucesso."
  }
};

export const ExpertiseDetail: React.FC<ExpertiseDetailProps> = ({ type, onNavigate }) => {
  const content = contentMap[type];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <img src={content.heroImage} alt={content.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <button 
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest mb-8 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Voltar ao Início
          </button>
          
          <div className="w-20 h-20 bg-orange-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
             <content.icon className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {content.title}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <RevealOnScroll>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-orange-600" /> Foco de Atuação
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.topics.map((topic: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-orange-200 transition-all group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                       <CheckCircle2 className="w-6 h-6 text-orange-600 group-hover:text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{topic.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-sm">{topic.desc}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <ShieldAlert className="w-48 h-48" />
               </div>
               <h3 className="text-2xl font-bold mb-6 relative z-10">Onde fazemos a diferença</h3>
               <p className="text-slate-400 text-lg leading-relaxed mb-8 relative z-10">
                 {content.details}
               </p>
               <div className="flex flex-wrap gap-3">
                 {content.tags.map((tag: string) => (
                   <span key={tag} className="px-6 py-2 bg-white/10 rounded-full text-orange-500 font-bold text-xs uppercase tracking-widest border border-white/10">
                     {tag}
                   </span>
                 ))}
               </div>
            </RevealOnScroll>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-orange-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-orange-900/20">
               <Zap className="w-12 h-12 mb-6" />
               <h3 className="text-2xl font-black mb-4 leading-tight">Pronto para blindar seu negócio?</h3>
               <p className="text-orange-100 mb-8 font-medium">
                 Nossos especialistas estão prontos para desenhar o roadmap de conformidade ideal para seu setor.
               </p>
               <button 
                 onClick={() => onNavigate('quiz')}
                 className="w-full bg-white text-orange-600 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
               >
                 Diagnóstico Grátis <ArrowRight className="w-5 h-5" />
               </button>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
               <h4 className="text-slate-900 font-bold mb-6">Expertise Relacionada</h4>
               <div className="space-y-4">
                  {Object.keys(contentMap).filter(k => k !== type).map((key: any) => (
                    <button 
                      key={key}
                      onClick={() => onNavigate(`expertise-${key}` as any)}
                      className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-500/50 hover:shadow-lg transition-all text-left"
                    >
                      <span className="text-slate-700 font-bold text-sm">{contentMap[key].title}</span>
                      <ArrowRight className="w-4 h-4 text-orange-500" />
                    </button>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
