# Gmail Unsubscribe Tool - Setup Instructions

## What You Have
1. `gmail_unsubscribe.py` - The main script
2. `credentials.json` - Your OAuth credentials

## How to Run It

### Step 1: Install Python Libraries
Open your terminal/command prompt and run:
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### Step 2: Run the Script
```bash
python gmail_unsubscribe.py
```

### Step 3: Authorize the App
1. The script will display a URL
2. Copy and paste it into your web browser
3. Log in with your Gmail account
4. Click "Allow" to give the app permission to read your emails
5. Google will show you an authorization code
6. Copy that code and paste it back into the terminal
7. Press Enter

### Step 4: Results
The script will:
- Search through your recent emails for ones with "unsubscribe" links
- Extract all the unsubscribe URLs
- Create a file called `unsubscribe_report.txt` with all the results
- Display the results in the terminal

## What the Script Does (Learning Notes)

### 1. Authentication (`authenticate_gmail()`)
- Uses OAuth 2.0 to securely connect to Gmail
- Saves a token so you don't have to log in every time
- The token is saved in `token.pickle`

### 2. Searching Emails (`search_unsubscribe_emails()`)
- Queries Gmail API with the search term "unsubscribe"
- Returns up to 50 emails (you can change this number)
- Uses Gmail's powerful search syntax

### 3. Getting Email Details (`get_email_details()`)
- Fetches the full email including headers and body
- Extracts sender and subject information
- Handles Gmail's complex email structure

### 4. Extracting Links (`extract_unsubscribe_links()`)
- Uses Regular Expressions (regex) to find URLs
- Looks for common patterns like "unsubscribe", "opt-out", etc.
- Removes duplicates

## Customization Options

### Change Number of Emails to Scan
In the `main()` function, find this line:
```python
messages = search_unsubscribe_emails(service, max_results=50)
```
Change `50` to any number you want.

### Make Search More Specific
In the `search_unsubscribe_emails()` function, change the query:
```python
query = 'unsubscribe'
```

Examples:
- `query = 'unsubscribe newer_than:30d'` - Only emails from last 30 days
- `query = 'unsubscribe from:newsletter@example.com'` - From specific sender
- `query = 'unsubscribe category:promotions'` - Only promotional emails

### Gmail Search Syntax
You can combine multiple criteria:
- `newer_than:7d` - Last 7 days
- `older_than:1y` - Older than 1 year
- `from:sender@domain.com` - From specific sender
- `category:promotions` - Promotional tab
- `is:unread` - Only unread emails

## Next Steps (Phase 2)

Want to automatically click unsubscribe links? We can add:
1. Automated HTTP requests to unsubscribe URLs
2. Ability to filter which senders to unsubscribe from
3. A safer "preview mode" before taking action
4. Statistics on how many subscriptions you have

## Security Notes

- Your `credentials.json` contains sensitive info - don't share it
- The script only has READ-ONLY access to your Gmail
- `token.pickle` stores your login - keep it safe
- You can revoke access anytime at: https://myaccount.google.com/permissions

## Troubleshooting

**"No module named 'google.auth'"**
- Run: `pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client`

**"Invalid credentials"**
- Make sure `credentials.json` is in the same folder as the script
- Check that your OAuth credentials are set up correctly in Google Cloud Console

**"Access blocked"**
- In Google Cloud Console, make sure your OAuth consent screen is configured
- Add your Gmail address to the test users list

**No emails found**
- Try a broader search query
- Check if you actually have emails with unsubscribe links
- Increase the `max_results` number

## Understanding the Code

### Key Concepts You're Learning:
1. **API Authentication** - How to securely connect to external services
2. **OAuth 2.0** - The standard way apps access user data with permission
3. **JSON** - Data format for configuration and API responses
4. **Regular Expressions** - Pattern matching for finding URLs
5. **Base64 Decoding** - Gmail encodes email content
6. **Recursion** - The `get_email_body()` function calls itself to handle nested email parts
7. **Error Handling** - Try/except blocks to handle failures gracefully

### Functions Explained:
- `authenticate_gmail()` - Gets permission to access Gmail
- `search_unsubscribe_emails()` - Finds relevant emails
- `get_email_details()` - Gets full email information
- `get_email_body()` - Extracts the actual email text (handles complex structure)
- `extract_unsubscribe_links()` - Finds unsubscribe URLs using regex
- `main()` - Orchestrates everything

## Want to Extend This?

Ideas for enhancements:
1. Add a GUI interface
2. Automatically categorize senders by domain
3. Create a whitelist of senders you want to keep
4. Track which unsubscribes were successful
5. Generate statistics (how many marketing emails per day, top senders, etc.)
6. Export to CSV for analysis in Excel
7. Add support for Outlook emails too

Let me know what you'd like to build next!
