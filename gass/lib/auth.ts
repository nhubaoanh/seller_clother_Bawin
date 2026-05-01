
export type RoleCode = "ADMIN" | "CUSTOMER" | "MANAGER" | "STAFF";

export interface MenuItem {
  name: string;
  href: string;
  icon: string;
  roles: RoleCode[]; // Roles được phép truy cập
}

// ==================== MENU CONFIG ====================

export const ALL_MENU_ITEMS: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "/icon/iconmember.png",
    roles: ["ADMIN", "CUSTOMER", "STAFF", "MANAGER"],
  },
  {
    name: "Products",
    href: "/product",
    icon: "/icon/iconmember.png",
    roles: ["ADMIN", "STAFF", "MANAGER"],
  },
  {
    name: "Users",
    href: "/users",
    icon: "/icon/iconmember.png",
    roles: ["ADMIN", "MANAGER"], // Chỉ super admin
  },
  {
    name: "Orders",
    href: "/order",
    icon: "/icon/pen.png",
    roles: ["ADMIN", "STAFF", "MANAGER"],
  },
  {
    name: "Category",
    href: "/category",
    icon: "/icon/calendar.png",
    roles: ["ADMIN", "STAFF", "MANAGER"],
  },
  {
    name: "Import order",
    href: "/importOrder",
    icon: "/icon/dollar.png",
    roles: ["ADMIN", "STAFF", "MANAGER"],
  },
  {
    name: "Chat",
    href: "/chat",
    icon: "/icon/dollar.png",
    roles: ["ADMIN", "STAFF", "MANAGER"],
  },
  {
    name: "Review",
    href: "/reviews",
    icon: "/icon/dollar.png",
    roles: ["ADMIN", "STAFF", "MANAGER"],
  },
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Lấy menu items theo role
 */
export function getMenuByRole(roleCode: RoleCode | string | number | undefined): MenuItem[] {
  if (roleCode === undefined || roleCode === null) return [];
  
  // Map numeric roles from DB to RoleCode strings
  let normalizedRole = roleCode.toString().toUpperCase();
  if (normalizedRole === "1") normalizedRole = "ADMIN";
  if (normalizedRole === "0") normalizedRole = "STAFF";
  
  return ALL_MENU_ITEMS.filter(item => item.roles.includes(normalizedRole as RoleCode));
}

/**
 * Kiểm tra user có quyền truy cập route không
 */
export function canAccessRoute(pathname: string, roleCode: RoleCode | string | number | undefined): boolean {
  if (roleCode === undefined || roleCode === null) return false;
  
  // Map numeric roles from DB to RoleCode strings
  let normalizedRole = roleCode.toString().toUpperCase();
  if (normalizedRole === "1") normalizedRole = "ADMIN";
  if (normalizedRole === "0") normalizedRole = "STAFF";
  
  // Tìm menu item tương ứng với pathname
  const menuItem = ALL_MENU_ITEMS.find(item => 
    pathname === item.href || pathname.startsWith(item.href + "/")
  );
  
  // Nếu không tìm thấy trong menu, cho phép (có thể là trang public)
  if (!menuItem) return true;
  
  // Kiểm tra role có trong danh sách được phép không
  return menuItem.roles.includes(normalizedRole as RoleCode);
}

/**
 * Các route public (không cần đăng nhập)
 */
export const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgotPass",
  "/reset-password",
];

/**
 * Kiểm tra route có phải public không
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}
