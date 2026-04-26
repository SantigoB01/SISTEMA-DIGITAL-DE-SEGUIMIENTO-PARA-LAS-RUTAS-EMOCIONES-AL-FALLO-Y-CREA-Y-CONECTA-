const BASE = '/api'
let token = null

const h = () => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

const parse = async (r) => {
  if (!r.ok) throw await r.json().catch(() => ({ mensaje: r.statusText }))
  if (r.status === 204) return {}
  return r.json().catch(() => ({}))
}

const http = {
  setToken: (t) => { token = t },
  clearToken: () => { token = null },
  getToken: () => token,
  get: (p) => fetch(`${BASE}${p}`, { headers: h() }).then(parse),
  post: (p, b) => fetch(`${BASE}${p}`, { method: 'POST', headers: h(), body: JSON.stringify(b) }).then(parse),
  put: (p, b) => fetch(`${BASE}${p}`, { method: 'PUT', headers: h(), body: JSON.stringify(b) }).then(parse),
  patch: (p, b) => fetch(`${BASE}${p}`, { method: 'PATCH', headers: h(), body: b ? JSON.stringify(b) : undefined }).then(parse),
  del: (p) => fetch(`${BASE}${p}`, { method: 'DELETE', headers: h() }).then(parse),
}


export default http
