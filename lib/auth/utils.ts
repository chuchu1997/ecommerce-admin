import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "@prisma/client";

// import { User } from "@prisma/client";

// Hash password


export async function hashPassword(password: string): Promise<string> {

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions


  return await bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: Partial<User>): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "",
    { expiresIn: "10d" } // Token will expire in 10 days
  );
}

// Verify JWT token
export function verifyToken(token: string){
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "");
  } catch (error) {
    console.log(error)
    return null;
  }
}
