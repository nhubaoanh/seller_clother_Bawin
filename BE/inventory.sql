-- ==========================================
-- INVENTORY & STOCK MANAGEMENT
-- ==========================================

-- 1. Tạo bảng nhập hàng nếu chưa có
CREATE TABLE IF NOT EXISTS inventoryImports (
    importId VARCHAR(50) PRIMARY KEY,
    variantId VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    purchasePrice DECIMAL(12,2) NOT NULL DEFAULT 0,
    supplier VARCHAR(200),
    notes TEXT,
    activeFlag INT DEFAULT 1,
    userCreateId VARCHAR(50),
    luUserId VARCHAR(50),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (variantId) REFERENCES productVariants(variantId)
);

DELIMITER $$

-- 2. Procedure Nhập hàng (Tự động cộng tồn kho)
DROP PROCEDURE IF EXISTS `Proc_Admin_AddImportStock`$$
CREATE PROCEDURE `Proc_Admin_AddImportStock`(
    IN p_importId VARCHAR(50),
    IN p_variantId VARCHAR(50),
    IN p_quantity INT,
    IN p_purchasePrice DECIMAL(12,2),
    IN p_supplier VARCHAR(200),
    IN p_notes TEXT,
    IN p_adminId VARCHAR(50)
)
BEGIN
    -- Thêm bản ghi vào lịch sử nhập
    INSERT INTO inventoryImports (
        importId, variantId, quantity, purchasePrice, supplier, notes, 
        activeFlag, userCreateId, luUserId
    ) VALUES (
        p_importId, p_variantId, p_quantity, p_purchasePrice, p_supplier, p_notes, 
        1, p_adminId, p_adminId
    );
    
    -- Cập nhật số lượng tồn trong bảng biến thể sản phẩm
    UPDATE productVariants 
    SET stock = stock + p_quantity,
        luUserId = p_adminId,
        updatedAt = NOW()
    WHERE variantId = p_variantId;
END$$

-- 3. Procedure Lấy lịch sử nhập hàng
DROP PROCEDURE IF EXISTS `Proc_Admin_GetImportHistory`$$
CREATE PROCEDURE `Proc_Admin_GetImportHistory`(
    IN p_search VARCHAR(150),
    IN p_pageIndex INT,
    IN p_pageSize INT
)
BEGIN
    DECLARE v_offset INT;
    SET v_offset = (p_pageIndex - 1) * p_pageSize;

    SELECT i.*, p.productName, pv.size, pv.color,
           (SELECT COUNT(*) FROM inventoryImports i2 
            JOIN productVariants pv2 ON i2.variantId = pv2.variantId
            JOIN products p2 ON pv2.productId = p2.productId
            WHERE i2.activeFlag = 1 AND (p_search = '' OR p2.productName LIKE CONCAT('%', p_search, '%'))) as RecordCount
    FROM inventoryImports i
    JOIN productVariants pv ON i.variantId = pv.variantId
    JOIN products p ON pv.productId = p.productId
    WHERE i.activeFlag = 1
      AND (p_search = '' OR p.productName LIKE CONCAT('%', p_search, '%'))
    ORDER BY i.createdAt DESC
    LIMIT v_offset, p_pageSize;
END$$

-- 4. Procedure Thống kê Nhập - Xuất - Tồn
DROP PROCEDURE IF EXISTS `Proc_Admin_GetStockReport`$$
CREATE PROCEDURE `Proc_Admin_GetStockReport`()
BEGIN
    SELECT 
        p.productId,
        p.productName,
        pv.variantId,
        pv.size,
        pv.color,
        -- Tổng đã nhập
        COALESCE((SELECT SUM(quantity) FROM inventoryImports WHERE variantId = pv.variantId AND activeFlag = 1), 0) as totalImported,
        -- Tổng đã bán (Chỉ tính các đơn đã hoàn thành hoặc đã thanh toán)
        COALESCE((SELECT SUM(od.quantity) 
                  FROM orderDetails od 
                  JOIN orders o ON od.orderId = o.orderId 
                  WHERE od.variantId = pv.variantId AND o.orderStatus IN (1, 2, 3)), 0) as totalSold,
        -- Tồn kho hiện tại
        pv.stock as currentStock
    FROM productVariants pv
    JOIN products p ON pv.productId = p.productId
    WHERE pv.activeFlag = 1
    ORDER BY p.productName ASC;
END$$

-- 5. Procedure Thống kê Dashboard Tổng quát
DROP PROCEDURE IF EXISTS `Proc_Admin_GetDashboardStats`$$
CREATE PROCEDURE `Proc_Admin_GetDashboardStats`()
BEGIN
    -- Doanh thu, Chi phí, Lợi nhuận
    SELECT 
        (SELECT COALESCE(SUM(totalPrice), 0) FROM orders WHERE orderStatus IN (1, 2, 3) AND activeFlag = 1) as totalRevenue,
        (SELECT COALESCE(SUM(quantity * purchasePrice), 0) FROM inventoryImports WHERE activeFlag = 1) as totalImportCost,
        (SELECT COUNT(*) FROM orders WHERE activeFlag = 1) as totalOrders,
        (SELECT COUNT(*) FROM users WHERE activeFlag = 1) as totalCustomers;
        
    -- Trạng thái đơn hàng
    SELECT orderStatus, COUNT(*) as count 
    FROM orders 
    WHERE activeFlag = 1 
    GROUP BY orderStatus;
    
    -- Top 5 sản phẩm bán chạy
    SELECT p.productName, SUM(od.quantity) as totalSold, SUM(od.price * od.quantity) as revenue
    FROM orderDetails od
    JOIN productVariants pv ON od.variantId = pv.variantId
    JOIN products p ON pv.productId = p.productId
    JOIN orders o ON od.orderId = o.orderId
    WHERE o.orderStatus IN (1, 2, 3)
    GROUP BY p.productId, p.productName
    ORDER BY totalSold DESC
    LIMIT 5;

    -- Doanh thu 6 tháng gần nhất (để vẽ biểu đồ)
    SELECT 
        DATE_FORMAT(createdAt, '%m/%Y') as month_label,
        SUM(totalPrice) as revenue,
        DATE_FORMAT(createdAt, '%Y-%m') as month_key
    FROM orders
    WHERE orderStatus IN (1, 2, 3) AND activeFlag = 1
    AND createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY month_key, month_label
    ORDER BY month_key ASC;

    -- 5 đơn hàng mới nhất
    SELECT o.orderId, u.fullName as customer_name, o.totalPrice, o.orderStatus, o.createdAt
    FROM orders o
    LEFT JOIN users u ON o.userId = u.userId
    WHERE o.activeFlag = 1
    ORDER BY o.createdAt DESC
    LIMIT 5;
END$$

DELIMITER ;
    