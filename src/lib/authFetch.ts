export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  if (typeof window === "undefined") {
    throw new Error("authFetch can only be used in the browser");
  }

  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Authentication token is missing");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers,
  });
}
