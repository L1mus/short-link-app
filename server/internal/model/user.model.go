package model

import "time"

type User struct {
	Id                int        `db:"id"`
	FullName          *string    `db:"full_name"`
	Email             string     `db:"email"`
	HashPassword      string     `db:"hash_password"`
	ProfilePictureURL *string    `db:"profile_picture_url"`
	CreatedAt         time.Time  `db:"created_at"`
	UpdatedAt         *time.Time `db:"updated_at"`
	DeletedAt         *time.Time `db:"deleted_at"`
}
