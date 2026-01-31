const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL;
const EVOLUTION_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY;

export const evolutionApi = {
    async sendTextMessage(phone: string, text: string, instanceName: string = 'compliance_bot') {
        if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) return;

        try {
            // Format phone: remove non-digits
            const formattedPhone = phone.replace(/\D/g, '');
            const number = formattedPhone.startsWith('55') ? formattedPhone : `55${formattedPhone}`;

            const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${instanceName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': EVOLUTION_API_KEY
                },
                body: JSON.stringify({
                    number: number,
                    options: {
                        delay: 1200,
                        presence: 'composing'
                    },
                    textMessage: {
                        text: text
                    }
                })
            });

            return await response.json().catch(() => null);
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            return null;
        }
    },

    async createInstance(instanceName: string = 'compliance_bot') {
        try {
            const response = await fetch(`${EVOLUTION_API_URL}/instance/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': EVOLUTION_API_KEY
                },
                body: JSON.stringify({
                    instanceName: instanceName,
                    qrcode: true,
                    integration: "WHATSAPP-BAILEYS"
                })
            });
            return await response.json();
        } catch (e) {
            console.error(e);
            throw e;
        }
    },

    async connectInstance(instanceName: string = 'compliance_bot') {
        const response = await fetch(`${EVOLUTION_API_URL}/instance/connect/${instanceName}`, {
            method: 'GET',
            headers: {
                'apikey': EVOLUTION_API_KEY
            }
        });
        return await response.json();
    },

    async logoutInstance(instanceName: string = 'compliance_bot') {
        const response = await fetch(`${EVOLUTION_API_URL}/instance/logout/${instanceName}`, {
            method: 'DELETE',
            headers: {
                'apikey': EVOLUTION_API_KEY
            }
        });
        return await response.json();
    },

    async fetchInstances() {
        try {
            const response = await fetch(`${EVOLUTION_API_URL}/instance/fetchInstances`, {
                method: 'GET',
                headers: {
                    'apikey': EVOLUTION_API_KEY
                }
            });
            return await response.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    }
};
