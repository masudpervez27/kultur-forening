# Södertörns Muslimska Kultur Förening (SMKF)

En modern, elegant webbplats för Södertörns Muslimska Kultur Förening - en ny muslimsk kulturförening i Stockholm som arbetar för att bygga en stark gemenskap och bevara islamiska värderingar.

## 🌟 Funktioner

- **Modern svensk design** - Minimalistisk och elegant layout
- **Responsiv** - Fungerar på alla enheter (mobil, surfplatta, desktop)
- **Flerspråkig** - Svenska med arabiska element
- **Evenemangshantering** - Integration med Google Sheets för registrering
- **Navigering** - Smidig navigation med ankarlänkar

## 📋 Sektioner

- **Hero** - Välkomnande sektion med islamisk hälsning
- **Om oss** - Information om föreningen
- **Evenemang** - Inbjudan till kulturella sammankomster
- **Värderingar** - Gemenskap, Kultur, Kunskap
- **Kontakt** - Kontaktuppgifter
- **Registrering** - Formulär för evenemangsanmälan

## 🚀 Kom igång

1. Klona repositoriet
2. Öppna `index.html` i en webbläsare
3. För att aktivera formuläret, följ instruktionerna i `GOOGLE_SHEETS_SETUP.md`

## 🛠️ Teknologier

- HTML5
- CSS3 (Modern flexbox/grid layout)
- Vanilla JavaScript
- Google Sheets API (för formulärhantering)

## 📝 Konfiguration

För att ansluta registreringsformuläret till Google Sheets:
1. Se detaljerade instruktioner i `GOOGLE_SHEETS_SETUP.md`
2. Uppdatera `scriptURL` i `script.js` med din Google Apps Script URL

## 🎨 Design

Designen följer moderna skandinaviska designprinciper med:
- Ren, minimalistisk estetik
- Grön färgpalett (representerar islamiska värden)
- Inter-typsnitt för läsbarhet
- Amiri-typsnitt för arabisk text

## 📱 Kontakt

- **Telefon:** +46 700 000 000
- **E-post:** info@sodertonmuslim.se
- **Plats:** Södertörn, Stockholm

---

# ✅ How the system works (important)
1. Your website (HTML/JS/CSS)

Runs on GitHub Pages servers, not on your computer.

2. When a user submits the form

Their browser sends the POST request directly to:

https://script.google.com/macros/s/.../exec

3. Google Apps Script Web App (the backend)

Runs entirely on Google’s servers, not on your computer.

4. Google Sheets (the database)

Also lives on Google’s servers.

## 🧠 Your computer is NOT part of the chain

Here is the real flow:

User → GitHub Pages → Google Apps Script → Google Sheet


Your computer plays zero role in the process.
It is simply where you wrote the code.

You could:

Shut down your laptop

Travel abroad

Lose electricity

Never open your browser

…and the system will still run perfectly 24/7.

## The script logic flow

So the logic flow is:

Receive request →
  Validate inputs →
    Check if email exists →
      IF exists:
        return error JSON
      ELSE:
        appendRow()
        return success JSON

✔️ appendRow() only executes when:

email is NOT found

and all other validations passed

❌ appendRow() is skipped when:

email exists

name missing

invalid email

invalid phone

invalid number of attendees

JSON parse error

script error
© 2025 Södertörns Muslimska Kultur Förening. Alla rättigheter förbehållna.
