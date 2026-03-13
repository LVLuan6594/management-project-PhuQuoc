const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export abstract class BaseApiService {
  protected async request<TResponse>(
    path: string,
    method: HttpMethod,
    body?: unknown,
  ): Promise<TResponse> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Request failed (${method} ${path}): ${response.status} ${response.statusText}`)
    }

    if (response.status === 204) {
      return undefined as TResponse
    }

    return (await response.json()) as TResponse
  }
}
