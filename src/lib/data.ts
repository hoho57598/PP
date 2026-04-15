import fs from "fs";
import path from "path";

export interface Project {
  slug: string;
  title: string;
  description: string;
  gradient: string;
  thumbnail: string;
  tags: string[];
  year: string;
  detail: string;
  role: string;
  images: string[];
}

export interface ResumeEntry {
  period: string;
  title: string;
  company: string;
  description: string;
}

export interface Skill {
  name: string;
  color: string;
}

export interface Resume {
  intro: string;
  experience: ResumeEntry[];
  education: ResumeEntry[];
  skills: Skill[];
}

const DATA_DIR = path.join(process.cwd(), "src/data");

export function getProjects(): Project[] {
  const raw = fs.readFileSync(path.join(DATA_DIR, "projects.json"), "utf-8");
  return JSON.parse(raw);
}

export function saveProjects(projects: Project[]) {
  fs.writeFileSync(
    path.join(DATA_DIR, "projects.json"),
    JSON.stringify(projects, null, 2),
    "utf-8"
  );
}

export function getResume(): Resume {
  const raw = fs.readFileSync(path.join(DATA_DIR, "resume.json"), "utf-8");
  return JSON.parse(raw);
}

export function saveResume(resume: Resume) {
  fs.writeFileSync(
    path.join(DATA_DIR, "resume.json"),
    JSON.stringify(resume, null, 2),
    "utf-8"
  );
}
