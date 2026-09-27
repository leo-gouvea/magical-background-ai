import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function playDoneSound() {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    const now = ctx.currentTime;
    // Duas notas curtas ascendentes (efeito "ding")
    [
      { f: 660, t: 0 },
      { f: 990, t: 0.12 },
    ].forEach(({ f, t }) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now + t);
      g.gain.exponentialRampToValueAtTime(0.25, now + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.25);
      o.connect(g).connect(ctx.destination);
      o.start(now + t);
      o.stop(now + t + 0.3);
    });
    setTimeout(() => ctx.close(), 800);
  } catch {
    /* audio bloqueado, sem problema */
  }
}

function Index() {
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/src/js/index.js";
    script.async = true;
    document.body.appendChild(script);

    const onDone = () => {
      setShowDone(true);
      playDoneSound();
      setTimeout(() => setShowDone(false), 1800);
    };
    window.addEventListener("fundo:done", onDone);

    return () => {
      document.body.removeChild(script);
      window.removeEventListener("fundo:done", onDone);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="badge-n8n">
          <span className="badge-dot" />
          powered by Groq AI
        </div>
        <h1>Fundo Mágico</h1>
        <p className="subtitle">
          Transforme suas ideias em backgrounds incríveis com o poder da IA.
          Descreva o que você imagina e veja a magia acontecer.
        </p>
      </header>

      <main className="container">
        <section className="card main">
          <h2 className="card-header">
            Descreva o background que você deseja criar.
          </h2>

          <form className="form-group">
            <textarea
              rows={5}
              id="description"
              placeholder="Ex: Um gradiente da cor preta ao cinza oferecendo um contraste suave."
            />
            <div className="actions">
              <button id="generate-btn" className="btn-magic" type="submit">
                <span id="btn-text">Gerar Fundo Mágico</span>
              </button>
              <button
                id="undo-btn"
                type="button"
                className="btn-ghost"
                hidden
              >
                ↺ Desfazer
              </button>
            </div>
          </form>
        </section>

        <section id="preview-section" className="preview-card">
          <div id="preview-container" />
        </section>

        <section id="code-output" className="code-grid">
          <div className="card code-card">
            <div className="code-head">
              <h3 className="code-title">Código HTML</h3>
              <button
                type="button"
                className="btn-copy"
                data-copy-target="html-code"
              >
                Copiar
              </button>
            </div>
            <pre id="html-code" className="code-block" />
          </div>

          <div className="card code-card">
            <div className="code-head">
              <h3 className="code-title">Código CSS</h3>
              <button
                type="button"
                className="btn-copy"
                data-copy-target="css-code"
              >
                Copiar
              </button>
            </div>
            <pre id="css-code" className="code-block" />
          </div>
        </section>
      </main>

      {showDone && (
        <div className="done-toast" role="status" aria-live="polite">
          <span className="done-check">✓</span>
          <span>Feito!</span>
        </div>
      )}
    </>
  );
}
