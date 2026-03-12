import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'compliance_super_secret_key_2026';

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
