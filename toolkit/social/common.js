const C=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const P=(t,a,b)=>C((t-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3);
const eo5=x=>1-Math.pow(1-x,5);
const ei=x=>x*x*x;
const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const eb=x=>{const c1=1.6,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const L=(a,b,p)=>a+(b-a)*p;
const $=id=>document.getElementById(id);
function T(el,o={}){const {x=0,y=0,s=1,r=0,op=1}=o;el.style.transform=`translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;el.style.opacity=op;}
function fadeUp(el,t,t0,d=.6,dy=36){const p=eo(P(t,t0,t0+d));T(el,{y:(1-p)*dy,op:p});}
function reveal(el,t,t0,stag=.1,d=.65){el.querySelectorAll('.ln>span').forEach((sp,i)=>{const p=eo5(P(t,t0+i*stag,t0+i*stag+d));sp.style.transform=`translateY(${(1-p)*115}%)`;});}
function scene(el,t,a,b,fi=.3,fo=.3){const pi=P(t,a,a+fi),po=P(t,b-fo,b);const op=(a<=0?1:eo(pi))*(1-ei(po));el.style.opacity=op;el.style.visibility=op<=0.001?'hidden':'visible';el.style.transform=`scale(${1+ei(po)*.04})`;return op>0.001;}
const pop=(t,t0,d=.35)=>{const p=P(t,t0,t0+d);return p>0?eb(p):0;};

const ICON={
 chat:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/></svg>',
 mail:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
 file:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
 bell:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/></svg>',
 rep:'<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#7d93ff" stroke-width="2.2" stroke-linecap="round"><path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/></svg>',
 chk:(s=26)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>`,
 clock:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 thumb:'<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.3l1-4.6v-.3c0-.4-.2-.8-.4-1.1L13.2 1 6.6 7.6C6.2 8 6 8.5 6 9v10c0 1.1.9 2 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7.1c.1-.2.2-.5.2-.7v-2z"/></svg>',
 lock:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2bd47f" stroke-width="2.4"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
 warn:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/></svg>',
 bellRed:'<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#f0453a" stroke-width="2.2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>'
};
function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function notif(n){const d=el(`<div class="a nt" style="left:${n.x}px;top:${n.y}px"><div class="ic" style="background:${n.c}">${ICON[n.i]}</div><div style="flex:1;min-width:0"><div class="tt"><span>${n.h}</span><span>${n.m}</span></div><div class="bd">${n.b}</div></div>${n.k?`<div class="badge">${n.k}</div>`:''}</div>`);return d;}
/* chain card: returns {root, update(t, times)} */
function chainCard(title,meta,steps){
  const root=el(`<div class="a card chain"><div class="ttl">${title}</div><div class="meta">${meta}</div>
   <div class="pill pend" style="position:absolute;right:44px;top:44px;background:rgba(245,165,36,.14);color:var(--amber)">${ICON.clock}Onay bekliyor</div>
   <div class="pill ok" style="position:absolute;right:44px;top:44px;background:rgba(43,212,127,.15);color:var(--green);opacity:0">${ICON.thumb}Onaylandı</div>
   <div style="position:absolute;left:112px;top:238px;width:714px;border-top:5px dotted #3a3f4a"></div>
   <div class="cl" style="position:absolute;left:112px;top:238px;width:0;height:5px;border-radius:3px;background:linear-gradient(90deg,var(--g1),var(--g2))"></div>
   <div class="lockl" style="position:absolute;left:48px;top:404px;font-size:25px;color:#cfd5df;display:flex;align-items:center;gap:14px;opacity:0">${ICON.lock}İçerik kilitlendi · Denetim kaydı oluşturuldu</div></div>`);
  const nodes=steps.map((s,i)=>{const d=el(`<div class="node" style="left:${48+i*238}px;top:174px"><div class="av"><img src="../assets/${s.img}.png">${i>0?`<div class="ck" style="transform:scale(0)">${ICON.chk(22)}</div>`:''}</div><div class="role">${s.role}</div><div class="st">${i==0?'Talep etti':'Bekliyor'}</div></div>`);root.appendChild(d);return {d,ck:d.querySelector('.ck'),st:d.querySelector('.st'),av:d.querySelector('.av')};});
  const cl=root.querySelector('.cl'),pend=root.querySelector('.pend'),ok=root.querySelector('.ok'),lock=root.querySelector('.lockl');
  function update(t,ts,tOk,tLock){let w=0;ts.forEach(s=>{w+=238*eo(P(t,s-.4,s));});cl.style.width=Math.min(714,w)+'px';
    nodes.forEach((n,i)=>{if(!i)return;const s=ts[i-1];n.ck.style.transform=`scale(${pop(t,s)})`;n.av.style.opacity=L(.45,1,eo(P(t,s-.3,s)));n.st.textContent=t>=s?'Onayladı':'Bekliyor';n.st.style.color=t>=s?'#2bd47f':'#949cab';});
    const sw=P(t,tOk,tOk+.3);pend.style.opacity=1-sw;ok.style.opacity=sw;ok.style.transform=`scale(${.9+eb(sw)*.1})`;
    fadeUp(lock,t,tLock,.5,14);}
  return {root,update};
}
const STEPS=[{img:'av1',role:'Burak Ö.'},{img:'av2',role:'Birim yön.'},{img:'av3',role:'Finans'},{img:'av4',role:'Genel müdür'}];
function routineRows(rows){
  const root=el(`<div class="a" style="width:940px;height:${rows.length*146}px"></div>`);
  const items=rows.map((r,i)=>{const d=el(`<div class="row card a" style="top:${i*146}px"><div class="ri">${ICON.rep}</div><div><div class="rt">${r.t}</div><div class="rf">${r.f}</div></div><div class="rs"><div class="ring"></div>${r.late?`<div class="late" style="transform:scale(0)">${ICON.warn}Gecikti</div>`:`<div class="done" style="transform:scale(0)">${ICON.chk(26)}</div>`}</div></div>`);root.appendChild(d);return {d,done:d.querySelector('.done'),late:d.querySelector('.late'),ring:d.querySelector('.ring'),late_:r.late};});
  function update(t,tIn,tDone){items.forEach((it,i)=>{fadeUp(it.d,t,tIn+i*.12,.5,30);const s=tDone[i];const p=pop(t,s);
    if(it.late_){it.late.style.transform=`scale(${p})`;it.ring.style.opacity=1-C(p);it.d.style.borderColor=p>0?'rgba(240,69,58,.5)':'';const sh=t>s&&t<s+.4?Math.sin(t*60)*7*(1-P(t,s,s+.4)):0;if(sh)it.d.style.transform+=` translateX(${sh}px)`;}
    else{it.done.style.transform=`scale(${p})`;}});}
  return {root,update};
}
function glows(t){const a=$('glowA'),b=$('glowB');if(a)T(a,{x:-500+Math.sin(t*.25)*220,y:-500+Math.cos(t*.2)*200});if(b)T(b,{x:100+Math.cos(t*.22)*220,y:900+Math.sin(t*.3)*200});}
function ready(){return Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))).then(()=>document.fonts.ready);}
function autoplay(dur){if(!navigator.webdriver){let t0=performance.now();(function loop(){render(((performance.now()-t0)/1000)%dur);requestAnimationFrame(loop);})();}else render(0);}
