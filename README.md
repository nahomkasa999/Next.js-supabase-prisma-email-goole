# 🚀 Supabase Auth + Database Trigger Setup Guide

**Immediate use setup for Supabase Auth and database with automatic user tracking.**

## 📋 What This Does

- ✅ **Automatically creates user records** when someone signs up (email/password or OAuth)
- ✅ **Tracks user activity** with timestamps
- ✅ **Works with Google OAuth** and other providers
- ✅ **Secure with Row Level Security (RLS)**
- ✅ **Performance optimized** with indexes

## 🎯 Quick Start (5 Minutes)

### Step 1: Run Database Setup

1. **Open Supabase Dashboard** → Your Project → SQL Editor
2. **Copy and paste** the contents of `database-setup.sql`
3. **Click "Run"** to execute the script
4. **Verify success** - you should see "Success" message

### Step 2: Test the Setup

1. **Go to your app's signup page**
2. **Create a new account** (email/password or Google)
3. **Check Supabase Dashboard** → Table Editor → `users` table
4. **Verify user record was created automatically**

## 🔧 Google OAuth Setup (Optional)

### 1. Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project → Enable Google+ API
3. **Credentials** → **Create OAuth 2.0 Client ID**
4. **Web application** → Add redirect URI:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```

### 2. Supabase Dashboard
1. **Authentication** → **Providers** → **Google**
2. **Enable Google** → Add Client ID & Secret
3. **Save** configuration

## 📊 What Gets Created

### Database Table: `public.users`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | User ID (matches auth.users.id) |
| `email` | TEXT | User's email address |
| `full_name` | TEXT | Full name from OAuth/signup |
| `avatar_url` | TEXT | Avatar URL from OAuth |
| `created_at` | TIMESTAMP | When user was created |
| `updated_at` | TIMESTAMP | When user was last updated |
| `last_seen` | TIMESTAMP | When user was last active |
| `is_active` | BOOLEAN | Account status |

### Database Triggers
- **`on_auth_user_created`** - Fires when user signs up
- **`on_auth_user_activity`** - Updates last_seen timestamp

### Security (RLS Policies)
- Users can only view/update their own data
- Secure against unauthorized access

## 🔄 How It Works

```
1. User signs up (email/password or Google)
   ↓
2. Supabase Auth creates record in auth.users
   ↓
3. Database trigger fires automatically
   ↓
4. User record created in public.users
   ↓
5. Frontend can access user data immediately
```

## 🧪 Testing Checklist

### ✅ Email/Password Signup
- [ ] Create account with email/password
- [ ] Check `public.users` table has new record
- [ ] Verify `full_name` and `email` are populated

### ✅ Google OAuth Signup
- [ ] Click "Continue with Google"
- [ ] Complete Google authentication
- [ ] Check `public.users` table has new record
- [ ] Verify `avatar_url` and `full_name` from Google

### ✅ User Activity Tracking
- [ ] Sign in as user
- [ ] Navigate around app
- [ ] Check `last_seen` timestamp updates

## 🛠️ Troubleshooting

### Problem: User exists in auth.users but not public.users
**Solution**: Check if triggers are created
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name LIKE '%user%';
```

### Problem: RLS blocking user access
**Solution**: Verify RLS policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### Problem: Trigger not firing
**Solution**: Check Supabase logs for errors
- Go to Dashboard → Logs → Database
- Look for trigger-related errors

## 📈 Performance Features

### Indexes Created
- `idx_users_email` - Fast email lookups
- `idx_users_created_at` - Sort by creation date
- `idx_users_last_seen` - Sort by activity
- `idx_users_is_active` - Filter active users

### Query Examples
```sql
-- Get all active users
SELECT * FROM public.users WHERE is_active = true;

-- Get users created today
SELECT * FROM public.users 
WHERE created_at > CURRENT_DATE;

-- Get user by email
SELECT * FROM public.users WHERE email = 'user@example.com';
```

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Prevents unauthorized data access
- Secure by default

### Trigger Security
- `SECURITY DEFINER` - Runs with proper privileges
- `SET search_path = ''` - Prevents injection attacks
- Fully qualified object names

## 🎯 Production Checklist

- [ ] Database triggers created and tested
- [ ] RLS policies configured
- [ ] Indexes created for performance
- [ ] OAuth providers configured (if using)
- [ ] Error handling implemented
- [ ] User data validation
- [ ] Backup strategy in place

## 📚 Advanced Usage

### Custom User Fields
```sql
-- Add more fields to users table
ALTER TABLE public.users 
ADD COLUMN phone TEXT,
ADD COLUMN company TEXT,
ADD COLUMN role TEXT DEFAULT 'user';
```

### Additional Triggers
```sql
-- Log user logins
CREATE OR REPLACE FUNCTION public.log_user_login()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_logins (user_id, login_at)
  VALUES (NEW.id, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 🆘 Support

### Common Issues
1. **Trigger not firing** → Check Supabase logs
2. **RLS blocking access** → Verify policies
3. **Performance issues** → Check indexes
4. **OAuth not working** → Verify redirect URIs

### Debug Commands
```sql
-- Check triggers
SELECT * FROM information_schema.triggers WHERE trigger_name LIKE '%user%';

-- Check functions
SELECT * FROM information_schema.routines WHERE routine_name LIKE '%user%';

-- Check table structure
SELECT * FROM information_schema.columns WHERE table_name = 'users';
```

---

## 🎉 Ready to Use!

This setup provides **automatic user tracking** for any Supabase Auth project with **minimal configuration**. Just run the SQL script and you're done!

**Next Steps:**
1. Run `database-setup.sql` in Supabase SQL Editor
2. Test with a new user signup
3. Verify user record appears in `public.users` table
4. Start building your app with automatic user tracking! 🚀
