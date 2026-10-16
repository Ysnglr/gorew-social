// usage: node shots.js <page.html> <deckId> <slideCount> <outDir>
// renders page.html?d=<deckId>&s=1..N at 1080x1350 -> <outDir>/gorew_<deckId>_<n>.jpg
const {chromium}=require('/opt/node-tools/node_modules/playwright-core');const path=require('path');const fs=require('fs');
(async()=>{const [page,d,n,outDir]=process.argv.slice(2);fs.mkdirSync(outDir,{recursive:true});
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const pg=await b.newPage({viewport:{width:1080,height:1350}});pg.on('pageerror',e=>console.log('ERR',e.message));
 for(let s=1;s<=+n;s++){await pg.goto('file://'+path.resolve(page)+`?d=${d}&s=${s}`);await pg.evaluate(()=>window.ready);
  await pg.screenshot({path:path.join(outDir,`gorew_${d}_${s}.jpg`),type:'jpeg',quality:92});}
 await b.close();console.log('ok');})();
