import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../utils/db.js';
import { verifyToken } from '../utils/auth.js';
import { evolutionApiServer } from '../utils/evolution.js';

const LEAD_ALERT_GROUP_JID = process.env.LEAD_ALERT_GROUP_JID || '120363406751423640@g.us';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST: Create a new lead (public)
  if (req.method === 'POST') {
    const { name, email, phone, company, quiz_results, status, notes, tags } = req.body;

    try {
      const query = `
        INSERT INTO leads (name, email, phone, company, quiz_results, status, notes, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      // Safely ensure phone is just digits before inserting and formatting
      const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
      const values = [name, email || 'sem-email@whatsapp-widget.com', cleanPhone, company, JSON.stringify(quiz_results || null), status || 'new', notes || null, tags || []];
      
      const result = await pool.query(query, values);
      const insertedLead = result.rows[0];

      // Async WhatsApp trigger (fire and forget)
      if (phone && name) {
        const firstName = name.split(' ')[0];
        
        // Message to the Lead
        const isFromWidget = tags && tags.includes('whatsapp-widget');
        
        let welcomeText = `Olá *${firstName}*! Tudo bem?\n\nSou a Taís da *Compliance Enforcement Consultoria*.\nRecebemos o seu contato através da nossa calculadora no site e gostaríamos de entender melhor o cenário da sua empresa.\n\nQual o melhor horário para conversarmos rapidamente hoje ou amanhã?`;
        
        if (isFromWidget) {
          welcomeText = `Olá *${firstName}*! Tudo bem?\n\nSou a Taís da *Compliance Enforcement Consultoria*.\nRecebemos o seu contato através do nosso site e gostaríamos de entender melhor o cenário da sua empresa.\n\nQual o melhor horário para conversarmos rapidamente hoje ou amanhã?`;
        }

        const originText = isFromWidget ? 'Veio pelo formulário!' : 'Veio pelo Quiz!';
        const alertMsg = `${originText}\n*NOVO LEAD* 📢\n\n*Nome:* ${name}\n*WhatsApp:* https://wa.me/55${cleanPhone}\n*Empresa:* ${company || 'Não informada'}`;
        
        const fireAutomations = async () => {
          try {
            await Promise.all([
              evolutionApiServer.sendTextMessage(cleanPhone, welcomeText),
              evolutionApiServer.sendTextMessage(LEAD_ALERT_GROUP_JID, alertMsg)
            ]);
          } catch(e) {
            console.error('Failed Evolution API trigger:', e);
          }
        };

        if (typeof (req as any).waitUntil === 'function') {
          (req as any).waitUntil(fireAutomations());
        } else {
          fireAutomations();
        }
      }

      return res.status(201).json(insertedLead);
    } catch (error: any) {
      console.error('Insert lead error:', error);
      return res.status(500).json({ message: 'Error inserting lead', detail: error.message });
    }
  }

  // For GET, PUT, PATCH, DELETE we need authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // GET: Read all leads
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      return res.status(500).json({ message: 'Error fetching leads', detail: error.message });
    }
  }

  // PATCH: Update a lead's status/notes
  if (req.method === 'PATCH') {
    const { id, status, notes, tags } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Lead ID is required' });
    }

    try {
      let query = 'UPDATE leads SET ';
      const values: any[] = [];
      let counter = 1;

      if (status !== undefined) {
        query += `status = $${counter}, `;
        values.push(status);
        counter++;
      }
      
      if (notes !== undefined) {
        query += `notes = $${counter}, `;
        values.push(notes);
        counter++;
      }

      if (tags !== undefined) {
        query += `tags = $${counter}, `;
        values.push(tags);
        counter++;
      }

      if (values.length === 0) {
        return res.status(400).json({ message: 'Nothing to update' });
      }

      query = query.slice(0, -2);
      query += ` WHERE id = $${counter} RETURNING *`;
      values.push(id);

      const result = await pool.query(query, values);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      return res.status(200).json(result.rows[0]);
    } catch (error: any) {
      console.error('Update lead error:', error);
      return res.status(500).json({ message: 'Error updating lead', detail: error.message });
    }
  }

  // DELETE: delete a lead
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Lead ID is required' });
    }

    try {
      const result = await pool.query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      return res.status(200).json(result.rows[0]);
    } catch (error: any) {
      console.error('Delete lead error:', error);
      return res.status(500).json({ message: 'Error deleting lead', detail: error.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
