# InstaAutoBot - Instagram DM Automation Platform

## Deployment Instructions

### Prerequisites
1. Node.js (v14 or higher)
2. MongoDB Atlas account
3. Gmail account for email notifications
4. Stripe account for payments
5. Domain name (optional)

### Environment Setup
1. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=https://your-domain.com
```

### Deployment Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Build the Application**
```bash
npm start
```

3. **Deploy to Your Hosting Provider**

#### Option 1: Deploy to Heroku
1. Create a Heroku account
2. Install Heroku CLI
3. Run the following commands:
```bash
heroku create instaautobot
git add .
git commit -m "Initial deployment"
git push heroku main
```

#### Option 2: Deploy to DigitalOcean
1. Create a DigitalOcean account
2. Create a new app
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy the application

#### Option 3: Deploy to AWS
1. Create an AWS account
2. Set up an EC2 instance
3. Install Node.js and MongoDB
4. Clone your repository
5. Configure environment variables
6. Start the application using PM2:
```bash
npm install -g pm2
pm2 start server.js
```

### Post-Deployment Steps

1. **Set up MongoDB Atlas**
   - Create a new cluster
   - Set up database access
   - Configure network access
   - Get your connection string

2. **Configure Email**
   - Set up Gmail app password
   - Update EMAIL_USER and EMAIL_PASS in .env

3. **Set up Stripe**
   - Create a Stripe account
   - Get your API keys
   - Update STRIPE_SECRET_KEY in .env

4. **Domain Setup**
   - Point your domain to your hosting provider
   - Set up SSL certificate
   - Update FRONTEND_URL in .env

### Monitoring and Maintenance

1. **Logs**
   - Monitor application logs
   - Set up error tracking
   - Configure alerts

2. **Backup**
   - Set up regular database backups
   - Store backups securely

3. **Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Regular maintenance

### Support

For support, contact:
- Email: support@instaautobot.com
- Documentation: https://docs.instaautobot.com 