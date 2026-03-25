Vite + React + TypeScript

1. Cài dependencies

- Chạy `npm install`.

2. Thiết lập biến môi trường
   tạo .env từ .env.example

3. Chạy dự án

- BE: Hiện tại đang test bằng json-server : Chạy `npm run json:server`

* hiện tại : http://localhost:3001, sau thay bằng link be vào .env

- FE: `npm run dev`

4. Hiện tại đang có:
   Frontend đang gọi:

- `POST auth/login`
- `POST auth/logout`
- `POST auth/signup`
- `POST auth/refresh-token`
- `GET users`

Backend thật cần khớp các endpoint trên (hoặc sửa lại frontend).

5. Kịch bản test module quản lý lớp (json-server)

- Đăng nhập giáo viên: `teacher / 123456`.
- Vào trang chi tiết lớp: `/teacher/class/classroom-detail/1`.
  - Thấy danh sách 2 học sinh
- Thêm học sinh vào lớp:
  - Mở “Thêm học sinh”, nhập mã `HS003` (chưa có trong lớp 1).
  - Kỳ vọng: danh sách tăng thêm 1 dòng.
- Xóa học sinh:
  - Bấm “Xóa” ở một dòng bất kỳ.
  - Kỳ vọng: danh sách giảm 1 dòng.
- Đăng nhập học sinh: `student / 123456`.
- Vào danh sách lớp: `/student/classroom`, mở các lớp `tcc`, `vldc`, `ths`.
  - Vào danh sách đề: `/student/classroom/tcc/exams` để xem đề theo lớp.

6. Commit & PR

- Không commit `node_modules`, `dist`, `.env`.
