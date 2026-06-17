package pkg

import (
	"crypto/rand"
	"math/big"
	"strings"
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
