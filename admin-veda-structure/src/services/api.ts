const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

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

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (networkErr: any) {
    throw new ApiError(
      0,
      networkErr?.message || "Network connection error. Please verify the backend is running.",
      null
    );
  }

  const data = await response
    .json()
    .catch(() => ({ message: "Invalid JSON response" }));

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
      throw new ApiError(
        401,
        data.message || "Session expired or invalid. Please log in again.",
        data
      );
    }

    if (response.status === 403) {
      const forbiddenMsg =
        data.message || "Admin access required. Your account does not have administrator privileges.";
      throw new ApiError(403, forbiddenMsg, data);
    }

    throw new ApiError(
      response.status,
      data.message || response.statusText || "API request failed",
      data
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
