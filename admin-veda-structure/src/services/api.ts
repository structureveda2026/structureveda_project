const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("accessToken");

const request = async (path: string, options: RequestInit = {}) => {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response
    .json()
    .catch(() => ({ message: "Invalid JSON response" }));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    throw new Error(
      data.message || response.statusText || "API request failed",
    );
  }

  return data;
};

const get = async (path: string) => request(path, { method: "GET" });
const post = async (path: string, body: unknown) =>
  request(path, { method: "POST", body: JSON.stringify(body) });
const patch = async (path: string, body: unknown) =>
  request(path, { method: "PATCH", body: JSON.stringify(body) });
const put = async (path: string, body: unknown) =>
  request(path, { method: "PUT", body: JSON.stringify(body) });
const del = async (path: string) => request(path, { method: "DELETE" });

const upload = async (path: string, formData: FormData) =>
  request(path, { method: "POST", body: formData });

export default { get, post, patch, put, delete: del, del, upload };
