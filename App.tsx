
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
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Admin Imports
import { AdminLayout } from './components/Admin/Layout';
import { Dashboard } from './pages/Admin/Dashboard';
import { LeadsList } from './pages/Admin/LeadsList';
import { WhatsAppConfig } from './pages/Admin/WhatsAppConfig';
import { Login } from './pages/Admin/Login';
export type Page = 'home' | 'solucoes' | 'sobre' | 'contato' | 'quiz' |
  'expertise-financeira' | 'expertise-regulados' | 'expertise-lgpd' | 'expertise-iso';

function App() {
  // Public State
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Admin State
  const [isAdminMode, setIsAdminMode] = useState(window.location.pathname.startsWith('/admin'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

      {currentPage !== 'quiz' && <FloatingWhatsApp />}
    </div>
  );
}

export default App;
