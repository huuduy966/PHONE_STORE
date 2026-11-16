import Storefront from '../storefront';
import { getStoreProducts } from '@/lib/server';
import { notFound } from 'next/navigation';
export const dynamic='force-dynamic';
import {siteOrigin as origin} from '@/lib/site-origin';
export async function generateMetadata({params}:{params:Promise<{path:string[]}>}) {const {path}=await params;const p=path[0]==='san-pham'?(await getStoreProducts()).find(p=>p.id===path[1]):null;return {title:p?.name||({'dien-thoai':'Khám phá sản phẩm','gio-hang':'Giỏ hàng','thanh-toan':'Thanh toán','tai-khoan':'Tài khoản','quan-tri':'Quản trị','tra-cuu':'Tra cứu đơn hàng'} as Record<string,string>)[path[0]]||'Khám phá PhoneStore',description:p?.description,alternates:{canonical:origin+'/'+path.join('/')},robots:['quan-tri','tai-khoan','thanh-toan','gio-hang','dat-hang-thanh-cong'].includes(path[0])?{index:false,follow:false}:undefined};}
export default async function Page({params}:{params:Promise<{path:string[]}>}) {
 const {path}=await params;const products=await getStoreProducts();const product=path[0]==='san-pham'?products.find(p=>p.id===path[1]):null;
 if(!['dien-thoai','san-pham','gio-hang','thanh-toan','dat-hang-thanh-cong','so-sanh','yeu-thich','tai-khoan','tra-cuu','quan-tri','chinh-sach','ve-phonestore','lien-he','tin-tuc'].includes(path[0])||(path[0]==='san-pham'&&!product))notFound();
 const schema=product?{'@context':'https://schema.org','@type':'Product',name:product.name,description:product.description,image:origin+'/images/'+product.image,sku:product.id,brand:{'@type':'Brand',name:product.brand},offers:{'@type':'AggregateOffer',priceCurrency:'VND',lowPrice:product.price,highPrice:Math.max(...(product.variants||[]).map(v=>v.price)),offerCount:product.variants?.length,availability:product.variants?.some(v=>v.stock>0)?'https://schema.org/InStock':'https://schema.org/OutOfStock'}}:null;
 return <>{schema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>}<Storefront initialPath={'/'+path.join('/')} initialProducts={products}/></>;
}
