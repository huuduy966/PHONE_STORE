import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw Error('Rate-limit tests only run against localhost.');

async function post(path, data, ip) {
  const response = await fetch(`${base}/api/v1/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': ip },
    body: JSON.stringify(data),
  });
  return response.status;
}

const email = `rate-${randomUUID()}@example.test`;
const ipPrefix = `198.18.${Math.floor(Math.random() * 200) + 1}`;
for (let attempt = 1; attempt <= 5; attempt++) {
  assert.equal(await post('auth/login', { email, password: 'wrong' }, `${ipPrefix}.${attempt}`), 401);
}
assert.equal(await post('auth/login', { email, password: 'wrong' }, `${ipPrefix}.6`), 429,
  'The sixth guess for one email must be blocked even when the IP changes');
assert.equal(await post('auth/login', { email: `other-${randomUUID()}@example.test`, password: 'wrong' }, `${ipPrefix}.6`), 401,
  'A different email must not share the account limit');

const validEmail = `rate-valid-${randomUUID()}@example.test`;
const validPassword = `TestA1${randomBytes(16).toString('hex')}`;
assert.equal(await post('auth/register', { name: 'Rate Limit QA', email: validEmail, password: validPassword }, `${ipPrefix}.7`), 200);
for (let attempt = 8; attempt <= 11; attempt++) {
  assert.equal(await post('auth/login', { email: validEmail, password: 'wrong' }, `${ipPrefix}.${attempt}`), 401);
}
assert.equal(await post('auth/login', { email: validEmail, password: validPassword }, `${ipPrefix}.12`), 200);
for (let attempt = 13; attempt <= 17; attempt++) {
  assert.equal(await post('auth/login', { email: validEmail, password: 'wrong' }, `${ipPrefix}.${attempt}`), 401,
    'Successful login must reset the account attempt window');
}
assert.equal(await post('auth/login', { email: validEmail, password: 'wrong' }, `${ipPrefix}.18`), 429);

const loginIp = `${ipPrefix}.99`;
for (let attempt = 1; attempt <= 10; attempt++) {
  assert.equal(await post('auth/login', { email: `ip-${randomUUID()}@example.test`, password: 'wrong' }, loginIp), 401);
}
assert.equal(await post('auth/login', { email: `ip-${randomUUID()}@example.test`, password: 'wrong' }, loginIp), 429,
  'The IP limit must still apply across different email addresses');

const aiIp = `${ipPrefix}.100`;
for (let attempt = 1; attempt <= 20; attempt++) {
  assert.equal(await post('ai/future', {}, aiIp), 404,
    'The AI namespace has no endpoint yet');
}
assert.equal(await post('ai/future', {}, aiIp), 429,
  'The AI namespace must be limited before a future handler runs');
assert.equal(await post('ai/future', {}, `${ipPrefix}.101`), 404,
  'One AI caller must not consume another caller’s limit');

console.log('Rate-limit checks passed: login account limit and future AI API guard.');
