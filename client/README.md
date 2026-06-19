# ShortLink App - Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/license/mit)

## About ShortLink-app

ShortLink-app is a fast and intuitive URL shortening web application.
Built with React.js, JavaScript, and Redux, it allows users to easily manage and customize their links. Features include:

- Mobile-First Responsive UI
- Generate concise short links from long URLs
- Customize links with unique aliases for branding
- Copy and share links effortlessly
- Interactive dashboard for Link and Profile Management

From simplifying clumsy URLs to organizing your shared links — ShortLink-app makes link sharing effortless.

## Preview

<img src="./AuthPage.jpeg" width=500px/>
<img src="./LandingPage.jpeg" width=500px/>
<img src="./ResultPage.jpeg" width=500px/>
<img src="./DashboardPage.jpeg" width=500px/>

## Technologies Used

- [![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react&logoColor=white)](https://react.dev/)
- [![Vite](https://img.shields.io/badge/Vite-8.0.14-purple?logo=vite&logoColor=white)](https://vitejs.dev/)
- [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.2-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
- [![Redux](https://img.shields.io/badge/Redux_Toolkit-6.0.0-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
- [![Nginx](https://img.shields.io/badge/Nginx-Stable_Alpine-009639?logo=nginx&logoColor=white)](https://nginx.org/)
- [![Docker](https://img.shields.io/badge/Docker-29.5.2-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

## Environment

```sh
VITE_API_URL=<your_backend_addres>
```

## ⚙️ Installation

1. Clone the project

```sh
$ https://github.com/L1mus/short-link-app
```

2. Navigate to project directory

```sh
$ cd client
```

3. Install dependencies

```sh
$ npm install
```

4. Run project

```sh
$ npm run dev
```

## Changelog

| Version | Description                                                                                                      |
| ------- | -----------------------------------------------------------------------------------------------------------------|
| 1.0     | Setup Docker multi-stage build, Nginx and setup GitHub Actions for GHCR deployment|

## How to Contribute

- Fork this repository
- Create your changes
- Commit your changes (Please strictly follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard: `feat:`, `fix:`, `chore:`, `docs:`)
- Push to the branch
- Open a Pull Request

## Related Project

[Backend short-link-app Repository](https://github.com/L1mus/short-link-app/tree/main/server)

Copyright (c) 2026
