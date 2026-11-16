import {siteOrigin} from '@/lib/site-origin';
export const dynamic='force-dynamic';
export function GET(){return new Response('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /quan-tri\nDisallow: /tai-khoan\nDisallow: /thanh-toan\nDisallow: /gio-hang\nSitemap: '+siteOrigin+'/sitemap.xml',{headers:{'Content-Type':'text/plain; charset=utf-8'}})}
