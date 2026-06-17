package repository

import (
	"context"
	"fmt"
	"log"
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
	SELECT u.id AS user_id, concat('shrt.lnk/',l.slug) AS short_link, l.original_url,l.click_count,l.created_at, COUNT(*) OVER() AS total_count
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
		if p, err := strconv.Atoi(req.Page); err != nil {
			page = p
		}
	}
	offset := (page - 1) * limit

	_, err := fmt.Fprintf(&sb, ` LIMIT $%d OFFSET $%d`, argCount, argCount+1)
	if err != nil {
		return nil, err
	}
	args = append(args, limit, offset)

	log.Println("banyak Arguments", args, "Banyak count", argCount)

	sql := sb.String()
	var data []model.GetAllLinks
	rows, err := r.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var link model.GetAllLinks
		if err := rows.Scan(&link.UserId, &link.ShortLink, &link.OriginalURL, &link.ClickCount, &link.CreatedAt, &link.TotalCount); err != nil {
			return nil, err
		}
		data = append(data, link)
	}
	return data, nil
}
