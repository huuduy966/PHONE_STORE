# PhoneStore

Website bán điện thoại dùng Next.js trên Vercel và database Turso (SQLite).

## Deploy trên Vercel

1. Đưa mã nguồn lên GitHub, import repository vào Vercel và deploy.
2. Trong project Vercel, mở **Storage** hoặc **Marketplace**, chọn **Turso**, tạo database và kết nối với project. Tích hợp tự thêm `TURSO_DATABASE_URL` và `TURSO_AUTH_TOKEN` vào environment của Vercel.
3. Trong **Settings → Environment Variables**, thêm `ADMIN_SETUP_TOKEN` với một giá trị bí mật dài do bạn tự chọn. Nếu dùng tên miền riêng, thêm `NEXT_PUBLIC_SITE_URL` (ví dụ `https://example.com`).
4. Redeploy. Build sẽ tự tạo các bảng còn thiếu và khi truy cập lần đầu sẽ khởi tạo sản phẩm mẫu. Chạy `npm run db:init` khi cần khởi tạo lại schema, lệnh không xóa dữ liệu.

Khi chưa kết nối database, trang hiển thị catalog mẫu, nhưng tài khoản, quản trị và đặt hàng chưa hoạt động. Dữ liệu Cloudflare D1 cũ không tự chuyển sang Turso; cần xuất/nhập riêng nếu muốn giữ.

## Chạy local

Cần Node.js 24. Chạy `npm ci`, tạo `.env.local` với `TURSO_DATABASE_URL=file:.sites-runtime/local.sqlite` và `ADMIN_SETUP_TOKEN` riêng, sau đó chạy `npm run db:init` và `npm run dev`. Truy cập http://localhost:5173. Database local và database trên Vercel độc lập.

## Quản trị

1. Mở `/account` → **Cần hỗ trợ tài khoản?** → **Thiết lập quản trị lần đầu**.
2. Nhập tên, email và mật khẩu do bạn chọn (tối thiểu 10 ký tự, chữ hoa/thường/số).
3. Nhập giá trị `ADMIN_SETUP_TOKEN` trong biến môi trường `ADMIN_SETUP_TOKEN` được thiết lập ở Vercel hoặc `.env.local`.
4. Vào `/admin`. Mã chỉ tạo được quản trị đầu tiên; máy chủ chặn quản trị thứ hai. Không có mật khẩu admin mặc định.

Không chia sẻ token hoặc đưa file môi trường lên kho mã nguồn.

## Phân quyền dữ liệu

Project dùng Turso SQLite, không dùng Supabase/PostgreSQL; quyền truy cập được kiểm tra trong mã server `lib/server.ts`, không cấp kết nối database cho trình duyệt. Các bảng `profiles`, `messages`, `files` trong ví dụ Supabase không tồn tại ở project này.

- `products`, `variants`: công khai chỉ đọc sản phẩm đang hiển thị; thay đổi sản phẩm, giá và tồn kho cần phiên admin.
- `users`, `sessions`: người dùng chỉ đọc/sửa hồ sơ của chính mình qua cookie phiên; chỉ admin xem danh sách khách hàng.
- `orders`: lịch sử chỉ trả đơn có `user_id` trùng người đăng nhập; huỷ đơn kiểm tra chủ đơn trên server. Khách vãng lai tra cứu bằng mã đơn và số điện thoại.
- `coupons`: người đăng nhập xem mã còn hiệu lực; chỉ admin tạo/cập nhật. `audit_logs` chỉ admin xem. `rate_limits` chỉ được server sử dụng.
- API không có thao tác xoá bản ghi. Nút xoá giỏ hàng chỉ sửa trạng thái giỏ trong trình duyệt.

Chạy `npm run test:authorization` với dev server local đang chạy để kiểm tra các yêu cầu API trực tiếp vượt quyền. Nếu chuyển database sang Supabase, cần thiết kế và bật RLS cho **mọi** bảng tại database, đồng thời giữ kiểm tra quyền phía server.

## Giới hạn yêu cầu

- Đăng nhập: tối đa 10 yêu cầu mỗi IP và 5 yêu cầu mỗi email trong 15 phút. Đăng nhập thành công đặt lại bộ đếm của email; yêu cầu vượt ngưỡng trả `429`.
- Các đường dẫn `/api/v1/ai` và `/api/v1/ai/*`: tối đa 20 yêu cầu mỗi IP trong 1 phút, kiểm tra trước khi xử lý. Hiện chưa có endpoint AI; khi thêm, đặt nó dưới nhóm đường dẫn này để giới hạn có hiệu lực.
- Bộ đếm lưu trong bảng `rate_limits`. Chạy `npm run test:rate-limit` với dev server local để kiểm tra ngưỡng đăng nhập và nhóm API AI.

## Kiểm tra input và SQL

API `/api/v1` kiểm tra body JSON bằng Zod trên server, từ chối field ngoài schema và query parameter chưa được hỗ trợ. Mã đơn trên URL, email, số điện thoại, giá, số lượng và idempotency key cũng được kiểm tra trước khi xử lý. Input sai định dạng trả `400 Bad Request`; body quá lớn trả `413`, sai `Content-Type` trả `415`, còn xung đột giá/tồn/trạng thái trả `409`.

Các giá trị từ request đi vào database qua prepared statement với `.bind(...)`; câu SQL được chọn từ các chuỗi cố định, không ghép input vào SQL. Chạy `npm run test:input-validation` với dev server local để kiểm tra JSON, query, body, đường dẫn và một số payload SQL injection.

## Kiểm tra

```powershell
npm test
npx tsc --noEmit
npm run build
# Cần dev server đang chạy và ADMIN_SETUP_TOKEN; chỉ cho phép localhost
npm run test:integration
```

Integration test tạo dữ liệu QA local (email thuộc example.test), không chạy trên hosted. Test giữ mật khẩu QA trong `.sites-runtime/qa-credential.json` bị Git bỏ qua. Trên DB local đã có admin thật, dùng DB kiểm thử riêng để thử thiết lập admin.

## Cấu trúc chính

- `app/storefront.tsx`, `commerce.tsx`, `admin.tsx`: cửa hàng, thanh toán/tài khoản, quản trị.
- `lib/catalog.ts`: kiểu dữ liệu và catalog mẫu.
- `lib/server.ts`: xác thực, quyền, dữ liệu, đặt hàng nguyên tử.
- `db/schema.ts`, `drizzle/`: schema và migration.
- `public/images/sources.json`, `public/fonts/sources.json`: nguồn tài nguyên.
- `lib/database.ts`: kết nối Turso và transaction.
- `IMPLEMENTATION.md`: đối chiếu phạm vi, kiểm chứng và phần còn lại của bản đặc tả.

## Phạm vi

Đây là **MVP trải nghiệm**, chưa phải toàn bộ hệ thống thương mại production trong bản đặc tả. Đặt hàng COD lưu dữ liệu thật vào DB của bản trải nghiệm nhưng chưa thu tiền, gửi email/SMS hoặc tạo vận đơn. Các cổng thanh toán, IMEI, đánh giá thật, phân quyền nhân viên và báo cáo nâng cao chưa tích hợp. Xem `IMPLEMENTATION.md` để biết chi tiết.

Ảnh sản phẩm được tải từ Apple, Samsung, OPPO, TGDD để minh họa. Cần kiểm tra quyền dùng thương mại hoặc thay bằng tài sản của cửa hàng trước khi mở bán. Font Be Vietnam Pro dùng SIL OFL (kèm giấy phép).
