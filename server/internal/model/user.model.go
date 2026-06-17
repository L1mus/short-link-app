package model

import "time"

type User struct {
	Id           int        `json:"id" db:"id"`
	FullName     string     `json:"full_name" db:"full_name"`
	Email        string     `json:"email" db:"email"`
	HashPassword string     `json:"hash_password" db:"hash_password"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at" db:"deleted_at"`
}
