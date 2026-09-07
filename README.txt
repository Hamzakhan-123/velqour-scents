VELQOUR SCENTS WEBSITE
========================
Open index.html to preview.

Pages:
1 Home
2 Shop
3 ONLY MINE
4 ONLY YOUR
5 About
6 Shipping & Policies
7 Contact

Functional:
Cart -> Checkout -> WhatsApp order confirmation.

Important:
- This is a front-end/static build. Cart uses browser localStorage.
- Checkout prepares a WhatsApp order to 03132413207.
- COD, Bank Transfer, Easypaisa and JazzCash are manual payment options.
- Card Payment is a UI option only until a real payment gateway/merchant integration is connected.
- Replace the suggested Returns & Exchanges wording in shipping.html with your actual policy before launch.
- Upload the whole folder to your hosting and point velqourscents.store to it.


SAFEPAY TEST MODE SETUP
=======================
This package now includes a secure server-side payment scaffold.

1. Copy .env.example to .env.
2. Put your Safepay SECRET key only in .env. Never put it in HTML/JS or send it in chat.
3. Run: npm install
4. Run: npm start
5. Open: http://localhost:3000
6. Select Card Payment at checkout.

IMPORTANT:
- The public/publishable key is not a substitute for the server secret.
- This package is prepared for Safepay Test Mode, but Safepay may change API endpoints/response fields. Verify the current endpoint/schema in your Safepay dashboard/docs before production.
- Live payments require Safepay production onboarding/KYC and a production credential.
- Do not upload .env to public hosting or GitHub.
