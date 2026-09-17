# Week 3 — Contact Form + API + SMTP + Admin Dashboard

This project implements the three tasks in the screenshot:

## Task 1
- SMTP contact form integration
- HTTP request/response
- Node.js
- Express
- API endpoint
- Nodemailer
- Environment variables
- Backend validation
- CORS
- Vercel deployment configuration

Flow:

`Frontend → API → Backend → SMTP → Company Email`

## Task 2
`POST /api/contact`

Validation:
- required fields
- email validation
- minimum/maximum lengths
- empty values
- invalid requests
- proper HTTP status codes
- JSON responses
- error handling

The assignment deliberately does NOT use a database yet. Enquiries are stored in memory so the API and dashboard can be demonstrated without immediately adding MongoDB/PostgreSQL.

## Task 3 — Optional
Admin dashboard:
- fetch enquiries from API
- display dynamically
- search
- filter by status
- view enquiry
- change status
- delete enquiry

## 1. Install

Install Node.js (LTS), then inside this folder:

```bash
npm install
```

## 2. Configure SMTP

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then replace the SMTP values with the SMTP credentials supplied by your company/email provider.

Example shape:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5000

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password

COMPANY_EMAIL=company@example.com
ADMIN_TOKEN=use-a-long-random-token
SEND_AUTO_REPLY=true
```

Never commit `.env` to GitHub.

## 3. Run

```bash
npm start
```

Open:

`http://localhost:5000`

Test the API health endpoint:

`GET /api/health`

Expected:

```json
{
  "success": true,
  "message": "API is running"
}
```

## 4. Test Task 2

Submit the form with valid data.

The browser sends:

```http
POST /api/contact
Content-Type: application/json
```

Body:

```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "message": "I would like to know more about your services."
}
```

Successful response:

```json
{
  "success": true,
  "message": "Your enquiry was submitted successfully.",
  "data": {
    "id": 1,
    "status": "new"
  }
}
```

Validation errors return HTTP `400`.

Server/SMTP failures return HTTP `500`.

## 5. Test Task 3

Open:

`http://localhost:5000/admin.html`

Enter the same `ADMIN_TOKEN` from `.env`.

Then you can:
- search
- filter
- update status
- delete enquiries

## 6. Vercel

Push the project to GitHub and import it into Vercel.

The included `vercel.json` routes:
- `/api/*` to the Node serverless function
- other paths to the `public` frontend

Add these Environment Variables in Vercel:

```text
CORS_ORIGIN=https://YOUR-VERCEL-DOMAIN.vercel.app
SMTP_HOST=...
SMTP_PORT=...
SMTP_SECURE=...
SMTP_USER=...
SMTP_PASS=...
COMPANY_EMAIL=...
ADMIN_TOKEN=...
SEND_AUTO_REPLY=true
```

Do not put SMTP passwords in frontend code.

## Important limitation

The sample uses an in-memory array instead of a database because Task 2 explicitly says not to jump into a database immediately.

On Vercel/serverless hosting, in-memory data is temporary and can disappear between executions. For a real production dashboard, replace `enquiries` with MongoDB, PostgreSQL, Supabase, etc.

## Suggested submission evidence

Take screenshots of:
1. Contact form
2. Successful form submission
3. Company email received through SMTP
4. Invalid form validation response
5. `POST /api/contact` in Postman/Thunder Client
6. Admin dashboard
7. Search/filter
8. Status change
9. Vercel deployment
10. GitHub repository

Then submit the deployed URL + GitHub URL + screenshots/PDF according to your course instructions.
