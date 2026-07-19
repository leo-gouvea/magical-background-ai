document.addEventListener("DOMContentLoaded", function () {
  // Objetivo:
  // Enviar um texto de um formulário para uma API do n8n e exibir o resultado o código html, css e colocar a animação no fundo da tela do site.

  // Passos:
  // 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
  const form = document.querySelector(".form-group");
  const inputDesc = document.getElementById("description");
  const codigoHtml = document.getElementById("html-code");
  const codigoCss = document.getElementById("css-code");
  const previewSection = document.getElementById("preview-section");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita o recarregamento da página

    // 2. Obter o valor digitado pelo usuário no campo de texto.
    const desc = inputDesc.value.trim();

    if (!desc) {
      return;
    }

    // 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
    showLoading(true);

    // 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
    try {
      const answer = await fetch(
        "https://n8n-production-3db5.up.railway.app/webhook/fundo-magico",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ desc }),
        },
      );

      const data = await answer.json();

      codigoHtml.textContent = data.html || "";
      codigoCss.textContent = data.css || "";

      previewSection.style.display = "block";

      const previewContainer = document.getElementById("preview-container");

      if (previewContainer) {
        previewContainer.innerHTML = `<div class="${data.html.match(/class='([^']+)'/)?.[1] || "fundo"}"></div>`;
      }

      let styleTag = document.getElementById("dynamic-style");
      if (styleTag) {
        styleTag.remove();
      }

      if (data.css) {
        styleTag = document.createElement("style");
        styleTag.id = "dynamic-style";
        styleTag.textContent = `
    #preview-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
      overflow: hidden;
    }
    ${data.css}
  `;
        document.head.appendChild(styleTag);
      }
    } catch (error) {
      console.error("Erro ao enviar a requisição:", error);
      codigoHtml.textContent = "Não consegui gerar o HTML, tente novamente.";
      codigoCss.textContent = "Não consegui gerar o CSS, tente novamente.";
      previewSection.innerHTML = "";
    } finally {
      showLoading(false);
    }
  });

  function showLoading(isLoading) {
    const botaoEnviar = document.getElementById("generate-btn");
    if (isLoading) {
      botaoEnviar.textContent = "Carregando Background...";
    } else {
      botaoEnviar.textContent = "Gerar Fundo Mágico";
    }
  }

  // 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).
  // 6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela:
  //    - Mostrar o HTML e CSS gerado em uma área de preview.
  //    - Inserir o CSS retornado dinamicamente na página para aplicar o background.
  // 7. Remover o indicador de carregamento após o recebimento da resposta.
});
