# Resume Site

Hugo-based resume site deployed to `https://evefreeman.com/`

## Deployment

This site is hosted on **AWS Amplify** (deployed via S3). Deploy using the provided script.

### Quick Deploy

The deployment script defaults to the `eve-resume` S3 bucket and Amplify app ID `d197x6838h47m2`:

```bash
./deploy.sh
```

**With custom bucket/app ID:**
```bash
./deploy.sh eve-resume d197x6838h47m2
```

**Using environment variables:**
```bash
export S3_BUCKET_NAME=eve-resume
export AMPLIFY_APP_ID=d197x6838h47m2
./deploy.sh
```

The script will:
1. Build the Hugo site with minification
2. Sync the `public/` directory to S3 (with delete for removed files)
3. Trigger AWS Amplify deployment

**Note:** The script attempts to automatically trigger Amplify deployment. If that fails, Amplify may be configured to auto-deploy from S3 changes, or you may need to manually trigger deployment in the AWS Console.

### Prerequisites

- **AWS CLI** installed and configured:
  ```bash
  brew install awscli
  aws configure
  ```
  
- **Hugo** installed:
  ```bash
  brew install hugo
  ```

- AWS credentials with permissions for:
  - `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on the `eve-resume` bucket
  - `amplify:StartJob` for the Amplify app (if auto-trigger is enabled)

### Manual Deployment

If you prefer to deploy manually:

1. **Build the site:**
   ```bash
   hugo --minify
   ```

2. **Deploy to S3:**
   ```bash
   aws s3 sync ./public s3://eve-resume --delete
   ```

3. **Trigger Amplify deployment (if needed):**
   - Go to AWS Console → Amplify → App `d197x6838h47m2`
   - Click "Redeploy this version" or wait for auto-deployment

## Local Development

```bash
hugo server
```

Visit `http://localhost:1313/`

## Image Optimization

See `README-WEBP.md` for WebP image conversion instructions.
