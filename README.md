# Piveau (Next.js)

The **Next.js-based web version of Piveau**, a modern open-source data portal built for discoverability, accessibility, and performance.  
This project reimagines the web UI for the [Piveau](https://www.piveau.de/) platform, offering the full functionality of the original site — plus enhanced user experience, favorites, example code blocks, and AI-chat.

### Demos

- [KI-Allianz Datenplattform](https://next-piveau.vercel.app/de/)
- [Hammerhai Datenplattform](https://next-piveau-git-hammerhai-felixsmtts-projects.vercel.app/en)

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
cd piveau.nextjs
pnpm i
```

### 2. Configuration

Create a .env file with the following environment variables or copy from .env.example:

```env
DOMAIN="http://localhost:3000"
SEARCH_HUB_URL="https://DOMAIN_OF_PIVEAU_BACKEND/hub/search/"
REPO_HUB_URL="https://DOMAIN_OF_PIVEAU_BACKEND/hub/repo/"

# Auth configuration
AUTH_SECRET=<your secret>  # Added by `npx auth secret --copy`. Read more: https://cli.authjs.dev
AUTH_KEYCLOAK_ID=<keycloak client id>
AUTH_KEYCLOAK_SECRET=<keycloak secret>
AUTH_KEYCLOAK_ISSUER=<keycloak issuer url>
AUTH_DISABLED="false" # Set to true to disable authentication, AUTH_SECRET needs to still have a value.

NEXTAUTH_URL=${DOMAIN}
NEXT_PUBLIC_AUTH_DISABLED=${AUTH_DISABLED}
NEXT_PUBLIC_AUTH_URL=${DOMAIN}
NEXT_PUBLIC_AUTH_KEYCLOAK_ID=${AUTH_KEYCLOAK_ID}
NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER=${AUTH_KEYCLOAK_ISSUER}

NEXT_PUBLIC_DISABLE_THEME_SWITCHING="false" # Wether to allow theme switching in the URI
NEXT_PUBLIC_DEFAULT_THEME=kiallianz # The default theme to use, if switching is disabled or no theme is set in the URI.
```

Run the following command to generate a secret for `AUTH_SECRET`:

```bash
npx auth secret --copy
```

Copy the generated secret and paste it into your `.env` file.

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

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
