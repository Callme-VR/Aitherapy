# Deployment Guide for Render

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d

# Google AI (if used)
GOOGLE_AI_API_KEY=your_google_ai_api_key

# CORS (adjust as needed for production)
ALLOWED_ORIGINS=*
```

## Deployment Steps

1. **Prerequisites**
   - Node.js 16+ installed
   - MongoDB database (Atlas or self-hosted)
   - Render account

2. **Deploy to Render**
   - Create a new Web Service on Render
   - Connect your GitHub/GitLab repository or deploy manually
   - Configure the following settings:
     - **Build Command**: `npm run build:prod`
     - **Start Command**: `npm start`
     - **Environment**: Node
     - **Node Version**: 18.x (or your preferred LTS version)
   - Add all the environment variables from the `.env` section above
   - Deploy!

3. **Post-Deployment**
   - Verify the application is running by checking the logs
   - Test your API endpoints
   - Set up a custom domain if needed

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

- **Build Failures**: Check the build logs in Render dashboard
- **Database Connection Issues**: Verify `MONGODB_URI` is correct and accessible
- **Port Issues**: Ensure `PORT` is set correctly in environment variables
- **CORS Errors**: Verify `ALLOWED_ORIGINS` includes your frontend URL
