(function () {
  const form = document.querySelector(".form-group");
  const inputDesc = document.getElementById("description");
  const codigoHtml = document.getElementById("html-code");
  const codigoCss = document.getElementById("css-code");
  const previewSection = document.getElementById("preview-section");
  const btnUndo = document.getElementById("undo-btn");

  // Guarda o último estado para permitir desfazer
  let lastState = null;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const desc = inputDesc.value.trim();
    if (!desc) return;

    showLoading(true);

    try {
      const answer = await fetch(
        "https://n8n-production-3db5.up.railway.app/webhook/fundo-magico",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ desc }),
        },
      );

      const data = await answer.json();

      codigoHtml.textContent = data.html || "";
      codigoCss.textContent = data.css || "";
      previewSection.style.display = "block";

      const previewContainer = document.getElementById("preview-container");
      if (previewContainer && data.html) {
        previewContainer.innerHTML = `<div class="${
          data.html.match(/class='([^']+)'/)?.[1] || "fundo"
        }"></div>`;
      }

      let styleTag = document.getElementById("dynamic-style");
      if (styleTag) styleTag.remove();

      if (data.css) {
        styleTag = document.createElement("style");
        styleTag.id = "dynamic-style";
        styleTag.textContent = `
          #preview-container {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: -1;
            pointer-events: none;
            overflow: hidden;
          }
          ${data.css}
        `;
        document.head.appendChild(styleTag);
      }

      lastState = { html: data.html || "", css: data.css || "" };
      if (btnUndo) btnUndo.hidden = false;

      window.dispatchEvent(new CustomEvent("fundo:done"));
    } catch (error) {
      console.error("Erro ao enviar a requisição:", error);
      codigoHtml.textContent = "Não consegui gerar o HTML, tente novamente.";
      codigoCss.textContent = "Não consegui gerar o CSS, tente novamente.";
    } finally {
      showLoading(false);
    }
  });

  if (btnUndo) {
    btnUndo.addEventListener("click", function () {
      const styleTag = document.getElementById("dynamic-style");
      if (styleTag) styleTag.remove();
      const previewContainer = document.getElementById("preview-container");
      if (previewContainer) previewContainer.innerHTML = "";
      previewSection.style.display = "none";
      codigoHtml.textContent = "";
      codigoCss.textContent = "";
      btnUndo.hidden = true;
      lastState = null;
    });
  }

  // Botões de copiar
  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.dataset.copyTarget);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent || "");
        const original = btn.textContent;
        btn.textContent = "Copiado!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("copied");
        }, 1500);
      } catch (e) {
        console.error("Falha ao copiar", e);
      }
    });
  });

  function showLoading(isLoading) {
    const botaoEnviar = document.getElementById("generate-btn");
    const label = document.getElementById("btn-text");
    if (isLoading) {
      botaoEnviar.disabled = true;
      if (label) label.textContent = "Carregando Background...";
      else botaoEnviar.textContent = "Carregando Background...";
    } else {
      botaoEnviar.disabled = false;
      if (label) label.textContent = "Gerar Fundo Mágico";
      else botaoEnviar.textContent = "Gerar Fundo Mágico";
    }
  }
})();
