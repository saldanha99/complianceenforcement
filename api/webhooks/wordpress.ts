import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../utils/db.js';
import { evolutionApiServer } from '../utils/evolution.js';

// Internal Notification Group
// Extracted via Evolution API from invite link provided by user
const LEAD_ALERT_GROUP_JID = process.env.LEAD_ALERT_GROUP_JID || '120363406751423640@g.us'; 

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for external webhooks
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    
    // Fallback parsing depending on how WordPress sends data (JSON vs URL-encoded)
    const name = data.name || data.first_name || 'Lead WP';
    const email = data.email || 'Não informado';
    const phoneOrig = data.phone || data.telefone || '';
    const company = data.company || data.empresa || 'Não informada';
    const notes = data.message || data.mensagem || 'Origem: Blog WordPress';
    
    // Force numbers only for formatting
    const phone = phoneOrig.replace(/\D/g, '');

    // 1. Insert into database
    const query = `
      INSERT INTO leads (name, email, phone, company, status, notes, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [name, email, phoneOrig, company, 'new', notes, ['wordpress-blog']];
    const result = await pool.query(query, values);
    const lead = result.rows[0];

    // Return early to WP so it doesn't hang or queue
    res.status(200).json({ success: true, lead });

    // 2. Automations (Evolution API)
    // Fire and forget in the background, but wrapped in a promise Vercel awaits viawaitUntil if available
    if (phone) {
      const firstName = name.split(' ')[0];
      
      const welcomeText = `Olá *${firstName}*! Tudo bem?\n\nAqui é da *Compliance Enforcement Consultoria*.\nRecebemos o seu contato através do nosso site e gostaríamos de entender melhor o cenário da sua empresa.\n\nQual o melhor horário para conversarmos rapidamente hoje ou amanhã?`;
      const alertMsg = `Veio pelo WordPress!\n*NOVO LEAD* 📢\n\n*Nome:* ${name}\n*WhatsApp:* https://wa.me/55${phone}\n*Empresa:* ${company}`;
      
      const fireAutomations = async () => {
        try {
          await Promise.all([
            evolutionApiServer.sendTextMessage(phone, welcomeText),
            evolutionApiServer.sendTextMessage(LEAD_ALERT_GROUP_JID, alertMsg)
          ]);
        } catch(e) {
          console.error('Failed Evolution API WP hook:', e);
        }
      };

      // Vercel waitUntil allows the lambda to continue running after returning the response
      if (typeof (req as any).waitUntil === 'function') {
        (req as any).waitUntil(fireAutomations());
      } else {
        fireAutomations();
      }
    }

  } catch (error: any) {
    console.error('WP Webhook error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Webhook processing failed', detail: String(error) });
    }
  }
}
