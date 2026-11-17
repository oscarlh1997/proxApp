// Prueba de humo contra una API arrancada: npm run test:smoke  (o node scripts/smoke-test.mjs http://host:3001)
import assert from 'node:assert/strict';

const BASE = process.argv[2] || 'http://localhost:3001';

async function call(method, path, body, token) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

const ok = (r, label) => {
  assert.ok(r.status < 300, `${label}: ${r.status} ${JSON.stringify(r.data)}`);
  return r.data;
};

ok(await call('POST', '/api/seed'), 'seed');
const ana = ok(await call('POST', '/api/auth/login', { email: 'ANA@test.com ', password: 'test123' }), 'login ana');
const luis = ok(await call('POST', '/api/auth/login', { email: 'luis@test.com', password: 'test123' }), 'login luis');

// Validación en la frontera
assert.equal((await call('POST', '/api/auth/register', { username: 'x', email: 'no', password: '1' })).status, 400);
assert.equal((await call('POST', '/api/location', { latitude: "1); DROP TABLE users;--", longitude: 0 }, ana.token)).status, 400);
assert.equal((await call('PUT', '/api/profile/me', { socialLinks: [{ platform: 'x', url: 'javascript:alert(1)' }] }, ana.token)).status, 400);

// Radar: Ana en San Sebastián de los Reyes, trae a los demo a su alrededor
ok(await call('POST', '/api/location', { latitude: 40.5468, longitude: -3.6262 }, ana.token), 'location');
ok(await call('POST', '/api/dev/demo-nearby', null, ana.token), 'demo-nearby');
const nearby = ok(await call('GET', '/api/nearby?radius=0.5', null, ana.token), 'nearby');
assert.ok(nearby.length >= 4, `esperaba usuarios cerca, hay ${nearby.length}`);
assert.ok(!('latitude' in nearby[0]) && nearby[0].distanceM % 10 === 0, 'sin coordenadas y distancia redondeada');
assert.ok(nearby[0].socialLinks.length > 0, 'incluye redes sociales');

// Perfil
const me = ok(await call('PUT', '/api/profile/me', { bio: 'Probando', interests: ['Café', 'Café', 'ML'] }, ana.token), 'update profile');
assert.deepEqual(me.interests.sort(), ['Café', 'ML']);

// Feed
const post = ok(await call('POST', '/api/posts', { text: 'Hola radar', tags: ['Café'] }, ana.token), 'post');
const like = ok(await call('POST', `/api/posts/${post.id}/like`, null, luis.token), 'like');
assert.deepEqual(like, { liked: true, likeCount: 1 });
ok(await call('POST', `/api/posts/${post.id}/comments`, { text: '¡Hola!' }, luis.token), 'comment');
const feed = ok(await call('GET', '/api/feed?limit=5', null, luis.token), 'feed');
const mine = feed.find((p) => p.id === post.id);
assert.ok(mine.liked && mine.commentCount === 1 && mine.tags[0] === 'Café');

// Chat y autorización
const convo = ok(await call('POST', '/api/conversations', { targetUserId: luis.user.id }, ana.token), 'convo');
const again = ok(await call('POST', '/api/conversations', { targetUserId: ana.user.id }, luis.token), 'convo again');
assert.equal(convo.id, again.id, 'reutiliza la conversación');
ok(await call('POST', `/api/conversations/${convo.id}/messages`, { text: 'Hola Luis' }, ana.token), 'send');
const msgs = ok(await call('GET', `/api/conversations/${convo.id}/messages`, null, luis.token), 'read');
assert.equal(msgs.at(-1).text, 'Hola Luis');
const mar = ok(await call('POST', '/api/auth/login', { email: 'mar@test.com', password: 'test123' }), 'login mar');
assert.equal((await call('GET', `/api/conversations/${convo.id}/messages`, null, mar.token)).status, 403, 'un tercero no lee el chat');
const inbox = ok(await call('GET', '/api/conversations', null, luis.token), 'inbox');
assert.equal(inbox[0].other.id, ana.user.id);

// Conexiones con dos usuarios nuevos (repetible): si ambos se piden conexión, queda aceptada
const tag = Date.now().toString(36);
const reg = async (n) => ok(await call('POST', '/api/auth/register', { username: `${n}_${tag}`, email: `${n}_${tag}@test.dev`, password: 'test123' }), `register ${n}`);
const [u1, u2] = [await reg('uno'), await reg('dos')];
ok(await call('POST', `/api/connect/${u2.user.id}`, null, u1.token), 'connect');
assert.equal(ok(await call('GET', `/api/connections/with/${u1.user.id}`, null, u2.token), 'status').status, 'pending_received');
assert.equal(ok(await call('POST', `/api/connect/${u1.user.id}`, null, u2.token), 'mutual').status, 'accepted');

console.log('OK: todas las comprobaciones pasaron');
