# Quick Start Guide

Get up and running with App Backup in 5 minutes!

## Installation (2 minutes)

```bash
# Navigate to your bench directory
cd ~/frappe-bench

# Get the app (use the path to this directory)
bench get-app /path/to/app_backup_restore

# Install on your site
bench --site your-site-name install-app app_backup_restore

# Restart
bench restart
```

## First Backup (2 minutes)

1. **Login** to your Frappe site
2. **Navigate**: Click on search bar → Type "Partial Backup" → Enter
3. **Select**: Check a few DocTypes (start with 1-2 for testing)
4. **Generate**: Click "Generate Backup" button
5. **Download**: File downloads automatically as `.zip`

## First Restore (1 minute)

1. **Navigate**: Search → "Partial Restore" → Enter
2. **Upload**: Click "Choose File" → Select your backup ZIP
3. **Restore**: Click "Restore Backup" → Confirm
4. **Review**: Check the summary for import statistics

## That's It!

You now have a working backup and restore system. For more details:
- Full usage guide: [USAGE.md](USAGE.md)
- Installation help: [INSTALLATION.md](INSTALLATION.md)
- Project overview: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## Quick Tips

**Backup Tips:**
- Use module filter to find DocTypes quickly
- Use "Select All" for bulk selection
- Backup files are timestamped automatically

**Restore Tips:**
- Uncheck "Overwrite" to keep existing data
- Check "Overwrite" to replace existing data
- Review the summary table for detailed statistics

## Common Commands

```bash
# Clear cache if pages don't appear
bench clear-cache

# Rebuild if JavaScript doesn't work
bench build

# Check for errors
bench --site your-site console
>>> frappe.get_all("Error Log", limit=5)

# Uninstall if needed
bench --site your-site-name uninstall-app app_backup_restore
```

## Need Help?

1. Check the detailed documentation files
2. Review Frappe Error Log in the UI
3. Ensure you have System Manager role
4. Try clearing cache and rebuilding

Happy backing up! 🎉
