# 🛒 BazarDor — বাজার দর

BazarDor is a responsive web application that helps users check the daily prices of essential market products in Bangladesh. Users can explore product categories, compare price changes, view product details, and access their profile through secure authentication.

## ✨ Features

- View daily prices of essential market products.
- Browse products by category.
- Compare today's prices with previous prices.
- View product details and market information.
- User registration and login with email and password.
- Google and GitHub social authentication.
- User profile page with GitHub avatar.
- Responsive design for mobile, tablet, and desktop.
- Bangla interface and Bangla number formatting.
- Dynamic product and category data from an API.

## 🛠️ Technology Stack

- Next.js
- React
- Tailwind CSS
- JavaScript (ES6+)
- Better Auth
- MongoDB
- Lucide React
- React Hot Toast
- REST API
- Vercel

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd bazardor-project-assijment-7
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file and configure the environment variables required by your project.

```env
BETTER_AUTH_MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Use the exact variable names required by your source code. Never upload your `.env` file or private credentials to GitHub.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
```

## 🔌 API Information

**API Base URL:**

`https://api.abcz.workers.dev/api/bazardor`

Available endpoints include:

- `/products` — Get all products.
- `/products?category=chal` — Get products by category.
- `/products/1` — Get a product by ID.
- `/categories` — Get all categories.
- `/categories/chal` — Get category details.

API availability depends on the external service.

## 🔐 Authentication

BazarDor uses Better Auth for authentication.

Supported authentication methods:

- Email and password
- Google OAuth
- GitHub OAuth

For production deployment, configure the correct OAuth callback URLs using your actual domain:

```text
https://YOUR_DOMAIN/api/auth/callback/google
https://YOUR_DOMAIN/api/auth/callback/github
```

Replace `YOUR_DOMAIN` with your deployed website's domain and configure the same URLs in the Google and GitHub developer dashboards.

## 🌐 Deployment

The project can be deployed using Vercel.

1. Push the source code to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Update the Google and GitHub OAuth settings.
5. Deploy the application.
6. Test product pages, authentication, and profile functionality.

## 📁 Project Structure

```text
src/
└── app/
    ├── api/
    │   ├── auth/
    │   ├── products/
    │   └── profile/
    │       └── github-avatar/
    ├── category/
    ├── product/
    ├── profile/
    ├── signin/
    ├── signup/
    └── components/
```

## 🔒 Security

- Keep database credentials and OAuth secrets private.
- Never commit `.env` or `.env.local` files.
- Use HTTPS for production.
- Ensure OAuth callback URLs match the deployed domain.

## 👩‍💻 Author

Developed as a web development project using Next.js, React, MongoDB, and Better Auth.

## 📄 License

This project was created for educational and assignment purposes.