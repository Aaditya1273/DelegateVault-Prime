export const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${body}`)
  }
  try {
    return await res.json()
  } catch {
    throw new Error("Failed to parse JSON response")
  }
}

export const postJson = async (url: string, body: any) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `POST ${url} failed ${res.status}`)
  }
  try {
    return await res.json()
  } catch {
    throw new Error("Failed to parse JSON response")
  }
}

export const fetcherWith = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, { cache: "no-store", ...(init || {}) })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${body}`)
  }
  try {
    return await res.json()
  } catch {
    throw new Error("Failed to parse JSON response")
  }
}
