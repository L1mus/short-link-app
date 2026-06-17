package model

import "time"

type GetAllLinks struct {
	UserId      int       `db:"user_id"`
	ShortLink   string    `db:"short_link"`
	OriginalURL string    `db:"original_link"`
	ClickCount  int       `db:"click_count"`
	CreatedAt   time.Time `db:"created_at"`
	TotalCount  int       `db:"total_count"`
}
