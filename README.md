# FCMaddict Website

Web app dành cho cộng đồng FC Mobile, port từ ứng dụng Flutter sang Next.js và
triển khai tĩnh trên GitHub Pages.

## Tính năng

- Cơ sở dữ liệu và review cầu thủ.
- Xếp hạng theo 12 vị trí và ba mức ngân sách.
- ShardIQ tìm tổ hợp cầu thủ theo ngân sách, vị trí và sự kiện.
- Máy tính OVR đội hình, dự bị và badge bonus.
- Mã quà tặng, mẫu thẻ và thư viện render.

## Chạy local

```bash
npm ci
npm run dev
```

## Kiểm tra

```bash
npm run lint
npm test
npm run data:sync
npm run build:github
```

## Triển khai

Push nhánh `codex/github-pages`. GitHub Actions chạy
`.github/workflows/deploy-pages.yml`, đồng bộ snapshot API, tạo static export và
triển khai GitHub Pages tại `https://tienlab19.github.io/fcmaddict-site/`.

## Cấu trúc

- `app/tools/`: web app và logic ShardIQ/OVR đã port từ Flutter.
- `scripts/sync-data.mjs`: đồng bộ API thành JSON cùng origin, tránh lỗi CORS.
- `public/data/`: snapshot dữ liệu dùng khi chạy và fallback khi API lỗi.
- `app/`: landing page, chính sách quyền riêng tư, hỗ trợ.
- `public/`: logo và ảnh chia sẻ mạng xã hội.
- `tests/`: kiểm tra HTML render phía server.
- `worker/`, `db/`: hạ tầng Vinext/Cloudflare dự phòng; website hiện không dùng DB.
