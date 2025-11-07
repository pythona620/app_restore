# Installation Guide

## Prerequisites

- Frappe Framework installed
- Bench setup completed
- Python 3.10 or higher

## Installation Steps

### 1. Get the App

Navigate to your bench directory and get the app:

```bash
cd ~/frappe-bench
bench get-app https://github.com/yourusername/app_backup_restore
```

Or if you have the app locally:

```bash
cd ~/frappe-bench
bench get-app /path/to/app_backup_restore
```

### 2. Install on Site

Install the app on your site:

```bash
bench --site your-site-name install-app app_backup_restore
```

### 3. Clear Cache and Build

After installation, clear cache and build assets:

```bash
bench clear-cache
bench build
```

### 4. Restart Bench

Restart the bench to apply changes:

```bash
bench restart
```

## Verification

1. Log in to your Frappe site
2. Navigate to **Modules** > **Data Tools**
3. You should see two pages:
   - **Partial Backup**
   - **Partial Restore**

## Permissions

By default, these pages are accessible only to users with the **System Manager** role. To grant access to other users:

1. Go to **Role Permission Manager**
2. Add the required roles to both pages
3. Save changes

## Troubleshooting

### Pages Not Showing

If the pages don't appear:

```bash
bench clear-cache
bench migrate
bench build --force
bench restart
```

### Permission Denied

Make sure your user has the **System Manager** role or add appropriate roles to the pages.

### Import Errors

Check the error log in Frappe:
- Navigate to **Error Log** in the search bar
- Look for recent errors related to `app_backup_restore`

## Uninstallation

To uninstall the app:

```bash
bench --site your-site-name uninstall-app app_backup_restore
```

## Support

For issues and questions:
- Check the error log in Frappe
- Review the README.md file
- Open an issue on GitHub
