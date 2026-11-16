import type {Product} from './catalog';

export type DescriptionSection={title:string;text:string};

// Copy for the seeded catalog lives outside product rows so existing D1 records also receive it.
const details:Record<string,readonly [string,string]>={
  'iphone-15-pro-max':[
    'Khung titan tạo cảm giác cao cấp mà vẫn dễ cầm nắm. Màn hình Super Retina XDR 6,7 inch dành nhiều không gian cho ảnh, video và công việc; các lựa chọn màu titan giữ vẻ ngoài tinh giản của dòng Pro Max.',
    'Chip A17 Pro đáp ứng các tác vụ nặng và chuyển đổi ứng dụng hằng ngày. Camera chính 48MP kết hợp hệ thống ba camera và zoom quang học 5x giúp bạn linh hoạt hơn từ ảnh chân dung đến khung cảnh ở xa; máy hỗ trợ kết nối 5G.'
  ],
  'galaxy-s24-ultra':[
    'Galaxy S24 Ultra kết hợp khung titan, màn hình phẳng 6,8 inch và bút S Pen tích hợp. Không gian hiển thị rộng thuận tiện để ghi chú, xem nội dung và thao tác nhiều việc trên một thiết bị.',
    'Snapdragon 8 Gen 3 và RAM 12GB phục vụ các ứng dụng cần hiệu năng cao. Cụm camera có cảm biến chính 200MP cùng nhiều tiêu cự, còn pin 5.000mAh và kết nối 5G hỗ trợ nhịp sử dụng di động mỗi ngày.'
  ],
  'iphone-15':[
    'iPhone 15 có màn hình 6,1 inch vừa tay, Dynamic Island hiển thị hoạt động đang diễn ra và các màu sắc dễ phối với phong cách cá nhân. Đây là lựa chọn phù hợp nếu bạn muốn màn hình rõ nét mà không cần thân máy quá lớn.',
    'A16 Bionic xử lý mượt các tác vụ thường ngày, từ liên lạc đến chụp và chỉnh ảnh. Camera chính 48MP đi cùng camera 12MP cho nhiều góc chụp hơn; kết nối 5G giúp tận dụng mạng di động tương thích.'
  ],
  'iphone-14':[
    'Màn hình Super Retina XDR 6,1 inch của iPhone 14 phù hợp để đọc, xem video và duyệt ảnh trên một thiết bị gọn gàng. Thiết kế quen thuộc giúp việc chuyển từ các đời iPhone trước trở nên dễ làm quen.',
    'Chip A15 Bionic và RAM 6GB đáp ứng liên lạc, ứng dụng, giải trí và chỉnh sửa ảnh hằng ngày. Hai camera 12MP mang lại lựa chọn góc chụp linh hoạt, trong khi 5G hỗ trợ kết nối trên các mạng tương thích.'
  ],
  'iphone-13':[
    'iPhone 13 giữ kích thước màn hình Super Retina XDR 6,1 inch, đủ rộng cho nội dung nhưng vẫn dễ mang theo. Phiên bản trong danh mục có bộ nhớ 128GB, phù hợp để lưu ứng dụng, hình ảnh và video thường dùng.',
    'A15 Bionic xử lý các công việc quen thuộc trên iOS. Hệ thống camera kép 12MP hỗ trợ chụp ở nhiều tình huống, còn khả năng kết nối 5G giúp máy sẵn sàng với mạng di động hiện đại khi khu vực có hỗ trợ.'
  ],
  'iphone-12':[
    'iPhone 12 sở hữu màn hình Super Retina XDR 6,1 inch trên thân máy gọn. Màu đen dễ dùng cùng nhiều loại phụ kiện; dung lượng 64GB phù hợp nếu bạn thường xuyên quản lý ảnh và dữ liệu trên đám mây.',
    'Chip A14 Bionic đáp ứng nhu cầu liên lạc, học tập và giải trí phổ biến. Camera kép 12MP cho nhiều cách ghi lại khoảnh khắc, và hỗ trợ 5G là điểm đáng cân nhắc khi chọn một mẫu iPhone đời trước.'
  ],
  'iphone-11':[
    'Màn hình Liquid Retina HD 6,1 inch tạo không gian thoải mái cho các ứng dụng hằng ngày. iPhone 11 có dáng máy dễ nhận diện và phiên bản màu trắng trong danh mục, phù hợp với người thích thiết kế đơn giản.',
    'A13 Bionic đảm nhiệm những việc thường xuyên như nhắn tin, xem video và chụp ảnh. Hai camera 12MP mở rộng góc nhìn so với một camera đơn; hãy cân nhắc dung lượng 64GB theo lượng ảnh và ứng dụng bạn lưu.'
  ],
  'iphone-x':[
    'iPhone X nổi bật với màn hình Super Retina 5,8 inch, Face ID và kiểu dáng gọn hơn nhiều mẫu điện thoại màn hình lớn. Đây là lựa chọn cho người thích trải nghiệm iPhone trong một kích thước vừa tay.',
    'Chip A11 Bionic và camera kép 12MP phục vụ các nhu cầu cơ bản như liên lạc, xem nội dung và chụp ảnh. Vì đây là dòng máy đời cũ, bạn nên đối chiếu nhu cầu ứng dụng, pin và tình trạng thiết bị trước khi chọn mua.'
  ],
  'xiaomi-14':[
    'Xiaomi 14 đặt màn hình 6,36 inch trong kiểu dáng vừa tay, tạo sự cân bằng giữa không gian hiển thị và khả năng mang theo. Cụm ba camera 50MP cùng dấu ấn Leica là điểm nhấn cho người thích thử nhiều cách chụp.',
    'Snapdragon 8 Gen 3 kết hợp RAM 12GB hướng đến tác vụ đòi hỏi tốc độ. Pin 4.610mAh và sạc nhanh 90W giúp việc bổ sung năng lượng thuận tiện hơn; máy cũng hỗ trợ mạng 5G ở khu vực tương thích.'
  ],
  'galaxy-a55':[
    'Khung kim loại và màn hình Super AMOLED 6,6 inch giúp Galaxy A55 5G có vẻ ngoài chỉn chu cùng không gian hiển thị rộng. Đây là mẫu máy dễ cân nhắc cho người thường xem nội dung, học tập và liên lạc trên điện thoại.',
    'Exynos 1480, RAM 8GB và pin 5.000mAh đáp ứng nhịp sử dụng hằng ngày. Bộ ba camera 50MP, 12MP và 5MP cho các góc chụp khác nhau; kết nối 5G hỗ trợ truy cập trên mạng tương thích.'
  ],
  'oppo-reno11':[
    'Reno11 5G hướng đến người thích chụp chân dung với camera tele 32MP bên cạnh camera chính 50MP và camera 8MP. Màn hình 6,7 inch cho không gian rộng khi xem ảnh, video và chỉnh sửa nội dung.',
    'Dimensity 7050 cùng RAM 8GB phục vụ các ứng dụng thường ngày. Pin 5.000mAh và sạc nhanh SUPERVOOC 67W giúp bạn chủ động hơn khi cần sạc giữa ngày; bộ nhớ 256GB dành chỗ cho ảnh và ứng dụng.'
  ],
  'ipad-10':[
    'Màn hình Liquid Retina 10,9 inch của iPad Gen 10 tạo không gian để đọc tài liệu, học trực tuyến, xem phim và phác thảo ý tưởng. Màu xanh dương đem lại vẻ tươi sáng cho một thiết bị dùng ở nhà hoặc mang theo.',
    'A14 Bionic và iPadOS hỗ trợ công việc, học tập và giải trí trên máy tính bảng. Camera 12MP giúp ghi lại tài liệu hoặc tham gia các nhu cầu hình ảnh cơ bản; bạn có thể chọn 64GB hoặc 256GB theo lượng dữ liệu cần lưu.'
  ],
  'airpods-pro-2':[
    'AirPods Pro 2 USB-C có thiết kế nhỏ gọn, hộp sạc dùng cổng USB-C và chip H2. Kiểu tai nghe này phù hợp với người muốn mang âm nhạc, cuộc gọi và nội dung giải trí theo mình trong suốt ngày.',
    'Chống ồn chủ động giúp giảm tiếng ồn xung quanh, còn Âm thanh thích ứng điều chỉnh trải nghiệm nghe theo môi trường. Các tính năng và cách điều khiển có thể khác nhau tùy thiết bị kết nối; hãy kiểm tra mức tương thích trước khi mua.'
  ],
  'apple-charger-20w':[
    'Củ sạc Apple USB-C 20W có kích thước gọn, dễ đặt trong túi phụ kiện hoặc dùng ở bàn làm việc. Thiết kế một cổng USB-C giúp bạn dùng chung với cáp và thiết bị tương thích mà không cần bộ sạc cồng kềnh.',
    'Chuẩn USB-C Power Delivery cung cấp công suất tối đa 20W cho thiết bị hỗ trợ. Tốc độ sạc thực tế phụ thuộc vào thiết bị, cáp và trạng thái pin; hãy dùng cáp phù hợp với cổng trên iPhone, iPad hoặc thiết bị khác.'
  ],
  'galaxy-s23':[
    'Galaxy S23 có màn hình Dynamic AMOLED 2X 6,1 inch, phù hợp với người muốn điện thoại gọn nhưng vẫn có không gian xem nội dung rõ ràng. Màu Cream tạo vẻ ngoài nhẹ nhàng, dễ phối cùng phụ kiện thường dùng.',
    'Snapdragon 8 Gen 2 for Galaxy và RAM 8GB phục vụ đa nhiệm, giải trí và xử lý ảnh. Camera chính 50MP đi cùng hai camera bổ sung; pin 3.900mAh và 5G là những thông số nên đối chiếu với nhu cầu sử dụng của bạn.'
  ],
  'redmi-note-13':[
    'Redmi Note 13 có màn hình AMOLED 6,67 inch với tần số quét 120Hz, tạo nhiều không gian cho video, mạng xã hội và đọc nội dung. Phiên bản 256GB phù hợp nếu bạn muốn lưu thêm ảnh, ứng dụng và tệp cá nhân.',
    'Snapdragon 685 cùng RAM 8GB đáp ứng các tác vụ phổ biến. Camera chính 108MP là điểm nhấn khi chụp ảnh, còn pin 5.000mAh hỗ trợ nhu cầu di động hằng ngày; mẫu này không có kết nối 5G trong danh mục.'
  ],
  'oppo-reno10':[
    'OPPO Reno10 5G kết hợp màn hình AMOLED 6,7 inch, tần số quét 120Hz và thiết kế màu xanh băng tuyết. Camera chân dung tele 32MP giúp bạn thử những góc chụp khác bên cạnh camera chính 64MP.',
    'Dimensity 7050, RAM 8GB và bộ nhớ 256GB tạo nền tảng cho liên lạc, giải trí và lưu ảnh. Pin 5.000mAh đi với sạc nhanh 67W; máy hỗ trợ 5G khi nhà mạng và khu vực sử dụng tương thích.'
  ],
  'galaxy-tab-s9':[
    'Galaxy Tab S9 có màn hình Dynamic AMOLED 2X 11 inch để đọc, xem phim và làm việc trên không gian rộng hơn điện thoại. S Pen đi kèm phù hợp cho ghi chú nhanh, đánh dấu tài liệu và phác thảo ý tưởng.',
    'Snapdragon 8 Gen 2 for Galaxy và RAM 8GB hỗ trợ đa nhiệm trên máy tính bảng. Pin 8.400mAh, bộ nhớ 128GB và camera 13MP là những thông số để cân nhắc theo thời lượng sử dụng và nhu cầu lưu trữ của bạn.'
  ],
  'airpods-3':[
    'AirPods thế hệ 3 có thiết kế gọn nhẹ, dễ mang theo khi đi học, làm việc hoặc di chuyển. Hộp sạc và tai nghe màu trắng giữ kiểu dáng quen thuộc; chip H1 hỗ trợ kết nối trong hệ sinh thái thiết bị tương thích.',
    'Âm thanh không gian mở rộng cảm giác nghe với nội dung hỗ trợ, còn Adaptive EQ điều chỉnh âm thanh theo cách đeo. Trải nghiệm một số tính năng có thể khác nhau giữa iOS và Android, vì vậy bạn nên kiểm tra thiết bị đang dùng.'
  ],
  'iphone-16':[
    'iPhone 16 có màn hình 6,1 inch và phiên bản màu đen dễ kết hợp với nhiều kiểu phụ kiện. Camera Control tạo thêm cách thao tác khi chụp, giúp việc chuyển từ quan sát sang ghi lại khoảnh khắc trực tiếp hơn.',
    'Chip A18 và RAM 8GB phục vụ các ứng dụng thường ngày cũng như tác vụ cần hiệu năng. Camera Fusion 48MP đi cùng camera 12MP cho nhiều lựa chọn góc chụp; máy hỗ trợ kết nối 5G trên mạng tương thích.'
  ],
  'galaxy-a56':[
    'Galaxy A56 5G có màn hình Super AMOLED 6,7 inch, phù hợp khi xem video, đọc tài liệu hoặc dùng nhiều ứng dụng trên màn hình rộng. Thiết kế màu xám nhạt mang vẻ trung tính, dễ dùng trong nhiều hoàn cảnh.',
    'Exynos 1580 kết hợp RAM 8GB cho các công việc và giải trí thường ngày. Cụm camera có cảm biến chính 50MP, pin 5.000mAh và hỗ trợ 5G; hãy chọn mức bộ nhớ 128GB hoặc 256GB theo nhu cầu lưu trữ.'
  ],
  'ipad-air-m3':[
    'iPad Air 11 inch M3 tạo không gian rộng để đọc, làm việc và sáng tạo mà vẫn thuận tiện mang theo. Thiết bị hỗ trợ Apple Pencil Pro, phù hợp với người thích viết tay, đánh dấu tài liệu hoặc phác thảo trực tiếp trên màn hình.',
    'Chip Apple M3 và RAM 8GB hướng đến đa nhiệm cùng các ứng dụng iPadOS. Camera 12MP hỗ trợ nhu cầu hình ảnh cơ bản; hai lựa chọn 128GB và 256GB cho phép bạn cân đối giữa dữ liệu lưu trên máy và ngân sách.'
  ],
  'galaxy-tab-s10-fe':[
    'Galaxy Tab S10 FE có màn hình 10,9 inch, đủ rộng cho bài học, ghi chú và nội dung giải trí. Hỗ trợ S Pen giúp việc viết hoặc đánh dấu trực tiếp trên tài liệu thuận tiện hơn so với chỉ dùng thao tác chạm.',
    'Exynos 1580 cùng RAM 8GB đáp ứng nhu cầu máy tính bảng hằng ngày. Pin 8.000mAh, camera 13MP và hai mức bộ nhớ 128GB hoặc 256GB là các thông số hữu ích khi chọn thiết bị cho học tập hay công việc.'
  ],
  'airpods-4':[
    'AirPods 4 có thiết kế mở, phù hợp với người thích cảm giác đeo không dùng nút tai kín. Hộp sạc USB-C giúp việc dùng chung cáp với những thiết bị tương thích trở nên thuận tiện hơn khi mang theo.',
    'Chip H2 và Âm thanh không gian hỗ trợ trải nghiệm nghe trên nội dung tương thích. Bạn có thể dùng tai nghe cho cuộc gọi, nhạc và video; các tùy chọn điều khiển có thể khác nhau tùy hệ điều hành và thiết bị ghép nối.'
  ],
  'galaxy-buds3':[
    'Galaxy Buds3 mang kiểu dáng mới và màu bạc, dễ đi cùng điện thoại hoặc máy tính bảng Galaxy. Dạng tai nghe không dây gọn giúp bạn chuyển giữa nghe nhạc, xem video và nhận cuộc gọi khi di chuyển.',
    'Sản phẩm hướng đến trải nghiệm âm thanh chất lượng cao và kết nối thuận tiện với thiết bị Android tương thích. Các tính năng liên quan Galaxy AI phụ thuộc thiết bị ghép nối và phiên bản phần mềm; nên kiểm tra trước khi chọn mua.'
  ]
};

export function descriptionSections(product:Product):DescriptionSection[]{
  const copy=details[product.id];
  if(copy){
    const accessory=product.category==='Phụ kiện';
    return [
      {title:accessory?'Thiết kế và kết nối':'Thiết kế và hiển thị',text:copy[0]},
      {title:accessory?'Trải nghiệm sử dụng':'Hiệu năng và trải nghiệm',text:copy[1]}
    ];
  }
  if(product.category==='Phụ kiện')return [
    {title:'Thiết kế và kết nối',text:`${product.name} là phụ kiện của ${product.brand}, có phiên bản ${product.storages.join(', ')}. Hãy đối chiếu thông tin công nghệ ${product.chip} và khả năng tương thích với ${product.os} trước khi chọn để phù hợp với cách sử dụng của bạn.`},
    {title:'Trải nghiệm sử dụng',text:`Sản phẩm phù hợp để bổ sung cho bộ thiết bị bạn đang dùng. Xem mô tả do cửa hàng cung cấp, kiểm tra phụ kiện đi kèm và hỏi thêm về khả năng tương thích nếu bạn dùng thiết bị khác hệ sinh thái ${product.brand}.`}
  ];
  return [
    {title:'Thiết kế và hiển thị',text:`${product.name} có màn hình ${product.screen} inch và các lựa chọn màu ${product.colorNames.join(', ')}. Kích thước màn hình là một điểm để cân nhắc giữa không gian xem nội dung và sự thuận tiện khi mang theo mỗi ngày.`},
    {title:'Hiệu năng và trải nghiệm',text:`Chip ${product.chip}, RAM ${product.ram}GB và các mức bộ nhớ ${product.storages.join(', ')} đáp ứng những nhu cầu lưu trữ khác nhau. Camera ${product.camera}${product.battery?`, pin ${product.battery.toLocaleString('vi-VN')}mAh`:''} và hệ điều hành ${product.os} là các thông số nên đối chiếu với cách bạn dùng thiết bị.`}
  ];
}
