/**
 * Cryptographic utility for FARMATRIX Enterprise Blockchain Integrity
 * Implements deterministic canonical JSON serialization and SHA-256 hashing.
 */

export async function sha256(message: string): Promise<string> {
  // Use Web Crypto API available in modern Node.js and modern browsers
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return "0x" + hashHex;
}

/**
 * Creates a deterministic canonical representation of batch payload
 */
export function canonicalizePayload(obj: Record<string, unknown>): string {
  const sortedKeys = Object.keys(obj).sort();
  const canonicalObj: Record<string, unknown> = {};
  for (const key of sortedKeys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      canonicalObj[key] = obj[key];
    }
  }
  return JSON.stringify(canonicalObj);
}

/**
 * Generates mock or real NEAR testnet transaction hash
 */
export function generateNearTxHash(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
