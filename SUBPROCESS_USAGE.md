# Sub-Process Form - User Guide

## Tính Năng Mới

Hình thức thêm quy trình con (sub-process) giờ đã hoạt động đầy đủ!

## Cách Sử Dụng

### 1. Mở Chi Tiết Dự Án
- Vào module "Quản lý Dự án"
- Chọn một dự án từ danh sách

### 2. Xem Tiến Trình & Quy Trình Con
- Kéo xuống phần "Tiến trình thực hiện dự án"
- Bạn sẽ thấy 16 tiến trình đã được tạo sẵn:
  1. Khảo sát & Quy hoạch
  2. Thiết kế kỹ thuật
  3. Chuẩn bị thi công
  ... (và 13 tiến trình khác)

### 3. Thêm Quy Trình Con Mới
**Bước 1:** Click vào mũi tên (▶) để mở rộng một tiến trình
- Thấy phần "Quy trình con" với danh sách các quy trình con

**Bước 2:** Click nút "Thêm quy trình" (biểu tượng + màu xanh)
- Một cửa sổ dialog sẽ xuất hiện

**Bước 3:** Điền vào form:
- **Tên quy trình** (bắt buộc): Ví dụ: "Khảo sát thực địa"
- **Nội dung quy trình** (bắt buộc): Mô tả chi tiết công việc
- **Báo cáo tiến độ** (tùy chọn): Ví dụ: "50% hoàn thành"
- **Thời gian thực hiện** (tùy chọn): Chọn ngày giờ bắt đầu/kết thúc

**Bước 4:** Click "Thêm quy trình"
- Quy trình con mới sẽ được thêm vào danh sách

### 4. Chỉnh Sửa Quy Trình Con
- Click vào quy trình con để mở rộng
- Chỉnh sửa các trường:
  - Nội dung quy trình
  - Báo cáo tiến độ
  - Thời gian thực hiện
- Thay đổi sẽ được lưu tự động (trên local)

### 5. Xóa Quy Trình Con
- Mở rộng quy trình con
- Click nút "Xóa quy trình" (màu đỏ)
- Quy trình con sẽ bị xóa khỏi danh sách

## Dữ Liệu Mặc Định

Mỗi tiến trình đã được cấp 3-4 quy trình con mặc định:

### Ví dụ: Tiến trình 1 - Khảo sát & Quy hoạch
- ✓ Khảo sát địa hình
- ✓ Lập kế hoạch tổng thể
- ✓ Phân tích môi trường

### Ví dụ: Tiến trình 5 - Xây dựng công trình chính
- ✓ Cốt thép kết cấu
- ✓ Đổ bê tông
- ✓ Xây tường
- ✓ Lắp mái

## Thông Tin Kỹ Thuật

### Lưu Trữ Dữ Liệu
- **Hiện tại**: Dữ liệu lưu trong state local của component
- **Tương lai**: Sẽ kết nối với backend API

### Cấu Trúc Thư Mục
```
hooks/
  └── use-subprocess.ts          # Hook quản lý sub-process
lib/services/
  ├── subprocess.service.ts      # Service API cho sub-process
  ├── stage.service.ts           # Service API cho stage
  └── index.ts                   # Export central
components/
  └── project-details.tsx        # Component sử dụng
```

### Files Hỗ Trợ
- `API_INTEGRATION.md`: Hướng dẫn tích hợp API cho backend team

## Tính Năng Demo

✅ Thêm quy trình con mới  
✅ Chỉnh sửa quy trình con  
✅ Xóa quy trình con  
✅ Mở rộng/Thu gọn quy trình con  
✅ Form validation (kiểm tra tên & nội dung bắt buộc)  

## Chuẩn Bị Cho Backend

Cấu trúc code đã sẵn sàng cho backend:

1. **API Services** đã được định nghĩa rõ ràng
2. **TypeScript Interfaces** cho tất cả dữ liệu
3. **TODO Comments** để backend team biết cần làm gì

Xem file `API_INTEGRATION.md` để biết chi tiết.

## Lưu Ý

⚠️ **Dữ liệu chưa được lưu trên server** - Nếu load lại trang, dữ liệu mới thêm sẽ mất

Sau khi backend API sẵn sàng, sẽ thêm:
- Lưu dữ liệu lên server
- Xóa/Cập nhật trên server
- Xử lý lỗi mạng
- Loading states
- Thông báo thành công/lỗi
