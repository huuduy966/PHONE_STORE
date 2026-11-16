import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw Error('Authorization tests only run against localhost.');

async function request(path, { method = 'GET', data, cookie, key } = {}) {
  const response = await fetch(`${base}/api/v1/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { cookie } : {}),
      ...(key ? { 'idempotency-key': key } : {}),
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  return {
    status: response.status,
    data: await response.json().catch(() => null),
    cookie: response.headers.get('set-cookie')?.split(';')[0],
  };
}

const password = `TestA1${randomBytes(16).toString('hex')}`;
async function register() {
  const response = await request('auth/register', {
    method: 'POST',
    data: { name: 'Authorization QA', email: `auth-${randomUUID()}@example.test`, password },
  });
  assert.equal(response.status, 200);
  return response;
}

const a = await register();
const b = await register();
const product = (await request('products')).data.products.find(p => p.variants?.some(v => v.stock > 0));
assert.ok(product, 'A product with available stock is required');

for (const [path, method, data] of [
  ['admin/overview', 'GET'],
  ['admin/products', 'PATCH', { id: product.id, name: 'Unauthorized edit', description: '', visible: false, variants: product.variants.map(({ id, price, stock }) => ({ id, price, stock })) }],
  ['admin/products', 'POST', {}],
  ['admin/coupons', 'POST', {}],
  ['admin/orders/status', 'POST', {}],
]) {
  assert.equal((await request(path, { method, data })).status, 401, `Anonymous ${method} ${path}`);
  assert.equal((await request(path, { method, data, cookie: b.cookie })).status, 403, `Customer ${method} ${path}`);
}

assert.equal((await request('admin/products', { method: 'DELETE', cookie: b.cookie })).status, 405);

const changed = await request('me', {
  method: 'PATCH', cookie: a.cookie,
  data: { id: b.data.user.id, role: 'admin', name: 'Changed A', phone: '', addresses: [], wishlist: [] },
});
assert.equal(changed.status, 400);
assert.equal((await request('me', { cookie: a.cookie })).data.user.name, a.data.user.name);
assert.equal((await request('me', { method: 'PATCH', cookie: a.cookie,
  data: { name: 'Changed A', phone: '', addresses: [], wishlist: [] } })).status, 200);
assert.equal((await request('me', { cookie: a.cookie })).data.user.name, 'Changed A');
assert.equal((await request('me', { cookie: a.cookie })).data.user.role, 'customer');
assert.equal((await request('me', { cookie: b.cookie })).data.user.name, b.data.user.name);

const variant = product.variants.find(v => v.stock > 0);
const order = await request('orders', {
  method: 'POST', cookie: a.cookie, key: randomUUID(),
  data: {
    items: [{ variantId: variant.id, quantity: 1, price: variant.price }],
    recipient: {
      name: 'Authorization QA', phone: '0900000000', email: 'qa@example.test',
      city: 'Thành phố Hà Nội', district: '', ward: 'Phường Ba Đình',
      address: 'Địa chỉ mẫu để kiểm thử', note: 'Local authorization test',
      delivery: 'delivery', company: '', taxCode: '', companyAddress: '',
    },
    payment: 'COD', coupon: '',
  },
});
assert.equal(order.status, 201);
const code = order.data.order.code;
assert.ok((await request('orders', { cookie: a.cookie })).data.orders.some(o => o.code === code));
assert.ok(!(await request('orders', { cookie: b.cookie })).data.orders.some(o => o.code === code));
assert.equal((await request(`orders/${code}/cancel`, { method: 'POST', data: {}, cookie: b.cookie })).status, 403);
assert.equal((await request(`orders/${code}/cancel`, { method: 'POST', data: {} })).status, 401);
assert.equal((await request(`orders/${code}/cancel`, { method: 'POST', data: {}, cookie: a.cookie })).status, 200);

console.log('Authorization checks passed: admin API, account isolation, order ownership, and direct DELETE.');
