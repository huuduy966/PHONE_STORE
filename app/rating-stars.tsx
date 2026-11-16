'use client';

import {Star} from 'lucide-react';
import {ratingFillPercent} from '@/lib/rating';

export default function RatingStars({value}: {value: number}) {
  return <div className="rating-stars" aria-hidden="true">
    <div className="rating-stars-outline">{Array.from({length: 5}, (_, i) => <Star key={i}/>)}</div>
    <div className="rating-stars-fill" style={{width: `${ratingFillPercent(value)}%`}}>
      {Array.from({length: 5}, (_, i) => <Star key={i}/>)}
    </div>
  </div>;
}
