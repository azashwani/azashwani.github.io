# azashwani.github.io

# Open Road Life — Site Files

## index.html
Your page content. Edit this file when you want to:
- Add or update a trip card
- Change your bio, name, or stats
- Add a new story or letter
- Update the hero text or photo strip

## style.css
All colors, fonts, and layout. Edit this file when you want to:
- Change the color scheme
- Adjust spacing or sizing
- Modify how a section looks

## main.js
Password logic and scroll animations. Edit this file when you want to:
- Update your site password (instructions are at the top of the file)
- Change any interactive behavior

---
To update the password:
1. Open browser console (F12 → Console tab)
2. Run this, replacing 'yournewpassword' with your actual password:
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('yournewpassword'))
     .then(buf => console.log(Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')))
3. Copy the result and replace the SITE_HASH value in main.js