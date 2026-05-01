"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Bell,
  Calendar,
  Megaphone,
  Heart,
  Frown,
  Smile,
  Loader2,
  X,
} from "lucide-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { INotification } from "@/types/Notification";
import {
  getNotifications,
  createNotification,
  deleteNotification,
} from "@/service/notifiCation.service";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

// --- SUB-COMPONENT: MODAL ---
const NotificationModal = ({ isOpen, onClose, onSubmit, isLoading }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fffdf5] w-full max-w-lg rounded-lg shadow-2xl border border-[#d4af37] overflow-hidden">
        <div className="bg-[#b91c1c] text-yellow-400 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold font-display uppercase">
            Tạo Thông Báo Mới
          </h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            onSubmit({
              tieuDe: formData.get("tieuDe"),
              noiDung: formData.get("noiDung"),
              loaiThongBao: formData.get("loaiThongBao"),
              nguoiTao: "Admin", // Hardcoded for demo
              uuTien: formData.get("uuTien") === "on",
            });
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-bold text-[#8b5e3c] mb-1">
              Tiêu đề
            </label>
            <input
              required
              name="tieuDe"
              className="w-full p-2 border border-[#d4af37]/50 rounded"
              placeholder="Nhập tiêu đề..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#8b5e3c] mb-1">
              Loại thông báo
            </label>
            <select
              name="loaiThongBao"
              className="w-full p-2 border border-[#d4af37]/50 rounded"
            >
              <option value="TIN_CHUNG">Tin chung</option>
              <option value="SU_KIEN">Sự kiện / Họp mặt</option>
              <option value="TIN_VUI">Tin vui (Hỷ, Đỗ đạt)</option>
              <option value="TIN_BUON">Tin buồn (Hiếu)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#8b5e3c] mb-1">
              Nội dung
            </label>
            <textarea
              required
              name="noiDung"
              rows={4}
              className="w-full p-2 border border-[#d4af37]/50 rounded"
              placeholder="Nội dung chi tiết..."
            ></textarea>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="uuTien"
              id="uuTien"
              className="w-4 h-4 text-[#b91c1c]"
            />
            <label
              htmlFor="uuTien"
              className="text-sm font-bold text-[#8b5e3c]"
            >
              Đánh dấu ưu tiên (Ghim)
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#5d4037] font-bold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[#b91c1c] text-white font-bold rounded shadow hover:bg-[#991b1b] disabled:opacity-50"
            >
              {isLoading ? "Đang lưu..." : "Đăng Thông Báo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function NotificationPage() {
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<INotification | null>(null);

  const { data: notifData, isLoading } = useQuery({
    queryKey: ["notifications", pageIndex],
    queryFn: () => getNotifications({ pageIndex, pageSize: 10 }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Đăng thông báo thành công");
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Đã xóa thông báo");
      setIsDeleteModalOpen(false);
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "TIN_VUI":
        return <Smile className="text-pink-600" />;
      case "TIN_BUON":
        return <Frown className="text-gray-600" />;
      case "SU_KIEN":
        return <Calendar className="text-orange-600" />;
      default:
        return <Megaphone className="text-blue-600" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "TIN_VUI":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "TIN_BUON":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "SU_KIEN":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto font-serif pb-20 animate-fadeIn">
      <div className="flex justify-between items-center mb-8 border-b border-[#d4af37] pb-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-[#b91c1c] uppercase">
            Bảng Tin Dòng Họ
          </h2>
          <p className="text-[#8b5e3c] italic text-sm">
            Thông báo sự kiện, hiếu hỉ và tin tức chung
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#b91c1c] text-white rounded shadow hover:bg-[#991b1b] font-bold"
        >
          <Plus size={16} /> Đăng Tin Mới
        </button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-10 text-[#8b5e3c] flex flex-col items-center">
            <Loader2 className="animate-spin mb-2" /> Đang tải thông báo...
          </div>
        ) : notifData?.data.data.length === 0 ? (
          <div className="text-center py-10 text-stone-400 italic">
            Chưa có thông báo nào.
          </div>
        ) : (
          notifData?.data.data.map((item) => (
            <div
              key={item.thongBaoId}
              className={`bg-white p-6 rounded-lg border border-[#d4af37] shadow-sm hover:shadow-md transition-all relative group ${
                item.uuTien ? "ring-2 ring-[#d4af37]/30 bg-[#fffdf5]" : ""
              }`}
            >
              {item.uuTien && (
                <div className="absolute top-0 right-0 bg-[#d4af37] text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                  Đã Ghim
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#fdf6e3] rounded-full border border-[#d4af37]/30 mt-1">
                  {getIcon(item.loaiThongBao)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border ${getBadgeColor(
                        item.loaiThongBao
                      )}`}
                    >
                      {item.loaiThongBao === "TIN_CHUNG"
                        ? "Tin Chung"
                        : item.loaiThongBao === "SU_KIEN"
                        ? "Sự Kiện"
                        : item.loaiThongBao === "TIN_VUI"
                        ? "Tin Vui"
                        : "Tin Buồn"}
                    </span>
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Calendar size={12} />{" "}
                      {new Date(item.ngayTao).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="text-xs text-stone-400">
                      • Đăng bởi: {item.nguoiTao}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#5d4037] mb-2">
                    {item.tieuDe}
                  </h3>
                  <p className="text-stone-600 whitespace-pre-wrap">
                    {item.noiDung}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data: any) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() =>
          selectedItem && deleteMutation.mutate(selectedItem.thongBaoId)
        }
        itemName={selectedItem?.tieuDe || ""}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
