/**
 * Decodes a JWT token and extracts the payload.
 * Note: This only decodes the token, it does NOT verify the signature.
 * Signature verification should be done on the backend.
 */
export function decodeJWT(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode from base64
    const decoded = atob(padded);
    
    // Parse JSON
    const parsed = JSON.parse(decoded);
    return parsed;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Extracts email and role from a JWT token
 */
export function extractEmailAndRole(token: string | null): { email: string | null; role: string | null } {
  if (!token) {
    return { email: null, role: null };
  }

  const payload = decodeJWT(token);
  if (!payload) {
    return { email: null, role: null };
  }

  // Common JWT claim names for email
  const email = payload.email || 
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
    payload.sub || 
    null;

  // Role can be in different formats
  const role = payload.role || 
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    payload.roles || 
    null;

  return { email, role };
}
