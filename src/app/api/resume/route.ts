import { NextRequest, NextResponse } from "next/server";
import { getResume, saveResume } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  return NextResponse.json(getResume());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  saveResume(body);
  revalidatePath("/resume");
  return NextResponse.json({ ok: true });
}
