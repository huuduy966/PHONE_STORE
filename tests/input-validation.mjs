import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw Error('Input validation tests only run against localhost.');
const ip = `198.19.${Math.floor(Math.random() * 200) + 1}.1`;

async function request(path, { method = 'GET', data, cookie, raw, key } = {}) {
  const response = await fetch(`${base}/api/v1/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': ip, ...(cookie ? { cookie } : {}), ...(key ? { 'idempotency-key': key } : {}) },
    ...(raw !== undefined ? { body: raw } : data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
  return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] };
}

assert.equal((await request('products?unexpected=1')).status, 400, 'Unused query input is rejected');
assert.equal((await request('auth/login', { method: 'POST', raw: '{broken' })).status, 400, 'Malformed JSON is rejected');
assert.equal((await request('auth/login', { method: 'POST', data: { email: 'valid@example.test', password: '' } })).status, 400, 'Empty password is invalid input');
assert.equal((await request('orders/lookup', { method: 'POST', data: { code: "PS123' OR 1=1 --", phone: '0900000000' } })).status, 400, 'Malformed order code is rejected before SQL');
assert.equal((await request('coupons/validate', { method: 'POST', data: { code: "HELLO200' OR 1=1 --", subtotal: 5000000 } })).status, 400, 'SQL syntax in coupon input cannot alter the lookup');
const invalidOrder = {
  items: [{ variantId: 'missing-variant', quantity: 1, price: 1000 }],
  recipient: { name: 'Validation QA', phone: '0900000000', email: '', city: 'Thành phố Hà Nội',
    district: '', ward: 'Phường Ba Đình', address: 'Địa chỉ mẫu để kiểm thử', note: '',
    delivery: 'delivery', company: '', taxCode: '', companyAddress: '' },
  payment: 'COD', coupon: '',
};
assert.equal((await request('orders', { method: 'POST', key: '-'.repeat(36), data: invalidOrder })).status, 400,
  'Idempotency key must be a UUID');
assert.equal((await request('orders', { method: 'POST', key: randomUUID(), data: { ...invalidOrder, role: 'admin' } })).status, 400,
  'Unknown order fields are rejected');

const password = `TestA1${randomBytes(16).toString('hex')}`;
const registered = await request('auth/register', { method: 'POST', data: { name: 'Validation QA', email: `validation-${randomUUID()}@example.test`, password } });
assert.equal(registered.status, 200);
const cookie = registered.cookie;
assert.equal((await request('me', { method: 'PATCH', cookie, data: { name: 'Validation QA', phone: '', addresses: [], wishlist: [], role: 'admin' } })).status, 400, 'Unknown profile fields are rejected');
assert.equal((await request('auth/logout', { method: 'POST', cookie, data: { token: 'ignored' } })).status, 400, 'Unused logout input is rejected');
assert.equal((await request('orders/bad-code/cancel', { method: 'POST', cookie, data: {} })).status, 400, 'Malformed order code in path is rejected');
assert.equal((await request('orders/PS1234567890/cancel', { method: 'POST', cookie, data: { force: true } })).status, 400, 'Unused cancellation input is rejected');
assert.equal((await request('me', { cookie })).data.user.role, 'customer');

console.log('Input validation checks passed: JSON, query, body, path, and SQL injection probes.');
