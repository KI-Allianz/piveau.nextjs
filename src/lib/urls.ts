export const BACKEND_URLS = {
  SEARCH: process.env.SEARCH_HUB_URL?.replace(/^"|"$/g, "") || "",
  REPO: process.env.REPO_HUB_URL?.replace(/^"|"$/g, "") || "",
};
