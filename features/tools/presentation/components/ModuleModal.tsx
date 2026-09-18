import { useEffect, type ReactNode } from "react";

export function ModuleModal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="module-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="module-modal" role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="module-modal-close" onClick={onClose} aria-label="Đóng">×</button>
        {children}
      </section>
    </div>
  );
}
