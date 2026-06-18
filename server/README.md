# ShortLink-app - Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/license/mit)

## About ShortLink-app

ShortLink-app is a fast, secure, and scalable URL shortening backend system.
Built with Go, PostgreSQL, and Redis, it handles:

- User management & authentication (JWT + argon2)
- Fast and reliable URL redirection
- Custom aliases for branded links
- Link management and organization
- Click analytics and traffic tracking utilizing Redis caching

From shortening clumsy URLs to tracking your link engagement, ShortLink-app works behind the scenes to keep your links accessible and insightful.

## Technologies Used

- [![Go](https://img.shields.io/badge/Go-1.24-00ADD8?logo=go&logoColor=white)](https://go.dev/)
- [![Gin](https://img.shields.io/badge/Gin-Framework-00ADD8?logo=go&logoColor=white)](https://gin-gonic.com/)
- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.13-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
- [![Redis](https://img.shields.io/badge/Redis-8.6.3-FF4438?logo=redis&logoColor=white)](https://redis.io/)
- [![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
- [![Swagger](https://img.shields.io/badge/Swagger-Docs-85EA2D?logo=swagger&logoColor=white)](https://swagger.io/)
- [![Docker](https://img.shields.io/badge/Docker-29.5.2-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

## Environment

```bash
APP_HOST=<your_app_host>
APP_PORT=<your_app_port>

DB_HOST=<your_database_host>
DB_PORT=<your_database_port>
DB_USER=<your_database_user>
DB_PASS=<your_database_password>
DB_NAME=<your_database_name>

JWT_ISSUER=<your_jwt_issuer>
JWT_SECRET=<your_jwt_secret>

RDB_USER=<your_redis_user>
RDB_PASS=<your_redis_password>
```

## ⚙️ Installation

1. Clone the project

```sh
$ https://github.com/L1mus/short-link-app.git
```

2. Navigate to project directory

```sh
$ cd server
```

3. Install dependencies

```sh
$ go mod tidy
```

4. Setup your [environment](##-environment)

5. Install [migrate](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate#installation) for DB migration

6. Do the DB Migration

```sh
$ migrate -database YOUR_DATABASE_URL -path ./db/migrations up
```

or if you install Makefile run command

```sh
$ make migrate-up
```

and seeding data

```sh
$ make db-seed
```

7. Run the project

```sh
$ go run ./cmd/main.go
```

## API Endpoint

| Method | Endpoint            | Description                                                       |
|--------|---------------------|-------------------------------------------------------------------|
| POST   | `/auth/register`    | Register new user                                                 |
| POST   | `/auth`             | Login user and admin                                              |
| POST   | `/auth/logout`      | Logout(Blacklist)                                                 |
| POST   | `/auth/forgot-password` | Create token                                                      |
| POST   | `/auth/reset-password` | Set a new password after successful create token                  |
| GET    | `/users/profile`    | Get the profile data of the logged in user based on the jwt token |
| PATCH  | `/users/profile`    | Update user data profile                                          |
| GET    | `/links`            | Get list of Links for logged-in User                              |
| POST   | `/links`            | Create short link by generate or create Custom                    |
| DELETE | `/links/:id`        | Delete link by ID                                                 |
| GET    | `/`                 | Redirect Link link to ORGINAL LINK                                |

Full interactive docs available at `/swagger/index.html` after running the server.

## Changelog
| Version | Description                                                                                                                                                                                                                                 |
| ------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.0  | Setup Docker multi-stage build and docker-compose orchestration with PostgreSQL & Redis |

## How to Contribute
- Fork this repository
- Create your changes
- Commit your changes (Please strictly follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard: `feat:`, `fix:`, `chore:`, `docs:`)
- Push to the branch
- Open a Pull Request

## Related Project
[Frontend ShortLink Repository](https://github.com/L1mus/short-link-app/client)

Copyright (c) 2026