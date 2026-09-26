import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { loginId, email, password } = await req.json();

    if (!loginId || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if (loginId.length < 6 || loginId.length > 12) {
      return NextResponse.json({ message: "Login ID must be between 6 and 12 characters" }, { status: 400 });
    }

    if (password.length <= 8) {
      return NextResponse.json({ message: "Password must be greater than 8 characters" }, { status: 400 });
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json({ message: "Password must contain uppercase, lowercase, and a special character" }, { status: 400 });
    }

    const existingLogin = await prisma.user.findUnique({ where: { loginId } });
    if (existingLogin) {
      return NextResponse.json({ message: "Login ID already exists" }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      // We don't have a specific name field in the exact spec UI, so we default it or use loginId
      data: { name: loginId, loginId, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User created", user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
