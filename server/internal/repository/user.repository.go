package repository

import (
	"context"
	"fmt"

	"github.com/L1mus/short-link-app/server/internal/dto"
	"github.com/L1mus/short-link-app/server/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) GetUserProfile(ctx context.Context, id int) (model.User, error) {
	sql := `SELECT id,full_name,email,profile_picture_url FROM users WHERE id = $1 AND deleted_at IS NULL`
	args := []any{id}
	var data model.User
	if err := r.db.QueryRow(ctx, sql, args...).Scan(&data.Id, &data.FullName, &data.Email, &data.ProfilePictureURL); err != nil {
		return model.User{}, err
	}
	return data, nil
}

func (r *UserRepository) UpdateProfile(ctx context.Context, id int, req dto.EditProfileRequest) error {
	sql := `
		UPDATE users
        SET full_name           = $1,
            profile_picture_url = COALESCE($2, profile_picture_url),
            updated_at          = NOW()
        WHERE id = $3 AND deleted_at IS NULL`
	fmt.Println(req.ProfilePictureURL)
	args := []any{req.FullName, req.ProfilePictureURL, id}
	_, err := r.db.Exec(ctx, sql, args...)
	return err
}

func (r *UserRepository) GetHashPassword(ctx context.Context, id int) (model.User, error) {
	sql := `SELECT hash_password FROM users WHERE id = $1 AND deleted_at IS NULL`
	var user model.User
	if err := r.db.QueryRow(ctx, sql, id).Scan(&user.HashPassword); err != nil {
		return model.User{}, err
	}
	return user, nil
}

func (r *UserRepository) UpdatePassword(ctx context.Context, id int, hashPassword string) error {
	sql := `UPDATE users SET hash_password = $1, updated_at = NOW() WHERE id = $2`
	_, err := r.db.Exec(ctx, sql, hashPassword, id)
	return err
}
