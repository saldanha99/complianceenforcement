import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5lhsdoVZJme2@ep-gentle-wind-acg2mlze-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// We use a connection pool to handle multiple connections efficiently in stateless functions
export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
});
