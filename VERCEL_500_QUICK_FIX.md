# ⚡ Quick Fix: Vercel 500 Error

## The Issue
Every request returns **500: FUNCTION_INVOCATION_FAILED** with error:
```
Error: ENOENT: no such file or directory, mkdir 'logs'
```

## The Cause
Winston logger tries to write to `logs/` directory, but Vercel's filesystem is **read-only**. Only console logging works.

## The Fix (Already Applied ✅)

Updated [server/src/utils/logger.ts](server/src/utils/logger.ts) to:
- ✅ Always log to console (works everywhere)
- ✅ Only log to files when NOT on Vercel
- ✅ Check `process.env.VERCEL !== "1"` before file I/O

### What Changed
```typescript
// BEFORE (BROKEN)
transports: [
  new winston.transports.Console(),
  new winston.transports.File({ filename: "logs/error.log" }),  // ❌ Fails on Vercel
]

// AFTER (FIXED)
const transports = [new winston.transports.Console()];
if (process.env.VERCEL !== "1") {  // ✅ Only on local dev
  transports.push(
    new winston.transports.File({ filename: "logs/error.log" })
  );
}
```

## Deploy the Fix

```bash
git add server/src/utils/logger.ts
git commit -m "Fix: Make logger serverless-compatible"
git push
```

**Vercel auto-redeploys** in 1-2 minutes.

## Verify It Works

```bash
# After deployment
curl https://your-app.vercel.app/api/health

# Should return:
# {"status":"ok","database":"connected",...}
```

---

## Why This Works

| Environment | Winston Config | Result |
|-------------|----------------|--------|
| **Local** | Console + Files | ✅ Both work |
| **Vercel** | Console only | ✅ Works (read-only filesystem) |

---

## The Key Lesson

**Serverless filesystem constraint:**
- `/var/task` = Read-only (your code)
- `/tmp` = Writable but ephemeral (temporary)
- Only console output and external services (DB, S3) are persistent

Always check environment before file I/O:
```typescript
if (process.env.VERCEL !== "1") {
  // Safe to write files
}
```

---

**Status:** ✅ Fixed and ready to deploy
