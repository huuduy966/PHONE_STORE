'use client';

import { ArrowUpRight } from 'lucide-react';
import { Nav } from './shop-context';

export default function HomeHero() {
  return (
    <section className="container launch-section" aria-labelledby="launch-title">
      <div className="launch-hero">
        <div className="launch-main">
          <div className="launch-copy">
            <h1 id="launch-title">Thiết kế của bạn,<br />phong cách<br />của bạn.</h1>
            <p>Một thiết kế cuốn hút.<br />Một trải nghiệm xứng tầm bạn.</p>
            <Nav to="/dien-thoai" className="launch-cta">Khám phá ngay <ArrowUpRight size={21} aria-hidden="true" /></Nav>
          </div>

          <div className="launch-art">
            <img src="/images/hero-3d-studio.webp" alt="Minh họa 3D điện thoại titan lơ lửng giữa dải kim loại bạc và những khối cầu tím" width={1536} height={1024} fetchPriority="high" />
          </div>
          <span className="launch-edition" aria-hidden="true">THE NEXT CHAPTER / 01</span>
        </div>

      </div>
    </section>
  );
}
