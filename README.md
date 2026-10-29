This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin dashboard

Neon Auth must be enabled on the linked Neon branch. Add these variables to
`.env.local` before running the app:

```dotenv
ADMIN_EMAIL=the-email-used-by-your-Neon-Auth-admin-account
NEON_AUTH_COOKIE_SECRET=generate-a-random-secret-at-least-32-characters-long
```

Generate a local cookie secret in PowerShell without printing it to the terminal:

```powershell
$secret = node -e "process.stdout.write(require('crypto').randomBytes(32).toString('base64'))"
Add-Content .env.local "NEON_AUTH_COOKIE_SECRET=$secret"
```

Set `ADMIN_EMAIL` in `.env.local` to the exact administrator email address. For
the first login, enable **Sign-up with Email** and **Verify at Sign-up** under
Neon Console → Project → Settings → Better Auth. Use verification codes when
using Neon’s shared email provider. On `/admin/login`, select **First time?
Create admin account**, choose a password, then verify the code sent to that
email. Only the configured email can create the admin account or access `/admin`.
Configure both `ADMIN_EMAIL` and `NEON_AUTH_COOKIE_SECRET` in the production
host's environment variables as well. Never commit or share the cookie secret.

### Managing blog posts

Before deploying the blog admin, apply both migrations in order:
[`database/migrations/20261026000000_create_blog_posts.sql`](./database/migrations/20261026000000_create_blog_posts.sql)
and
[`database/migrations/20261026130000_create_blog_images.sql`](./database/migrations/20261026130000_create_blog_images.sql)
to the Neon database using the Neon SQL Editor. They create the blog tables and
the first migration seeds the three existing published painting guides. The admin dashboard blog
page is available at `/admin/blog`; it supports creating and editing posts,
saving drafts, publishing or unpublishing posts, and deleting posts. The Quill
rich-text editor supports headings, text styles, links, lists, quotes, and a
live formatted view while writing. Cover images can be uploaded as JPEG, PNG,
or WebP files up to 3 MB, converted to WebP, and stored in the Neon database.
Published blog images load lazily and posts appear on `/blog` and in the sitemap.

To change the editor toolbar, edit `toolbarOptions` and the `formats` allowlist
in `src/app/admin/(protected)/blog/quill-editor.jsx`. Add a Quill toolbar format
such as `"code-block"` or `[{ align: [] }]` to `toolbarOptions`, then allow that
format in `formats`. Update `src/app/blog/blog-content.jsx` and the format
validation in `src/app/admin/(protected)/blog/actions.js` before enabling a new
format, so it can be safely saved and displayed on published posts. See the
[Quill toolbar module documentation](https://quilljs.com/docs/modules/toolbar)
for toolbar array syntax and available controls.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
