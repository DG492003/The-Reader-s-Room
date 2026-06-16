<div align="center">

<br/>

<svg width="72" height="52" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 42 C50 42 18 38 14 14 C10 -4 36 2 50 18 Z" fill="#3B5998" opacity="0.9"/>
  <path d="M50 42 C50 42 82 38 86 14 C90 -4 64 2 50 18 Z" fill="#4A7C59" opacity="0.9"/>
  <path d="M50 42 C50 42 18 38 10 58 C8 64 30 68 50 54 Z" fill="#3B5998" opacity="0.55"/>
  <path d="M50 42 C50 42 82 38 90 58 C92 64 70 68 50 54 Z" fill="#4A7C59" opacity="0.55"/>
</svg>

# 📚 The Reader's Room

**A full-stack community book-sharing platform where readers can share, borrow, review, and manage books.**

<br/>

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.6-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

</div>

---

## ✨ Overview

The Reader's Room is a community-driven book lending platform. Users can register, share books from their personal collection, borrow from others, leave reviews, and manage their entire reading activity — all in one place.

> *"A reader lives a thousand lives before he dies. The man who never reads lives only one."* — George R.R. Martin

---

## 🗂️ Project Structure

```
The-Readers-Room/
├── readers-room-api/          # Spring Boot REST API (Backend)
│   ├── src/main/java/com/trr/readers_room_api/
│   │   ├── auth/              # Registration, login, account activation
│   │   ├── book/              # Book CRUD, borrow, return, cover upload
│   │   ├── feedback/          # Reviews and star ratings
│   │   ├── history/           # Borrow transaction history
│   │   ├── users/             # User entity & repository
│   │   ├── tokens/            # Email activation tokens
│   │   ├── security/jwt/      # JWT filter & service
│   │   ├── configs/           # Spring Security, CORS, auditing
│   │   ├── emails/            # Email service (Thymeleaf templates)
│   │   ├── handler/           # Global exception handler
│   │   └── common/            # Base audit entity, pagination response
│   └── src/main/resources/
│       ├── application.yaml
│       ├── application-dev.yml
│       └── templates/         # Thymeleaf email templates
│
└── readers-room-ui/           # Angular 20 SPA (Frontend)
    └── src/app/services/
        ├── Pages/             # Login, Register, Activate Account
        ├── modules/books/
        │   ├── components/    # Menu, BookCard, Rating
        │   └── pages/         # BookList, MyBooks, ManageBook,
        │                      #   BookDetails, BorrowedBooks,
        │                      #   ReturnedBooks, WaitingList
        ├── guard/             # Auth & registration guards
        ├── interceptor/       # HTTP interceptor (JWT + 401 handling)
        └── services/token/    # Token service (localStorage + expiry)
```

---

## 🚀 Features

### 👤 Authentication & Account
| Feature | Description |
|---|---|
| 📝 Register | Create an account with name, email & password |
| 📧 Email Activation | 6-digit OTP sent via email — account enabled only after verification |
| 🔐 JWT Login | Stateless authentication with 24-hour token expiry |
| ⏰ Session Expiry | Auto-logout with "Session Expired" notification when token expires |
| 🚪 Logout | Clears token from localStorage and redirects to login |

### 📖 Book Management
| Feature | Description |
|---|---|
| ➕ Add Book | Share a book with title, author, ISBN, synopsis & cover photo |
| ✏️ Edit Book | Update book details and replace cover image |
| 🔒 Archive | Archive books to hide them from the community |
| 🔄 Toggle Shareable | Mark a book as available or unavailable for borrowing |
| 🖼️ Cover Upload | Upload book cover photos stored on the server |

### 🔄 Borrow & Return Lifecycle
```
┌─────────────┐     borrow      ┌──────────────┐
│  Discover   │ ──────────────► │   Borrowed   │
│   (public)  │                 │  (borrower)  │
└─────────────┘                 └──────┬───────┘
                                       │ return
                                       ▼
                                ┌──────────────┐
                                │   Returned   │  ◄── owner approves
                                │  (pending)   │
                                └──────┬───────┘
                                       │ approved
                                       ▼
                                ┌──────────────┐
                                │  Available   │  (back on Discover)
                                └──────────────┘
```

| Feature | Description |
|---|---|
| 🔍 Discover | Browse all shareable, non-archived, currently-available books |
| 📥 Borrow | Borrow a book (one active borrow per book at a time) |
| 💚 Waiting List | Queue up to borrow books |
| ↩️ Return | Mark a borrowed book as returned |
| ✅ Approve Return | Book owner approves the return — book re-enters discovery pool |

### ⭐ Reviews & Ratings
| Feature | Description |
|---|---|
| 🌟 Star Rating | Interactive 1–5 star picker with hover preview |
| 💬 Written Review | Leave a text comment alongside your rating |
| 👤 Own Feedback | Your own reviews are visually highlighted |
| 📊 Average Rating | Computed from all reviews and shown on book cards |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Angular 20 SPA                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Login   │  │ BookList │  │ MyBooks  │  │Details │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│         HTTP Interceptor (JWT Bearer token)             │
└────────────────────────┬────────────────────────────────┘
                         │ REST / JSON
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Spring Boot 3.4.6 REST API                 │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ AuthController│  │BookController│  │FeedbackCtrl  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │           │
│  ┌──────▼─────────────────▼─────────────────▼───────┐  │
│  │           Spring Security (JWT Filter)            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Spring Data JPA  +  Hibernate ORM         │  │
│  └──────────────────────────┬───────────────────────┘  │
└─────────────────────────────┼───────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   PostgreSQL DB   │
                    │                  │
                    │  _user           │
                    │  book_entity     │
                    │  feedback_entity │
                    │  book_trans_     │
                    │  history_entity  │
                    │  token_entity    │
                    │  role_entity     │
                    └──────────────────┘
```

---

## 🗄️ Database Schema

```
_user                          book_entity
─────────────────────          ──────────────────────────
id (PK)                        id (PK)
firstname                      title
lastname                       author_name
email (unique)                 isbn
password (bcrypt)              synopsis
account_locked                 book_cover (path)
enabled                        archived
created_date                   shareable
last_modified_date             owner_id (FK → _user)
                               created_by (FK → _user)
                               created_date

token_entity                   book_trans_history_entity
─────────────────────          ──────────────────────────
id (PK)                        id (PK)
token (6-digit OTP)            is_returned
created_at                     is_returned_approved
expires_at                     user_id (FK → _user)
validated_at                   book_id (FK → book_entity)
user_id (FK → _user)           created_date

feedback_entity
──────────────────────
id (PK)
note (0.0–5.0)
comment
book_id (FK → book_entity)
created_by (FK → _user)
created_date
```

---

## 🔌 API Reference

Base URL: `http://localhost:8088/api/v1`

### 🔐 Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/authenticate` | Login and receive JWT | ❌ |
| `GET` | `/auth/activate-account?token=` | Activate account with OTP | ❌ |

### 📚 Books
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/books` | Discover all available books | ✅ |
| `GET` | `/books/{id}` | Get a single book by ID | ✅ |
| `POST` | `/books` | Create a new book | ✅ |
| `GET` | `/books/owner` | My books (as owner) | ✅ |
| `PATCH` | `/books/shareable/{bookId}` | Toggle shareable status | ✅ |
| `PATCH` | `/books/archived/{bookId}` | Toggle archived status | ✅ |
| `POST` | `/books/cover/{bookId}` | Upload book cover photo | ✅ |

### 🔄 Borrow & Return
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/books/borrow/{bookId}` | Borrow a book | ✅ |
| `GET` | `/books/borrowed` | My currently borrowed books | ✅ |
| `PATCH` | `/books/borrow/return/{bookId}` | Mark as returned | ✅ |
| `GET` | `/books/returned` | Books returned to me (as owner) | ✅ |
| `PATCH` | `/books/borrow/return/approve/{bookId}` | Approve the return | ✅ |

### ⭐ Feedback
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/feedbacks` | Submit a review | ✅ |
| `GET` | `/feedbacks/book/{bookId}` | Get all reviews for a book | ✅ |

> 📖 Full interactive API docs available at `http://localhost:8088/api/v1/swagger-ui.html`

---

## ⚙️ Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.9+ |
| Node.js | 20+ |
| PostgreSQL | 14+ |
| MailDev *(local email)* | Latest |

---

### 1️⃣ Database Setup

```sql
CREATE DATABASE the_readers_room;
CREATE USER admin1234 WITH PASSWORD 'password#12';
GRANT ALL PRIVILEGES ON DATABASE the_readers_room TO admin1234;
```

---

### 2️⃣ Mail Server (local dev)

The app sends activation emails. Run MailDev locally to catch them:

```bash
# Install MailDev
npm install -g maildev

# Start MailDev (SMTP on 1025, UI on 1080)
maildev
```

Open **http://localhost:1080** to view emails.

---

### 3️⃣ Backend

```bash
cd readers-room-api

# Run with Maven
./mvnw spring-boot:run
```

The API starts on **http://localhost:8088**

> Make sure PostgreSQL is running and the database exists before starting.

**Environment config** (`src/main/resources/application-dev.yml`):
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/the_readers_room
    username: admin1234
    password: password#12

application:
  security:
    jwt:
      secret-key: your-secret-key-here
      expiration: 86400000   # 24 hours in ms
  mailing:
    frontend:
      activation-url: http://localhost:4200/activate-account
```

---

### 4️⃣ Frontend

```bash
cd readers-room-ui

# Install dependencies
npm install

# Start dev server
npm start
```

The app opens at **http://localhost:4200**

---

## 🔐 Security

```
HTTP Request
     │
     ▼
┌─────────────────────────────┐
│        JWT Filter           │
│  1. Extract Bearer token    │
│  2. Validate signature      │
│  3. Check expiry            │
│  4. Load user from DB       │◄── Returns 401 if user not found
│  5. Set SecurityContext     │
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│   Spring Security Chain     │
│  - Public: /auth/**         │
│  - Protected: everything    │
└─────────────────────────────┘
```

- Passwords hashed with **BCrypt**
- JWT signed with **HMAC-SHA256**
- CORS restricted to `http://localhost:4200`
- Token expiry handled both client-side (proactive timer) and server-side (401 response)
- Account activation required before login

---

## 🧰 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.4.6 | Application framework |
| Spring Security 6 | Authentication & authorization |
| Spring Data JPA | Database ORM |
| Hibernate | JPA implementation |
| PostgreSQL | Relational database |
| JJWT 0.12.6 | JWT generation & validation |
| Lombok | Boilerplate reduction |
| Thymeleaf | Email templates |
| SpringDoc OpenAPI 2.8.9 | Swagger UI |
| Spring Mail | Email sending |
| Spring Validation | Request validation |

### Frontend
| Technology | Purpose |
|---|---|
| Angular 20 | SPA framework |
| TypeScript 5.9 | Language |
| RxJS 7.8 | Reactive programming |
| Tabler Icons | Icon set |
| Bootstrap 5.3 | CSS utilities |
| Angular Router | Client-side routing |
| HttpClient | API communication |

---

## 📁 Key Frontend Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | `Login` | Sign-in form with session expired notification |
| `/register` | `Register` | User registration |
| `/activate-account` | `ActivateAccount` | OTP verification |
| `/books` | `BookList` | Discover page — all available books |
| `/books/my-books` | `MyBooks` | Owner's book management |
| `/books/manage` | `ManageBook` | Add new book |
| `/books/manage/:id` | `ManageBook` | Edit existing book |
| `/books/details/:id` | `BookDetails` | Book detail page with reviews |
| `/books/my-borrowed-books` | `MyBorrowedBooks` | Currently borrowed |
| `/books/my-returned-books` | `MyReturnedBooks` | Returned books (owner view) |
| `/books/my-waiting-list` | `MyWaitingList` | Waiting / borrow queue |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by a reader, for readers.

⭐ **Star this repo** if you found it useful!

</div>
