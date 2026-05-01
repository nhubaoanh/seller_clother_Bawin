"use client";

import { useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Users, Heart, Baby, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AppFamilyNode = {
  id?: string | number;
  fid?: string | number;
  mid?: string | number;
  pids?: (string | number)[];
  memberId?: number;
  field_0?: string; // tên
  field_1?: string; // ngày mất
  field_2?: string; // nghề nghiệp
  img_0?: string; // ảnh đại diện
};

interface FamilyMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: AppFamilyNode | null;
  getNameById: (id: string | number | undefined) => string;
  getChildren: (parentId: number) => string[];
}

export function FamilyMemberModal({
  open,
  onOpenChange,
  node,
  getNameById,
  getChildren,
}: FamilyMemberModalProps) {
  const router = useRouter();

  if (!node) return null;

  const handleViewDetail = () => {
    const memberId = node.memberId ?? node.id;
    if (memberId) {
      router.push(`/member/${memberId}`);
      onOpenChange(false);
    }
  };

  const fatherName = getNameById(node.fid);
  const motherName = getNameById(node.mid);
  const spouseNames = (node.pids || [])
    .map((pid) => getNameById(pid))
    .filter(Boolean)
    .join(", ");
  const children = typeof node.id === "string" ? Number(node.id) : node.id;
  const childNames = typeof children === "number" ? getChildren(children) : [];

  const InfoItem = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
    <div className={cn("flex items-start py-2 border-b border-gray-100", className)}>
      <span className="font-medium text-gray-700 min-w-[120px]">{label}:</span>
      <span className="text-gray-800 flex-1">{value || "Chưa có thông tin"}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-red-800 to-red-600 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {node.field_0 || "Chi tiết thành viên"}
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Profile section */}
          <div className="px-6 py-4 flex items-start gap-6 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md">
              {node.img_0 ? (
                <img
                  src={node.img_0}
                  alt={node.field_0}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <User size={32} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{node.field_0}</h3>
              {node.field_2 && (
                <p className="text-gray-600 mt-1">{node.field_2}</p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs.Root defaultValue="detail" className="w-full">
            <Tabs.List className="grid grid-cols-4 border-b border-gray-200 px-6">
              {[
                { value: "detail", icon: User, label: "Chi tiết" },
                { value: "parents", icon: Users, label: "Cha mẹ" },
                { value: "spouse", icon: Heart, label: "Vợ/chồng" },
                { value: "children", icon: Baby, label: "Con cái" },
              ].map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 px-1 text-sm font-medium transition-colors",
                    "data-[state=active]:text-red-700 data-[state=active]:border-b-2 data-[state=active]:border-red-700",
                    "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <div className="p-6 max-h-[400px] overflow-y-auto">
              {/* Detail Tab */}
              <Tabs.Content value="detail" className="space-y-2">
                <InfoItem label="Họ tên" value={node.field_0} />
                <InfoItem label="Nghề nghiệp" value={node.field_2} />
                <InfoItem label="Ngày mất" value={node.field_1} />
                <div className="pt-4">
                  <button
                    onClick={handleViewDetail}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors"
                  >
                    Xem trang chi tiết <ChevronRight size={16} />
                  </button>
                </div>
              </Tabs.Content>

              {/* Parents Tab */}
              <Tabs.Content value="parents" className="space-y-2">
                <InfoItem label="Cha" value={fatherName} />
                <InfoItem label="Mẹ" value={motherName} />
              </Tabs.Content>

              {/* Spouse Tab */}
              <Tabs.Content value="spouse" className="space-y-2">
                <InfoItem label="Vợ/Chồng" value={spouseNames} />
              </Tabs.Content>

              {/* Children Tab */}
              <Tabs.Content value="children" className="space-y-2">
                {childNames.length > 0 ? (
                  <div className="space-y-2">
                    {childNames.map((name, i) => (
                      <div
                        key={i}
                        className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50"
                      >
                        <span className="w-6 h-6 flex items-center justify-center bg-red-100 text-red-700 rounded-full text-xs font-medium mr-3">
                          {i + 1}
                        </span>
                        <span className="text-gray-800">{name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Chưa có thông tin con cái
                  </div>
                )}
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </DialogContent>
    </Dialog>
  );
}