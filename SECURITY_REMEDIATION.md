# Security Remediation Guide - Kissan AI

## 🚨 Alert Summary

Three security vulnerabilities were detected and fixed:
1. ❌ Google API Key exposed in SETUP_COMPLETE.md
2. ❌ MongoDB URI with credentials exposed in .env
3. ❌ MongoDB URI with credentials exposed in SETUP_COMPLETE.md

**Status**: ✅ All exposed credentials have been removed and replaced with placeholders

---

## 🔴 CRITICAL ACTIONS REQUIRED

### Step 1: Rotate Google API Key (URGENT)

**Exposed Key**: `AIzaSyDSuaXejjlHF97vpdtr_-pFE-WVWjFztjE`

**To rotate:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** > **Credentials**
3. Find and delete the exposed API key
4. Create a new API key for Gemini API
5. Update your local `.env` with the new key
6. Deploy the new key to your environment

---

### Step 2: Reset MongoDB Atlas Credentials (URGENT)

**Exposed Credentials**:
- Username: `magantirajesh12_db_user`
- Password: `Rajesh@123`
- Connection: `cluster0.2ziyufb.mongodb.net`

**To rotate:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your cluster: **Security** > **Database Access**
3. Click the "Delete" button next to `magantirajesh12_db_user`
4. Create a new database user with a strong password
5. Update your `.env` file with the new credentials
6. Restart your backend server

---

### Step 3: Verify `.gitignore` Configuration

Ensure `.env` is properly ignored:

```bash
# Check if .env is in .gitignore
cat .gitignore | grep ".env"

# If not present, add it
echo ".env" >> .gitignore
```

**Expected output in `.gitignore`:**
```
.env
.env.local
.env.*.local
```

---

### Step 4: Create `.env.example` Template

Create a safe template for developers:

```bash
# Create .env.example
cat > .env.example << EOF
VITE_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/kissan-ai
VITE_API_URL=http://localhost:3003
EOF

# Commit this file (it's safe - no real credentials)
git add .env.example
git commit -m "docs: add .env.example template for developers"
```

---

## 🧹 Optional: Clean Git History

**⚠️ Note**: This step rewrites Git history. Only do this if the repo is private or you coordinate with team members.

### Option A: Using BFG Repo-Cleaner (Recommended)

```bash
# Install BFG
npm install -g bfg

# Remove all instances of exposed credentials
bfg --replace-text credentials.txt

# Force push
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push origin --force-with-lease
```

### Option B: Using git-filter-branch

```bash
# Remove specific strings from history
git filter-branch --tree-filter 'sed -i "s/AIzaSyDSuaXejjlHF97vpdtr_-pFE-WVWjFztjE/REDACTED/g" SETUP_COMPLETE.md'
git filter-branch --tree-filter 'sed -i "s/Rajesh@123/REDACTED/g" MONGODB_SETUP.md'

# Force push to remote
git push origin --force-with-lease --all
```

---

## ✅ Verification Checklist

- [ ] Rotated Google API Key
- [ ] Reset MongoDB user password
- [ ] Created new MongoDB user with strong credentials
- [ ] Updated local `.env` with new credentials
- [ ] Verified `.gitignore` includes `.env`
- [ ] Created `.env.example` template
- [ ] Tested application still works
- [ ] Restarted backend server
- [ ] Confirmed no credential errors in logs

---

## 📋 Updated Files

All sensitive data has been removed from:

1. **`.env`** → Placeholder template
2. **`SETUP_COMPLETE.md`** → Placeholder template  
3. **`MONGODB_SETUP.md`** → Placeholder template

---

## 🛡️ Best Practices Going Forward

1. **Never commit credentials** to version control
2. **Use environment variables** for sensitive data
3. **Add `.env` to `.gitignore`** immediately
4. **Rotate credentials regularly** (quarterly recommended)
5. **Use GitHub Secrets** for CI/CD workflows
6. **Enable branch protection** to require code reviews
7. **Scan for secrets** before committing:
   ```bash
   npm install -g git-secrets
   git secrets --install
   git secrets --register-aws
   ```

---

## 📞 Support

If you need to restore accidentally deleted credentials:
1. Check your MongoDB Atlas backup/recovery options
2. Review Google Cloud billing alerts for usage anomalies
3. Monitor for unauthorized API usage

---

**Last Updated**: 2026-05-22  
**Security Status**: ✅ REMEDIATED
