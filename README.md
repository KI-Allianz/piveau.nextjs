# Piveau (Next.js)

The **Next.js-based web version of Piveau**, a modern open-source data portal built for discoverability, accessibility, and performance.  
This project reimagines the web UI for the [Piveau](https://www.piveau.de/) platform, offering the full functionality of the original site — plus enhanced user experience, favorites, example code blocks, and AI-chat. The test instance is available under [ki-daten.hlrs.de](https://ki-daten.hlrs.de)

<img width="60%" alt="KI-Allianz data plattform" src="https://github.com/user-attachments/assets/68405841-ef2e-49b2-90ae-e50aafa10edc" />


<img width="60%" height="1104" alt="KI-Allianz data plattform-Datensatz Seite" src="https://github.com/user-attachments/assets/bc2775e5-767a-4a28-9a1c-cd29e78dabc2" />


### Development instances
- [KI-Allianz](https://next-piveau.vercel.app/de/)
- [HammerHAI](https://next-piveau-git-hammerhai-felixsmtts-projects.vercel.app/en)

---

## ✨ Features

- **Full Feature Parity with Original Piveau**
    - Dataset search, filtering, sorting, and visualization
    - Support for all metadata structures and linked data standards
- **User Favorites**
    - Save and manage favorite datasets directly in your browser
- **AI Model Routing**
    - Dedicated details pages for AI models with structured metadata
- **Modern Frontend Stack**
    - Built with [Next.js 15](https://nextjs.org/)
    - Fully typed with TypeScript
    - ShadCN and Tailwind CSS for styling
- **Optimized Performance**
    - Server-side rendering (SSR) for SEO

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone https://gitlab.kit.edu/kit/ki-allianz/datenplattform-core/piveau-hub/piveau.nextjs.git
cd piveau-web
pnpm i
```

### 2. Configuration

Create a .env file with the following environment variables or copy from .env.example:

```env
DOMAIN="http://localhost:3000"
SEARCH_HUB_URL="https://DOMAIN_OF_PIVEAU_BACKEND/hub/search/"
REPO_HUB_URL="https://DOMAIN_OF_PIVEAU_BACKEND/hub/repo/"
```

### 3. Run the development server

```bash
pnpm dev
```

Visit http://localhost:3000 to view the application.

## 🐳 Docker Deployment

You can easily deploy Piveau (Next.js) with Docker Compose using the provided `docker-compose.yml` file.

```bash
docker-compose up -d
```


