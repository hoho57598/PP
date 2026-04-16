"use client";
import { useState, useEffect, useRef } from "react";

interface Project {
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
  figmaUrl?: string;
}

interface ResumeEntry {
  period: string;
  title: string;
  company: string;
  description: string;
}

interface Skill {
  name: string;
  color: string;
}

interface Resume {
  intro: string;
  experience: ResumeEntry[];
  education: ResumeEntry[];
  skills: Skill[];
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "0000";
const ACCENT_COLORS = ["#20FFA6", "#49FFB6", "#5249FF", "#4242FF", "#94FF42"];

const emptyProject: Project = {
  slug: "",
  title: "",
  description: "",
  gradient: "linear-gradient(135deg, #20FFA6, #5249FF)",
  thumbnail: "",
  tags: [],
  year: new Date().getFullYear().toString(),
  detail: "",
  role: "",
  images: [],
  figmaUrl: "",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState<"portfolio" | "resume">("portfolio");
  const [projects, setProjects] = useState<Project[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth")) setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/projects").then((r) => r.json()).then(setProjects);
    fetch("/api/resume").then((r) => r.json()).then(setResume);
  }, [authed]);

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("admin_auth", "1");
    } else {
      showToast("비밀번호가 틀렸습니다");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-heading text-3xl font-bold mb-2">Admin</h1>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
            비밀번호를 입력하세요
          </p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4 text-center"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
            placeholder="Password"
            autoFocus
          />
          <button
            onClick={login}
            className="w-full px-4 py-3 bg-mint text-black rounded-xl text-sm font-medium hover:bg-mint-light transition-colors cursor-pointer"
          >
            로그인
          </button>
          {toast && (
            <p className="text-red-400 text-sm mt-4">{toast}</p>
          )}
        </div>
      </div>
    );
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

  // ─── Portfolio handlers ───

  async function saveProject() {
    if (!editing) return;
    setSaving(true);
    const method = isNew ? "POST" : "PUT";
    await fetch("/api/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const updated = await fetch("/api/projects").then((r) => r.json());
    setProjects(updated);
    setEditing(null);
    setSaving(false);
    showToast(isNew ? "프로젝트 추가됨" : "프로젝트 저장됨");
  }

  async function deleteProject(slug: string) {
    if (!confirm("정말 삭제할까요?")) return;
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const updated = await fetch("/api/projects").then((r) => r.json());
    setProjects(updated);
    showToast("삭제됨");
  }

  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "images"
  ) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    if (type === "thumbnail") {
      setEditing({ ...editing, thumbnail: url });
    } else {
      setEditing({ ...editing, images: [...editing.images, url] });
    }
    showToast("이미지 업로드됨");
  }

  // ─── Resume handlers ───

  async function saveResume() {
    if (!resume) return;
    setSaving(true);
    await fetch("/api/resume", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resume),
    });
    setSaving(false);
    showToast("이력서 저장됨");
  }

  function updateEntry(
    section: "experience" | "education",
    idx: number,
    field: keyof ResumeEntry,
    value: string
  ) {
    if (!resume) return;
    const arr = [...resume[section]];
    arr[idx] = { ...arr[idx], [field]: value };
    setResume({ ...resume, [section]: arr });
  }

  function addEntry(section: "experience" | "education") {
    if (!resume) return;
    setResume({
      ...resume,
      [section]: [
        ...resume[section],
        { period: "", title: "", company: "", description: "" },
      ],
    });
  }

  function removeEntry(section: "experience" | "education", idx: number) {
    if (!resume) return;
    setResume({
      ...resume,
      [section]: resume[section].filter((_, i) => i !== idx),
    });
  }

  // ─── Styles ───

  const input =
    "w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors";
  const inputStyle = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
  };
  const label = "block text-xs uppercase tracking-wider mb-1.5";
  const labelStyle = { color: "var(--muted)" };

  return (
    <div className="pt-20 pb-20 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-heading text-3xl font-bold">Admin</h1>
          <a
            href="/"
            className="text-sm text-mint hover:underline"
          >
            &larr; 사이트 보기
          </a>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-lg mb-8 w-fit"
          style={{ background: "var(--card)" }}
        >
          {(["portfolio", "resume"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize cursor-pointer"
              style={{
                background: tab === t ? "#20FFA6" : "transparent",
                color: tab === t ? "#000" : "var(--muted)",
              }}
            >
              {t === "portfolio" ? "Portfolio" : "Resume"}
            </button>
          ))}
        </div>

        {/* ─── Portfolio Tab ─── */}
        {tab === "portfolio" && (
          <div>
            {!editing ? (
              <>
                <button
                  onClick={() => {
                    setEditing({ ...emptyProject });
                    setIsNew(true);
                  }}
                  className="mb-6 px-4 py-2 bg-mint text-black rounded-lg text-sm font-medium hover:bg-mint-light transition-colors cursor-pointer"
                >
                  + 새 프로젝트
                </button>

                <div className="space-y-3">
                  {projects.map((p) => (
                    <div
                      key={p.slug}
                      className="flex items-center gap-4 p-4 rounded-xl transition-colors"
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        className="w-16 h-10 rounded-lg flex-shrink-0"
                        style={{
                          background: p.thumbnail
                            ? `url(${p.thumbnail}) center/cover`
                            : p.gradient,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {p.title}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--muted)" }}
                        >
                          {p.description}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditing({ ...p });
                            setIsNew(false);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                          style={{
                            border: "1px solid var(--border)",
                            color: "var(--foreground)",
                          }}
                        >
                          편집
                        </button>
                        <button
                          onClick={() => deleteProject(p.slug)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 cursor-pointer"
                          style={{ border: "1px solid #ef444440" }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* ─── Edit form ─── */
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold">
                    {isNew ? "새 프로젝트" : `편집: ${editing.title}`}
                  </h2>
                  <button
                    onClick={() => setEditing(null)}
                    className="text-sm cursor-pointer"
                    style={{ color: "var(--muted)" }}
                  >
                    취소
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={label} style={labelStyle}>
                      제목
                    </label>
                    <input
                      className={input}
                      style={inputStyle}
                      value={editing.title}
                      onChange={(e) =>
                        setEditing({ ...editing, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={label} style={labelStyle}>
                      Slug
                    </label>
                    <input
                      className={input}
                      style={inputStyle}
                      value={editing.slug}
                      onChange={(e) =>
                        setEditing({ ...editing, slug: e.target.value })
                      }
                      placeholder="auto-generated if empty"
                    />
                  </div>
                  <div>
                    <label className={label} style={labelStyle}>
                      연도
                    </label>
                    <input
                      className={input}
                      style={inputStyle}
                      value={editing.year}
                      onChange={(e) =>
                        setEditing({ ...editing, year: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={label} style={labelStyle}>
                      역할
                    </label>
                    <input
                      className={input}
                      style={inputStyle}
                      value={editing.role}
                      onChange={(e) =>
                        setEditing({ ...editing, role: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className={label} style={labelStyle}>
                    한줄 설명
                  </label>
                  <input
                    className={input}
                    style={inputStyle}
                    value={editing.description}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className={label} style={labelStyle}>
                    상세 설명
                  </label>
                  <textarea
                    className={`${input} min-h-[100px] resize-y`}
                    style={inputStyle}
                    value={editing.detail}
                    onChange={(e) =>
                      setEditing({ ...editing, detail: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className={label} style={labelStyle}>
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    className={input}
                    style={inputStyle}
                    value={editing.tags.join(", ")}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>

                <div>
                  <label className={label} style={labelStyle}>
                    그라데이션 CSS
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      className={`${input} flex-1`}
                      style={inputStyle}
                      value={editing.gradient}
                      onChange={(e) =>
                        setEditing({ ...editing, gradient: e.target.value })
                      }
                    />
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0"
                      style={{ background: editing.gradient }}
                    />
                  </div>
                </div>

                {/* Figma URL */}
                <div>
                  <label className={label} style={labelStyle}>
                    Figma URL <span style={{ opacity: 0.6 }}>(선택)</span>
                  </label>
                  <input
                    className={input}
                    style={inputStyle}
                    value={editing.figmaUrl ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, figmaUrl: e.target.value })
                    }
                    placeholder="https://www.figma.com/design/..."
                  />
                  {editing.figmaUrl && (
                    <p
                      className="text-xs mt-1.5"
                      style={{ color: "var(--muted)" }}
                    >
                      ✓ 프로젝트 상세 페이지에 임베드 표시됨
                    </p>
                  )}
                </div>

                {/* Thumbnail */}
                <div>
                  <label className={label} style={labelStyle}>
                    썸네일
                  </label>
                  <div className="flex gap-3 items-center">
                    {editing.thumbnail ? (
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={editing.thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() =>
                            setEditing({ ...editing, thumbnail: "" })
                          }
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white text-xs flex items-center justify-center cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-32 h-20 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                        style={{
                          background: editing.gradient,
                          color: "white",
                        }}
                      >
                        미리보기
                      </div>
                    )}
                    <input
                      ref={thumbRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadImage(e, "thumbnail")}
                    />
                    <button
                      onClick={() => thumbRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                      style={{
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                      }}
                    >
                      업로드
                    </button>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className={label} style={labelStyle}>
                    프로젝트 이미지
                  </label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {editing.images.map((url, i) => (
                      <div
                        key={i}
                        className="relative w-32 h-20 rounded-lg overflow-hidden"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() =>
                            setEditing({
                              ...editing,
                              images: editing.images.filter(
                                (_, j) => j !== i
                              ),
                            })
                          }
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white text-xs flex items-center justify-center cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => uploadImage(e, "images")}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                    style={{
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    + 이미지 추가
                  </button>
                </div>

                <button
                  onClick={saveProject}
                  disabled={saving}
                  className="px-6 py-2.5 bg-mint text-black rounded-lg text-sm font-medium hover:bg-mint-light transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Resume Tab ─── */}
        {tab === "resume" && resume && (
          <div className="space-y-10">
            {/* Intro */}
            <div>
              <label className={label} style={labelStyle}>
                소개 문구
              </label>
              <input
                className={input}
                style={inputStyle}
                value={resume.intro}
                onChange={(e) =>
                  setResume({ ...resume, intro: e.target.value })
                }
              />
            </div>

            {/* Experience & Education */}
            {(["experience", "education"] as const).map((section) => (
              <div key={section}>
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="font-heading text-sm uppercase tracking-[0.2em] text-mint"
                  >
                    {section}
                  </h3>
                  <button
                    onClick={() => addEntry(section)}
                    className="text-xs text-mint cursor-pointer hover:underline"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-4">
                  {resume[section].map((entry, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl"
                      style={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                          className={input}
                          style={inputStyle}
                          placeholder="기간"
                          value={entry.period}
                          onChange={(e) =>
                            updateEntry(section, i, "period", e.target.value)
                          }
                        />
                        <input
                          className={input}
                          style={inputStyle}
                          placeholder="직책/전공"
                          value={entry.title}
                          onChange={(e) =>
                            updateEntry(section, i, "title", e.target.value)
                          }
                        />
                        <input
                          className={input}
                          style={inputStyle}
                          placeholder="회사/학교"
                          value={entry.company}
                          onChange={(e) =>
                            updateEntry(section, i, "company", e.target.value)
                          }
                        />
                        <input
                          className={input}
                          style={inputStyle}
                          placeholder="설명"
                          value={entry.description}
                          onChange={(e) =>
                            updateEntry(
                              section,
                              i,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <button
                        onClick={() => removeEntry(section, i)}
                        className="text-xs text-red-400 cursor-pointer hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Skills */}
            <div>
              <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-mint mb-4">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {resume.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      border: `1px solid ${skill.color}40`,
                      color: skill.color,
                    }}
                  >
                    {skill.name}
                    <button
                      onClick={() =>
                        setResume({
                          ...resume,
                          skills: resume.skills.filter((_, j) => j !== i),
                        })
                      }
                      className="hover:opacity-70 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  id="newSkill"
                  className={`${input} max-w-[200px]`}
                  style={inputStyle}
                  placeholder="새 스킬 이름"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const el = e.target as HTMLInputElement;
                      if (!el.value.trim()) return;
                      setResume({
                        ...resume,
                        skills: [
                          ...resume.skills,
                          {
                            name: el.value.trim(),
                            color:
                              ACCENT_COLORS[
                                resume.skills.length % ACCENT_COLORS.length
                              ],
                          },
                        ],
                      });
                      el.value = "";
                    }
                  }}
                />
                <span
                  className="text-xs self-center"
                  style={{ color: "var(--muted)" }}
                >
                  Enter로 추가
                </span>
              </div>
            </div>

            <button
              onClick={saveResume}
              disabled={saving}
              className="px-6 py-2.5 bg-mint text-black rounded-lg text-sm font-medium hover:bg-mint-light transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? "저장 중..." : "이력서 저장"}
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-2 bg-mint text-black rounded-lg text-sm font-medium animate-pulse">
          {toast}
        </div>
      )}
    </div>
  );
}
