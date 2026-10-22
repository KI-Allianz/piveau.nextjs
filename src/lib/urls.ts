export const BACKEND_URLS = {
  SEARCH: process.env.SEARCH_HUB_URL?.replace(/^"|"$/g, "") || "",
  REPO: process.env.REPO_HUB_URL?.replace(/^"|"$/g, "") || "",
  UPLOAD: process.env.UPLOAD_API_URL?.replace(/^"|"$/g, "") || "",
  ASSISTANT: process.env.CHATBOT_BACKEND_URL?.replace(/^"|"$/g, "") || "",
};
