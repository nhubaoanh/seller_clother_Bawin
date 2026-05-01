-- =============================================
-- STORED PROCEDURES CẬP NHẬT CHO SẢN PHẨM
-- =============================================

DELIMITER $$

-- Lấy tất cả sản phẩm với thông tin đầy đủ
DROP PROCEDURE IF EXISTS GetAllProducts$$
CREATE PROCEDURE GetAllProducts(
    IN p_pageIndex INT,
    IN p_pageSize INT,
    OUT p_error_code INT,
    OUT p_error_message VARCHAR(500)
)
BEGIN
    DECLARE p_total_row INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_error_code = RETURNED_SQLSTATE,
            p_error_message = MESSAGE_TEXT;
    END;

    SET p_error_code = 0;
    SET p_error_message = '';

    IF p_pageSize <> 0 THEN
        DROP TEMPORARY TABLE IF EXISTS ProductResults;
        
        CREATE TEMPORARY TABLE ProductResults AS
        SELECT 
            (@row_number := @row_number + 1) AS RowNumber,
            t.*
        FROM (
            SELECT 
                p.productId,
                p.productName,
                p.categoryId,
                c.categoryName,
                p.description,
                p.thumbnail,
                p.basePrice,
                p.activeFlag,
                p.createdAt,
                p.updatedAt,
                -- Thông tin variants
                COUNT(DISTINCT pv.variantId) as variantCount,
                COALESCE(SUM(pv.stock), 0) as totalStock,
                MIN(pv.price) as minPrice,
                MAX(pv.price) as maxPrice,
                -- Thông tin images
                GROUP_CONCAT(DISTINCT pi.imageUrl ORDER BY pi.createdAt SEPARATOR ',') as images,
                -- Thông tin đánh giá (giả lập)
                ROUND(4.0 + (RAND() * 1.0), 1) as rating,
                FLOOR(10 + (RAND() * 200)) as ratingCount,
                FLOOR(RAND() * 100) as soldCount
            FROM products p
            LEFT JOIN categories c ON p.categoryId = c.categoryId
            LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
            LEFT JOIN productImages pi ON p.productId = pi.productId AND pi.activeFlag = 1
            WHERE p.activeFlag = 1
            GROUP BY p.productId, p.productName, p.categoryId, c.categoryName, 
                     p.description, p.thumbnail, p.basePrice, p.activeFlag,
                     p.createdAt, p.updatedAt
            ORDER BY p.createdAt DESC
        ) t
        CROSS JOIN (SELECT @row_number := 0) r;

        SELECT COUNT(*) INTO p_total_row FROM ProductResults;

        SELECT *, p_total_row AS RecordCount
        FROM ProductResults
        WHERE RowNumber BETWEEN ((p_pageIndex - 1) * p_pageSize) + 1 AND (p_pageIndex * p_pageSize);

        DROP TEMPORARY TABLE ProductResults;
    ELSE
        SELECT 
            p.productId,
            p.productName,
            p.categoryId,
            c.categoryName,
            p.description,
            p.thumbnail,
            p.basePrice,
            p.activeFlag,
            p.createdAt,
            p.updatedAt,
            COUNT(DISTINCT pv.variantId) as variantCount,
            COALESCE(SUM(pv.stock), 0) as totalStock,
            MIN(pv.price) as minPrice,
            MAX(pv.price) as maxPrice,
            GROUP_CONCAT(DISTINCT pi.imageUrl ORDER BY pi.createdAt SEPARATOR ',') as images,
            ROUND(4.0 + (RAND() * 1.0), 1) as rating,
            FLOOR(10 + (RAND() * 200)) as ratingCount,
            FLOOR(RAND() * 100) as soldCount,
            COUNT(*) OVER() AS RecordCount
        FROM products p
        LEFT JOIN categories c ON p.categoryId = c.categoryId
        LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
        LEFT JOIN productImages pi ON p.productId = pi.productId AND pi.activeFlag = 1
        WHERE p.activeFlag = 1
        GROUP BY p.productId, p.productName, p.categoryId, c.categoryName, 
                 p.description, p.thumbnail, p.basePrice, p.activeFlag,
                 p.createdAt, p.updatedAt
        ORDER BY p.createdAt DESC;
    END IF;
END$$

-- Lấy sản phẩm theo ID với thông tin chi tiết
DROP PROCEDURE IF EXISTS GetProductById$$
CREATE PROCEDURE GetProductById(
    IN p_productId VARCHAR(50),
    OUT p_error_code INT,
    OUT p_error_message VARCHAR(500)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_error_code = RETURNED_SQLSTATE,
            p_error_message = MESSAGE_TEXT;
    END;

    SET p_error_code = 0;
    SET p_error_message = '';

    SELECT 
        p.productId,
        p.productName,
        p.categoryId,
        c.categoryName,
        p.description,
        p.thumbnail,
        p.basePrice,
        p.activeFlag,
        p.createdAt,
        p.updatedAt,
        -- Thông tin variants
        COUNT(DISTINCT pv.variantId) as variantCount,
        COALESCE(SUM(pv.stock), 0) as totalStock,
        MIN(pv.price) as minPrice,
        MAX(pv.price) as maxPrice,
        -- Thông tin images
        GROUP_CONCAT(DISTINCT pi.imageUrl ORDER BY pi.createdAt SEPARATOR ',') as images,
        -- Thông tin đánh giá
        ROUND(4.0 + (RAND() * 1.0), 1) as rating,
        FLOOR(10 + (RAND() * 200)) as ratingCount,
        FLOOR(RAND() * 100) as soldCount
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.categoryId
    LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
    LEFT JOIN productImages pi ON p.productId = pi.productId AND pi.activeFlag = 1
    WHERE p.productId = p_productId AND p.activeFlag = 1
    GROUP BY p.productId, p.productName, p.categoryId, c.categoryName, 
             p.description, p.thumbnail, p.basePrice, p.activeFlag,
             p.createdAt, p.updatedAt;
END$$

-- Lấy variants của sản phẩm
DROP PROCEDURE IF EXISTS GetProductVariants$$
CREATE PROCEDURE GetProductVariants(
    IN p_productId VARCHAR(50),
    OUT p_error_code INT,
    OUT p_error_message VARCHAR(500)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_error_code = RETURNED_SQLSTATE,
            p_error_message = MESSAGE_TEXT;
    END;

    SET p_error_code = 0;
    SET p_error_message = '';

    SELECT 
        pv.variantId,
        pv.productId,
        pv.size,
        pv.color,
        pv.price,
        pv.stock,
        pv.activeFlag,
        pv.createdAt,
        pv.updatedAt,
        p.productName,
        p.thumbnail
    FROM productVariants pv
    LEFT JOIN products p ON pv.productId = p.productId
    WHERE pv.productId = p_productId 
    AND pv.activeFlag = 1 
    AND p.activeFlag = 1
    ORDER BY pv.size, pv.color;
END$$

-- Lấy sản phẩm theo category
DROP PROCEDURE IF EXISTS GetProductsByCategory$$
CREATE PROCEDURE GetProductsByCategory(
    IN p_categoryId VARCHAR(50),
    IN p_pageIndex INT,
    IN p_pageSize INT,
    OUT p_error_code INT,
    OUT p_error_message VARCHAR(500)
)
BEGIN
    DECLARE p_total_row INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            p_error_code = RETURNED_SQLSTATE,
            p_error_message = MESSAGE_TEXT;
    END;

    SET p_error_code = 0;
    SET p_error_message = '';

    IF p_pageSize <> 0 THEN
        DROP TEMPORARY TABLE IF EXISTS CategoryResults;
        
        CREATE TEMPORARY TABLE CategoryResults AS
        SELECT 
            (@row_number := @row_number + 1) AS RowNumber,
            t.*
        FROM (
            SELECT 
                p.productId,
                p.productName,
                p.categoryId,
                c.categoryName,
                p.description,
                p.thumbnail,
                p.basePrice,
                p.activeFlag,
                p.createdAt,
                p.updatedAt,
                COUNT(DISTINCT pv.variantId) as variantCount,
                COALESCE(SUM(pv.stock), 0) as totalStock,
                MIN(pv.price) as minPrice,
                MAX(pv.price) as maxPrice,
                GROUP_CONCAT(DISTINCT pi.imageUrl ORDER BY pi.createdAt SEPARATOR ',') as images,
                ROUND(4.0 + (RAND() * 1.0), 1) as rating,
                FLOOR(10 + (RAND() * 200)) as ratingCount,
                FLOOR(RAND() * 100) as soldCount
            FROM products p
            LEFT JOIN categories c ON p.categoryId = c.categoryId
            LEFT JOIN productVariants pv ON p.productId = pv.productId AND pv.activeFlag = 1
            LEFT JOIN productImages pi ON p.productId = pi.productId AND pi.activeFlag = 1
            WHERE p.activeFlag = 1 AND p.categoryId = p_categoryId
            GROUP BY p.productId, p.productName, p.categoryId, c.categoryName, 
                     p.description, p.thumbnail, p.basePrice, p.activeFlag,
                     p.createdAt, p.updatedAt
            ORDER BY p.createdAt DESC
        ) t
        CROSS JOIN (SELECT @row_number := 0) r;

        SELECT COUNT(*) INTO p_total_row FROM CategoryResults;

        SELECT *, p_total_row AS RecordCount
        FROM CategoryResults
        WHERE RowNumber BETWEEN ((p_pageIndex - 1) * p_pageSize) + 1 AND (p_pageIndex * p_pageSize);

        DROP TEMPORARY TABLE CategoryResults;
    END IF;
END$$

DELIMITER ;

-- =============================================
-- CẬP NHẬT DỮ LIỆU MẪU VỚI ĐƯỜNG DẪN ẢNH MỚI
-- =============================================

-- Cập nhật thumbnail sản phẩm với đường dẫn mới
UPDATE products SET 
thumbnail = '/uploads/products/2024/12/27/ao_thun_uniqlo.jpg'
WHERE productId = 'PROD001';

UPDATE products SET 
thumbnail = '/uploads/products/2024/12/27/hoodie_nike.jpg'
WHERE productId = 'PROD002';

UPDATE products SET 
thumbnail = '/uploads/products/2024/12/27/jean_levis.jpg'
WHERE productId = 'PROD003';

UPDATE products SET 
thumbnail = '/uploads/products/2024/12/27/vay_zara.jpg'
WHERE productId = 'PROD004';

UPDATE products SET 
thumbnail = '/uploads/products/2024/12/27/somi_uniqlo.jpg'
WHERE productId = 'PROD005';

-- Cập nhật ảnh chi tiết sản phẩm
UPDATE productImages SET 
imageUrl = '/uploads/products/2024/12/27/ao_thun_uniqlo_1.jpg'
WHERE imageId = 'IMG001';

UPDATE productImages SET 
imageUrl = '/uploads/products/2024/12/27/hoodie_nike_1.jpg'
WHERE imageId = 'IMG002';

UPDATE productImages SET 
imageUrl = '/uploads/products/2024/12/27/jean_levis_1.jpg'
WHERE imageId = 'IMG003';

UPDATE productImages SET 
imageUrl = '/uploads/products/2024/12/27/vay_zara_1.jpg'
WHERE imageId = 'IMG004';

UPDATE productImages SET 
imageUrl = '/uploads/products/2024/12/27/somi_uniqlo_1.jpg'
WHERE imageId = 'IMG005';

-- Thêm nhiều ảnh cho mỗi sản phẩm
INSERT INTO productImages VALUES
('IMG006','PROD001','/uploads/products/2024/12/27/ao_thun_uniqlo_2.jpg',1,'USR001','USR001',NOW(),NOW()),
('IMG007','PROD001','/uploads/products/2024/12/27/ao_thun_uniqlo_3.jpg',1,'USR001','USR001',NOW(),NOW()),
('IMG008','PROD002','/uploads/products/2024/12/27/hoodie_nike_2.jpg',1,'USR001','USR001',NOW(),NOW()),
('IMG009','PROD002','/uploads/products/2024/12/27/hoodie_nike_3.jpg',1,'USR001','USR001',NOW(),NOW()),
('IMG010','PROD003','/uploads/products/2024/12/27/jean_levis_2.jpg',1,'USR001','USR001',NOW(),NOW());