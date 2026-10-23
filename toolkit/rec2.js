// usage: node rec2.js page.html W H seconds out.mp4 [snapTimes...]  (if snapTimes given -> only stills)
const {chromium}=require('/opt/node-tools/node_modules/playwright-core');
const {spawn}=require('child_process');const path=require('path');
(async()=>{
 const [file,W,H,secs,out,...snaps]=process.argv.slice(2);
 const b=await chromium.launch({executablePath:process.env.CHROME||['/opt/pw-browsers/chromium','/opt/pw-browsers/chromium-1243/chrome-linux64/chrome','/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p=>require('fs').existsSync(p))});
 const SS=+(process.env.SS||2);const pg=await b.newPage({viewport:{width:+W,height:+H},deviceScaleFactor:SS});
 pg.on('pageerror',e=>console.log('ERR',e.message));pg.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
 await pg.goto('file://'+path.resolve(file));await pg.evaluate(()=>window.ready);
 if(snaps.length){for(const t of snaps){await pg.evaluate(t=>render(t),+t);await pg.screenshot({path:`${out}_${t}.jpg`,type:'jpeg',quality:80});}await b.close();return;}
 const FPS=30,N=Math.round(+secs*FPS);
 const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-vf',`scale=${W}:${H}:flags=lanczos,noise=alls=2:allf=t,format=yuv420p`,'-c:v','libx264','-preset','slow','-crf','14','-maxrate','14M','-bufsize','28M','-profile:v','high','-level','4.2','-g','60','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart',out],{stdio:['pipe','ignore','ignore']});
 for(let f=0;f<N;f++){await pg.evaluate(t=>render(t),f/FPS);const buf=await pg.screenshot({type:'jpeg',quality:97});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done',out);
})();
