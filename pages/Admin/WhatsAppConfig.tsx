import React, { useState, useEffect } from 'react';
import { evolutionApi } from '../../services/evolutionApi';
import { QrCode, RefreshCcw, Wifi, WifiOff, Trash2, Smartphone, Download } from 'lucide-react';

export function WhatsAppConfig() {
    const [instance, setInstance] = useState<any>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [debugLog, setDebugLog] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // State for importing existing instance
    const [customInstanceName, setCustomInstanceName] = useState('');
    const [activeInstanceName, setActiveInstanceName] = useState('compliance_bot');

    useEffect(() => {
        checkStatus(activeInstanceName);
    }, []);

    const checkStatus = async (nameToCheck: string = activeInstanceName) => {
        setLoading(true);
        setError(null);
        setDebugLog(prev => prev + `\nChecking status for: ${nameToCheck}...`);

        try {
            const response = await evolutionApi.fetchInstances();
            setDebugLog(prev => prev + '\nFetch response: ' + JSON.stringify(response));

            let found = null;
            let instances: any[] = [];

            if (Array.isArray(response)) {
                instances = response;
            } else if (response && Array.isArray(response.data)) {
                instances = response.data;
            } else if (response && typeof response === 'object') {
                instances = Object.values(response);
            }

            // Safe find with flexible property matching
            found = instances.find((i: any) => {
                const iName = i?.instance?.instanceName || i?.instanceName || i?.name;
                return iName === nameToCheck;
            });

            if (found) {
                setInstance(found.instance || found);
                setDebugLog(prev => prev + `\nFound instance data: ${JSON.stringify(found)}`);
                // If we found it, make sure we update our active name to match if it was a search
                if (nameToCheck !== activeInstanceName) {
                    setActiveInstanceName(nameToCheck);
                }
            } else {
                setInstance(null);
                setDebugLog(prev => prev + `\nInstance ${nameToCheck} NOT found in list.`);
            }
        } catch (err: any) {
            console.error(err);
            setError('Falha ao buscar status: ' + (err.message || 'Erro desconhecido'));
            setDebugLog(prev => prev + '\nError: ' + (err.message || 'Unknown'));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInstance = async () => {
        setLoading(true);
        setError(null);
        try {
            setDebugLog(prev => prev + `\nCreating instance: ${activeInstanceName}...`);
            const res = await evolutionApi.createInstance(activeInstanceName);
            setDebugLog(prev => prev + '\nCreate response: ' + JSON.stringify(res));

            if (res?.qrcode?.base64) {
                setQrCode(res.qrcode.base64);
            } else if (res?.base64) {
                setQrCode(res.base64);
            } else if (res?.instance || res?.count?.id || res?.hash) {
                // Already created, try to connect
                handleConnect();
            } else {
                if (res.error) throw new Error(res.error);
            }

            setTimeout(() => checkStatus(activeInstanceName), 1000);
        } catch (err: any) {
            console.error(err);
            setError('Erro ao criar instância: ' + (err.message || 'Erro API'));
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        setLoading(true);
        setQrCode(null);
        try {
            const res = await evolutionApi.connectInstance(activeInstanceName);
            setDebugLog(prev => prev + '\nConnect response: ' + JSON.stringify(res));

            if (res?.base64) {
                setQrCode(res.base64);
            } else if (res?.qrcode?.base64) {
                setQrCode(res.qrcode.base64);
            }
        } catch (err: any) {
            console.error(err);
            setError('Erro ao gerar QR Code: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (!confirm('Tem certeza? Isso irá desconectar o WhatsApp.')) return;

        setLoading(true);
        try {
            await evolutionApi.logoutInstance(activeInstanceName);
            setInstance(null);
            setQrCode(null);
            setTimeout(() => checkStatus(activeInstanceName), 1000);
        } catch (err: any) {
            console.error(err);
            setError('Erro ao desconectar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImportInstance = () => {
        if (!customInstanceName.trim()) return;
        // Update active instance first, then check status
        setActiveInstanceName(customInstanceName);
        checkStatus(customInstanceName);
        setCustomInstanceName('');
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Configuração WhatsApp</h2>
                <p className="text-slate-500">Gerencie a conexão da Evolution API.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
                    <WifiOff size={20} />
                    <span className="break-all">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${instance?.status === 'open' || instance?.connectionStatus === 'open' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">
                                        {instance?.status === 'open' || instance?.connectionStatus === 'open' ? 'Conectado' : 'Desconectado'}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Instância: <span className="font-mono text-slate-700 bg-slate-100 px-1 rounded">{activeInstanceName}</span>
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => checkStatus(activeInstanceName)}
                                disabled={loading}
                                className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                                title="Atualizar Status"
                            >
                                <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        {!instance && !qrCode && (
                            <div className="text-center py-4">
                                <button
                                    onClick={handleCreateInstance}
                                    disabled={loading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/20 mb-4"
                                >
                                    {loading ? 'Processando...' : 'Criar Nova Instância'}
                                </button>
                            </div>
                        )}

                        {qrCode && (
                            <div className="flex flex-col items-center gap-6 py-4">
                                <div className="text-center">
                                    <p className="mb-4 text-sm font-bold text-slate-700 uppercase tracking-widest">Escaneie o QR Code</p>
                                    <div className="p-4 bg-white border-2 border-slate-900 rounded-xl inline-block">
                                        <img src={qrCode} alt="QR Code WhatsApp" className="w-64 h-64" />
                                    </div>
                                    <button
                                        onClick={() => checkStatus(activeInstanceName)}
                                        className="block mx-auto mt-4 text-sm text-orange-600 hover:underline"
                                    >
                                        Já escaneou? Atualizar
                                    </button>
                                </div>
                            </div>
                        )}

                        {instance && instance.status !== 'open' && instance.connectionStatus !== 'open' && !qrCode && (
                            <div className="text-center py-4">
                                <p className="text-slate-600 mb-4">Instância existe, mas não está conectada.</p>
                                <button
                                    onClick={handleConnect}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition-all mx-auto"
                                >
                                    <QrCode size={20} />
                                    {loading ? 'Gerando...' : 'Gerar QR Code'}
                                </button>
                            </div>
                        )}

                        {instance && (instance.status === 'open' || instance.connectionStatus === 'open') && (
                            <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-green-800">
                                    <Wifi size={20} />
                                    <span className="font-medium">Online</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                                >
                                    <Trash2 size={16} />
                                    Desconectar
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Download size={20} className="text-slate-400" />
                            Importar Instância Existente
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Já tem uma instância criada na Evolution API? Digite o nome dela abaixo para conectar.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Nome da instância (ex: minha-empresa)"
                                value={customInstanceName}
                                onChange={(e) => setCustomInstanceName(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500"
                            />
                            <button
                                onClick={handleImportInstance}
                                disabled={!customInstanceName}
                                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 disabled:opacity-50"
                            >
                                Conectar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Debug Panel */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-fit">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Logs de Depuração</h4>
                    <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap overflow-auto max-h-[500px] bg-white p-2 rounded border border-slate-100">
                        {debugLog || 'Aguardando logs...'}
                    </pre>
                </div>
            </div>
        </div>
    );
}
