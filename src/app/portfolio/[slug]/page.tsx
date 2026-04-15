import { getProjects } from "@/lib/data";
import { notFound } from "next/navigation";
import PortfolioDetail from "./PortfolioDetail";

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = projects.indexOf(project);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return <PortfolioDetail project={project} prev={prev} next={next} />;
}
