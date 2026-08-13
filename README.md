# 🔀 Câmbio Seguro — Conversor de Moedas

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Security-CSP](https://img.shields.io/badge/Security-CSP%20Hardened-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222222?style=flat&logo=github)

> **Aplicação web estática (SPA - Single Page Application) para conversão de moedas em tempo real, desenvolvida com foco em arquitetura limpa e princípios de AppSec / DevSecOps.**

---

## ⚠️ Isenção de Responsabilidade (Educational Purpose Only)

> ⚠️ **Aviso Importante:** Esta aplicação foi desenvolvida **exclusivamente para fins educacionais e de estudo**. Não deve ser utilizada como serviço comercial de câmbio nem como única fonte para transações financeiras reais. O autor não se responsabiliza pela oscilação de valores fornecidos por APIs públicas de terceiros.

---

## 🚀 Funcionalidades

* **Conversão em Tempo Real:** Suporte a múltiplos pares de moedas (USD, EUR, GBP, BRL, BTC) consumindo a [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas).
* **Painel de Cotações Rápidas:** Visão geral dinâmica do câmbio comercial atual das principais moedas.
* **Internacionalização Native (Intl):** Formatação monetária precisa conforme o padrão e cultura de cada moeda local.
* **Mecanismo Anti-Flood (Debounce):** Controle de frequência de requisições no cliente para proteção contra *Rate Limiting*.
* **Tratamento de Race Conditions:** Uso de `AbortController` para cancelar requisições assíncronas obsoletas em trocas rápidas de seleção.
* **Layout Responsivo & UI Dark Mode:** Design acessível, fluido e adaptado para múltiplos tamanhos de tela.

---

## 🛡️ Destaques de AppSec & Postura de Segurança

Esta aplicação passou por uma refatoração focada em **Security by Design**, visando eliminar más práticas comuns em front-ends estáticos:

1. **Segregação Estrita de Arquivos (Separation of Concerns):**
   * Remoção total de scripts e estilos *inline* em conformidade com os padrões de arquitetura limpa.
   * Organização estruturada do diretório de recursos estáticos (`assets/css` e `assets/js`).

2. **Content Security Policy (CSP) Endurecida:**
   * Bloqueio do cabeçalho/meta tag contra `unsafe-inline` para a execução de JavaScript, mitigando riscos de **Cross-Site Scripting (XSS)**.
   * Escopo explícito de conexões permitidas (`connect-src`) restrito ao endpoint seguro da API pública.

3. **Prevenção contra Injeção de Código (DOM-based XSS):**
   * Atualização do DOM utilizando exclusivamente `textContent` em vez de `innerHTML` nas saídas do conversor.

4. **Sanitização de Inputs:**
   * Validação rigorosa dos dados informados pelo usuário (conversão numérica, limite máximo e lista estrita de pares aceitos `ALLOWED_PAIRS`).

---

## 🤖 Requisitos de Pipeline & Integração Contínua (DevSecOps)

Para manter a integridade e a postura de segurança do código em pipelines de CI/CD (ex: GitHub Actions, Jenkins, GitLab CI), recomenda-se a execução das seguintes análises automatizadas:

| Etapa | Ferramenta Sugerida | Objetivo na Pipeline |
| :--- | :--- | :--- |
| **SAST** *(Static Analysis)* | **Semgrep** / **ESLint (security plugin)** | Detectar más práticas de manipulação do DOM, uso de APIs inseguras ou desvio dos padrões de segurança no código JS. |
| **SCA** *(Software Composition Analysis)* | **Retire.js** / **npm audit** | Monitorar e identificar vulnerabilidades conhecidas (CVEs) em bibliotecas e dependências de terceiros. |
| **DAST** *(Dynamic Analysis)* | **OWASP ZAP** | Validar os cabeçalhos de segurança (CSP, CORS, HSTS) e testar a aplicação em tempo de execução. |
| **Linter / Formatting** | **Prettier** / **HTMLHint** | Garantir a padronização e qualidade da sintaxe dos arquivos HTML, CSS e JS. |

---

## 📋 Requisitos Necessários

Para executar este projeto localmente, você não precisa de *runtimes* complexos (como Node.js ou Docker), apenas:

* Um **navegador moderno** com suporte a ES6+ e `fetch` API (Google Chrome, Mozilla Firefox, Microsoft Edge, Brave).
* Um servidor web simples (opcional, para testar a CSP corretamente sem restrições do protocolo `file://`).

### 🔧 Como Executar Localmente

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Mdsoare/secure-currency-converter.git
   cd secure-currency-converter
   ```

---

2. **Inicie um servidor local estático (Opções recomendadas):**

* Via extensão do VS Code: Utilize a extensão Live Server.
* Via Python 3:
    ```bash
    python3 -m http.server 8000
    ```
* Via Node.js (npx):
    ```bash
    npx serve .
    ```

---

3. **Acesse no seu navegador:**

    ```plaintext
    <http://localhost:8000>
    ```

---

## 📁 Estrutura do Repositório

```plaintext
├── assets/
│   ├── css/
│   │   └── styles.css        # Estilos e variáveis da interface
│   └── js/
│       └── app.js            # Lógica de conversão, consumo de API e sanitização
├── .gitignore
├── index.html                # Estrutura HTML5 com meta tags de segurança (CSP)
└── README.md                 # Documentação do projeto
```

---

## 📜 Licença

Este projeto está sob a licença [MIT](LICENSE).

---
*Desenvolvido por **Marcelo Soares** | Especialista em Segurança da Informação e Computação Forense.*