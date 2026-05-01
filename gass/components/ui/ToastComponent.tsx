// ToastComponent.tsx

import React from "react";
import { useToast } from "@/service/useToas";

const ToastComponent: React.FC = () => {
  const { toastState, hideToast } = useToast();
  const { message, type, isVisible } = toastState;

  if (!isVisible) return null;

  // Định nghĩa style cơ bản cho Toast
  const style: React.CSSProperties = {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    color: "white",
    borderRadius: "8px",
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
    // Hiệu ứng xuất hiện
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(-20px)",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  };

  // Định nghĩa màu sắc và Icon dựa trên type
  let backgroundColor = "#333";
  let icon = "💡";

  switch (type) {
    case "error":
      backgroundColor = "#dc3545"; // Đỏ
      icon = "❌";
      break;
    case "success":
      backgroundColor = "#28a745"; // Xanh lá
      icon = "✅";
      break;
    case "warning":
      backgroundColor = "#ffc107"; // Vàng
      icon = "⚠️";
      break;
    case "info":
    default:
      backgroundColor = "#007bff"; // Xanh dương
      icon = "ℹ️";
      break;
  }

  return (
    <div
      style={{ ...style, backgroundColor }}
      onClick={hideToast} // Cho phép đóng thủ công
      role="alert"
    >
      <span style={{ marginRight: "10px", fontSize: "1.2em" }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default ToastComponent;
