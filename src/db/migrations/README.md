# Database Migrations

## Running the Admin Column Migration

To add the `is_admin` column to the users table, run:

```bash
psql $DATABASE_URL -f src/db/migrations/add-admin-column.sql
```

Or if you have a local database:

```bash
psql -d your_database_name -f src/db/migrations/add-admin-column.sql
```

## Verifying the Migration

Check that the column was added:

```sql
\d users
```

Or:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'is_admin';
```

## Promoting a User to Admin

To manually promote a user to admin status:

```sql
UPDATE users SET is_admin = true WHERE strava_id = <your_strava_id>;
```

To verify:

```sql
SELECT id, strava_id, is_admin FROM users WHERE is_admin = true;
```

