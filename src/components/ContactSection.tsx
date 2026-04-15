"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:hello@example.com?subject=Contact from ${encodeURIComponent(form.name)}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${encodeURIComponent(form.email)}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-mint/30";
  const inputStyle = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
  };

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Get in Touch
          </h2>
          <p className="mb-12" style={{ color: "var(--muted)" }}>
            프로젝트 의뢰, 협업 제안, 또는 커피챗 환영합니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className={inputCls}
                style={inputStyle}
                placeholder="이름"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className={inputCls}
                style={inputStyle}
                placeholder="이메일"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <textarea
              className={`${inputCls} min-h-[150px] resize-y`}
              style={inputStyle}
              placeholder="메시지를 남겨주세요"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-mint text-black font-medium rounded-full hover:bg-mint-light transition-colors text-sm"
            >
              {sent ? "감사합니다!" : "보내기"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
