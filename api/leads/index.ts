const { pool } = require('../utils/db');
const { verifyToken } = require('../utils/auth');

module.exports = async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST: Create a new lead
  if (req.method === 'POST') {
    const { name, email, phone, company, quiz_results, status, notes, tags } = req.body;

    try {
      const query = `
        INSERT INTO leads (name, email, phone, company, quiz_results, status, notes, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [name, email, phone, company, JSON.stringify(quiz_results || null), status || 'new', notes || null, tags || []];
      
      const result = await pool.query(query, values);
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Insert lead error:', error);
      return res.status(500).json({ message: 'Error inserting lead' });
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
    } catch (error) {
      console.error('Error fetching leads:', error);
      return res.status(500).json({ message: 'Error fetching leads' });
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
      const values = [];
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

      // remove trailing comma and space
      query = query.slice(0, -2);
      
      query += ` WHERE id = $${counter} RETURNING *`;
      values.push(id);

      const result = await pool.query(query, values);
      
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Update lead error:', error);
      return res.status(500).json({ message: 'Error updating lead' });
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
    } catch (error) {
      console.error('Delete lead error:', error);
      return res.status(500).json({ message: 'Error deleting lead' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
