package repository

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/L1mus/short-link-app/server/internal/dto"
	"github.com/L1mus/short-link-app/server/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LinkRepository struct {
	db *pgxpool.Pool
}

func NewLinkRepository(db *pgxpool.Pool) *LinkRepository {
	return &LinkRepository{
		db: db,
	}
}

func (r *LinkRepository) GetAllLink(ctx context.Context, UserId int, req dto.PageQuery) ([]model.GetAllLinks, error) {
	var sb strings.Builder
	var args []any
	argCount := 1

	sb.WriteString(`
	SELECT l.id,u.id AS user_id, concat('shrt.lnk/',l.slug) AS short_link, l.original_url,l.click_count,l.created_at, COUNT(*) OVER() AS total_count
	FROM links l
	JOIN users u ON u.id = l.user_id
	WHERE l.deleted_at IS NULL AND u.id = $1
	`)
	args = append(args, UserId)
	argCount++

	if req.Search != "" {
		_, err := fmt.Fprintf(&sb, `AND (l.original_url ILIKE  $%d  OR l.slug  ILIKE $%d )`, argCount, argCount)
		if err != nil {
			return nil, err
		}
		args = append(args, "%"+req.Search+"%")
		argCount++
	}
	sb.WriteString(`ORDER BY l.created_at ASC`)
	limit := 10
	page := 1

	if req.Page != "" {
		if p, err := strconv.Atoi(req.Page); err == nil && p > 0 {
			page = p
		}
	}
	offset := (page - 1) * limit

	_, err := fmt.Fprintf(&sb, ` LIMIT $%d OFFSET $%d`, argCount, argCount+1)
	if err != nil {
		return nil, err
	}
	args = append(args, limit, offset)

	sql := sb.String()
	var data []model.GetAllLinks
	rows, err := r.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var link model.GetAllLinks
		if err := rows.Scan(&link.ID, &link.UserId, &link.ShortLink, &link.OriginalURL, &link.ClickCount, &link.CreatedAt, &link.TotalCount); err != nil {
			return nil, err
		}
		data = append(data, link)
	}
	return data, nil
}

func (r *LinkRepository) CreateShortLink(ctx context.Context, userID int, slug string, originalLink string) (model.Links, error) {
	var data model.Links
	sql := `
	INSERT INTO links (user_id,original_url,slug) VALUES ($1,$2,$3) RETURNING id,original_url,slug
`
	args := []any{userID, originalLink, slug}
	err := r.db.QueryRow(ctx, sql, args...).Scan(&data.ID, &data.OriginalURL, &data.Slug)
	if err != nil {
		return model.Links{}, err
	}
	return model.Links{
		ID:          data.ID,
		OriginalURL: data.OriginalURL,
		Slug:        data.Slug,
	}, nil
}

func (r *LinkRepository) CheckLink(ctx context.Context, slug string) (bool, error) {
	sql := `
	SELECT COUNT(1) FROM links WHERE slug = $1 AND deleted_at IS NULL`
	var count int

	if err := r.db.QueryRow(ctx, sql, slug).Scan(&count); err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *LinkRepository) DeleteLinkById(ctx context.Context, linkID int) error {
	sql := `
	UPDATE links SET deleted_at = NOW() WHERE id = $1
`
	_, err := r.db.Exec(ctx, sql, linkID)
	if err != nil {
		return err
	}

	return nil
}

func (r *LinkRepository) CheckDeletedLinkById(ctx context.Context, linkID int) error {
	sql := `
	SELECT id FROM links WHERE id = $1 AND deleted_at IS NULL
`
	var id int
	err := r.db.QueryRow(ctx, sql, linkID).Scan(&id)
	if err != nil {
		return err
	}
	return nil
}

func (r *LinkRepository) CheckOriginalLink(ctx context.Context, slug string) (model.Links, error) {
	sql := `
	SELECT slug,original_url FROM links WHERE slug = $1 AND deleted_at IS NULL
`
	var data model.Links
	err := r.db.QueryRow(ctx, sql, slug).Scan(&data.Slug, &data.OriginalURL)
	if err != nil {
		return model.Links{}, err
	}
	return data, nil
}
