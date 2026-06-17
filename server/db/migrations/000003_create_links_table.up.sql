CREATE TABLE IF NOT EXISTS links
(
    id           SERIAL PRIMARY KEY,
    user_id      INT                NOT NULL,
    original_url TEXT               NOT NULL,
    slug         VARCHAR(50) UNIQUE NOT NULL,
    click_count  INT                NOT NULL DEFAULT 0,
    created_at   TIMESTAMP          NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMP,

    CONSTRAINT fk_links FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_links_user_id ON links (user_id);
CREATE UNIQUE INDEX idx_links_slug ON links (slug) WHERE deleted_at IS NULL;