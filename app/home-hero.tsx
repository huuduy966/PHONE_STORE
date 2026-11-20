'use client';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Nav } from './shop-context';
export default function HomeHero() {
  return (
    <section className="container launch-section" aria-labelledby="launch-title">
      <div className="launch-hero">
        <div className="launch-main">
          <div className="launch-copy">
            <h1 id="launch-title">Tinh hoa thiết kế.<br /><em>Dấu ấn riêng bạn.</em></h1>
            <p>Đường nét tinh xảo. Chất liệu đẳng cấp.<br />Khám phá những chiếc điện thoại xứng tầm phong cách của bạn.</p>
            <Nav to="/products" className="launch-cta">Khám phá bộ sưu tập <ArrowUpRight size={20} aria-hidden="true" /></Nav>
            <div className="launch-signature"><span>APPLE</span><b aria-hidden="true">/</b><span>SAMSUNG</span><b aria-hidden="true">/</b><span>XIAOMI</span></div>
          </div>
          <div className="launch-art">
            <Image src="/images/hero-luxury-light-3d.webp" alt="iPhone 15 Pro Max titan, Galaxy S24 Ultra và Xiaomi 14 xanh ngọc trên bệ kính 3D trắng ngà trong không gian studio sáng" width={1536} height={1024} fetchPriority="high" />
          </div>
          <span className="launch-edition" aria-hidden="true">TUYỂN CHỌN / 01</span>
        </div>
      </div>
    </section>
  );
}
