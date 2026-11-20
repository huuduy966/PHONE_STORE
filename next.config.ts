import type { NextConfig } from 'next';
const routes: [string, string][] = [
  ['dat-hang-thanh-cong', 'order-success'], ['ve-phonestore', 'about'],
  ['dien-thoai', 'products'], ['san-pham', 'product'], ['gio-hang', 'cart'],
  ['thanh-toan', 'checkout'], ['so-sanh', 'compare'], ['yeu-thich', 'favorites'],
  ['tai-khoan', 'account'], ['tra-cuu', 'order-tracking'], ['quan-tri', 'admin'],
  ['lien-he', 'contact'], ['tin-tuc', 'news'],
];
const nextConfig: NextConfig = {
  agentRules: false,
  async redirects() {
    return [
      { source: '/chinh-sach/bao-mat', destination: '/policies/privacy', permanent: true },
      { source: '/chinh-sach/giao-hang', destination: '/policies/delivery', permanent: true },
      { source: '/chinh-sach/:path*', destination: '/policies/:path*', permanent: true },
      ...routes.map(([from, to]) => ({source: `/${from}/:path*`, destination: `/${to}/:path*`, permanent: true})),
    ];
  },
};
export default nextConfig;
