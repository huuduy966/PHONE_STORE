import assert from 'node:assert/strict';
import {provinces,wardsForProvince,isValidLocation} from '../lib/vietnam-locations.ts';

assert.equal(provinces.length,34);
assert.equal(provinces.reduce((total,province)=>total+province.wards.length,0),3321);
assert.equal(new Set(provinces.map(province=>province.code)).size,34);
assert.equal(new Set(provinces.flatMap(province=>province.wards.map(ward=>ward.code))).size,3321);
assert.ok(wardsForProvince('Thành phố Hà Nội').some(ward=>ward.name==='Phường Ba Đình'));
assert.ok(isValidLocation('Thành phố Hà Nội','Phường Ba Đình'));
assert.equal(isValidLocation('Thành phố Hà Nội','Phường Bến Thành'),false);
assert.equal(isValidLocation('Không có tỉnh này','Phường Ba Đình'),false);
assert.deepEqual(wardsForProvince(''),[]);
for(const province of provinces){
  assert.equal(new Set(province.wards.map(ward=>ward.name)).size,province.wards.length,`${province.name}: ward names must be unambiguous`);
}
console.log('34 tỉnh/thành và 3.321 phường/xã/đặc khu được kiểm tra.');
