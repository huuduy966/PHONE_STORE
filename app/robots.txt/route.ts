import {siteOrigin} from '@/lib/site-origin';
export const dynamic='force-dynamic';
export function GET(){return new Response('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /account\nDisallow: /checkout\nDisallow: /cart\nSitemap: '+siteOrigin+'/sitemap.xml',{headers:{'Content-Type':'text/plain; charset=utf-8'}})}
