'use client';

import {useEffect,useState} from 'react';
import {Ticket} from 'lucide-react';
import {money} from '@/lib/catalog';
import {api,Alert,Busy} from './storefront';
import {useShop} from './shop-context';

type Voucher={code:string;amount:number;minimum:number;expires:string};

export default function AccountVouchers(){
  const {toast}=useShop();
  const [vouchers,setVouchers]=useState<Voucher[]|null>(null);
  const [error,setError]=useState('');
  useEffect(()=>{
    let active=true;
    api<{coupons:Voucher[]}>('coupons').then(data=>{if(active)setVouchers(data.coupons)}).catch(e=>{if(active)setError((e as Error).message)});
    return()=>{active=false};
  },[]);
  return <section className="account-vouchers"><h2>Voucher</h2><p>Chọn mã giảm giá và nhập mã khi thanh toán.</p>
    {error&&<Alert>{error}</Alert>}
    {!error&&!vouchers&&<div className="empty"><Busy/><p>Đang tải voucher…</p></div>}
    {vouchers?.length===0&&<div className="panel"><p>Hiện chưa có voucher nào còn hiệu lực.</p></div>}
    {vouchers?.map(v=><article className="panel voucher-card" key={v.code}>
      <Ticket size={24} aria-hidden="true"/>
      <div><h3>Giảm {money(v.amount)}</h3><p>Cho đơn từ {money(v.minimum)}</p><small>Hạn dùng: {new Date(v.expires).toLocaleDateString('vi-VN')}</small><code>{v.code}</code></div>
      <button className="button small" onClick={async()=>{try{await navigator.clipboard.writeText(v.code);toast('Đã sao chép mã '+v.code)}catch{toast('Không thể sao chép mã. Hãy nhập '+v.code+' khi thanh toán.')}}}>Sao chép mã</button>
    </article>)}
  </section>;
}
