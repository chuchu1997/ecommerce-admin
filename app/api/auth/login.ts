import { NextApiRequest, NextApiResponse } from "next";

import { comparePassword, generateToken } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Validate input
    const { name, password } = req.body;

    // Find user

    // const user = await prisma.user.findUnique({
    //   where: { name:name},
    //   include: { profile: true }
    // })\
    const user = await prismadb.user.findFirst({
      where: { name },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    // Set token in HTTP-only cookie
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
