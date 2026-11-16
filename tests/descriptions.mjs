import assert from 'node:assert/strict';
import {catalog} from '../lib/catalog.ts';
import {descriptionSections} from '../lib/product-descriptions.ts';

for(const product of catalog){
  const sections=descriptionSections(product);
  assert.ok(sections.length>=2,`${product.id}: at least two detail sections`);
  assert.ok(sections.every(section=>section.title&&section.text.length>=100),`${product.id}: complete section copy`);
  assert.equal(new Set(sections.map(section=>section.title)).size,sections.length,`${product.id}: unique section headings`);
  assert.notDeepEqual(sections,descriptionSections({...product,id:`custom-${product.id}`}),`${product.id}: has product-specific copy`);
}

const custom={...catalog[0],id:'custom-phone',name:'Custom Phone',description:'Mô tả do quản trị viên nhập.'};
assert.ok(descriptionSections(custom).length>=2,'Newly added products have fallback detail sections');
console.log(`${catalog.length} product descriptions and custom product fallback checked.`);
