import {parseNewsFeed,type NewsArticle} from '@/lib/news';

export const dynamic='force-dynamic';
const feeds=[
 {url:'https://www.techradar.com/feeds/tag/phones',source:'TechRadar',host:'www.techradar.com'},
 {url:'https://www.androidauthority.com/feed/',source:'Android Authority',host:'www.androidauthority.com'}
];
let cache:{articles:NewsArticle[];updatedAt:string;expires:number}|undefined;

export async function GET(){
 if(!cache||Date.now()>=cache.expires){
  const results=await Promise.allSettled(feeds.map(async feed=>{
   const response=await fetch(feed.url,{signal:AbortSignal.timeout(7000),headers:{Accept:'application/rss+xml, application/xml'}});
   if(!response.ok)throw Error(`RSS ${response.status}`);
   const xml=await response.text();if(xml.length>4_000_000)throw Error('RSS quá lớn');
   return parseNewsFeed(xml,feed.source,feed.host);
  }));
  const articles=results.flatMap(result=>result.status==='fulfilled'?result.value:[])
   .filter(article=>/\b(smartphones?|phones?|iphones?|android|pixel|oneplus|xiaomi|oppo|redmi|tablets?|mobile)\b|galaxy [sza]\d/i.test(article.title)&&!/\b(headphones?|earbuds?|smartwatches?|watches?)\b/i.test(article.title))
   .sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice(0,12);
  if(articles.length)cache={articles,updatedAt:new Date().toISOString(),expires:Date.now()+86_400_000};
 }
 return Response.json({articles:cache?.articles||[],updatedAt:cache?.updatedAt||null},{headers:{'Cache-Control':'public, max-age=3600'}});
}
