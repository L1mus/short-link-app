CREATE TABLE IF NOT EXISTS users
(
    id                  SERIAL PRIMARY KEY,
    full_name           VARCHAR(100),
    email               VARCHAR(255) UNIQUE NOT NULL,
    hash_password       VARCHAR(255)        NOT NULL,
    created_at          TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP,
    deleted_at          TIMESTAMP
);