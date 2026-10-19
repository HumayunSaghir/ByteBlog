# ByteBlog

ByteBlog is a server-rendered blogging platform built with Node.js, Express and MongoDB. Users can create an account, publish posts with cover images, and like and comment on each other's writing.

**Live demo:** http://56.228.91.213

![Home page](screenshots/home.png)

<p align="center">
  <img src="screenshots/blog.png" width="270" alt="Blog post" />
  <img src="screenshots/comments.png" width="270" alt="Comments" />
  <img src="screenshots/profile.png" width="270" alt="Profile page" />
</p>

## Features

- Sign up, sign in and log out, with sessions stored as a JWT in a cookie
- Salted password hashing (HMAC-SHA256)
- Write posts with an optional cover image
- Like/unlike posts and leave comments
- View counter on every post
- Profile page listing your posts, with a custom profile picture
- Protected routes redirect to sign in; unknown pages and missing posts return a 404 page
- Responsive layout that works on mobile

## Tech Stack

| Layer          | Technology                     |
|----------------|--------------------------------|
| Server         | Node.js, Express 5             |
| Database       | MongoDB with Mongoose          |
| Views          | EJS (server-side rendering)    |
| Auth           | jsonwebtoken, cookie-parser    |
| File uploads   | Multer                         |
| Hosting        | AWS EC2, Nginx, PM2            |

## How It Works

Every request passes through a small middleware chain before reaching the routers:

1. `express.urlencoded` parses form submissions.
2. A logger appends the method and path of each request to `logs.txt`.
3. `checkForToken` reads the `token` cookie and, if it verifies, attaches the user to `req.user`.
4. Routes that need a signed-in user go through `restrictToLoggedIn`, which redirects to `/user/signin` otherwise.

Passwords are never stored in plain text. A `pre("save")` hook on the user model generates a random salt and stores the HMAC of the password. At sign-in, the `matchPassword` static recomputes the hash and issues a token on success.

Likes are stored as one document per post holding an array of user IDs, so toggling a like is a single read and update.

### Data Model

| Collection | Fields                                                        |
|------------|---------------------------------------------------------------|
| `users`    | fullname, email, password, salt, profileImageUrl, role        |
| `blogs`    | title, body, coverImageUrl, createdBy → users, views          |
| `comments` | content, createdBy → users, blogId → blogs                    |
| `likes`    | blogId → blogs, likedBy → [users]                             |

### Routes

| Method | Path                         | Auth | Description                     |
|--------|------------------------------|------|---------------------------------|
| GET    | `/`                          |      | Home feed                       |
| GET    | `/user/signup`               |      | Sign-up form                    |
| POST   | `/user/signup`               |      | Create an account               |
| GET    | `/user/signin`               |      | Sign-in form                    |
| POST   | `/user/signin`               |      | Sign in                         |
| GET    | `/user/logout`               |      | Log out                         |
| GET    | `/user/profile`              | Yes  | Profile and your posts          |
| GET    | `/user/changeProfileImage`   | Yes  | Profile picture form            |
| POST   | `/user/changeProfileImage`   | Yes  | Upload a new profile picture    |
| GET    | `/blog/addBlog`              | Yes  | New post form                   |
| POST   | `/blog/addBlog`              | Yes  | Publish a post                  |
| GET    | `/blog/showBlog/:id`         | Yes  | Read a post                     |
| POST   | `/blog/addComment/:id`       | Yes  | Comment on a post               |
| GET    | `/blog/like/:blogId`         | Yes  | Like or unlike a post           |

## Running Locally

You need Node.js 20+ and a running MongoDB instance.

```bash
git clone https://github.com/HumayunSaghir/ByteBlog.git
cd ByteBlog
npm install
```

Create a `.env` file in the project root:

```
MONGO_URL=mongodb://127.0.0.1:27017/byteblog
secret=replace_with_a_long_random_string
PORT=8000
```

Start the server:

```bash
npm run dev     # with nodemon
npm start       # without
```

The app runs at http://localhost:8000.

### Environment Variables

| Variable    | Required | Description                                  |
|-------------|----------|----------------------------------------------|
| `MONGO_URL` | Yes      | MongoDB connection string                    |
| `secret`    | Yes      | Key used to sign and verify JWTs             |
| `PORT`      | No       | Port the server listens on (default `8000`)  |

## Deployment

The live demo runs on a single AWS EC2 instance (t4g.micro, Ubuntu 24.04). Nginx accepts traffic on port 80 and proxies it to the Node process, which PM2 keeps running and restarts on boot. MongoDB runs on the same machine and only listens on localhost.

```
Client → Nginx :80 → Node.js (PM2) :8000 → MongoDB :27017 (localhost)
```

### 1. Create the instance

- AMI: Ubuntu Server 24.04 LTS
- Instance type: t4g.micro (any small instance works)
- Storage: 20 GB gp3
- Security group: allow SSH (22) from your IP, and HTTP (80) / HTTPS (443) from anywhere. Do not open 27017.
- Optionally attach an Elastic IP so the address survives restarts.

Connect with:

```bash
ssh -i your-key.pem ubuntu@<public-ip>
```

### 2. Install dependencies

```bash
sudo apt update && sudo apt upgrade -y

# 1 GB swap, recommended on instances with 1 GB of RAM
sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Node.js 20, Git, Nginx, PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
sudo npm install -g pm2

# MongoDB 8.2
curl -fsSL https://pgp.mongodb.com/server-8.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.2 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-8.2.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

Note: use MongoDB 8.2 rather than 8.0. MongoDB 8.0 fails to start on the newer kernels that current Ubuntu 24.04 AMIs ship with ([SERVER-121912](https://jira.mongodb.org/browse/SERVER-121912)). The 8.2 packages are signed with the 8.0 key, which is why the key URL above says 8.0.

### 3. Set up the app

```bash
git clone https://github.com/HumayunSaghir/ByteBlog.git
cd ByteBlog
npm ci --omit=dev
mkdir -p public/uploads public/profileImages
```

Create `.env` as shown in [Running Locally](#running-locally). You can generate a secret with `openssl rand -hex 32`.

Start the app with PM2 from inside the project folder, since paths such as `public/` and `.env` are resolved relative to it:

```bash
pm2 start app.js --name byteblog
pm2 save
pm2 startup     # then run the command it prints
```

### 4. Configure Nginx

Create `/etc/nginx/sites-available/byteblog`:

```nginx
server {
    listen 80 default_server;
    server_name _;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable it and reload:

```bash
sudo ln -s /etc/nginx/sites-available/byteblog /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

If you have a domain, point an A record at the instance and run `sudo certbot --nginx -d your-domain.com` to add HTTPS.

### Updating

```bash
cd ~/ByteBlog
git pull
npm ci --omit=dev
pm2 restart byteblog
```

## Project Structure

```
ByteBlog/
├── app.js              Entry point: middleware, routers, 404 handler
├── connection.js       MongoDB connection
├── controllers/        Request handlers for users, blogs and home/profile
├── middlewares/        Token check, login guard, request logger
├── models/             Mongoose schemas: users, blogs, comments, likes
├── routes/             Express routers and Multer upload config
├── services/           JWT creation and verification
├── views/              EJS pages and shared partials (head, nav)
└── public/
    ├── css/            Stylesheet
    ├── images/         Default avatar
    ├── uploads/        Post cover images
    └── profileImages/  Uploaded profile pictures
```

## Known Limitations

- Uploaded images are stored on the server's disk, so they are lost if the instance is replaced. Moving them to S3 would fix this.
- Posts and comments cannot be edited or deleted yet.
- Liking a post uses a GET request; it would be better as a POST form.
- The demo is served over plain HTTP because it has no domain name attached.

## Author

**Humayun Saghir**, [github.com/HumayunSaghir](https://github.com/HumayunSaghir)
