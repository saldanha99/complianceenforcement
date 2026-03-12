import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../utils/db.js';
import { evolutionApiServer } from '../utils/evolution.js';

// Internal Notification Group
// To figure out the real Group JID, check evolution API docs or list groups.
// You have to overwrite this via Vercel Environment Variables later.
const LEAD_ALERT_GROUP_JID = process.env.LEAD_ALERT_GROUP_JID || '12036304561829@g.us'; 

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

    // 2. Automations (Evolution API)
    // Only fire if we actually got a phone number
    if (phone) {
      const firstName = name.split(' ')[0];
      
      // A. Message to the Lead
      const welcomeText = `Olá *${firstName}*! Tudo bem?\n\nAqui é da *Compliance Enforcement Consultoria*.\nRecebemos o seu contato por meio do nosso site e gostaríamos de entender melhor a sua necessidade.\n\nQual o melhor horário para conversarmos rapidamente hoje ou amanhã?`;
      await evolutionApiServer.sendTextMessage(phone, welcomeText).catch(e => console.error('Failed to message WP Lead:', e));

      // B. Alert to Internal Group
      const alertMsg = `🚀 *NOVO LEAD DO WORDPRESS*\n\n*Nome:* ${name}\n*Empresa:* ${company}\n*WhatsApp:* wa.me/55${phone}\n*E-mail:* ${email}\n\n*Mensagem:* ${notes}`;
      await evolutionApiServer.sendTextMessage(LEAD_ALERT_GROUP_JID, alertMsg).catch(e => console.error('Failed to send group alert:', e));
    }

    return res.status(200).json({ success: true, lead });

  } catch (error: any) {
    console.error('WP Webhook error:', error);
    return res.status(500).json({ message: 'Webhook processing failed', detail: String(error) });
  }
}
