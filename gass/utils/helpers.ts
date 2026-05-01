export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  // Kiểm tra chuỗi rỗng sau khi loại bỏ khoảng trắng
  if (typeof value === "string") {
    return value.trim() === "";
  }

  // Kiểm tra mảng rỗng
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  // Kiểm tra đối tượng rỗng (nếu cần)
  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }

  return false;
}
