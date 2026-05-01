"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import storage from "@/utils/storage";
import { canAccessRoute, isPublicRoute } from "@/lib/auth";

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * Component bảo vệ route
 * Kiểm tra đăng nhập và phân quyền trước khi render children
 */
export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // 1. Route public - cho phép truy cập
      if (isPublicRoute(pathname)) {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      // 2. Kiểm tra đăng nhập
      const token = storage.getToken();
      const user = storage.getUser();

      if (!token || !user) {
        // Chưa đăng nhập - redirect về login
        setAuthorized(false);
        setChecking(false);
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // 3. Kiểm tra quyền truy cập route
      const hasAccess = canAccessRoute(pathname, user.role_code);

      if (!hasAccess) {
        // Không có quyền - redirect về trang 403
        setAuthorized(false);
        setChecking(false);
        console.warn(`[RouteGuard] Access denied: ${pathname} for role ${user.role_code}`);
        router.replace("/403");
        return;
      }

      // 4. Có quyền - cho phép truy cập
      setAuthorized(true);
      setChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Đang kiểm tra - hiển thị loading
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Không có quyền - không render gì (đang redirect)
  if (!authorized) {
    return null;
  }

  // Có quyền - render children
  return <>{children}</>;
}
