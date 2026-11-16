'use client';
import {useEffect,useRef} from 'react';
import {ArrowUpRight,ChevronDown,Menu} from 'lucide-react';
import {navigationCategories,categoryProducts,categoryUrl,type NavigationCategory} from '@/lib/categories';
import {money} from '@/lib/catalog';
import {Nav,useShop} from './shop-context';

export default function CategoryMenu({category,open,onOpen}:{category?:NavigationCategory;open:boolean;onOpen:(open:boolean)=>void}) {
  const {products,path}=useShop();
  const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
  const id='category-'+(category?.id||'all');
  const groups=(category?[category]:navigationCategories).map(c=>({category:c,products:categoryProducts(products,c)})).filter(g=>g.products.length);
  useEffect(()=>{onOpen(false)},[path]);
  useEffect(()=>{
    if(!open)return;
    const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))onOpen(false)};
    document.addEventListener('pointerdown',outside);
    return()=>document.removeEventListener('pointerdown',outside);
  },[open]);
  return <div ref={root} className={'category-nav '+(open?'is-open':'')} onPointerEnter={e=>{if(e.pointerType==='mouse')onOpen(true)}} onPointerLeave={e=>{if(e.pointerType==='mouse')onOpen(false)}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))onOpen(false)}} onKeyDown={e=>{if(e.key==='Escape'&&open){e.preventDefault();onOpen(false);trigger.current?.focus()}}}>
    <button ref={trigger} type="button" id={id+'-trigger'} className={'category-trigger '+(!category?'all-categories':'')} aria-expanded={open} aria-controls={id} onClick={()=>onOpen(!open)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();onOpen(true)}}}>
      {!category&&<Menu size={18}/>} {category?.label||'Tất cả sản phẩm'} <ChevronDown size={13}/>
    </button>
    {open&&<div id={id} className={'category-popover '+(!category?'all-category-popover':'')} aria-labelledby={id+'-trigger'}>
      <div className="category-popover-heading"><div><span className="eyebrow">KHÁM PHÁ THEO DANH MỤC</span><h2>{category?.label||'Tìm sản phẩm bạn yêu thích'}</h2></div><Nav to={category?categoryUrl(category):'/dien-thoai'} className="text-link">Xem tất cả {category?.label}<ArrowUpRight size={16}/></Nav></div>
      {groups.length?<div className="category-group-grid">{groups.map(group=><section className="category-group" key={group.category.id}>
        {!category&&<Nav to={categoryUrl(group.category)} className="category-group-title">{group.category.label}<span>{group.products.length} sản phẩm</span></Nav>}
        <div className="category-models">{group.products.map(p=><Nav key={p.id} to={categoryUrl(group.category,p.id)} className="category-model"><img src={'/images/'+p.image} alt="" width={52} height={60}/><span><b>{p.name}</b><small>{p.storages.join(' · ')}</small><strong>Từ {money(p.price)}</strong></span></Nav>)}</div>
      </section>)}</div>:<p className="category-empty">Danh mục này chưa có sản phẩm hiển thị.</p>}
      <div className="category-popover-footer">Danh mục được cập nhật theo sản phẩm đang hiển thị tại cửa hàng.</div>
    </div>}
  </div>;
}
