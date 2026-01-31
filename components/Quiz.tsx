
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { evolutionApi } from '../services/evolutionApi';
import {
  ShieldAlert, Skull, ChevronRight, ArrowRight, Zap, Lock,
  Flame, Activity, Terminal, Fingerprint, X, User, Phone
} from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface Question {
  id: number;
  text: string;
  subtext: string;
  category: string;
  options: { text: string; risk: "Low" | "Medium" | "High"; feedback: string }[];
}

const auditQuestions: Question[] = [
  {
    id: 1,
    text: "Qual o seu nível de controle real sobre dados sensíveis hoje?",
    subtext: "Vazamentos de dados pessoais custam, em média, R$ 6.5 milhões no Brasil e podem paralisar operações.",
    category: "LGPD_EXPOSURE",
    options: [
      { text: "Mapeamento total e DPO ativo.", risk: "Low", feedback: "Boa base, mas a manutenção é onde a maioria falha." },
      { text: "Mapeado parcialmente, sem revisões.", risk: "Medium", feedback: "Ponto cego detectado. O risco está no que você ignora." },
      { text: "Sem mapeamento formalizado.", risk: "High", feedback: "ALVO FÁCIL. Você está operando uma bomba-relógio regulatória." },
    ]
  },
  {
    id: 2,
    text: "Como sua empresa trata denúncias internas de fraude ou assédio?",
    subtext: "85% das fraudes são detectadas por denúncias. Canais falhos geram prejuízo silencioso.",
    category: "ETHICS_VOID",
    options: [
      { text: "Canal externo, independente e anônimo.", risk: "Low", feedback: "Conformidade legal e proteção reputacional garantida." },
      { text: "E-mail interno ou RH direto.", risk: "Medium", feedback: "O medo cala o denunciante. A fraude continua ocorrendo." },
      { text: "Não temos canal formal.", risk: "High", feedback: "CAOS ÉTICO. Fraudes internas podem corroer 5% do seu faturamento." },
    ]
  },
  {
    id: 3,
    text: "A diretoria toma decisões baseadas em uma Matriz de Riscos?",
    subtext: "Decisões baseadas no 'feeling' são o caminho mais curto para multas da CVM ou BACEN.",
    category: "STRATEGIC_RISK",
    options: [
      { text: "Sim, pauta fixa de GRC no conselho.", risk: "Low", feedback: "Cultura de topo identificada. Governança resiliente." },
      { text: "Apenas em situações de crise grave.", risk: "Medium", feedback: "Gestão 'apaga incêndio'. O compliance reativo é 4x mais caro." },
      { text: "Raramente ou nunca discutimos isso.", risk: "High", feedback: "CEGUEIRA EXECUTIVA. A liderança é o elo mais fraco hoje." },
    ]
  },
  {
    id: 4,
    text: "Existe Due Diligence (auditoria técnica) de parceiros e fornecedores?",
    subtext: "Você é solidariamente responsável pelos erros dos seus terceiros perante a lei.",
    category: "THIRD_PARTY_THREAT",
    options: [
      { text: "Análise rigorosa em 100% dos críticos.", risk: "Low", feedback: "Blindagem de cadeia de suprimentos eficiente." },
      { text: "Análise apenas de grandes contratos.", risk: "Medium", feedback: "Ponto cego perigoso. O pequeno parceiro causará o grande dano." },
      { text: "Nenhuma análise formal.", risk: "High", feedback: "PORTAS ABERTAS. Você assina cheques em branco para o azar." },
    ]
  },
  {
    id: 5,
    text: "Qual o seu Plano de Resposta a Incidentes (Vazamentos/Ataques)?",
    subtext: "A paralisação média após um ataque hacker é de 21 dias sem faturar nada.",
    category: "RESILIENCE_FAIL",
    options: [
      { text: "Plano documentado e testado anualmente.", risk: "Low", feedback: "Resiliência detectada. Prontidão operacional." },
      { text: "Temos apenas backup básico de TI.", risk: "Medium", feedback: "Insuficiente. Falta gestão de crise e suporte jurídico." },
      { text: "Não temos plano formal.", risk: "High", feedback: "MORTE SUBITA. Um ataque hoje fecharia suas portas." },
    ]
  },
  {
    id: 6,
    text: "Seus colaboradores recebem treinamento de ética e segurança?",
    subtext: "O erro humano é responsável por 90% das falhas de segurança em empresas.",
    category: "HUMAN_ERROR",
    options: [
      { text: "Treinamentos periódicos com evidências.", risk: "Low", feedback: "Cultura de prevenção ativa. Menos riscos operacionais." },
      { text: "Apenas na integração (onboarding).", risk: "Medium", feedback: "O conhecimento caduca. Sua equipe esqueceu os protocolos." },
      { text: "Não realizamos treinamentos.", risk: "High", feedback: "CAMPO MINADO. Sua equipe é a maior vulnerabilidade hoje." },
    ]
  },
  {
    id: 7,
    text: "Como você monitora mudanças em normas e leis do seu setor?",
    subtext: "A ignorância da lei não é defesa. O mercado pune quem se atualiza tarde demais.",
    category: "REGULATORY_LAG",
    options: [
      { text: "Assessoria especializada contínua.", risk: "Low", feedback: "Visão de futuro. Você antecipa o impacto regulatório." },
      { text: "Monitoramento interno pontual.", risk: "Medium", feedback: "Lentidão detectada. Você está sempre um passo atrás da lei." },
      { text: "Não monitoramos formalmente.", risk: "High", feedback: "TOTAL EXPOSIÇÃO. Você será multado por algo que nem sabe que mudou." },
    ]
  },
  {
    id: 8,
    text: "Sua empresa possui políticas de combate à corrupção e suborno?",
    subtext: "A Lei Anticorrupção prevê multas de até 20% do faturamento bruto da empresa.",
    category: "INTEGRITY_VOID",
    options: [
      { text: "Programa de integridade completo e ISOs.", risk: "Low", feedback: "Maturidade de elite. Proteção total do CNPJ." },
      { text: "Apenas um Código de Conduta genérico.", risk: "Medium", feedback: "Compliance 'de papel'. Não resiste a uma investigação real." },
      { text: "Não temos políticas formalizadas.", risk: "High", feedback: "ALTO RISCO CRIMINAL. Vulnerabilidade total para sócios e diretores." },
    ]
  }
];

export const Quiz: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[INITIALIZING_AUDIT_PROTOCOL]", "[SCANNING_NETWORK_VULNERABILITIES]"]);
  const [timeLeft, setTimeLeft] = useState(600);

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');

  useEffect(() => {
    if (showResult && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [showResult, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 10));
  }, []);

  const handleOptionSelect = (risk: "Low" | "Medium" | "High", feedback: string) => {
    const riskIncrement = risk === "High" ? 12.5 : risk === "Medium" ? 6 : 1;
    setRiskScore(prev => Math.min(prev + riskIncrement, 100));

    if (risk === "High") {
      setIsGlitching(true);
      addLog(`[CRITICAL_FAILURE] ${auditQuestions[currentStep].category}`);
      setTimeout(() => setIsGlitching(false), 300);
    } else {
      addLog(`[ANALYSIS_SUCCESS] ${auditQuestions[currentStep].category}: OK`);
    }

    setTimeout(() => {
      if (currentStep < auditQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowResult(true);
      }
    }, 500);
  };


  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    const riskStatus = riskScore >= 40 ? "Cenário de Perigo Crítico" : "Blindagem Parcial";
    const message = `Olá, ${leadName}! Aqui é da Compliance Enforcement. Recebemos seu diagnóstico com ${Math.round(riskScore)}% de exposição (${riskStatus}). Nossa especialista já está analisando seus dados para a reunião estratégica.`;

    // Save to CRM
    try {
      const { error } = await supabase.from('leads').insert({
        name: leadName,
        phone: leadPhone,
        quiz_results: {
          score: riskScore,
          risk_level: riskStatus,
          answers: auditQuestions.map((q, i) => ({
            question: q.category,
            answer: i <= currentStep ? "Answered" : "Skipped" // Simplified for now as we don't track individual answers in state yet, just score.
          }))
        },
        status: 'new',
        notes: 'Lead capturado via Quiz de Diagnóstico'
      });

      if (error) {
        console.error('Error saving lead:', error);
        // Continue to WhatsApp anyway? Yes, fail soft.
      }

      // Send WhatsApp Automation
      if (leadPhone) {
        await evolutionApi.sendTextMessage(leadPhone, message);
      }

    } catch (err) {
      console.error('System error:', err);
    }

    // Success UI
    alert('Diagnóstico enviado com sucesso! Verifique seu WhatsApp.');
    setShowLeadModal(false);
  };

  if (showResult) {
    const isCritical = riskScore >= 40;
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative font-sans overflow-hidden">
        <div className="absolute inset-0 bg-red-900/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

        <RevealOnScroll className="max-w-4xl w-full relative z-10">
          <div className="bg-zinc-900/95 backdrop-blur-3xl border-2 border-red-500/40 rounded-[3rem] p-8 md:p-16 text-center shadow-[0_0_100px_rgba(239,68,68,0.3)]">

            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
              <div className="text-left">
                <h2 className="text-red-500 font-black text-xl md:text-2xl uppercase tracking-tighter flex items-center gap-2">
                  <Skull className="w-6 h-6" /> RELATÓRIO DE EXPOSIÇÃO
                </h2>
                <p className="text-zinc-500 font-mono text-[10px]">HASH: AUDIT_STRESS_{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <div className="text-white font-black text-4xl md:text-5xl leading-none">{Math.round(riskScore)}%</div>
                <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">NÍVEL DE RISCO</div>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <h3 className="text-white text-3xl md:text-6xl font-black italic uppercase leading-[0.9] tracking-tighter">
                {isCritical ? "Cenário de Perigo Crítico" : "Blindagem Parcial Detectada"}
              </h3>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                {isCritical
                  ? "O diagnóstico identificou falhas estruturais graves. Sua empresa está operando sem blindagem jurídica real e o custo de um incidente hoje seria fatal para o seu fluxo de caixa."
                  : "Sua base é sólida, mas existem 'buracos' na conformidade que podem ser usados por concorrentes e órgãos reguladores para paralisar seu crescimento."
                }
              </p>
            </div>

            <div className="bg-red-600/15 border border-red-500/50 p-6 md:p-8 rounded-[2.5rem] mb-12 flex flex-col md:flex-row items-center gap-6 md:gap-8 group hover:bg-red-600/20 transition-all text-left">
              <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-3xl flex items-center justify-center animate-bounce shadow-lg shadow-red-900/50">
                  <Flame className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-white font-black text-lg md:text-xl mb-1 flex items-center gap-2 uppercase">INTERVENÇÃO DE EMERGÊNCIA <Zap className="w-5 h-5 text-yellow-400" /></h4>
                <p className="text-zinc-400 text-sm font-medium leading-tight">Liberei uma **Sessão Estratégica Gratuita** para desenhar seu plano de mitigação imediata. Valor desta consultoria: <span className="text-white font-bold">R$ 2.500,00</span> (Zero hoje).</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <button
                onClick={() => setShowLeadModal(true)}
                className="relative group bg-white text-black font-black py-6 md:py-8 rounded-[2rem] transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center gap-1 hover:bg-red-600 hover:text-white transform hover:scale-[1.02] active:scale-95"
              >
                <span className="text-xl md:text-3xl flex items-center gap-4">
                  PARAR O SANGRAMENTO AGORA <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-60">Sua reserva expira em: {formatTime(timeLeft)}</span>
              </button>

              <button
                onClick={onBack}
                className="text-zinc-600 hover:text-zinc-400 text-[10px] font-black uppercase tracking-[0.5em] transition-colors"
              >
                [ VOLTAR AO INÍCIO E CORRER O RISCO ]
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {showLeadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <RevealOnScroll className="max-w-md w-full">
              <div className="bg-zinc-900 border-2 border-orange-600/50 rounded-[2.5rem] p-10 relative overflow-hidden shadow-[0_0_80px_rgba(234,88,12,0.2)]">
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="mb-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-500/20 mb-6">
                    <Fingerprint className="w-8 h-8 text-orange-500 animate-pulse" />
                  </div>
                  <h2 className="text-white text-2xl font-black uppercase tracking-tighter mb-2 italic">Autorização Necessária</h2>
                  <p className="text-zinc-500 text-[10px] font-mono leading-tight">IDENTIFIQUE-SE PARA RESERVAR SUA VAGA COM A ESPECIALISTA</p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Identificação_Nome</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full bg-black border border-white/10 focus:border-orange-500 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-zinc-700 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Contato_WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                      <input
                        type="tel"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-black border border-white/10 focus:border-orange-500 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-zinc-700 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-900/40 flex items-center justify-center gap-3 group uppercase text-xs tracking-[0.2em]"
                  >
                    GERAR PROTOCOLO E AGENDAR <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-2 text-[8px] text-zinc-600 font-mono font-bold tracking-widest uppercase">
                  <Lock className="w-3 h-3" /> AMBIENTE SEGURO (AES-256)
                </div>
              </div>
            </RevealOnScroll>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden ${isGlitching ? 'animate-glitch' : ''}`}>

      <div className="absolute inset-0 pointer-events-none z-50 opacity-20">
        <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px]"></div>
        <div className="w-full h-px bg-white/40 animate-scanline"></div>
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-full transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at center bottom, rgba(239, 68, 68, ${riskScore / 250}), transparent 75%)`
        }}
      ></div>

      <div className="max-w-6xl w-full relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div className="hidden lg:flex flex-col gap-4 col-span-1">
          <div className="bg-zinc-950/80 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] h-full flex flex-col shadow-inner">
            <div className="flex items-center gap-2 mb-6 text-red-500 border-b border-red-900/20 pb-4">
              <Terminal className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">AUDITOR_CONSOLE</span>
            </div>
            <div className="flex-1 space-y-2 overflow-hidden font-mono">
              {logs.map((log, i) => (
                <div key={i} className={`text-[9px] ${log.includes('CRITICAL') ? 'text-red-500 font-bold animate-pulse' : 'text-zinc-600'}`}>
                  {log}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between text-zinc-500 text-[8px] font-black uppercase mb-3">
                <span>Risk_Factor</span>
                <span>{Math.round(riskScore)}%</span>
              </div>
              <div className="w-full h-3 bg-zinc-900 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-700 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                  style={{ width: `${riskScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <RevealOnScroll key={currentStep}>
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-6 md:p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-zinc-900/60 -z-10"></div>

              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center border border-red-500/30">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h1 className="text-white font-black text-[10px] md:text-xs uppercase tracking-[0.3em] leading-none mb-1">AUDITORIA DE CRITO</h1>
                    <p className="text-red-500/80 font-mono text-[9px] font-bold uppercase tracking-widest">{auditQuestions[currentStep].category}</p>
                  </div>
                </div>
                <div className="bg-zinc-950 px-3 md:px-4 py-1 rounded-full border border-white/5">
                  <span className="text-white font-black italic text-[10px] md:text-xs uppercase tracking-widest">{currentStep + 1} / 8</span>
                </div>
              </div>

              <h2 className="text-2xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                {auditQuestions[currentStep].text}
              </h2>
              <p className="text-zinc-300 text-base md:text-xl mb-12 font-medium italic border-l-4 border-red-600 pl-6 leading-relaxed">
                {auditQuestions[currentStep].subtext}
              </p>

              <div className="grid grid-cols-1 gap-4">
                {auditQuestions[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option.risk, option.feedback)}
                    className="w-full text-left bg-zinc-950/60 hover:bg-white/10 border border-white/5 hover:border-red-500/40 p-6 md:p-8 rounded-2xl text-zinc-300 hover:text-white transition-all duration-300 group flex items-center justify-between"
                  >
                    <span className="text-lg md:text-2xl font-bold">{option.text}</span>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 transition-all">
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-14 pt-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-zinc-600" />
                  <span className="text-zinc-600 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">Sessão Criptografada (E2EE)</span>
                </div>
                <div className="flex items-center gap-3 bg-zinc-950 px-4 py-2 rounded-xl border border-white/5">
                  <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                  <span className="text-green-500/80 font-mono text-[9px] font-black">AUDIT_STRESS_ALIVE</span>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
};
