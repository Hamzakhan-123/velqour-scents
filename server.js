const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const SAFEPAY_SECRET_KEY = process.env.SAFEPAY_SECRET_KEY;
const SAFEPAY_API_BASE = process.env.SAFEPAY_API_BASE || "https://api.getsafepay.com";

app.post("/api/create-checkout", async (req,res)=>{
  try {
    if(!SAFEPAY_SECRET_KEY) return res.status(500).json({error:"Safepay secret key is not configured on the server."});
    const o=req.body;
    if(!o || !Number.isInteger(o.total) || o.total < 1) return res.status(400).json({error:"Invalid order total."});

    // Safepay's server-side SDK/API is intentionally kept behind this endpoint.
    // Configure the exact checkout/session flow for your Safepay account here.
    // Never put SAFEPAY_SECRET_KEY in HTML, JS, or Git.
    const response = await fetch(`${SAFEPAY_API_BASE}/payments/v2/sessions`, {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${SAFEPAY_SECRET_KEY}`
      },
      body:JSON.stringify({
        amount:o.total,
        currency:"PKR",
        order_id:`VS-${Date.now()}`,
        customer:{
          name:o.name, email:o.email, phone:o.phone
        },
        metadata:{brand:"VELQOUR SCENTS"}
      })
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) return res.status(response.status).json({error:data.message||data.error||"Safepay rejected the checkout request."});

    const checkoutUrl=data.checkout_url || data.url || data.redirect_url;
    if(!checkoutUrl) return res.status(502).json({error:"Safepay response did not include a checkout URL. Check the current Safepay API configuration for this account."});
    res.json({checkout_url:checkoutUrl});
  } catch(e) {
    console.error(e);
    res.status(500).json({error:"Payment service error."});
  }
});

app.get("/payment-success",(req,res)=>res.sendFile(path.join(__dirname,"confirmation.html")));
app.listen(PORT,()=>console.log(`VELQOUR SCENTS server running on http://localhost:${PORT}`));
