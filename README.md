# PhoneStore

Website bán điện thoại tiếng Việt, giao diện kem/đen/xanh lime, xây bằng React + TypeScript trên Vinext (tương thích Next.js App Router), Cloudflare Workers + D1.

## Chạy local

Yêu cầu Node.js 24, npm, Git.

```powershell
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_careful_maelstrom.sql
npm run dev -- --port 5173
```

Mở http://127.0.0.1:5173. Chỉ áp dụng migration chưa chạy; dữ liệu mẫu được khởi tạo khi catalog rỗng. Dữ liệu local và hosted hoàn toàn riêng biệt.

## Quản trị

1. Mở `/tai-khoan` → **Cần hỗ trợ tài khoản?** → **Thiết lập quản trị lần đầu**.
2. Nhập tên, email và mật khẩu do bạn chọn (tối thiểu 10 ký tự, chữ hoa/thường/số).
3. Nhập giá trị `ADMIN_SETUP_TOKEN` trong file `.dev.vars` tại thư mục dự án. File được tạo riêng, không đưa vào Git và không nằm trong web assets.
4. Vào `/quan-tri`. Mã chỉ tạo được quản trị đầu tiên; máy chủ chặn quản trị thứ hai. Không có mật khẩu admin mặc định.

Biến môi trường bí mật cùng tên đã được cấu hình riêng cho Site hosted. Không chia sẻ file `.dev.vars` hoặc đưa nó lên kho mã nguồn.

## Kiểm tra

```powershell
npm test
npx tsc --noEmit
npm run build
# Cần dev server đang chạy và .dev.vars; chỉ cho phép localhost
npm run test:integration
```

Integration test tạo dữ liệu QA local (email thuộc example.test), không chạy trên hosted. Test giữ mật khẩu QA trong `.sites-runtime/qa-credential.json` bị Git bỏ qua. Trên DB local đã có admin thật, dùng DB kiểm thử riêng để thử thiết lập admin.

## Cấu trúc chính

- `app/storefront.tsx`, `commerce.tsx`, `admin.tsx`: cửa hàng, thanh toán/tài khoản, quản trị.
- `lib/catalog.ts`: kiểu dữ liệu và catalog mẫu.
- `lib/server.ts`: xác thực, quyền, dữ liệu, đặt hàng nguyên tử.
- `db/schema.ts`, `drizzle/`: schema và migration.
- `public/images/sources.json`, `public/fonts/sources.json`: nguồn tài nguyên.
- `.openai/hosting.json`: định danh Site và binding D1.
- `IMPLEMENTATION.md`: đối chiếu phạm vi, kiểm chứng và phần còn lại của bản đặc tả.

## Phạm vi

Đây là **MVP trải nghiệm**, chưa phải toàn bộ hệ thống thương mại production trong bản đặc tả. Đặt hàng COD lưu dữ liệu thật vào DB của bản trải nghiệm nhưng chưa thu tiền, gửi email/SMS hoặc tạo vận đơn. Các cổng thanh toán, IMEI, đánh giá thật, phân quyền nhân viên và báo cáo nâng cao chưa tích hợp. Xem `IMPLEMENTATION.md` để biết chi tiết.

Ảnh sản phẩm được tải từ Apple, Samsung, OPPO, TGDD để minh họa. Cần kiểm tra quyền dùng thương mại hoặc thay bằng tài sản của cửa hàng trước khi mở bán. Font Be Vietnam Pro dùng SIL OFL (kèm giấy phép).
