# Klamarium

Vzdělávací hra o dezinformacích a deepfakes, vytvořená v rámci bakalářské práce.

One SvelteKit app on Vercel, backed by Supabase:

- **Database:** Postgres. The schema, row-level security and the Lens answer check live in `supabase/migrations/`.
- **Auth:** Supabase Auth, for staff only. Players play anonymously.
- **Images:** Supabase Storage, in the public `images` bucket.

## Local development

You need Docker and the [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
npm install
supabase start          # local Postgres/Auth/Storage, applies migrations + supabase/seed.sql
cp .env.example .env    # fill in the API URL and anon key printed by `supabase start`
npm run dev
```

The game content in `supabase/seed.sql` references images that `supabase start` doesn't load. Upload them once:

```bash
SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_SERVICE_ROLE_KEY=<service_role key from supabase start> \
  node scripts/migrate-from-mysql.mjs <path>/backup-klamarium.sql <path>/DeepFake/wwwroot --upload
```

## Staff accounts

Public sign-up is disabled. To add a staff member:

1. Invite them in the Supabase dashboard under Authentication → Users.
2. In the SQL editor, give them a role:

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role": "editor"}'   -- or "admin"
where email = 'someone@example.com';
```

Staff can use `/admin` and edit content. Player feedback can be read in the dashboard (table `feedback`).

## Data migration from the old .NET/MySQL backend

`scripts/migrate-from-mysql.mjs` converts the old production dump:

- Real game content goes to `supabase/seed.sql`. Test rows are skipped and the original ids are kept.
- Player feedback goes to `scripts/out/feedback.sql`. It contains personal data, is git-ignored, and you run it by hand.
- With `--upload`, it also uploads the referenced images.

## Deploy

1. Create a Supabase project (EU region). Run `supabase link --project-ref <ref>`, then `supabase db push --include-seed`.
2. Upload the images: run the script above with the project's URL and service-role key.
3. Run `scripts/out/feedback.sql` in the SQL editor.
4. Create a Vercel project from this repo and set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`.
5. Add the production domain to Supabase → Authentication → URL configuration.
