import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { getOrCreateUser } from '../services/cosmos.js';

const TENANT_ID = process.env.AZURE_AD_TENANT_ID;
const CLIENT_ID = process.env.AZURE_AD_CLIENT_ID;

const jwksClient = jwksRsa({
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 3_600_000,
  jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`,
});

function getSigningKey(header) {
  return new Promise((resolve, reject) => {
    jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) return reject(err);
      resolve(key.getPublicKey());
    });
  });
}

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded?.header?.kid) return res.status(401).json({ message: 'Invalid token format.' });

    const publicKey = await getSigningKey(decoded.header);

    const payload = jwt.verify(token, publicKey, {
      audience: CLIENT_ID,
      issuer: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
    });

    const oid = payload.oid;
    const email = payload.preferred_username || payload.email || '';
    const name = payload.name || email;

    const userDoc = await getOrCreateUser({ oid, email, name });
    req.user = { id: oid, email, name, role: userDoc.role };

    next();
  } catch (err) {
    console.error('[auth]', err.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated.' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Insufficient permissions.' });
    next();
  };
}
