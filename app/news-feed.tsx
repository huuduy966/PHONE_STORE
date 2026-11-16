'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,Newspaper} from 'lucide-react';
import type {NewsArticle} from '@/lib/news';

export default function NewsFeed({limit=12}:{limit?:number}){
 const [articles,setArticles]=useState<NewsArticle[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;fetch('/api/news',{cache:'no-store'}).then(r=>r.json() as Promise<{articles:NewsArticle[]}>).then(data=>{if(active&&Array.isArray(data.articles))setArticles(data.articles)}).catch(()=>{}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 if(loading)return <p className="news-status">Đang tải tin công nghệ mới...</p>;
 if(!articles.length)return <p className="news-status">Chưa lấy được tin mới. Bạn có thể xem trực tiếp tại <a href="https://www.techradar.com/phones" target="_blank" rel="noopener noreferrer">TechRadar</a> hoặc <a href="https://www.androidauthority.com/" target="_blank" rel="noopener noreferrer">Android Authority</a>.</p>;
 return <div className="home-news-grid">{articles.slice(0,limit).map(article=><a className="home-news-card" href={article.url} target="_blank" rel="noopener noreferrer" key={article.url}><div className="news-card-art"><Newspaper size={38}/>{article.image&&<img src={article.image} alt="" loading="lazy" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display='none'}}/>}</div><div><span className="eyebrow">{article.source} · {new Date(article.publishedAt).toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}</span><h3>{article.title}</h3><span className="text-link">Đọc bài gốc <ArrowUpRight size={16}/></span></div></a>)}</div>;
}
