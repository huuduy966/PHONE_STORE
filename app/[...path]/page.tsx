import {productImageSource} from '@/lib/product-image';
import Storefront from '../storefront';
import { getStoreProducts } from '@/lib/server';
import { notFound } from 'next/navigation';
export const dynamic='force-dynamic';
import {siteOrigin as origin} from '@/lib/site-origin';
export async function generateMetadata({params}:{params:Promise<{path:string[]}>}) {const {path}=await params;const p=path[0]==='product'?(await getStoreProducts()).find(p=>p.id===path[1]):null;return {title:p?.name||({'products':'Khám phá sản phẩm','cart':'Giỏ hàng','checkout':'Thanh toán','account':'Tài khoản','admin':'Quản trị','order-tracking':'Tra cứu đơn hàng'} as Record<string,string>)[path[0]]||'Khám phá PhoneStore',description:p?.description,alternates:{canonical:origin+'/'+path.join('/')},robots:['admin','account','checkout','cart','order-success'].includes(path[0])?{index:false,follow:false}:undefined};}
export default async function Page({params}:{params:Promise<{path:string[]}>}) {
 const {path}=await params;const products=await getStoreProducts();const product=path[0]==='product'?products.find(p=>p.id===path[1]):null;
 if(!['products','product','cart','checkout','order-success','compare','favorites','account','order-tracking','admin','policies','about','contact','news'].includes(path[0])||(path[0]==='product'&&!product))notFound();
 const schema=product?{'@context':'https://schema.org','@type':'Product',name:product.name,description:product.description,image:new URL(productImageSource(product.image),origin).toString(),sku:product.id,brand:{'@type':'Brand',name:product.brand},offers:{'@type':'AggregateOffer',priceCurrency:'VND',lowPrice:product.price,highPrice:Math.max(...(product.variants||[]).map(v=>v.price)),offerCount:product.variants?.length,availability:product.variants?.some(v=>v.stock>0)?'https://schema.org/InStock':'https://schema.org/OutOfStock'}}:null;
 return <>{schema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>}<Storefront initialPath={'/'+path.join('/')} initialProducts={products}/></>;
}
