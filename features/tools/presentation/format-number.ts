export function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}
