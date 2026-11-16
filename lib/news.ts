export type NewsArticle={title:string;url:string;source:string;publishedAt:string;image?:string};

function plain(value:string){
 return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]*>/g,'').replace(/&#(x[\da-f]+|\d+);|&(?:amp|lt|gt|quot|apos);/gi,entity=>{
  const named:Record<string,string>={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'"};
  if(entity.startsWith('&#')){const hex=entity[2]?.toLowerCase()==='x';const code=parseInt(entity.slice(hex?3:2,-1),hex?16:10);return code>0&&code<=0x10ffff?String.fromCodePoint(code):''}
  return named[entity.toLowerCase()]||entity
 }).trim();
}

export function parseNewsFeed(xml:string,source:string,host:string):NewsArticle[]{
 return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].slice(0,30).flatMap(([,item])=>{
  const field=(name:string)=>plain(item.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'))?.[1]||'');
  const title=field('title'),rawUrl=field('link'),date=new Date(field('pubDate'));
  const image=[...(item.match(/<(?:enclosure|media:content|media:thumbnail)\b[^>]*>/gi)||[])].map(tag=>{
   const raw=tag.match(/\burl=["']([^"']+)["']/i)?.[1];
   if(!raw||(/\btype=["']([^"']+)["']/i.test(tag)&&!/\btype=["']image\//i.test(tag)))return undefined;
   try{const url=new URL(plain(raw));return url.protocol==='https:'&&(url.hostname===host||host==='www.techradar.com'&&url.hostname==='cdn.mos.cms.futurecdn.net')?url.toString():undefined}catch{return undefined}
  }).find(Boolean);
  try{const url=new URL(rawUrl);if(!title||title.length>220||url.protocol!=='https:'||url.hostname!==host||Number.isNaN(date.getTime()))return [];return [{title,url:url.toString(),source,publishedAt:date.toISOString(),image}]}
  catch{return []}
 });
}
