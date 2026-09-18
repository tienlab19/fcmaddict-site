# FCMaddict Website

Website công cụ và nội dung dành cho cộng đồng FC Mobile, xây bằng Next.js và
triển khai tĩnh trên GitHub Pages.

## Chạy local

```bash
npm ci
npm run dev
```

## Kiểm tra

```bash
npm run lint
npm test
npm run build:github
```

## Triển khai

Push nhánh `codex/github-pages`. GitHub Actions chạy
`.github/workflows/deploy-pages.yml`, tạo static export và triển khai GitHub
Pages tại `https://tienlab19.github.io/fcmaddict-site/`.

## Cấu trúc

- `app/`: trang chủ, chính sách quyền riêng tư, hỗ trợ.
- `public/`: logo và ảnh chia sẻ mạng xã hội.
- `tests/`: kiểm tra HTML render phía server.
- `worker/`, `db/`: hạ tầng Vinext/Cloudflare dự phòng; website hiện không dùng DB.
