// Базовый URL API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Функция для получения токена из localStorage (только на клиенте)
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Базовая функция для выполнения запросов к API
export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");

  let data: any = null;
  if (isJson) {
    data = await response.json().catch(() => null);
  }

  // Возвращаем объект с данными и статусом
  return {
    success: response.ok,
    status: response.status,
    data,
  } as unknown as T;
}


// Вспомогательные функции для разных типов запросов
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    fetchAPI<T>(endpoint, { method: 'GET', ...options }),
  
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    fetchAPI<T>(endpoint, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
  
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => 
    fetchAPI<T>(endpoint, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) => 
    fetchAPI<T>(endpoint, { method: 'DELETE', ...options }),

  // Функция для отправки формы с файлами
  uploadForm: <T>(endpoint: string, formData: FormData, options?: RequestInit) => 
    fetchAPI<T>(endpoint, { 
      method: 'POST',
      body: formData,
      headers: {}, // Не устанавливаем Content-Type, чтобы браузер сам добавил boundary
      ...options 
    }),
};
