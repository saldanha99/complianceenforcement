import { Pool } from 'pg';

const connectionString = 'postgresql://neondb_owner:npg_5lhsdoVZJme2@ep-gentle-wind-acg2mlze-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
});
