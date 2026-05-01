// utils/treeUtils.ts
import { IMember } from "@/types/product";
import { ITreeNode } from "@/types/tree";

// utils/treeUtils.ts
export function buildTree(members: IMember[]): ITreeNode[] {
    if (!members || members.length === 0) return [];

    const memberMap = new Map<number, ITreeNode>();
    const allNodes: ITreeNode[] = []; // Thay thế 'roots' bằng 'allNodes'

    // Bước 1: Tạo node chuẩn Balkan
    members.forEach(member => {
        const node: ITreeNode = {
            ...member,
            id: member.thanhVienId,
            pids: [],
            fid: member.chaId || undefined,
            mid: member.meId || undefined,
            name: member.hoTen,
            gender: member.gioiTinh === 1 ? "male" : "female",
        };
        memberMap.set(member.thanhVienId, node);
        allNodes.push(node); // Thêm TẤT CẢ node vào mảng
    });

    // Bước 2: Thiết lập quan hệ vợ chồng hai chiều
    members.forEach(member => {
        const node = memberMap.get(member.thanhVienId);
        if (!node) return;

        // Xử lý chồng (nếu là nữ)
        if (member.gioiTinh === 0 && member.chongId) {
            const husband = memberMap.get(member.chongId);
            if (husband) {
                // Thêm chồng vào danh sách pids của node hiện tại
                if (!node.pids.includes(husband.id)) {
                    node.pids.push(husband.id);
                }
                // Thêm node hiện tại vào danh sách pids của chồng
                if (!husband.pids.includes(node.id)) {
                    husband.pids.push(node.id);
                }
            }
        }

        // Xử lý vợ (nếu là nam)
        if (member.gioiTinh === 1 && member.voId) {
            const wife = memberMap.get(member.voId);
            if (wife) {
                // Thêm vợ vào danh sách pids của node hiện tại
                if (!node.pids.includes(wife.id)) {
                    node.pids.push(wife.id);
                }
                // Thêm node hiện tại vào danh sách pids của vợ
                if (!wife.pids.includes(node.id)) {
                    wife.pids.push(node.id);
                }
            }
        }
    });

    return allNodes; // Trả về TẤT CẢ các thành viên đã chuẩn hóa
}