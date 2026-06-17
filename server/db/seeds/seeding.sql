-- 1. Insert 3 Data Users
INSERT INTO users (full_name, email, hash_password, created_at)
VALUES ('Budi Santoso', 'budi.santoso@example.com',
        '$argon2id$v=19$m=65536,t=2,p=1$xIJYsW0jYK6HncD8JVUsZA$wGP3m49Qm7OrrFOAu/baOcutE3s/sUb0LaoGLy7B13Y',
        NOW() - INTERVAL '30 days'),
       ('Siti Aminah', 'siti.aminah@example.com',
        '$argon2id$v=19$m=65536,t=2,p=1$xIJYsW0jYK6HncD8JVUsZA$wGP3m49Qm7OrrFOAu/baOcutE3s/sUb0LaoGLy7B13Y',
        NOW() - INTERVAL '20 days'),
       ('Andi Wijaya', 'andi.wijaya@example.com',
        '$argon2id$v=19$m=65536,t=2,p=1$xIJYsW0jYK6HncD8JVUsZA$wGP3m49Qm7OrrFOAu/baOcutE3s/sUb0LaoGLy7B13Y',
        NOW() - INTERVAL '10 days');

-- 2. Insert Data Forgot Password
INSERT INTO forgot_password (user_id, token, is_used, created_at, expired_at)
VALUES (1, 'token-reset-budi-12345', FALSE, NOW(), NOW() + INTERVAL '1 hour'),
       (2, 'token-reset-siti-67890', TRUE, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day');

-- 3. Insert 50 Data Links per User (Total 150 Data)
INSERT INTO links (user_id, original_url, slug, created_at, deleted_at)
SELECT
    u.id AS user_id,
    'https://sebuah-toko-online.com/kategori/promo-spesial/produk-unggulan-id-' || u.id || '-item-' || s.i AS original_url,
    SUBSTRING(MD5(u.id::TEXT || '-' || s.i::TEXT), 1, 6) AS slug,
    NOW() - (s.i || ' hours')::INTERVAL AS created_at,
    NULL AS deleted_at
FROM users u
         CROSS JOIN generate_series(1, 50) s(i)
WHERE u.id IN (1, 2, 3);