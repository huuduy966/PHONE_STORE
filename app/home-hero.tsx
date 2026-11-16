'use client';

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Nav } from './shop-context';

export default function HomeHero() {
  const hero = useRef<HTMLDivElement>(null);
  return <section className="container launch-section" aria-labelledby="launch-title">
    <div className="launch-hero" ref={hero} onPointerMove={e=>{if(e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',String((e.clientX-r.left)/r.width-.5));e.currentTarget.style.setProperty('--my',String((e.clientY-r.top)/r.height-.5));}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--mx','0');e.currentTarget.style.setProperty('--my','0')}}>
      <div className="launch-nebula" aria-hidden="true"/><div className="launch-dust" aria-hidden="true"/>
      <div className="launch-main">
        <div className="launch-copy">
          <div className="launch-kicker"><span/> PHONESTORE / THE NEXT WAVE <b>01 — 26</b></div>
          <h1 id="launch-title"><span>Thiết kế</span><span>của bạn.</span><span>Vượt mọi <em>giới hạn.</em></span></h1>
          <p>Công nghệ đỉnh cao. Phong cách dẫn đầu.<br/>Tương lai nằm trong tay bạn.</p>
          <div className="launch-offer"><span>ƯU ĐÃI DÀNH RIÊNG CHO BẠN</span><strong>Giảm 200.000đ</strong><small>Đơn từ 5 triệu · Mã HELLO200</small></div>
          <Nav to="/dien-thoai?deal=1" className="launch-cta"><span>CHỐT DEAL NGAY</span><ArrowUpRight size={21} aria-hidden="true" /></Nav>
        </div>
        <div className="launch-art" aria-hidden="true"><div className="launch-halo"/><div className="launch-ring ring-one"/><div className="launch-ring ring-two"/><img src="/images/hero-3d-studio.webp" alt="" width={1536} height={1024} fetchPriority="high"/><div className="launch-orbit-label">TITANIUM / NEXT GEN<br/><strong>POWER IN MOTION</strong></div></div>
        <span className="launch-edition" aria-hidden="true">ENGINEERED FOR WHAT'S NEXT / 01</span>
      </div>
      <div className="launch-ticker" aria-label="Khám phá điện thoại flagship và ưu đãi"><div aria-hidden="true">FLAGSHIP PERFORMANCE <i>✦</i> CAMERA ĐỈNH CAO <i>✦</i> MÀN HÌNH SẮC NÉT <i>✦</i> PIN BỀN BỈ <i>✦</i> ƯU ĐÃI HELLO200 <i>✦</i> FLAGSHIP PERFORMANCE <i>✦</i> CAMERA ĐỈNH CAO <i>✦</i> MÀN HÌNH SẮC NÉT <i>✦</i> PIN BỀN BỈ <i>✦</i> ƯU ĐÃI HELLO200 <i>✦</i></div></div>
    </div>
  </section>;
}
