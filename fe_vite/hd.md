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

5. Commit & PR

- Không commit `node_modules`, `dist`, `.env`.
