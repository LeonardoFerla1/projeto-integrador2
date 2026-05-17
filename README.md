# projeto-integrador2
# 📊 Dashboard de Atendimento Operacional

Este é um painel analítico dinâmico e interativo concebido para extrair dados brutos de um ficheiro de texto CSV, processá-los diretamente no navegador e transformá-los em indicadores de desempenho (KPIs) e gráficos visuais de fácil leitura.

O projeto foi desenvolvido puramente no *front-end*, sendo extremamente leve e independente de servidores ou bases de dados complexas para a realização de análises rápidas.

---

## 🛠️ Estrutura e Tecnologias

O ecossistema do projeto é composto por tecnologias Web nativas e duas bibliotecas open-source essenciais:

* **HTML5:** Define a árvore do DOM e os contêineres semânticos onde os gráficos e KPIs são injetados.
* **CSS3:** Controla a interface visual moderna, aplicando efeitos de *Glassmorphism* (`backdrop-filter`), tipografia fluida e um sistema de *Grid Layout* responsivo. Inclui também animações suaves de entrada (`@keyframes`).
* **JavaScript (ES6+):** Centraliza a lógica de controlo, requisições assíncronas (`Fetch API`) e a manipulação de objetos e arrays.
* **[Chart.js (v4.4.1)](https://www.chartjs.org/):** Biblioteca utilizada para renderizar os gráficos interativos em elementos `<canvas>`.
* **[PapaParse (v5.4.1)](https://www.papaparse.com/):** Extensão utilizada para converter o ficheiro CSV diretamente em objetos JavaScript estruturados.

---

## 📂 Organização dos Ficheiros

Para que a aplicação funcione corretamente, certifique-se de manter a seguinte estrutura de diretórios:

```text
├── index.html          # Estrutura e marcação da página
├── style.css           # Estilização, layout e animações
├── script.js           # Lógica de processamento e gráficos
└── atendimentos.csv    # Base de dados brutos (gerada pelo sistema)
