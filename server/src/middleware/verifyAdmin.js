import 'dotenv/config';

// Middleware to verify that the 'key' parameter exists and matches the admin secret
export default function verifyAdmin(req, res, next) {
  const key = req.body?.key;
  if (!key || key !== process.env.ADMIN_SECRET) {
    // Deny access with a 403 Forbidden response if verification fails.
    return res.status(403).json({ message: "Unauthorized action" });
  }
  next();
}