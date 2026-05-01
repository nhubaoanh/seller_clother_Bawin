DELIMITER $$

-- ==========================================
-- AUTH & USERS
-- ==========================================

DROP PROCEDURE IF EXISTS `Proc_LoginUser`$$
CREATE PROCEDURE `Proc_LoginUser`(
    IN p_email VARCHAR(150)
)
BEGIN
    SELECT * FROM users 
    WHERE (email = p_email OR username = p_email) 
    AND activeFlag = 1;
END$$

DROP PROCEDURE IF EXISTS `Proc_GetUser`$$
CREATE PROCEDURE `Proc_GetUser`(
    IN p_userId VARCHAR(50)
)
BEGIN
    SELECT userId, username, fullName, email, phone, address, role 
    FROM users 
    WHERE userId = p_userId AND activeFlag = 1;
END$$

-- ==========================================
-- ORDERS & PAYMENTS
-- ==========================================

DROP PROCEDURE IF EXISTS `Proc_CreateOrderHeader`$$
CREATE PROCEDURE `Proc_CreateOrderHeader`(
    IN p_orderId VARCHAR(50),
    IN p_userId VARCHAR(50),
    IN p_totalPrice DECIMAL(12,2),
    IN p_shippingAddress TEXT,
    IN p_phone VARCHAR(20)
)
BEGIN
    INSERT INTO orders (orderId, userId, totalPrice, orderStatus, shippingAddress, phone, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
    VALUES (p_orderId, p_userId, p_totalPrice, 0, p_shippingAddress, p_phone, 1, p_userId, p_userId, NOW(), NOW());
END$$

DROP PROCEDURE IF EXISTS `Proc_CreateOrderDetail`$$
CREATE PROCEDURE `Proc_CreateOrderDetail`(
    IN p_orderDetailId VARCHAR(50),
    IN p_orderId VARCHAR(50),
    IN p_variantId VARCHAR(50),
    IN p_price DECIMAL(12,2),
    IN p_quantity INT,
    IN p_userId VARCHAR(50)
)
BEGIN
    INSERT INTO orderDetails (orderDetailId, orderId, variantId, price, quantity, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
    VALUES (p_orderDetailId, p_orderId, p_variantId, p_price, p_quantity, 1, p_userId, p_userId, NOW(), NOW());
END$$

DROP PROCEDURE IF EXISTS `Proc_CreatePayment`$$
CREATE PROCEDURE `Proc_CreatePayment`(
    IN p_paymentId VARCHAR(50),
    IN p_orderId VARCHAR(50),
    IN p_paymentMethod INT,
    IN p_amount DECIMAL(12,2),
    IN p_userId VARCHAR(50)
)
BEGIN
    INSERT INTO payments (paymentId, orderId, paymentMethod, paymentStatus, amount, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
    VALUES (p_paymentId, p_orderId, p_paymentMethod, 0, p_amount, 1, p_userId, p_userId, NOW(), NOW());
END$$

DROP PROCEDURE IF EXISTS `Proc_GetMyOrders`$$
CREATE PROCEDURE `Proc_GetMyOrders`(
    IN p_userId VARCHAR(50)
)
BEGIN
    SELECT o.*, p.paymentMethod, p.paymentStatus, p.paymentId 
    FROM orders o 
    LEFT JOIN payments p ON o.orderId = p.orderId 
    WHERE o.userId = p_userId 
    ORDER BY o.createdAt DESC;
END$$

DROP PROCEDURE IF EXISTS `Proc_GetOrderDetails`$$
CREATE PROCEDURE `Proc_GetOrderDetails`(
    IN p_orderId VARCHAR(50)
)
BEGIN
    SELECT od.*, pv.size, pv.color, p.productName, p.thumbnail
    FROM orderDetails od
    JOIN productVariants pv ON od.variantId = pv.variantId
    JOIN products p ON pv.productId = p.productId
    WHERE od.orderId = p_orderId;
END$$

DROP PROCEDURE IF EXISTS `Proc_GetMyOrders_Single`$$
CREATE PROCEDURE `Proc_GetMyOrders_Single`(
    IN p_orderId VARCHAR(50)
)
BEGIN
    SELECT o.*, p.paymentMethod, p.paymentStatus, p.paymentId 
    FROM orders o 
    LEFT JOIN payments p ON o.orderId = p.orderId 
    WHERE o.orderId = p_orderId;
END$$

DROP PROCEDURE IF EXISTS `Proc_UpdatePaymentStatus`$$
CREATE PROCEDURE `Proc_UpdatePaymentStatus`(
    IN p_orderId VARCHAR(50),
    IN p_status INT
)
BEGIN
    UPDATE payments SET paymentStatus = p_status WHERE orderId = p_orderId;
    
    IF p_status = 1 THEN
        UPDATE orders SET orderStatus = 1 WHERE orderId = p_orderId;
    END IF;
END$$

-- ==========================================
-- ADMIN PROCEDURES
-- ==========================================

DROP PROCEDURE IF EXISTS `Proc_Admin_GetAllOrders`$$
CREATE PROCEDURE `Proc_Admin_GetAllOrders`()
BEGIN
    SELECT o.*, u.fullName, u.email, p.paymentMethod, p.paymentStatus
    FROM orders o
    JOIN users u ON o.userId = u.userId
    LEFT JOIN payments p ON o.orderId = p.orderId
    WHERE o.activeFlag = 1
    ORDER BY o.createdAt DESC;
END$$

DROP PROCEDURE IF EXISTS `Proc_Admin_UpdateOrderStatus`$$
CREATE PROCEDURE `Proc_Admin_UpdateOrderStatus`(
    IN p_orderId VARCHAR(50),
    IN p_status INT,
    IN p_adminId VARCHAR(50)
)
BEGIN
    UPDATE orders 
    SET orderStatus = p_status, 
        luUserId = p_adminId, 
        updatedAt = NOW() 
    WHERE orderId = p_orderId;
    
    -- Ghi log audit nếu cần
END$$

-- ==========================================
-- PRODUCT & CATEGORY CRUD
-- ==========================================

DROP PROCEDURE IF EXISTS `Proc_Admin_UpsertProduct`$$
CREATE PROCEDURE `Proc_Admin_UpsertProduct`(
    IN p_productId VARCHAR(50),
    IN p_productName VARCHAR(200),
    IN p_categoryId VARCHAR(50),
    IN p_description TEXT,
    IN p_thumbnail VARCHAR(255),
    IN p_basePrice DECIMAL(12,2),
    IN p_stock INT,
    IN p_adminId VARCHAR(50)
)
BEGIN
    IF EXISTS (SELECT 1 FROM products WHERE productId = p_productId) THEN
        UPDATE products 
        SET productName = p_productName,
            categoryId = p_categoryId,
            description = p_description,
            thumbnail = p_thumbnail,
            basePrice = p_basePrice,
            luUserId = p_adminId,
            updatedAt = NOW()
        WHERE productId = p_productId;
    ELSE
        INSERT INTO products (productId, productName, categoryId, description, thumbnail, basePrice, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
        VALUES (p_productId, p_productName, p_categoryId, p_description, p_thumbnail, p_basePrice, 1, p_adminId, p_adminId, NOW(), NOW());
        
        -- Tự động tạo một biến thể mặc định để có tồn kho ngay lập tức
        INSERT INTO productVariants (variantId, productId, size, color, price, stock, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
        VALUES (CONCAT('VAR-', UUID_SHORT()), p_productId, 'Free', 'Default', p_basePrice, p_stock, 1, p_adminId, p_adminId, NOW(), NOW());
    END IF;
END$$

DROP PROCEDURE IF EXISTS `Proc_Admin_DeleteProduct`$$
CREATE PROCEDURE `Proc_Admin_DeleteProduct`(
    IN p_productId VARCHAR(50),
    IN p_adminId VARCHAR(50)
)
BEGIN
    UPDATE products SET activeFlag = 0, luUserId = p_adminId, updatedAt = NOW() WHERE productId = p_productId;
END$$

DROP PROCEDURE IF EXISTS `Proc_Admin_UpsertCategory`$$
CREATE PROCEDURE `Proc_Admin_UpsertCategory`(
    IN p_categoryId VARCHAR(50),
    IN p_categoryName VARCHAR(150),
    IN p_description TEXT,
    IN p_adminId VARCHAR(50)
)
BEGIN
    IF EXISTS (SELECT 1 FROM categories WHERE categoryId = p_categoryId) THEN
        UPDATE categories 
        SET categoryName = p_categoryName,
            description = p_description,
            luUserId = p_adminId,
            updatedAt = NOW()
        WHERE categoryId = p_categoryId;
    ELSE
        INSERT INTO categories (categoryId, categoryName, description, activeFlag, userCreateId, luUserId, createdAt, updatedAt)
        VALUES (p_categoryId, p_categoryName, p_description, 1, p_adminId, p_adminId, NOW(), NOW());
    END IF;
END$$

DROP PROCEDURE IF EXISTS `Proc_Admin_DeleteCategory`$$
CREATE PROCEDURE `Proc_Admin_DeleteCategory`(
    IN p_categoryId VARCHAR(50),
    IN p_adminId VARCHAR(50)
)
BEGIN
    UPDATE categories SET activeFlag = 0, luUserId = p_adminId, updatedAt = NOW() WHERE categoryId = p_categoryId;
END$$

DROP PROCEDURE IF EXISTS `SearchProducts`$$
CREATE PROCEDURE `SearchProducts`(
    IN p_search VARCHAR(200),
    IN p_categoryId VARCHAR(50),
    IN p_minPrice DECIMAL(12,2),
    IN p_maxPrice DECIMAL(12,2),
    IN p_sortBy VARCHAR(50),
    IN p_pageIndex INT,
    IN p_pageSize INT
)
BEGIN
    DECLARE v_offset INT;
    SET v_offset = (p_pageIndex - 1) * p_pageSize;

    SELECT p.productId,
           p.productName,
           p.categoryId,
           c.categoryName,
           p.description,
           p.thumbnail,
           p.basePrice,
           p.activeFlag,
           p.createdAt,
           p.updatedAt,
           COALESCE(SUM(pv.stock), 0) as totalStock,
           COUNT(DISTINCT pv.variantId) as variantCount,
           MIN(pv.price) as minPrice,
           MAX(pv.price) as maxPrice,
           (SELECT GROUP_CONCAT(imageUrl) FROM productImages WHERE productId = p.productId AND activeFlag = 1) as images,
           4.5 as rating,
           120 as ratingCount,
           50 as soldCount,
           (SELECT COUNT(*) FROM products 
            WHERE activeFlag = 1 
              AND (p_search = '' OR productName LIKE CONCAT('%', p_search, '%')) 
              AND (p_categoryId IS NULL OR p_categoryId = '' OR categoryId = p_categoryId)
              AND (p_minPrice IS NULL OR basePrice >= p_minPrice)
              AND (p_maxPrice IS NULL OR basePrice <= p_maxPrice)
           ) as RecordCount
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.categoryId
    LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
    WHERE p.activeFlag = 1
      AND (p_search = '' OR p.productName LIKE CONCAT('%', p_search, '%'))
      AND (p_categoryId IS NULL OR p_categoryId = '' OR p.categoryId = p_categoryId)
      AND (p_minPrice IS NULL OR p.basePrice >= p_minPrice)
      AND (p_maxPrice IS NULL OR p.basePrice <= p_maxPrice)
    GROUP BY p.productId
    ORDER BY 
        CASE WHEN p_sortBy = 'price-asc' THEN p.basePrice END ASC,
        CASE WHEN p_sortBy = 'price-desc' THEN p.basePrice END DESC,
        CASE WHEN p_sortBy = 'newest' OR p_sortBy = '' OR p_sortBy IS NULL THEN p.createdAt END DESC
    LIMIT v_offset, p_pageSize;
END$$

DROP PROCEDURE IF EXISTS `Proc_GetProductById`$$
CREATE PROCEDURE `Proc_GetProductById`(
    IN p_productId VARCHAR(50)
)
BEGIN
    SELECT p.productId,
           p.productName,
           p.categoryId,
           c.categoryName,
           p.description,
           p.thumbnail,
           p.basePrice,
           p.activeFlag,
           p.createdAt,
           p.updatedAt,
           -- Variants info
           COALESCE(SUM(pv.stock), 0) as totalStock,
           COUNT(DISTINCT pv.variantId) as variantCount,
           MIN(pv.price) as minPrice,
           MAX(pv.price) as maxPrice,
           -- Images info
           (SELECT GROUP_CONCAT(imageUrl) FROM productImages WHERE productId = p.productId AND activeFlag = 1) as images,
           -- Dummy data
           4.5 as rating,
           120 as ratingCount,
           50 as soldCount
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.categoryId
    LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
    WHERE p.productId = p_productId AND p.activeFlag = 1
    GROUP BY p.productId;
END$$

DROP PROCEDURE IF EXISTS `Proc_SearchUsers`$$
CREATE PROCEDURE `Proc_SearchUsers`(
    IN p_search VARCHAR(150),
    IN p_pageIndex INT,
    IN p_pageSize INT
)
BEGIN
    DECLARE v_offset INT;
    SET v_offset = (p_pageIndex - 1) * p_pageSize;

    SELECT userId as user_id, 
           username, 
           fullName as full_name, 
           email, 
           phone, 
           address, 
           role as role_code, 
           role as role_name,
           activeFlag as active_flag, 
           1 as online_flag,
           (SELECT COUNT(*) FROM users WHERE activeFlag = 1 AND (p_search = '' OR username LIKE CONCAT('%', p_search, '%') OR fullName LIKE CONCAT('%', p_search, '%'))) as RecordCount
    FROM users
    WHERE activeFlag = 1
      AND (p_search = '' OR username LIKE CONCAT('%', p_search, '%') OR fullName LIKE CONCAT('%', p_search, '%'))
    ORDER BY createdAt DESC
    LIMIT v_offset, p_pageSize;
END$$

DROP PROCEDURE IF EXISTS `Proc_SearchCategories`$$
CREATE PROCEDURE `Proc_SearchCategories`(
    IN p_search VARCHAR(150),
    IN p_pageIndex INT,
    IN p_pageSize INT
)
BEGIN
    DECLARE v_offset INT;
    SET v_offset = (p_pageIndex - 1) * p_pageSize;

    SELECT *, 
           (SELECT COUNT(*) FROM categories WHERE activeFlag = 1 AND (categoryName LIKE CONCAT('%', p_search, '%') OR description LIKE CONCAT('%', p_search, '%'))) as RecordCount
    FROM categories
    WHERE activeFlag = 1
      AND (p_search = '' OR categoryName LIKE CONCAT('%', p_search, '%') OR description LIKE CONCAT('%', p_search, '%'))
    LIMIT v_offset, p_pageSize;
END$$

DELIMITER ;



