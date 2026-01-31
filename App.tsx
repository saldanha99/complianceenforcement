
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { RegulatoryExpertise } from './components/RegulatoryExpertise';
import { MethodArco } from './components/MethodArco';
import { Expert } from './components/Expert';
import { Testimonials } from './components/Testimonials';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { Quiz } from './components/Quiz';
import { LeadCapture } from './components/LeadCapture';
import { ExpertiseDetail } from './components/ExpertiseDetail';
import { RevealOnScroll } from './components/RevealOnScroll';

// Admin Imports
import { AdminLayout } from './components/Admin/Layout';
import { Dashboard } from './pages/Admin/Dashboard';
import { LeadsList } from './pages/Admin/LeadsList';
import { WhatsAppConfig } from './pages/Admin/WhatsAppConfig';
import { Login } from './pages/Admin/Login';
import { supabase } from './lib/supabase';

export type Page = 'home' | 'solucoes' | 'sobre' | 'contato' | 'quiz' |
  'expertise-financeira' | 'expertise-regulados' | 'expertise-lgpd' | 'expertise-iso';

function App() {
  // Public State
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Admin State
  const [isAdminMode, setIsAdminMode] = useState(window.location.pathname.startsWith('/admin'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPage, setAdminPage] = useState<'dashboard' | 'leads' | 'whatsapp'>('dashboard');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, adminPage]);

  // Check for admin route on load
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) {
      setIsAdminMode(true);
    }
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setIsAdminMode(false);
    window.history.pushState({}, '', '/');
  };

  const handleAdminNavigate = (page: 'dashboard' | 'leads' | 'whatsapp') => {
    setAdminPage(page);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdminMode(false);
    window.location.href = '/';
  };

  // If in Admin Mode
  if (isAdminMode) {
    if (!isAuthenticated) {
      return <Login onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
      <AdminLayout
        activePage={adminPage}
        onNavigate={handleAdminNavigate}
        onLogout={handleLogout}
      >
        {adminPage === 'dashboard' && <Dashboard />}
        {adminPage === 'leads' && <LeadsList />}
        {adminPage === 'whatsapp' && <WhatsAppConfig />}
      </AdminLayout>
    );
  }

  // Public Site Rendering
  const renderContent = () => {
    if (currentPage.startsWith('expertise-')) {
      const type = currentPage.replace('expertise-', '') as any;
      return <ExpertiseDetail type={type} onNavigate={navigateTo} />;
    }

    switch (currentPage) {
      case 'quiz':
        return <Quiz onBack={() => navigateTo('home')} />;
      case 'solucoes':
        return (
          <div className="pt-20">
            <Services />
            <RegulatoryExpertise onNavigate={navigateTo} />
            <LeadCapture />
            <CtaSection onStartQuiz={() => navigateTo('quiz')} />
          </div>
        );
      case 'sobre':
        return (
          <div className="pt-20">
            <Expert onNavigate={navigateTo} />
            <MethodArco />
            <Testimonials />
          </div>
        );
      case 'contato':
        return (
          <div className="pt-20">
            <LeadCapture />
            <div className="py-24 bg-white text-center">
              <RevealOnScroll>
                <span className="text-orange-600 font-black uppercase text-xs tracking-widest mb-4 inline-block">Canais Diretos</span>
                <h2 className="text-4xl md:text-5xl font-black mb-12 text-slate-900 tracking-tighter">Fale Conosco</h2>
                <div className="flex justify-center gap-8 flex-wrap max-w-7xl mx-auto px-4">
                  <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 w-full max-w-sm shadow-xl shadow-slate-100/50 hover:border-orange-500 transition-all">
                    <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-orange-600">Comercial & WhatsApp</h3>
                    <a href="https://wa.me/5512996590801" target="_blank" className="font-bold text-2xl text-slate-900 hover:text-orange-600 transition-colors">+55 12 99659-0801</a>
                  </div>
                  <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 w-full max-w-sm shadow-xl shadow-slate-100/50 hover:border-orange-500 transition-all">
                    <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-orange-600">E-mail Corporativo</h3>
                    <a href="mailto:comercial@complianceenforcement.com.br" className="font-bold text-xl text-slate-900 hover:text-orange-600 transition-colors break-all">comercial@complianceenforcement.com.br</a>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        );
      default:
        return (
          <>
            <Hero onStartQuiz={() => navigateTo('quiz')} />
            <Services />
            <RegulatoryExpertise onNavigate={navigateTo} />
            <MethodArco />
            <Expert onNavigate={navigateTo} />
            <Testimonials />
            <LeadCapture />
            <CtaSection onStartQuiz={() => navigateTo('quiz')} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {currentPage !== 'quiz' && <Navbar onNavigate={navigateTo} currentPage={currentPage} />}
      <main>
        {renderContent()}
      </main>
      {currentPage !== 'quiz' && <Footer onStartQuiz={() => navigateTo('quiz')} onNavigate={navigateTo} />}

      {currentPage !== 'quiz' && (
        <a
          href="https://wa.me/5512996590801"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </a>
      )}
    </div>
  );
}

export default App;
