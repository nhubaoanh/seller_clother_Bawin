// src/app/genealogy/utils/layout.ts

// --- CÁC HẰNG SỐ DÙNG TRONG BỐ CỤC ---
export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 60;
export const HORIZONTAL_GAP = 50;
export const VERTICAL_GAP = 120;

// Interface cho Node phẳng có tọa độ
export interface FlatNode {
  id: string;
  name: string;
  x: number;
  y: number;
  parentId: string | null;
  birth?: string;
  death?: string;
  gender?: "male" | "female";
  generation: number;
  childrenCount?: number; // Có thể dùng cho tính toán sau này
}

// Biến cục bộ trong module để theo dõi trạng thái bố cục
let nextX = 50;
const nodesMap = new Map<string, FlatNode>();

/**
 * Hàm đệ quy (DFS) tính toán vị trí X, Y cho Node.
 * Logic: Node Cha được đặt ở giữa các Node Con của nó.
 * @returns Tọa độ X (trung tâm) của Node hiện tại.
 */
function calculateLayout(
  node: any,
  parentId: string | null,
  generation: number
): number {
  const currentId = node.id.toString();

  // 1. Xử lý các node con trước (DFS)
  if (node.children && node.children.length > 0) {
    let firstChildX = -1;
    let lastChildX = -1;

    node.children.forEach((child: any) => {
      // Gọi đệ quy để tính toán vị trí X cho các node con
      const childX = calculateLayout(child, currentId, generation + 1);

      if (firstChildX === -1) firstChildX = childX;
      lastChildX = childX;
    });

    // 2. Tính X của Node Cha: Trung tâm giữa con đầu tiên và con cuối cùng
    let parentX: number;
    if (firstChildX !== lastChildX) {
      // Căn giữa dựa trên tâm của các node con
      parentX = (firstChildX + lastChildX) / 2;
    } else {
      // Chỉ có 1 con, căn giữa trên con
      parentX = firstChildX;
    }

    // Gán node hiện tại vào Map
    const newNode: FlatNode = {
      id: currentId,
      name: node.name,
      parentId: parentId,
      generation: generation,
      birth: node.birth,
      death: node.death,
      gender: node.gender,
      x: parentX,
      y: (generation - 1) * VERTICAL_GAP,
    };
    nodesMap.set(currentId, newNode);

    return parentX;
  } else {
    // 3. Trường hợp là Node Lá (không có con):
    const currentX = nextX;
    const currentY = (generation - 1) * VERTICAL_GAP;

    const newNode: FlatNode = {
      id: currentId,
      name: node.name,
      parentId: parentId,
      generation: generation,
      birth: node.birth,
      death: node.death,
      gender: node.gender,
      x: currentX,
      y: currentY,
    };
    nodesMap.set(currentId, newNode);

    // Cập nhật vị trí X tiếp theo cho node tiếp theo
    nextX += NODE_WIDTH + HORIZONTAL_GAP;

    return currentX;
  }
}

/**
 * Hàm chính chuyển dữ liệu phân cấp thành mảng phẳng có tọa độ X, Y.
 * @param hierarchicalData Cấu trúc dữ liệu cây.
 * @returns Mảng các FlatNode với tọa độ đã được tính toán.
 */
export const getFlatNodes = (hierarchicalData: any): FlatNode[] => {
  nodesMap.clear();
  nextX = 50;

  // Bắt đầu tính toán từ Node Gốc
  const rootCenter = calculateLayout(hierarchicalData, null, 0);

  // Gán Node Gốc (ID: root)
  const rootNode: FlatNode = {
    id: hierarchicalData.id.toString(),
    name: hierarchicalData.name,
    parentId: null,
    generation: 0,
    x: rootCenter,
    y: 0,
  };

  // Cập nhật lại Node Gốc trong Map (Nếu hàm calculateLayout bị bỏ qua cho root)
  nodesMap.set(rootNode.id, rootNode);

  // Chuyển đổi Map thành mảng và dịch chuyển Y xuống
  const finalNodes = Array.from(nodesMap.values()).map((node) => ({
    ...node,
    // Dịch chuyển Y của tất cả các node xuống để đời 0 không dính mép trên
    y: node.y + VERTICAL_GAP,
  }));

  return finalNodes;
};
