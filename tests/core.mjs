import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {catalog,seedVariants,matches,totals,transitions} from '../lib/catalog.ts';
import {navigationCategories,categoryProducts,categoryUrl} from '../lib/categories.ts';
assert.ok(matches(catalog[0],'iphone'));
assert.ok(matches(catalog[0],'iphon 15'));
assert.ok(matches(catalog[0],'dien thoai'));
assert.equal(matches(catalog[0],'samsung'),false);
assert.equal(new Set(catalog.flatMap(seedVariants).map(v=>v.id)).size,catalog.flatMap(seedVariants).length);
assert.deepEqual(totals([{price:490000,quantity:2}]),{subtotal:980000,shipping:30000,discount:0,total:1010000});
assert.equal(totals([{price:1000000,quantity:2}],200000).total,1800000);
assert.equal(totals([{price:1000000,quantity:2}],9999999).total,0);
assert.equal(transitions['Hoàn tất'].length,0);
assert.ok(!transitions['Chờ xác nhận'].includes('Đã giao'));
const iphone=navigationCategories.find(c=>c.id==='iphone');
assert.deepEqual(categoryProducts(catalog,iphone).map(p=>p.id),['iphone-15-pro-max','iphone-15','iphone-14','iphone-13','iphone-12','iphone-11','iphone-x','iphone-16']);
assert.ok(categoryProducts(catalog,navigationCategories.find(c=>c.id==='accessories')).every(p=>p.category==='Phụ kiện'));
for(const [category,id] of [['samsung','galaxy-s23'],['xiaomi','redmi-note-13'],['oppo','oppo-reno10'],['tablet','galaxy-tab-s9'],['accessories','airpods-3']]) {
  assert.ok(categoryProducts(catalog,navigationCategories.find(c=>c.id===category)).some(p=>p.id===id));
}
const added={...catalog[0],id:'iphone-new',name:'iPhone mới'};
assert.equal(categoryProducts([...catalog,added],iphone).length,9);
for(const id of ['iphone-16','galaxy-a56','ipad-air-m3','galaxy-tab-s10-fe','airpods-4','galaxy-buds3']) {
  const product=catalog.find(p=>p.id===id);
  assert.ok(product, id);
  assert.ok(existsSync(new URL('../public/images/'+product.image,import.meta.url)), id+' image');
  assert.ok(seedVariants(product).every(v=>v.stock>0), id+' stock');
}
assert.equal(categoryProducts([],iphone).length,0);
assert.equal(categoryUrl(iphone,'iphone-15'),'/product/iphone-15');
const categoryQuery=new URLSearchParams(categoryUrl(iphone).split('?')[1]);
assert.equal(categoryQuery.get('brand'),'Apple');
console.log('15 core checks passed: search, variants, money, state transitions, dynamic categories and exact model links.');
