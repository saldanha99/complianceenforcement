import React from 'react';
import { ShieldAlert, FileText, Lock, Users, BarChart3, GraduationCap, Building2, Eye } from 'lucide-react';
import { ServiceCardProps } from '../types';
import { RevealOnScroll } from './RevealOnScroll';

const ServiceCard: React.FC<ServiceCardProps & { index: number }> = ({ title, description, icon: Icon, index }) => (
  <div className="group relative bg-white border border-slate-100 rounded-2xl p-8 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 h-full">
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="w-24 h-24 text-orange-500" />
    </div>
    
    <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
      <Icon className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
    </div>
    
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm mb-6">
      {description}
    </p>
  </div>
);

export const Services: React.FC = () => {
  const services = [
    {
      title: "Adequação à LGPD",
      description: "Mapeamento de dados, DPO as a Service e implementação completa para evitar multas milionárias e garantir a privacidade.",
      icon: Lock
    },
    {
      title: "Programas de Compliance",
      description: "Estruturação de políticas, códigos de ética e canais de denúncia para proteger a reputação e prevenir fraudes.",
      icon: ShieldAlert
    },
    {
      title: "Auditoria Interna",
      description: "Identificação de gargalos operacionais e financeiros, garantindo a eficiência dos processos e conformidade.",
      icon: Eye
    },
    {
      title: "Consultoria ESG",
      description: "Estratégias ambientais, sociais e de governança para atrair investidores e consolidar a sustentabilidade do negócio.",
      icon: Building2
    },
    {
      title: "Gestão de Riscos (GRC)",
      description: "Metodologia integrada para governança, riscos e compliance, focada em resultados e proteção de ativos.",
      icon: BarChart3
    },
    {
      title: "Treinamentos Corporativos",
      description: "Aculturamento de equipes e lideranças em temas sensíveis como assédio, ética e segurança da informação.",
      icon: GraduationCap
    },
    {
      title: "Due Diligence",
      description: "Análise prévia de riscos em contratações de terceiros e fusões, mitigando passivos ocultos.",
      icon: FileText
    },
    {
      title: "Canal de Denúncias",
      description: "Implementação e gestão de canais seguros para relatos de irregularidades, conforme a Lei 14.457/22.",
      icon: Users
    }
  ];

  return (
    <section id="solucoes" className="py-24 bg-white relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-16">
          <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">O que entregamos</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
            Soluções completas para a sua <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Jornada de Conformidade</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <RevealOnScroll key={idx} delay={idx * 100}>
              <ServiceCard index={idx} {...service} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};