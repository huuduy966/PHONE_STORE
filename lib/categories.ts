import type { Product } from './catalog';

export const navigationCategories = [
  {id:'iphone',label:'iPhone',brand:'Apple',category:'Điện thoại'},
  {id:'samsung',label:'Samsung',brand:'Samsung',category:'Điện thoại'},
  {id:'xiaomi',label:'Xiaomi',brand:'Xiaomi',category:'Điện thoại'},
  {id:'oppo',label:'OPPO',brand:'OPPO',category:'Điện thoại'},
  {id:'tablet',label:'Máy tính bảng',brand:'',category:'Máy tính bảng'},
  {id:'accessories',label:'Phụ kiện',brand:'',category:'Phụ kiện'},
] as const;
export type NavigationCategory = typeof navigationCategories[number];
export function categoryProducts(products:Product[],category:NavigationCategory) {
  return products.filter(p=>p.category===category.category&&(!category.brand||p.brand===category.brand));
}
export function categoryUrl(category:NavigationCategory,model?:string) {
  const query=new URLSearchParams({category:category.category});
  if(category.brand)query.set('brand',category.brand);
  if(model)query.set('model',model);
  return '/dien-thoai?'+query.toString();
}
