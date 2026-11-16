import assert from 'node:assert/strict';
import {ratingFillPercent} from '../lib/rating.ts';

assert.equal(ratingFillPercent(4.9), 90);
assert.equal(ratingFillPercent(4.6), 90);
assert.equal(ratingFillPercent(4.4), 80);
assert.equal(ratingFillPercent(2.5), 50);
assert.equal(ratingFillPercent(0), 0);
assert.equal(ratingFillPercent(5), 100);
assert.equal(ratingFillPercent(6), 100);
assert.equal(ratingFillPercent(-1), 0);

console.log('Rating fill checks passed.');
