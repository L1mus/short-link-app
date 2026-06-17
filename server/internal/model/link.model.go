package model

import "time"

type Links struct {
	ID          int        `db:"id"`
	UserId      int        `db:"user_id"`
	Slug        string     `db:"Slug"`
	OriginalURL string     `db:"original_url"`
	ClickCount  int        `db:"click_count"`
	CreatedAt   time.Time  `db:"created_at"`
	DeletedAt   *time.Time `db:"deleted_at"`
}
type GetAllLinks struct {
	Links
	ShortLink  string `db:"short_link"`
	TotalCount int    `db:"total_count"`
}
