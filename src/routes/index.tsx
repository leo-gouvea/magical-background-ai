import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Carrega o JavaScript original do gerador assim que o DOM estiver pronto.
  // Os IDs dos elementos (description, generate-btn, preview-section,
  // preview-container, html-code, css-code) são mantidos exatamente como no
  // HTML original, garantindo que a integração com n8n continue funcionando.
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/src/js/index.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="badge-n8n">
          <span className="badge-dot" />
          powered by N8N
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
            <button id="generate-btn" className="btn-magic" type="submit">
              <span id="btn-text">Gerar Fundo Mágico</span>
            </button>
          </form>
        </section>

        <section id="preview-section" className="preview-card">
          <div id="preview-container" />
        </section>

        <section id="code-output" className="code-grid">
          <div className="card code-card">
            <h3 className="code-title">Código HTML</h3>
            <pre id="html-code" className="code-block" />
          </div>

          <div className="card code-card">
            <h3 className="code-title">Código CSS</h3>
            <pre id="css-code" className="code-block" />
          </div>
        </section>
      </main>
    </>
  );
}
