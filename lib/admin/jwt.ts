import { SignJWT, jwtVerify } from "jose";
import { ADMIN_SESSION_MAX_AGE_SEC } from "@/lib/admin/session-cookie";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET must be set (minimum 16 characters)");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminSessionJwt(subject = "admin") {
  return new SignJWT({ role: "admin", sub: subject })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SEC}s`)
    .sign(getSecret());
}

export async function verifyAdminSessionJwt(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload.role === "admin";
}
