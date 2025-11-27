# Google Sheets Integration Guide

## Setup Instructions for Event Registration Form

Follow these steps to connect your registration form to Google Sheets:

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "SMKF Event Registrations"
4. In the first row, add these column headers:
   - `Namn` (Column A)
   - `E-post` (Column B)
   - `Telefon` (Column C)
   - `Antal deltagare` (Column D)
   - `Meddelande` (Column E)
   - `Tidsstämpel` (Column F)

### Step 2: Create Google Apps Script

1. In your Google Sheet, click on **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Append data to the sheet
    sheet.appendRow([
      data.name,
      data.email,
      data.phone,
      data.attendees,
      data.message,
      data.timestamp
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Registration received'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("App is running!");
}
```

### Step 3: Deploy the Script

1. Click on **Deploy** → **New deployment**
2. Click on the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in the following:
   - **Description:** SMKF Event Registration Form
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to [Your Project Name] (unsafe)**
9. Click **Allow**
10. **Copy the Web App URL** - it should look like:
    `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

### Step 4: Update Your Website

1. Open `script.js` in your project
2. Find this line:
   ```javascript
   const scriptURL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace it with your actual Web App URL:
   ```javascript
   const scriptURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
   ```
4. Save the file

### Step 5: Test the Form

1. Open your website and go to the registration page
2. Fill out the form with test data
3. Submit the form
4. Check your Google Sheet - the data should appear in a new row!

## Security Notes

- The current setup allows anyone to submit data (required for public forms)
- Google Sheets stores all submissions with timestamps
- You can add data validation in Google Sheets to prevent duplicates
- Consider adding CAPTCHA if you experience spam

## Troubleshooting

**Form doesn't submit:**
- Check that you copied the correct Web App URL
- Make sure you deployed the script with "Anyone" access
- Check browser console for errors (F12)

**Data not appearing in sheet:**
- Verify column headers match exactly
- Check the Apps Script execution logs (View → Executions)
- Make sure the sheet is not protected

**Multiple sheets:**
- The script writes to the active sheet
- Make sure your registration sheet is the first/active sheet
- Or modify the script to target a specific sheet by name

## Optional: Email Notifications

If you want to receive email notifications for new registrations, add this to your Apps Script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.name,
      data.email,
      data.phone,
      data.attendees,
      data.message,
      data.timestamp
    ]);
    
    // Send email notification
    MailApp.sendEmail({
      to: "your-email@example.com", // Change this to your email
      subject: "Ny anmälan till SMKF evenemang",
      body: `
        Ny anmälan mottagen:
        
        Namn: ${data.name}
        E-post: ${data.email}
        Telefon: ${data.phone}
        Antal deltagare: ${data.attendees}
        Meddelande: ${data.message}
        Tidpunkt: ${data.timestamp}
      `
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Support

If you need help with the setup, please contact your web administrator or refer to the [Google Apps Script documentation](https://developers.google.com/apps-script).
