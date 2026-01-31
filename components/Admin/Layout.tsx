import { LayoutDashboard, Users, LogOut, Smartphone } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: 'dashboard' | 'leads' | 'whatsapp';
    onNavigate: (page: 'dashboard' | 'leads' | 'whatsapp') => void;
    onLogout: () => void;
}

export function AdminLayout({ children, activePage, onNavigate, onLogout }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-10">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-tight text-white/90">Compliance<br /><span className="text-orange-500">CRM</span></h1>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activePage === 'dashboard'
                            ? 'bg-orange-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </button>

                    <button
                        onClick={() => onNavigate('leads')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activePage === 'leads'
                            ? 'bg-orange-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <Users size={20} />
                        <span className="font-medium">Leads</span>
                    </button>

                    <button
                        onClick={() => onNavigate('whatsapp')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activePage === 'whatsapp'
                            ? 'bg-orange-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <Smartphone size={20} />
                        <span className="font-medium">WhatsApp API</span>
                    </button>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
