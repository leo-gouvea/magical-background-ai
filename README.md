# Magical Background — AI-Powered Background Generator
*🌐 Idioma em Português abaixo / Portuguese version below*

Deploy: https://magical-background-ai.vercel.app

## 🧠 About the Project

**Magical Background** is a web application that generates **HTML and CSS backgrounds** from natural language descriptions using **generative Artificial Intelligence**.

This project also documents a real infrastructure decision: it originally ran on an **n8n workflow** to orchestrate the AI call, but was later **migrated to a serverless function**, removing the need to host n8n (or any server) at all. The goal was to keep the project running for free, indefinitely, without depending on trial periods or paid hosting.

---

## ✨ Features

* Text-to-background generation
* AI-generated **HTML + CSS** code
* Serverless API endpoint (no server to keep running)
* Simple and responsive user interface
* Clean and reusable generated code

---

## 🛠️ Technologies Used

* **HTML5 / CSS3 / JavaScript (ES6+)**
* **TanStack Start** (React, SSR + server routes)
* **REST API**
* **Groq (Llama 3.3 70B)** for generative AI
* Deployed on **Vercel** (free tier, serverless functions)
* Previously orchestrated with **n8n** (see "Architecture History" below)

---

## 🔄 How It Works (current)

1. The user describes their desired background.
2. The front-end sends the request to `/api/gerar-fundo`, a server route in this same project.
3. That route calls the **Groq API** directly with a system prompt that constrains the output format.
4. The AI returns HTML + CSS as JSON.
5. The generated code is rendered live on the page.

---

## 🕰️ Architecture History

This project went through two versions of the same idea, which is worth documenting:

**v1 — n8n orchestration:** User input → n8n webhook → Groq API → JSON response → rendered on the front-end. This worked well as a way to prototype the AI integration visually and required no backend code. It was hosted as a self-hosted n8n instance (Docker → Render → Railway), which meant keeping a server running 24/7.

**v2 — serverless (current):** The same logic (receive text, call Groq, return HTML/CSS) was reimplemented as a small serverless function inside the existing front-end project. No standalone server, no risk of the automation platform's trial expiring, and no memory/hosting constraints to manage.

**Why the change:** n8n is a strong tool when a workflow involves multiple integrations, non-technical collaborators, or event-driven triggers. Here, the workflow was a single API call with no branching logic — a case where plain code is lighter, cheaper to run for free long-term, and has one less moving part to break. This project keeps both approaches documented as a practical example of recognizing when workflow automation is the right tool, and when it isn't.

---

## 🎯 Objectives

This project was built to practice:

* Front-end and API integration
* Applied generative AI for web development
* Workflow automation with n8n, and recognizing its trade-offs vs. plain code
* Running a project reliably on a zero-cost budget

---

## 👤 Author

**Leonardo José Alves Gouvea**

<br>
<hr>
<br>

# Fundo Mágico — Gerador de Fundos alimentado por IA

Deploy: https://magical-background-ai.vercel.app

## 🧠 Sobre o Projeto

**Fundo Mágico** é uma aplicação web que gera **fundos em HTML e CSS** a partir de descrições em linguagem natural, utilizando **Inteligência Artificial generativa**.

Esse projeto também documenta uma decisão de infraestrutura real: ele rodava originalmente com um **fluxo no n8n** orquestrando a chamada de IA, e foi depois **migrado para uma função serverless**, eliminando a necessidade de hospedar o n8n (ou qualquer servidor). O objetivo foi manter o projeto no ar de graça, indefinidamente, sem depender de trials ou hospedagem paga.

---

## ✨ Funcionalidades

* Geração de fundos a partir de texto
* Código **HTML + CSS** gerado por IA
* Endpoint serverless (sem servidor pra manter no ar)
* Interface simples e responsiva
* Código gerado limpo e reutilizável

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 / CSS3 / JavaScript (ES6+)**
* **TanStack Start** (React, SSR + rotas de servidor)
* **API REST**
* **Groq (Llama 3.3 70B)** para IA generativa
* Deploy na **Vercel** (tier gratuito, funções serverless)
* Anteriormente orquestrado com **n8n** (veja "Histórico de Arquitetura" abaixo)

---

## 🔄 Como Funciona (versão atual)

1. O usuário descreve o fundo desejado.
2. O front-end envia a requisição para `/api/gerar-fundo`, uma rota de servidor dentro do próprio projeto.
3. Essa rota chama a **API da Groq** diretamente, com um prompt de sistema que restringe o formato da resposta.
4. A IA devolve HTML + CSS como JSON.
5. O código gerado é renderizado ao vivo na página.

---

## 🕰️ Histórico de Arquitetura

Esse projeto passou por duas versões da mesma ideia, o que vale documentar:

**v1 — orquestração via n8n:** Entrada do usuário → webhook n8n → API da Groq → resposta JSON → renderizado no front-end. Isso funcionou bem como forma de prototipar a integração de IA visualmente, sem escrever backend. Foi hospedado como uma instância própria de n8n (Docker → Render → Railway), o que significava manter um servidor rodando 24h por dia.

**v2 — serverless (atual):** A mesma lógica (receber texto, chamar o Groq, devolver HTML/CSS) foi reimplementada como uma pequena função serverless dentro do próprio projeto de front-end. Sem servidor dedicado, sem risco de a plataforma de automação expirar o trial, e sem restrição de memória/hospedagem pra gerenciar.

**Por que a mudança:** o n8n é uma ferramenta forte quando o fluxo envolve múltiplas integrações, colaboradores não-técnicos, ou gatilhos por evento. Aqui, o fluxo era uma única chamada de API sem lógica condicional — um caso onde código puro é mais leve, mais barato de manter de graça no longo prazo, e tem uma peça a menos pra quebrar. Esse projeto mantém as duas abordagens documentadas como exemplo prático de reconhecer quando automação visual é a ferramenta certa, e quando não é.

---

## 🎯 Objetivos

Este projeto foi desenvolvido para praticar:

* Integração entre front-end e APIs
* Uso de IA generativa aplicada ao desenvolvimento web
* Automação de processos com n8n, e reconhecer seus trade-offs frente a código puro
* Manter um projeto rodando de forma confiável com orçamento zero

---

## 👤 Autor

**Leonardo José Alves Gouvea**
