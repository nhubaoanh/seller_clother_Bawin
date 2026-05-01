"use client";
import React, { useState, useMemo } from "react";
import { Search, Plus, Download, X, Loader2, Users, Shield, UserCog, ShoppingBag, Fingerprint } from "lucide-react";
import * as XLSX from "xlsx";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { IUser, IUserSearch } from "@/types/user";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/service/user.service";
import { UserTable } from "./components/userTable";
import { UserModal } from "./components/userModal";
import { ConfirmDeleteModal } from "./components/userDelete";
import { useToast } from "@/service/useToas";

const ROLE_GROUPS = [
  { id: "all", label: "Registry", icon: Users, roles: [] },
  { id: "customer", label: "Clients", icon: ShoppingBag, roles: ["CUSTOMER"] },
  { id: "staff", label: "Operatives", icon: UserCog, roles: ["STAFF"] },
  { id: "manager", label: "Directors", icon: Shield, roles: ["MANAGER", "ADMIN"] },
];

export default function UserManagementPage() {
  const queryClient = useQueryClient();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeRoleGroup, setActiveRoleGroup] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const { showSuccess, showError } = useToast();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageIndex(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchParams: IUserSearch = {
    pageIndex: 1,
    pageSize: 1000,
    search_content: debouncedSearch,
  };

  const usersQuery = useQuery({
    queryKey: ["users", searchParams],
    queryFn: () => getUsers(searchParams),
    placeholderData: keepPreviousData,
  });

  const allUsers = usersQuery.data?.data || [];
  const isLoading = usersQuery.isLoading;

  const filteredUsers = useMemo(() => {
    const group = ROLE_GROUPS.find(g => g.id === activeRoleGroup);
    if (!group || group.roles.length === 0) return allUsers;
    return allUsers.filter((user: IUser) => group.roles.includes(user.role_code));
  }, [allUsers, activeRoleGroup]);

  const paginatedUsers = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, pageIndex, pageSize]);

  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allUsers.length };
    ROLE_GROUPS.forEach(group => {
      if (group.roles.length > 0) {
        counts[group.id] = allUsers.filter((u: IUser) => group.roles.includes(u.role_code)).length;
      }
    });
    return counts;
  }, [allUsers]);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess("Thêm người dùng thành công!");
      setIsModalOpen(false);
    },
    onError: () => showError("Có lỗi xảy ra khi thêm người dùng."),
  });

  const updateMutation = useMutation({
    mutationFn: (user: Partial<IUser>) => updateUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess("Cập nhật thông tin thành công!");
      setIsModalOpen(false);
    },
    onError: () => showError("Có lỗi xảy ra khi cập nhật."),
  });

  const deleteMutation = useMutation({
    mutationFn: (userIds: string[]) => deleteUser(userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess("Đã xóa người dùng.");
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    },
    onError: () => showError("Không thể xóa người dùng này."),
  });

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user: IUser) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate([userToDelete.user_id]);
    }
  };

  const handleSaveUser = (user: Partial<IUser>) => {
    if (editingUser) {
      updateMutation.mutate({ ...user, user_id: editingUser.user_id });
    } else {
      createMutation.mutate(user);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageIndex(1);
  };

  const handleExportExcel = () => {
    if (filteredUsers.length === 0) {
      showError("Không có dữ liệu để xuất");
      return;
    }
    const exportData = filteredUsers.map((u: IUser) => ({
      "Họ tên": u.full_name,
      "Tên đăng nhập": u.username,
      "Email": u.email,
      "SĐT": u.phone,
      "Địa chỉ": u.address,
      "Vai trò": u.role_name,
      "Trạng thái": u.active_flag === 1 ? "Hoạt động" : "Khóa",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserRegistry");
    const groupLabel = ROLE_GROUPS.find(g => g.id === activeRoleGroup)?.label || "Master";
    XLSX.writeFile(workbook, `Users_${groupLabel}.xlsx`);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <div className="max-w-[1600px] mx-auto pb-32 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-10">
        <div>
          <h1 className="text-5xl font-black text-black tracking-tighter flex items-center gap-4 uppercase leading-none">
            Registry <span className="text-gray-200">/</span> Profiles
          </h1>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            Managing account permissions and security levels
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <button
                onClick={handleExportExcel}
                className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
            >
                <Download size={16} />
                Export Ledger
            </button>

            <button
                onClick={handleAdd}
                className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20"
            >
                <Plus size={16} />
                New Profile
            </button>
        </div>
      </div>

      {/* Role Group Navigation */}
      <div className="flex gap-8 border-b border-gray-50 overflow-x-auto pb-4 scrollbar-hide">
        {ROLE_GROUPS.map((group) => {
          const Icon = group.icon;
          const isActive = activeRoleGroup === group.id;
          const count = roleCounts[group.id] || 0;
          
          return (
            <button
              key={group.id}
              onClick={() => setActiveRoleGroup(group.id)}
              className={`flex items-center gap-3 pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                isActive ? "text-black" : "text-gray-300 hover:text-gray-500"
              }`}
            >
              <Icon size={14} />
              {group.label}
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                {count}
              </span>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          );
        })}
      </div>

      {/* Search Bar Section */}
      <div className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center bg-white rounded-full px-8 py-4 gap-4 w-full md:w-[500px] border border-gray-100 focus-within:border-black transition-all shadow-inner">
            <Search size={18} className="text-gray-300" />
            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Identity Registry..."
                className="w-full bg-transparent outline-none text-[11px] font-black uppercase tracking-[0.2em]"
            />
        </div>
        
        <div className="flex items-center gap-4 text-gray-300">
            <Fingerprint size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Biometric Data Verified</span>
        </div>
      </div>

      {/* Table Section */}
      <UserTable
        data={paginatedUsers}
        isLoading={isLoading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRecords={totalRecords}
        totalPages={totalPages}
        onPageChange={setPageIndex}
        onPageSizeChange={handlePageSizeChange}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
        initialData={editingUser}
        isLoading={isSaving}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={userToDelete?.full_name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
}
