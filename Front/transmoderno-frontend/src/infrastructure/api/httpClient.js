const BASE = '/api'
let token = null

const h = () => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

const parse = async (r) => {
  // 5xx = error del servidor, lanzar con flag silencioso
  if (r.status >= 500) {
    const err = { mensaje: null, serverError: true, status: r.status }
    throw err
  }
  // 4xx = error de negocio, lanzar con mensaje legible
  if (!r.ok) {
    const body = await r.json().catch(() => ({ mensaje: r.statusText }))
    throw body
  }
  if (r.status === 204) return {}
  return r.json().catch(() => ({}))
}

// Wrapper que captura errores de red (backend caído, sin conexión)
const safe = (p) => p.catch(e => {
  // TypeError = network error (ECONNREFUSED, backend caído)
  if (e instanceof TypeError) throw { mensaje: null, serverError: true }
  throw e
})

const http = {
  setToken:   (t) => { token = t },
  clearToken: () => { token = null },
  getToken:   () => token,
  get:    (p)    => safe(fetch(`${BASE}${p}`,                                             { headers: h() }).then(parse)),
  post:   (p, b) => safe(fetch(`${BASE}${p}`, { method: 'POST',   headers: h(), body: JSON.stringify(b) }).then(parse)),
  put:    (p, b) => safe(fetch(`${BASE}${p}`, { method: 'PUT',    headers: h(), body: JSON.stringify(b) }).then(parse)),
  patch:  (p, b) => safe(fetch(`${BASE}${p}`, { method: 'PATCH',  headers: h(), body: b ? JSON.stringify(b) : undefined }).then(parse)),
  del:    (p)    => safe(fetch(`${BASE}${p}`, { method: 'DELETE', headers: h() }).then(parse)),
}

export default http
