import { getResume } from "@/lib/data";
import ResumeContent from "./ResumeContent";

export const dynamic = "force-dynamic";

export default function ResumePage() {
  const resume = getResume();
  return <ResumeContent resume={resume} />;
}
