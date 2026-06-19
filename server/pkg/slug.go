package pkg

import (
	"crypto/rand"
	"math/big"
	"regexp"
	"strings"

	"github.com/L1mus/short-link-app/server/internal/appError"
)

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func GenRandomID() (uint64, error) {
	var minimumConstraint int64 = 961_132_832
	var maximumConstraint int64 = 218_340_105_584_895

	bg := big.NewInt(maximumConstraint - minimumConstraint + 1)

	r, err := rand.Int(rand.Reader, bg)
	if err != nil {
		return 0, err
	}

	return uint64(r.Int64() + minimumConstraint), nil
}

func Base64Encoded(number uint64) string {
	if number == 0 {
		return string(alphabet[0])
	}
	var sb strings.Builder
	for number > 0 {
		remainder := number % 62
		sb.WriteByte(alphabet[remainder])
		number = number / 62
	}
	return Reverse(sb.String())
}

func Reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

func GenSlug() (string, error) {
	randomID, err := GenRandomID()
	if err != nil {
		return "", err
	}
	return Base64Encoded(randomID), nil
}

func ValidateCustomSlug(slug string) error {
	var (
		reservedWords = map[string]bool{
			"api":       true,
			"login":     true,
			"register":  true,
			"dashboard": true,
		}
		slugRegex = regexp.MustCompile(`^[a-zA-Z0-9-]+$`)
	)

	// cek panjang
	if len(slug) < 3 {
		return appError.MinimumSlugLength
	}
	if len(slug) > 50 {
		return appError.MaximumSlugLength
	}

	// cek karakter
	if !slugRegex.MatchString(slug) {
		return appError.InvalidSlug
	}

	// cek reserved words
	slugLower := strings.ToLower(slug)
	segments := strings.Split(slugLower, "-")
	for _, segment := range segments {
		if reservedWords[segment] {
			return appError.UsingReserveWord
		}
	}
	return nil
}
