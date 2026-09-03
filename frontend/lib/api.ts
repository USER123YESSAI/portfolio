import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Simple in-memory cache to prevent duplicate SSR / dev requests within 15 seconds
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 15000;

const getCached = async (url: string, params?: unknown) => {
  const key = `${url}_${JSON.stringify(params || {})}`;
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  const response = await api.get(url, { params });
  cache.set(key, { data: response.data, timestamp: now });
  return response.data;
};

export const getProjects = (params?: { technologie?: string; categorie?: string }) =>
  getCached("/projects", params);

export const getProject = (id: number) => getCached(`/projects/${id}`);

export const getSkills = () => getCached("/skills");

export const getExperiences = () => getCached("/experiences");

export const getEducations = () => getCached("/educations");

export const getCertifications = () => getCached("/certifications");

export const getSettings = () => getCached("/settings");

export const sendContact = (data: {
  nom: string;
  email: string;
  sujet: string;
  contenu: string;
}) => api.post("/contact", data).then((r) => r.data);

export const verifyCVPassword = (password: string) =>
  api.post("/cv/verify", { password }).then((r) => r.data);

export const downloadCV = (password?: string) => {
  const url = password
    ? `${API_URL}/cv/download?password=${encodeURIComponent(password)}`
    : `${API_URL}/cv/download`;
  window.open(url, "_blank");
};

export const login = (email: string, mot_de_passe: string) =>
  api.post("/auth/login", { email, mot_de_passe }).then((r) => r.data);

export const getMe = () => api.get("/auth/me").then((r) => r.data);

export const getDashboardStats = () =>
  api.get("/admin/dashboard").then((r) => r.data);

export const adminGetProjects = () => api.get("/admin/projects").then((r) => r.data);
export const adminCreateProject = (data: FormData) =>
  api.post("/admin/projects", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
export const adminUpdateProject = (id: number, data: FormData) =>
  api.put(`/admin/projects/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
export const adminDeleteProject = (id: number) =>
  api.delete(`/admin/projects/${id}`).then((r) => r.data);
export const adminArchiveProject = (id: number) =>
  api.patch(`/admin/projects/${id}/archive`).then((r) => r.data);

export const adminGetSkills = () => api.get("/admin/skills").then((r) => r.data);
export const adminCreateSkill = (data: object) =>
  api.post("/admin/skills", data).then((r) => r.data);
export const adminUpdateSkill = (id: number, data: object) =>
  api.put(`/admin/skills/${id}`, data).then((r) => r.data);
export const adminDeleteSkill = (id: number) =>
  api.delete(`/admin/skills/${id}`).then((r) => r.data);

export const adminGetExperiences = () => api.get("/admin/experiences").then((r) => r.data);
export const adminCreateExperience = (data: object) =>
  api.post("/admin/experiences", data).then((r) => r.data);
export const adminUpdateExperience = (id: number, data: object) =>
  api.put(`/admin/experiences/${id}`, data).then((r) => r.data);
export const adminDeleteExperience = (id: number) =>
  api.delete(`/admin/experiences/${id}`).then((r) => r.data);

export const adminGetEducations = () => api.get("/admin/educations").then((r) => r.data);
export const adminCreateEducation = (data: object) =>
  api.post("/admin/educations", data).then((r) => r.data);
export const adminUpdateEducation = (id: number, data: object) =>
  api.put(`/admin/educations/${id}`, data).then((r) => r.data);
export const adminDeleteEducation = (id: number) =>
  api.delete(`/admin/educations/${id}`).then((r) => r.data);

export const adminGetCertifications = () =>
  api.get("/admin/certifications").then((r) => r.data);
export const adminCreateCertification = (data: object) =>
  api.post("/admin/certifications", data).then((r) => r.data);
export const adminUpdateCertification = (id: number, data: object) =>
  api.put(`/admin/certifications/${id}`, data).then((r) => r.data);
export const adminDeleteCertification = (id: number) =>
  api.delete(`/admin/certifications/${id}`).then((r) => r.data);

export const adminGetMessages = () => api.get("/admin/messages").then((r) => r.data);
export const adminMarkMessageRead = (id: number) =>
  api.patch(`/admin/messages/${id}/read`).then((r) => r.data);
export const adminDeleteMessage = (id: number) =>
  api.delete(`/admin/messages/${id}`).then((r) => r.data);

export const adminGetSettings = () => api.get("/admin/settings").then((r) => r.data);
export const adminUpdateSettings = (data: object) =>
  api.put("/admin/settings", data).then((r) => r.data);
export const adminUploadCV = (file: File) => {
  const formData = new FormData();
  formData.append("cv", file);
  return api.post("/admin/settings/cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};
export const uploadCV = adminUploadCV;

export const adminUploadProfilePhoto = (file: File) => {
  const formData = new FormData();
  formData.append("photo", file);
  return api.post("/admin/settings/profile-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};
export const uploadProfileImage = adminUploadProfilePhoto;

export const adminUploadAboutPhoto = (file: File) => {
  const formData = new FormData();
  formData.append("photo", file);
  return api.post("/admin/settings/about-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};
export const uploadAboutPhoto = adminUploadAboutPhoto;

export const getAssetUrl = (path?: string) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;

  let host = "localhost";
  if (typeof window !== "undefined") {
    host = window.location.hostname || "localhost";
  }
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    `http://${host}:5000`;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export default api;
