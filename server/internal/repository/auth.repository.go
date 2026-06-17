package repository

import (
	"context"
	"time"

	"github.com/L1mus/short-link-app/server/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuthRepository struct {
	db *pgxpool.Pool
}

func NewAuthRepository(db *pgxpool.Pool) *AuthRepository {
	return &AuthRepository{
		db: db,
	}
}

func (r *AuthRepository) Register(ctx context.Context, email, hashPassword string) (model.User, error) {

	sqlUser := `INSERT INTO users (email,hash_password) VALUES($1,$2) RETURNING id, email, created_at`
	args := []any{email, hashPassword}
	var user model.User
	if err := r.db.QueryRow(ctx, sqlUser, args...).Scan(&user.Id, &user.Email, &user.CreatedAt); err != nil {
		return model.User{}, err
	}
	return user, nil
}

func (r *AuthRepository) CheckEmailExist(ctx context.Context, email string) (bool, error) {
	var count int
	sql := `SELECT COUNT(1) FROM users WHERE email=$1 AND deleted_at IS NULL`
	args := []any{email}
	if err := r.db.QueryRow(ctx, sql, args...).Scan(&count); err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *AuthRepository) Login(ctx context.Context, email string) (model.User, error) {
	sql := `SELECT id,email, hash_password FROM users WHERE email = $1 AND deleted_at IS NULL`
	args := []any{email}
	var user model.User
	if err := r.db.QueryRow(ctx, sql, args...).Scan(&user.Id, &user.Email, &user.HashPassword); err != nil {
		return model.User{}, err
	}
	return user, nil
}

func (r *AuthRepository) GetUserByEmail(ctx context.Context, email string) (model.User, error) {
	sql := `SELECT id, email FROM users WHERE email = $1 AND deleted_at IS NULL`
	var user model.User
	if err := r.db.QueryRow(ctx, sql, email).Scan(
		&user.Id, &user.Email,
	); err != nil {
		return model.User{}, err
	}
	return user, nil
}

func (r *AuthRepository) InsertForgotPasswordToken(ctx context.Context, userID int, token string, expiredAt time.Time) error {
	sql := `INSERT INTO forgot_password (user_id, token, expired_at) VALUES ($1, $2, $3)`
	_, err := r.db.Exec(ctx, sql, userID, token, expiredAt)
	return err
}

func (r *AuthRepository) GetForgotPasswordToken(ctx context.Context, token string) (model.ForgotPassword, error) {
	sql := `SELECT id, user_id, token, is_used, created_at, expired_at FROM forgot_password WHERE token = $1`
	var fp model.ForgotPassword
	if err := r.db.QueryRow(ctx, sql, token).Scan(
		&fp.Id, &fp.UserID, &fp.Token, &fp.IsUsed, &fp.CreatedAt, &fp.ExpiredAt,
	); err != nil {
		return model.ForgotPassword{}, err
	}
	return fp, nil
}

func (r *AuthRepository) MarkTokenAsUsed(ctx context.Context, tokenID int) error {
	sql := `UPDATE forgot_password SET is_used = TRUE WHERE id = $1`
	_, err := r.db.Exec(ctx, sql, tokenID)
	return err
}

func (r *AuthRepository) UpdatePassword(ctx context.Context, userID int, hashPassword string) error {
	sql := `UPDATE users SET hash_password = $1, updated_at = NOW() WHERE id = $2`
	_, err := r.db.Exec(ctx, sql, hashPassword, userID)
	return err
}
