import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { action, email, otp, newPassword } = await req.json();

  if (action === "send_otp") {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    
    // Simulate generating and sending OTP (in real app, email this)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SIMULATED EMAIL] OTP for ${email} is ${generatedOtp}`);
    
    await prisma.user.update({
      where: { email },
      data: { otp: generatedOtp }
    });

    return NextResponse.json({ message: "OTP sent (check console)" });
  } 
  
  if (action === "reset") {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, otp: null }
    });

    return NextResponse.json({ message: "Password reset successful" });
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
