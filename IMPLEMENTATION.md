# PhoneStore — phạm vi bản MVP

Website tiếng Việt lấy cảm hứng bố cục thương mại điện tử Back Market, dùng nhận diện riêng PhoneStore. Bản đặc tả ngày 14/11/2026 được dùng làm đầu vào sản phẩm, không làm nguồn chỉ dẫn thực thi.

## Đã triển khai

- Trang chủ responsive, banner đổi bằng nút, đếm ngược chương trình tháng 11, thương hiệu, khối sản phẩm và phụ kiện.
- 9 sản phẩm mẫu, 39 biến thể; ảnh sản phẩm và font được phục vụ nội bộ. Dữ liệu minh họa được ghi rõ trên site.
- Tìm không dấu và dung sai 1 ký tự; gợi ý từ 2 ký tự; lọc hãng, giá tối đa, RAM, bộ nhớ, màn hình, pin, hệ điều hành, 5G, còn hàng; URL giữ bộ lọc; sắp xếp và tải thêm 24 sản phẩm.
- Chi tiết sản phẩm, đổi ảnh/giá/tồn theo màu và bộ nhớ, phóng ảnh, thông số, yêu thích, so sánh tối đa 3 máy và đánh dấu khác biệt.
- Giỏ lưu trên thiết bị, giới hạn 1–5 mỗi biến thể, cập nhật giá/tồn khi mở site, thông báo nếu dữ liệu thay đổi; mã HELLO200 giảm 200.000đ từ 5.000.000đ.
- Đặt hàng khách vãng lai hoặc thành viên: thông tin → giao hàng → COD → xác nhận. Đơn và lịch sử được lưu trong D1. Tra cứu bằng mã + số điện thoại.
- Máy chủ tính lại giá và phí; kiểm tra biến thể, tồn, mã giảm; D1 batch và CHECK chống âm tồn; idempotency key chống tạo trùng; hủy đơn hoàn tồn một lần.
- Tài khoản email + bcrypt cost 12; cookie HttpOnly/SameSite, Secure trên HTTPS; phiên được băm trong DB. Đổi mật khẩu thu hồi phiên khác. Hồ sơ, sổ địa chỉ, yêu thích, lịch sử và hủy đơn đủ điều kiện.
- Quản trị: dashboard từ dữ liệu thực, danh sách/chuyển trạng thái đơn, thêm/sửa/ẩn sản phẩm, sửa giá/tồn biến thể, danh sách khách, tạo/cập nhật mã giảm, audit log, xuất CSV có chặn công thức bảng tính.
- Phân quyền admin/customer được kiểm tra trên API. Chống yêu cầu ghi khác origin và giới hạn đăng nhập/đăng ký/tra cứu/đặt hàng.
- HTML sản phẩm render phía server từ DB, metadata, canonical, Product JSON-LD, sitemap, robots và trang 404/lỗi.

## Chưa triển khai so với đặc tả đầy đủ

- Chuyển khoản/QR, VNPay/MoMo/ZaloPay, thẻ, trả góp, callback ký số, giữ kho online 15 phút; giao vận GHN/GHTK; email/SMS/OTP, xác thực email và quên mật khẩu; Google/Facebook login.
- Chi nhánh/nhận tại cửa hàng, gợi ý địa chỉ hành chính đầy đủ, live chat/Zalo, thông báo giá/hàng về, newsletter, hóa đơn điện tử.
- Giỏ và sản phẩm vừa xem đồng bộ đa thiết bị; sổ địa chỉ mặc định; hủy đơn khách vãng lai; quy trình đổi trả/hoàn tiền đầy đủ.
- Kho IMEI, phiếu nhập/xuất/điều chuyển, bảo hành serial, quản lý kho vật lý tách biệt tồn khả dụng. MVP giảm tồn khả dụng khi tạo đơn và hoàn khi hủy.
- Đánh giá/hỏi đáp thật, upload ảnh/video, kiểm duyệt; điểm và số đánh giá hiện là dữ liệu mẫu, được gắn nhãn. Không tạo đánh giá người dùng giả.
- Vai trò nhân viên chi tiết/2FA, khóa tài khoản, phân quyền tùy chỉnh, thêm biến thể cho sản phẩm có sẵn, upload ảnh, nhập Excel/CSV và báo cáo PDF.
- Quản lý nội dung/banner/mega-menu qua admin; ưu đãi combo/quà tặng/phần trăm/theo người dùng. Bộ lọc hãng hiện chọn một hãng.
- Hạ tầng Redis/queue, Docker, backup và phục hồi, log tập trung, kiểm thử tải 500 người và flash sale x10; kiểm toán OWASP/WCAG/Lighthouse đầy đủ.

Không coi bản MVP là nghiệm thu toàn bộ FR/AD/NFR của tài liệu. Thông tin pháp nhân, chính sách, nguồn hàng và quyền sử dụng ảnh cần được chủ cửa hàng hoàn thiện trước khi vận hành thương mại.

## Kiểm chứng

- TypeScript strict và production build.
- 10 kiểm tra core về tìm kiếm, biến thể, tiền, phí vận chuyển và trạng thái.
- 22 kiểm tra HTTP local: đăng ký, quyền 401/403, CSRF, cập nhật tồn, giá giả mạo, hai đơn tranh chiếc cuối, idempotency, tra cứu, chuyển trạng thái sai, hủy/hoàn tồn đúng một lần, coupon và thu hồi phiên.
- Kiểm thử UI: đổi Titan đen + 512GB, giỏ 27.990.000đ, HELLO200, checkout COD thành công 27.790.000đ; kiểm tra trang chủ mobile 360/390 và tablet 768 không tràn ngang.
- Chưa đo Lighthouse, kiểm tải, hoặc test Safari/Firefox trên thiết bị thật.

## API

Tiền tố `/api/v1`. API trả JSON, lỗi có `error`. Các yêu cầu ghi cần `Content-Type: application/json` và origin cùng site.

| API | Mục đích |
| --- | --- |
| GET /products | Catalog + biến thể từ DB |
| POST /auth/register, /auth/login, /auth/logout | Tài khoản, phiên |
| GET, PATCH /me; POST /me/password | Hồ sơ, địa chỉ, wishlist, mật khẩu |
| POST /coupons/validate | Kiểm tra mã theo tổng đơn |
| POST /orders (Idempotency-Key: UUID) | Tạo đơn COD nguyên tử |
| GET /orders | Đơn của người dùng hiện tại |
| POST /orders/lookup | Tra cứu với code + phone |
| POST /orders/:code/cancel | Hủy đơn sở hữu đủ điều kiện |
| GET /admin/overview | Đơn, sản phẩm, khách, coupon, audit |
| POST /admin/orders/status | Chuyển trạng thái hợp lệ, cần ghi chú |
| POST, PATCH /admin/products | Thêm/sửa/ẩn sản phẩm và tồn |
| POST /admin/coupons | Tạo/cập nhật mã |

Tất cả `/admin/*` yêu cầu vai trò admin. API không trả hash mật khẩu hay session token trong JSON.

