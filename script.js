
const PRODUCTS = {
  mine:{
    id:"mine", name:"ONLY MINE", gender:"For Her", price:3000, old:4286, image:"assets/female-bottle.jpg",
    images:["assets/female-bottle.jpg","assets/female-hero.jpg","assets/female-hand.jpg"],
    description:"A captivating feminine fragrance blending fresh fruity notes with delicate florals and a soft, elegant base. Crafted for women who love a fresh, sophisticated and effortlessly charming scent—perfect for everyday wear and special occasions.",
    top:"Fresh Citrus & Juicy Fruity Notes", heart:"Peony, Floral & Soft Rose Accords", base:"Musk, Amber & Soft Woody Notes"
  },
  your:{
    id:"your", name:"ONLY YOUR", gender:"For Him", price:2500, old:3571, image:"assets/male-bottle.jpg",
    images:["assets/male-bottle.jpg","assets/male-box.jpg","assets/female-hero.jpg"],
    description:"A refined masculine fragrance built around a fresh opening, a smooth floral heart and a warm, elegant dry-down. Designed for a confident signature that feels polished from day to night.",
    top:"Fresh Citrus & Juicy Fruity Notes", heart:"Peony, Floral & Soft Rose Accords", base:"Musk, Amber & Soft Woody Notes"
  }
};

let cart = JSON.parse(localStorage.getItem("velqourCart") || "[]");

function money(n){return "Rs. " + Number(n).toLocaleString("en-PK");}
function saveCart(){localStorage.setItem("velqourCart",JSON.stringify(cart)); updateCartCount();}
function updateCartCount(){document.querySelectorAll("[data-cart-count]").forEach(x=>x.textContent=cart.reduce((s,i)=>s+i.qty,0));}
function addToCart(id, qty=1){
  const p=PRODUCTS[id]; const found=cart.find(x=>x.id===id);
  if(found) found.qty+=qty; else cart.push({id,qty});
  saveCart(); renderCart(); openCart(); toast(p.name+" added to your cart.");
}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function changeQty(id,delta){
  const x=cart.find(i=>i.id===id); if(!x)return;
  x.qty+=delta; if(x.qty<=0) removeFromCart(id); else {saveCart();renderCart();}
}
function cartTotals(){
  const subtotal=cart.reduce((s,i)=>s+PRODUCTS[i.id].price*i.qty,0);
  const shipping=cart.length?250:0; return {subtotal,shipping,total:subtotal+shipping};
}
function renderCart(){
  const box=document.querySelector("#cartItems"); if(!box)return;
  if(!cart.length){box.innerHTML='<div style="padding:35px 0;color:#9b9188">Your cart is waiting for a signature scent.</div>';}
  else box.innerHTML=cart.map(i=>{
    const p=PRODUCTS[i.id];
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.name}">
      <div><h4>${p.name}</h4><small class="muted">${p.gender} • 50ml</small><div style="color:#dcbf86;margin-top:5px">${money(p.price)}</div>
      <div class="qty" style="margin-top:8px"><button onclick="changeQty('${p.id}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${p.id}',1)">+</button></div></div>
      <button class="icon-btn" style="width:32px;height:32px" onclick="removeFromCart('${p.id}')">×</button>
    </div>`;
  }).join("");
  const t=cartTotals();
  document.querySelectorAll("[data-subtotal]").forEach(x=>x.textContent=money(t.subtotal));
  document.querySelectorAll("[data-shipping]").forEach(x=>x.textContent=cart.length?money(t.shipping):money(0));
  document.querySelectorAll("[data-total]").forEach(x=>x.textContent=money(t.total));
}
function openCart(){document.querySelector("#cartPanel")?.classList.add("open");document.querySelector("#backdrop")?.classList.add("show");}
function closeCart(){document.querySelector("#cartPanel")?.classList.remove("open");document.querySelector("#backdrop")?.classList.remove("show");}
function toast(msg){const t=document.querySelector("#toast");if(!t)return;t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}
function setupNav(){
  const header=document.querySelector(".site-header"); window.addEventListener("scroll",()=>header?.classList.toggle("scrolled",scrollY>30));
  document.querySelector(".menu-btn")?.addEventListener("click",()=>document.querySelector(".nav-links")?.classList.toggle("open"));
}
function reveal(){
  const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("visible")),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(x=>obs.observe(x));
}
function productCard(p){
  return `<article class="card reveal">
    <div class="card-img"><img src="${p.image}" alt="${p.name} perfume"></div>
    <div class="card-body"><div class="pill">${p.gender} • 50ml</div><div class="card-title">${p.name}</div>
    <div class="price"><span class="old">${money(p.old)}</span><span class="new">${money(p.price)}</span><span class="pill" style="margin:0">30% OFF</span></div>
    <div class="card-actions"><a class="btn outline" href="product-${p.id}.html">View Product</a><button class="btn" onclick="addToCart('${p.id}')">Add to Cart</button></div></div>
  </article>`;
}
function checkout(){
  if(!cart.length){toast("Your cart is empty.");return;}
  location.href="checkout.html";
}
function selectedPayment(){
  return document.querySelector('input[name="payment"]:checked')?.value || "Cash on Delivery";
}
function paymentInfo(){
  const v=selectedPayment(); const el=document.querySelector("#paymentInfo"); if(!el)return;
  const map={
    "Cash on Delivery":"Pay when your VELQOUR order arrives. Delivery charges: Rs. 250.",
    "Bank Transfer":"Bank Transfer\nIBAN: PK90MEZN99700115281414\nAfter transfer, keep your payment proof for order confirmation.",
    "Easypaisa":"Easypaisa\nAccount: +92 310 9636740\nAfter payment, keep your transaction proof for order confirmation.",
    "JazzCash":"JazzCash\nAccount: 03132413207\nAfter payment, keep your transaction proof for order confirmation.",
    "Card Payment":"You will be redirected to Safepay secure checkout. Test Mode is enabled in this package."
  };
  el.textContent=map[v];
}
async function submitOrder(e){
  e.preventDefault();
  if(!cart.length){toast("Your cart is empty.");return;}
  const f=new FormData(e.target); const t=cartTotals(); const payment=selectedPayment();
  const order={
    name:f.get("name"), phone:f.get("phone"), email:f.get("email")||"",
    city:f.get("city"), province:f.get("province"), postal:f.get("postal")||"",
    address:f.get("address"), notes:f.get("notes")||"", payment,
    items:cart.map(i=>({id:i.id,name:PRODUCTS[i.id].name,qty:i.qty,unit_price:PRODUCTS[i.id].price})),
    subtotal:t.subtotal, shipping:t.shipping, total:t.total, currency:"PKR"
  };
  if(payment==="Card Payment"){
    const btn=document.querySelector("#placeOrderBtn"); if(btn){btn.disabled=true;btn.textContent="Opening Safepay…";}
    try{
      const r=await fetch("/api/create-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(order)});
      const data=await r.json();
      if(!r.ok || !data.checkout_url) throw new Error(data.error||"Unable to create Safepay checkout.");
      localStorage.setItem("velqourPendingOrder",JSON.stringify(order));
      window.location.href=data.checkout_url;
    }catch(err){
      if(btn){btn.disabled=false;btn.textContent="Place Order";}
      toast(err.message||"Safepay checkout could not be opened.");
    }
    return;
  }
  const items=order.items.map(i=>`${i.name} x${i.qty} — ${money(i.unit_price*i.qty)}`).join("\n");
  const msg=`VELQOUR SCENTS — NEW ORDER\n\nCustomer: ${order.name}\nPhone: ${order.phone}\nEmail: ${order.email||"N/A"}\nAddress: ${order.address}\nCity: ${order.city}\nProvince: ${order.province}\nPostal Code: ${order.postal||"N/A"}\nPayment: ${payment}\nNotes: ${order.notes||"N/A"}\n\nITEMS:\n${items}\n\nSubtotal: ${money(t.subtotal)}\nDelivery: ${money(t.shipping)}\nTOTAL: ${money(t.total)}`;
  const url="https://wa.me/923132413207?text="+encodeURIComponent(msg);
  localStorage.setItem("velqourLastOrder",JSON.stringify({msg,items,total:t.total}));
  window.open(url,"_blank");
  location.href="confirmation.html";
}
document.addEventListener("DOMContentLoaded",()=>{
  setupNav(); updateCartCount(); renderCart(); reveal();
  document.querySelectorAll("[data-payment]").forEach(x=>x.addEventListener("change",paymentInfo));
  const form=document.querySelector("#checkoutForm"); if(form) form.addEventListener("submit",submitOrder);
});
