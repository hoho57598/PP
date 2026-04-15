export default function Footer() {
  return (
    <footer
      className="py-12 px-6"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          &copy; 2026 Portfolio. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            href="#contact"
            className="text-sm hover:text-mint transition-colors"
            style={{ color: "var(--muted)" }}
          >
            Contact
          </a>
          <a
            href="#"
            className="text-sm hover:text-mint transition-colors"
            style={{ color: "var(--muted)" }}
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="text-sm hover:text-mint transition-colors"
            style={{ color: "var(--muted)" }}
          >
            Behance
          </a>
        </div>
      </div>
    </footer>
  );
}
