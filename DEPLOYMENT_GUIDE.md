# Deployment Guide - Frontend to Vercel

## ✅ Backend Status
- **Backend URL**: `https://organvi-backend.onrender.com`
- **Status**: ✅ Successfully deployed on Render
- **Database**: MongoDB Atlas (already configured)

## 📋 Next Steps

### 1. Update Frontend API Endpoints

I've created a centralized API configuration file at `organvi/organvi/src/config/api.js`. 

**Files already updated:**
- ✅ `src/config/api.js` (created)
- ✅ `src/components/Footer/Footer.jsx`
- ✅ `src/pages/Admin/components/Products.jsx`
- ✅ `src/utils/shiprocketUtils.js`

**Files that still need updating** (replace `http://localhost:5000` with `API_ENDPOINTS`):

1. `src/pages/LoginModal/LoginModal.jsx`
2. `src/components/Account/Account.jsx`
3. `src/components/Account/UserRegistration.jsx`
4. `src/components/Payment/PaymentForm.jsx`
5. `src/components/Payment/RazorpayCheckout.jsx`
6. `src/components/Dashboard/Dashboard.jsx`
7. `src/components/Dashboard/Address.jsx`
8. `src/components/Order/OrderTracking.jsx`
9. `src/components/Pulses/Pulses.jsx`
10. `src/components/Pulses/ViewMoreDetails.jsx`
11. `src/components/Spices/Spices.jsx`
12. `src/components/Sweetner/Sweetner.jsx`
13. `src/components/Dry_Fruits/DryFruits.jsx`
14. `src/context/UserContext.jsx`
15. `src/utils/syncUserData.js`
16. `src/pages/Admin/components/Subscribers.jsx`
17. `src/pages/Admin/components/Reviews.jsx`

### 2. How to Update Each File

**Pattern to follow:**

**Before:**
```javascript
const response = await fetch('http://localhost:5000/api/users/login', {
```

**After:**
```javascript
import API_ENDPOINTS from '../../config/api'; // Adjust path as needed

const response = await fetch(API_ENDPOINTS.USERS.LOGIN, {
```

**Common replacements:**
- `http://localhost:5000/api/users/login` → `API_ENDPOINTS.USERS.LOGIN`
- `http://localhost:5000/api/users/login-mobile` → `API_ENDPOINTS.USERS.LOGIN_MOBILE`
- `http://localhost:5000/api/users/email/${email}` → `API_ENDPOINTS.USERS.EMAIL(email)`
- `http://localhost:5000/api/users/mobile/${mobile}` → `API_ENDPOINTS.USERS.MOBILE(mobile)`
- `http://localhost:5000/api/products?category=pulses` → `API_ENDPOINTS.PRODUCTS.BY_CATEGORY('pulses')`
- `http://localhost:5000/create-order` → `API_ENDPOINTS.PAYMENT.CREATE_ORDER`
- `http://localhost:5000/create-shipment` → `API_ENDPOINTS.SHIPROCKET.CREATE_SHIPMENT`
- `http://localhost:5000/orders?userMobile=${mobile}` → `API_ENDPOINTS.ORDERS.BY_USER(mobile)`
- `http://localhost:5000/api/reviews/submit` → `API_ENDPOINTS.REVIEWS.SUBMIT`
- `http://localhost:5000/api/reviews/product/${id}` → `API_ENDPOINTS.REVIEWS.BY_PRODUCT(id)`

### 3. Vercel Environment Variables

**Go to Vercel Dashboard → Your Project → Settings → Environment Variables**

Add the following environment variable:

```
VITE_API_URL=https://organvi-backend.onrender.com
```

**Important:**
- Variable name must be `VITE_API_URL` (Vite requires `VITE_` prefix)
- No trailing slash
- Use `https://` (not `http://`)

### 4. Deploy to Vercel

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Update API endpoints for production deployment"
   git push origin main
   ```

2. **If using Vercel CLI:**
   ```bash
   vercel --prod
   ```

3. **Or push to GitHub** (if connected to Vercel, it will auto-deploy)

### 5. Verify Deployment

After deployment, test these endpoints:
- ✅ Homepage loads
- ✅ User login/registration
- ✅ Product listings
- ✅ Add to cart
- ✅ Checkout process
- ✅ Order tracking

### 6. Database Configuration

**MongoDB Atlas is already configured:**
- Connection string is in `server.js`
- Database: `organvi`
- No additional setup needed

**If you need to update MongoDB connection:**
- Go to Render Dashboard → Your Service → Environment
- Add/Update `MONGODB_URI` variable
- Restart the service

### 7. CORS Configuration

The backend already has CORS enabled (`app.use(cors())`), so it should accept requests from your Vercel domain.

**If you encounter CORS issues:**
- Update `server.js` to allow specific origins:
  ```javascript
  app.use(cors({
    origin: ['https://your-vercel-domain.vercel.app', 'http://localhost:5173']
  }));
  ```

### 8. Troubleshooting

**Frontend can't connect to backend:**
- Check `VITE_API_URL` is set correctly in Vercel
- Verify backend is running: `https://organvi-backend.onrender.com/health`
- Check browser console for CORS errors

**Backend timeout:**
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Consider upgrading to paid tier for always-on service

**Environment variables not working:**
- Vite requires `VITE_` prefix for client-side variables
- Rebuild after adding environment variables
- Check Vercel build logs

## 📝 Quick Checklist

- [ ] Update all API endpoints in frontend files
- [ ] Add `VITE_API_URL` to Vercel environment variables
- [ ] Test locally with `VITE_API_URL=https://organvi-backend.onrender.com`
- [ ] Deploy to Vercel
- [ ] Test all major features
- [ ] Monitor Render logs for any errors
- [ ] Update any hardcoded URLs in documentation

## 🎯 Production URLs

- **Backend**: `https://organvi-backend.onrender.com`
- **Frontend**: `https://your-app.vercel.app` (after deployment)
- **Health Check**: `https://organvi-backend.onrender.com/health`

