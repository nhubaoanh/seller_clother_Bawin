"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Calendar, MessageCircle, Wallet, X, Send } from "lucide-react";
import { getNotifications } from "@/service/notifiCation.service";
import { getFinanceStats } from "@/service/finance.service";
import { getComments, addComment } from "@/service/comment.service";
import { INotification, IComment } from "@/types/Notification";
import { toast } from "react-hot-toast";

const DetailModal = ({
  item,
  onClose,
}: {
  item: INotification;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: comments } = useQuery({
    queryKey: ["comments", item.thongBaoId],
    queryFn: () => getComments(item.thongBaoId),
  });

  const commentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", item.thongBaoId],
      });
      setCommentText("");
      toast.success("Đã gửi bình luận");
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    commentMutation.mutate({
      doiTuongId: item.thongBaoId,
      nguoiBinhLuan: "Tôi (Thành viên)", // Giả lập user hiện tại
      noiDung: commentText,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-[#fffdf5] w-full max-w-2xl rounded-lg shadow-2xl border border-[#d4af37] flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#d4af37]/30 flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-[#b91c1c] uppercase tracking-wider mb-1 block">
              {item.loaiThongBao}
            </span>
            <h3 className="text-2xl font-display font-bold text-[#5d4037]">
              {item.tieuDe}
            </h3>
            <p className="text-sm text-stone-400 mt-1">
              {item.nguoiTao} •{" "}
              {new Date(item.ngayTao).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#b91c1c]"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <p className="text-stone-700 whitespace-pre-wrap leading-relaxed text-lg">
            {item.noiDung}
          </p>

          <hr className="my-8 border-[#d4af37]/20" />

          <h4 className="font-bold text-[#8b5e3c] mb-4 flex items-center gap-2">
            <MessageCircle size={18} /> Bình luận ({comments?.data?.length || 0}
            )
          </h4>

          <div className="space-y-4 mb-6">
            {comments?.data?.map((cmt) => (
              <div
                key={cmt.binhLuanId}
                className="bg-white p-3 rounded border border-stone-100 shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-[#5d4037]">
                    {cmt.nguoiBinhLuan}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(cmt.ngayTao).toLocaleString("vi-VN")}
                  </span>
                </div>
                <p className="text-stone-600 text-sm">{cmt.noiDung}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-[#fdf6e3] border-t border-[#d4af37]/30">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className="flex-1 p-3 rounded border border-[#d4af37]/50 focus:outline-none focus:border-[#b91c1c]"
            />
            <button
              type="submit"
              className="bg-[#b91c1c] text-white p-3 rounded hover:bg-[#991b1b] transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function NewsFeedPage() {
  const [selectedItem, setSelectedItem] = useState<INotification | null>(null);

  const { data: notifs } = useQuery({
    queryKey: ["notifications-feed"],
    queryFn: () => getNotifications({ pageIndex: 1, pageSize: 20 }),
  });

  const { data: finance } = useQuery({
    queryKey: ["finance-stats-feed"],
    queryFn: getFinanceStats,
  });

  return (
    <div className="max-w-4xl mx-auto font-serif pb-20 animate-fadeIn flex gap-6 flex-col md:flex-row">
      {/* LEFT COLUMN: FEED */}
      <div className="flex-1">
        <div className="mb-6 border-b border-[#d4af37] pb-4">
          <h2 className="text-3xl font-display font-bold text-[#b91c1c] uppercase">
            Tin Tức Dòng Họ
          </h2>
          <p className="text-[#8b5e3c] italic text-sm">
            Cập nhật mới nhất từ ban liên lạc
          </p>
        </div>

        <div className="space-y-4">
          {notifs?.data.data.map((item) => (
            <div
              key={item.thongBaoId}
              className="bg-white p-5 rounded-lg border border-[#d4af37]/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    item.loaiThongBao === "TIN_VUI"
                      ? "bg-pink-100 text-pink-700"
                      : item.loaiThongBao === "TIN_BUON"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.loaiThongBao}
                </span>
                <span className="text-stone-400 text-xs">
                  • {new Date(item.ngayTao).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#5d4037] mb-2">
                {item.tieuDe}
              </h3>
              <p className="text-stone-600 line-clamp-3 mb-3">{item.noiDung}</p>
              <div className="flex items-center gap-4 text-sm text-stone-500 font-bold">
                <span className="hover:text-[#b91c1c] flex items-center gap-1">
                  <MessageCircle size={16} /> Bình luận
                </span>
                <span className="text-[#b91c1c]">Xem chi tiết &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: WIDGETS */}
      <div className="w-full md:w-80 space-y-6">
        {/* Finance Widget */}
        <div className="bg-[#276749] text-white p-5 rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-white/10">
            <Wallet size={100} />
          </div>
          <h4 className="font-bold text-lg mb-4 relative z-10 flex items-center gap-2">
            <Wallet size={20} /> Quỹ Dòng Họ
          </h4>
          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center border-b border-white/20 pb-2">
              <span className="text-green-100 text-sm">Hiện có:</span>
              <span className="font-bold text-xl font-mono">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(finance?.data.ton || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-200">Tổng thu:</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(finance?.data.thu || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-200">Tổng chi:</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(finance?.data.chi || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-5 rounded-lg border border-[#d4af37] shadow-sm">
          <h4 className="font-bold text-[#8b5e3c] mb-3 uppercase text-sm">
            Liên kết nhanh
          </h4>
          <ul className="space-y-2 text-[#5d4037]">
            <li className="hover:text-[#b91c1c] cursor-pointer flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#b91c1c] rounded-full"></span>{" "}
              Quy định dòng họ
            </li>
            <li className="hover:text-[#b91c1c] cursor-pointer flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#b91c1c] rounded-full"></span>{" "}
              Cây gia phả (PDF)
            </li>
            <li className="hover:text-[#b91c1c] cursor-pointer flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#b91c1c] rounded-full"></span>{" "}
              Liên hệ trưởng tộc
            </li>
          </ul>
        </div>
      </div>

      {/* MODAL */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};
