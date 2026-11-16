import assert from 'node:assert/strict';
import {parseNewsFeed} from '../lib/news.ts';

const xml=`<rss><channel><item><title><![CDATA[Điện thoại &amp; pin mới]]></title><link>https://www.techradar.com/phones/example</link><pubDate>Sun, 15 Nov 2026 08:00:00 GMT</pubDate><enclosure url="https://cdn.mos.cms.futurecdn.net/phone.jpg" type="image/jpeg" /></item><item><title>Liên kết lạ</title><link>https://example.com/other</link></item></channel></rss>`;
const articles=parseNewsFeed(xml,'TechRadar','www.techradar.com');
assert.equal(articles.length,1);
assert.equal(articles[0].title,'Điện thoại & pin mới');
assert.equal(articles[0].url,'https://www.techradar.com/phones/example');
assert.equal(articles[0].source,'TechRadar');
assert.equal(articles[0].publishedAt,'2026-11-15T08:00:00.000Z');
assert.equal(articles[0].image,'https://cdn.mos.cms.futurecdn.net/phone.jpg');
const androidXml=`<item><title>Pixel 10 review</title><link>https://www.androidauthority.com/pixel-10/</link><pubDate>Sun, 15 Nov 2026 08:00:00 GMT</pubDate><media:content url="https://www.androidauthority.com/wp-content/uploads/pixel.jpg" medium="image"/></item>`;
assert.equal(parseNewsFeed(androidXml,'Android Authority','www.androidauthority.com')[0].image,'https://www.androidauthority.com/wp-content/uploads/pixel.jpg');
assert.equal(parseNewsFeed(androidXml.replace('www.androidauthority.com/wp-content','example.com/wp-content'),'Android Authority','www.androidauthority.com')[0].image,undefined);
console.log('News feed parsing checks passed.');
