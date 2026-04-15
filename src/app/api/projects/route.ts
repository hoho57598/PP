import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects, Project } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  return NextResponse.json(getProjects());
}

export async function POST(req: NextRequest) {
  const body: Project = await req.json();
  const projects = getProjects();

  // auto-generate slug from title
  if (!body.slug) {
    body.slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  projects.push(body);
  saveProjects(projects);
  revalidatePath("/");
  revalidatePath(`/portfolio/${body.slug}`);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const body: Project = await req.json();
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.slug === body.slug);

  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  projects[idx] = body;
  saveProjects(projects);
  revalidatePath("/");
  revalidatePath(`/portfolio/${body.slug}`);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { slug } = await req.json();
  let projects = getProjects();
  projects = projects.filter((p) => p.slug !== slug);
  saveProjects(projects);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
