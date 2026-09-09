const bytesToHex = (bytes: ArrayBuffer) =>
  [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

export const createDocumentSignature = async (payload: string) => {
  const secret = Bun.env.DIGITAL_SIGNATURE_SECRET ?? Bun.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error("Missing DIGITAL_SIGNATURE_SECRET or ACCESS_TOKEN_SECRET");
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );

  return bytesToHex(signature);
};
