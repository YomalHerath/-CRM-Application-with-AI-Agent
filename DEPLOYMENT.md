# Deployment Guide for InfinityFree

This guide will help you host your React + PHP CRM application on InfinityFree for free.

## Step 1: Build the React Application
1. Open your terminal in the project folder.
2. Run the command:
   ```bash
   npm run build
   ```
3. This will create a `dist` folder. These are your frontend files.

## Step 2: Prepare the Backend (PHP)
1. Your PHP files are in the `api/` folder.
2. Open `api/db.php` on your local machine. You will need to change the database credentials once you have your InfinityFree details (see Step 4).

## Step 3: InfinityFree Setup
1. Log in to [InfinityFree](https://infinityfree.net/).
2. Create a new Hosting Account.
3. Go to the **Control Panel** of your new account.
4. Go to **MySQL Databases** and create a new database (e.g., `crm_db`).

## Step 4: Import Database
1. In the Control Panel, open **phpMyAdmin** for your new database.
2. Use the **Import** tab to upload your SQL file.
   > [!NOTE]
   > You can export your local database from `http://localhost/phpmyadmin` using the **Export** tab.

## Step 5: Update `api/db.php`
Update your `api/db.php` with the credentials provided in the InfinityFree Control Panel (usually found under "Account Details"):
```php
$host = "sqlxxx.epizy.com"; // InfinityFree DB Host
$user = "epiz_xxxxxx";      // InfinityFree DB User
$pass = "your_password";    // InfinityFree DB Password
$db   = "epiz_xxxxxx_crm";  // InfinityFree DB Name
```

## Step 6: Upload Files via FTP
1. Use an FTP client like **FileZilla**.
2. Connect using your FTP details from InfinityFree.
3. Upload EVERYTHING inside your `dist` folder to the `htdocs/` folder on the server.
4. Upload your `api/` folder to the `htdocs/` folder on the server.
5. Ensure the `.htaccess` file is also in the `htdocs/` folder.

## Final Folder Structure on Server:
```text
htdocs/
  index.html
  assets/
  api/
    db.php
    auth.php
    ...
  .htaccess
```

## Troubleshooting
- **CORS Errors**: I have configured the app to use relative paths (`/api`) in production, which avoids most CORS issues.
- **Routing**: The `.htaccess` file handles the "Not Found" errors when you refresh the page on a sub-route like `/calendar`.
