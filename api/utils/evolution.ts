// Configuração da Evolution API
const EVOLUTION_API_URL = 'https://api.2b.app.br';
const EVOLUTION_API_KEY = 'd037768b3d06382756a0d9edecf3e40e';

// Exportando os métodos
export const evolutionApiServer = {
  /**
   * Envia uma mensagem de texto simples pelo WhatsApp usando a Evolution
   */
  async sendTextMessage(
    phoneOrJid: string,
    text: string,
    instanceName: string = 'ComplianceThais'
  ) {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
      console.warn('EVOLUTION_API url or key not loaded in backend');
      return null;
    }

    try {
      let number = phoneOrJid;

      // Se não for JID de grupo (que contém @g.us), aplicamos a formatação de telefone BR
      if (!number.includes('@g.us')) {
        const formattedPhone = number.replace(/\D/g, '');
        number = formattedPhone.startsWith('55') ? formattedPhone : `55${formattedPhone}`;
      }

      console.log(`[Evolution] Enviando mensagem para ${number} via instancia ${instanceName}`);

      const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number: number,
          options: {
            delay: 1500, // delay de 1.5s para simular digitação
            presence: 'composing',
          },
          textMessage: {
            text: text,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`[Evolution] Falha na request: ${response.status} - ${errorData}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[Evolution] Erro fatal ao tentar enviar WhatsApp:', error);
      return null;
    }
  },
};
