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
    
    // Server-side validation - Required fields
    if (!data.name || data.name.trim() === '') {
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Namn är obligatoriskt'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!data.phone || data.phone.trim() === '') {
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Telefonnummer är obligatoriskt'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validate email format if provided
    if (data.email && data.email !== 'Ej angivet') {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return ContentService.createTextOutput(JSON.stringify({
          'result': 'error',
          'message': 'Ogiltig e-postadress'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Validate phone number (basic Swedish format)
    var phoneRegex = /^[\+]?[0-9\s\-\(\)]{6,}$/;
    if (!phoneRegex.test(data.phone)) {
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Ogiltigt telefonnummer'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validate number of attendees
    var attendees = parseInt(data.attendees);
    if (isNaN(attendees) || attendees < 1 || attendees > 10) {
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Antal deltagare måste vara mellan 1 och 10'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Append data to the sheet
    sheet.appendRow([
      data.name.trim(),
      data.email,
      data.phone.trim(),
      data.attendees,
      data.message || 'Inget meddelande',
      data.timestamp
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Anmälan mottagen'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': 'Ett fel uppstod: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("App is running!");
}
```

**Key validation features:**
- ✅ Required fields validation (name, phone)
- ✅ Email format validation
- ✅ Phone number format validation
- ✅ Number of attendees range check (1-10)
- ✅ Data sanitization (trim whitespace)
- ✅ Error messages in Swedish

### Step 3: Deploy the Script

1. Click on **Deploy** → **New deployment**
2. Click on the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in the following:
   - **Description:** SMKF Event Registration Form
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
## Optional: Email Notifications

If you want to receive email notifications for new registrations, update your `doPost` function:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Validation (same as above)
    if (!data.name || data.name.trim() === '') {
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Namn är obligatoriskt'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!data.phone || data.phone.trim() === '') {
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Telefonnummer är obligatoriskt'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Append data
    sheet.appendRow([
      data.name.trim(),
      data.email,
      data.phone.trim(),
      data.attendees,
      data.message || 'Inget meddelande',
      data.timestamp
    ]);
    
    // Send email notification
    MailApp.sendEmail({
      to: "your-email@example.com", // Change this to your email
      subject: "✅ Ny anmälan till SMKF evenemang",
      body: `Assalamu Alaikum,\n\nNy anmälan mottagen:\n\n` +
            `📝 Namn: ${data.name}\n` +
            `📧 E-post: ${data.email}\n` +
            `📱 Telefon: ${data.phone}\n` +
            `👥 Antal deltagare: ${data.attendees}\n` +
            `💬 Meddelande: ${data.message}\n` +
            `⏰ Tidpunkt: ${data.timestamp}\n\n` +
            `---\nSödertörns Muslimska Kultur Förening`
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Anmälan mottagen'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': 'Ett fel uppstod: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

**Remember to:**
- Replace `"your-email@example.com"` with your actual email address
- The email will be sent from your Google account
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
