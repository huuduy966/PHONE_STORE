import {getStoreProducts} from '@/lib/server';
import {siteOrigin} from '@/lib/site-origin';
export const dynamic='force-dynamic';
export async function GET(){const paths=['','products','about','news','policies',...(await getStoreProducts()).map(p=>'product/'+p.id)];return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>'<url><loc>'+siteOrigin+'/'+p+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml'}})}
