import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = 'postgresql://neondb_owner:npg_5lhsdoVZJme2@ep-gentle-wind-acg2mlze-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new pg.Client({ connectionString });

async function setup() {
  try {
    await client.connect();
    console.log('Connected to Neon database');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created users table');

    // Create leads table (removing RLS policies since we're using a backend API now)
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.leads (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        name TEXT,
        email TEXT,
        phone TEXT,
        company TEXT,
        quiz_results JSONB,
        status TEXT DEFAULT 'new',
        notes TEXT,
        tags TEXT[]
      );
    `);
    console.log('Created leads table');

    // Insert default admin user
    const checkAdmin = await client.query(`SELECT id FROM public.users WHERE email = $1`, ['admin@compliance.com']);
    
    if (checkAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        `INSERT INTO public.users (email, password) VALUES ($1, $2)`,
        ['admin@compliance.com', hashedPassword]
      );
      console.log('Created default admin user (admin@compliance.com / admin123)');
    } else {
      console.log('Admin user already exists');
    }

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

setup();
