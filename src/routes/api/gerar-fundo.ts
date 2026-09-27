import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Substitui o antigo webhook do n8n. Mesma responsabilidade, sem servidor externo:
// recebe { desc }, chama o Groq, devolve { html, css } no mesmo formato de sempre.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Você é um gerador de fundos (backgrounds) em HTML e CSS.

Dada uma descrição em português, gere um único elemento HTML e o CSS necessário
para criar esse background. Regras obrigatórias:

- Responda APENAS com um JSON válido, sem markdown, sem crases, sem texto extra.
- Formato exato: {"html": "...", "css": "..."}
- O "html" deve ser uma única div, algo como: <div class='fundo'></div>
  (o nome da classe pode mudar, mas mantenha o padrão class='algumNome').
- O "css" deve estilizar SOMENTE essa classe (e pseudo-elementos dela, se precisar).
  NUNCA use seletores como body, html, *, :root ou position: fixed/absolute em
  relação à página — o elemento já é posicionado como fundo pelo site que consome
  esse CSS. Trate a classe como se ela sozinha devesse preencher 100% de largura
  e altura do contêiner pai (width: 100%; height: 100%;).
- Pode usar gradientes, animações CSS (@keyframes), múltiplos backgrounds,
  box-shadow, filter, etc. Não use imagens externas nem fontes externas.
- Não inclua comentários no CSS nem no HTML.
- Não inclua nenhuma explicação fora do JSON.`;

function extractJson(raw: string): { html?: string; css?: string } {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        /* cai no throw abaixo */
      }
    }
    throw new Error("Resposta da IA não veio em JSON válido");
  }
}

export const Route = createFileRoute("/api/gerar-fundo")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.GROQ_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "GROQ_API_KEY não configurada no servidor." }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }

          const body = (await request.json().catch(() => null)) as { desc?: string } | null;
          const desc = body?.desc?.trim();
          if (!desc) {
            return new Response(JSON.stringify({ error: "Campo 'desc' é obrigatório." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const groqResponse = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: GROQ_MODEL,
              temperature: 0.8,
              response_format: { type: "json_object" },
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: desc },
              ],
            }),
          });

          if (!groqResponse.ok) {
            const errText = await groqResponse.text();
            console.error("Erro na API da Groq:", groqResponse.status, errText);
            return new Response(
              JSON.stringify({ error: "Falha ao consultar a IA. Tente novamente." }),
              { status: 502, headers: { "Content-Type": "application/json" } },
            );
          }

          const data = (await groqResponse.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const content = data.choices?.[0]?.message?.content ?? "";
          const { html, css } = extractJson(content);

          return new Response(JSON.stringify({ html: html ?? "", css: css ?? "" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Erro em /api/gerar-fundo:", error);
          return new Response(
            JSON.stringify({ error: "Não foi possível gerar o fundo. Tente novamente." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
