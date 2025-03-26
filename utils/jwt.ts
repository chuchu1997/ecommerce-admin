import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (!decoded?.exp) return true;

    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
}
