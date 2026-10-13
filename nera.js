(function(){
function finale(host){
var WORD=(host.getAttribute('data-word')||'DONE').toUpperCase().replace(/[^A-Z0-9£!? ]/g,'').trim().slice(0,10)||'DONE';
var CAPTION=(host.getAttribute('data-caption')||'Task finished').trim().slice(0,140);
host.innerHTML='<div style="border-radius:12px;overflow:hidden;line-height:0;background:#02011a"><canvas style="width:100%;height:250px;display:block;cursor:crosshair;touch-action:none"></canvas></div><div style="display:flex;gap:10px;margin-top:10px;align-items:center;flex-wrap:wrap"><span class="cap" style="font-size:14px;color:var(--text-primary,#eee)"><i class="ti ti-confetti" aria-hidden="true" style="margin-right:6px;color:var(--text-accent,#35CDFF)"></i></span><button class="again" style="margin-left:auto">Replay</button></div>';
host.querySelector('.cap').appendChild(document.createTextNode(CAPTION));
const c=host.querySelector('canvas'),x=c.getContext('2d');
const fx=document.createElement('canvas'),f=fx.getContext('2d');
const fx2=document.createElement('canvas'),f2=fx2.getContext('2d');
const sk=document.createElement('canvas'),s=sk.getContext('2d');
let W=680,H=250,HOR=190,D=Math.min(2,window.devicePixelRatio||1);
let stars=[],flick=[],rockets=[],parts=[],flash=0,flashHue=200,queue=[],running=false,lastActive=0;
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
function size(){W=c.clientWidth||680;HOR=Math.round(H*0.76);for(const k of [c,fx,fx2,sk]){k.width=W*D;k.height=H*D}x.setTransform(D,0,0,D,0,0);f.setTransform(D,0,0,D,0,0);f2.setTransform(D,0,0,D,0,0);s.setTransform(D,0,0,D,0,0);build();paint(performance.now())}
function tower(px,w,h,col,win){const top=HOR-h;s.fillStyle=col;s.fillRect(px,top,w,h);if(!win)return;for(let wy=top+8;wy<HOR-5;wy+=7)for(let wx=px+4;wx<px+w-4;wx+=6){const v=rnd();if(v<0.42)continue;s.fillStyle=v>0.95?'rgba(255,209,102,.9)':'rgba(53,205,255,'+(0.25+v*0.6).toFixed(2)+')';s.fillRect(wx,wy,2.4,3.2);if(v>0.985)flick.push({x:wx,y:wy,p:rnd()*6})}}
function build(){seed=11;stars=[];flick=[];s.clearRect(0,0,W,H);for(let i=0;i<110;i++)stars.push({x:rnd()*W,y:rnd()*HOR*0.85,r:0.6+rnd()*1.3,p:rnd()*6,sp:0.001+rnd()*0.003});
let px=-10;while(px<W){const w=18+rnd()*40;tower(px,w,24+rnd()*50,'#16157a',false);px+=w+2}
px=-6;const cx=W*0.5;while(px<W){const w=22+rnd()*44;if(Math.abs(px+w/2-cx)<60||Math.abs(px+w/2-W*0.2)<34){px+=w;continue}tower(px,w,34+rnd()*70,'#08073f',true);px+=w+3}
s.fillStyle='#08073f';s.beginPath();const b=HOR,t=22;s.moveTo(cx-30,b);s.lineTo(cx-25,t+92);s.lineTo(cx-18,t+92);s.lineTo(cx-15,t+54);s.lineTo(cx-9,t+54);s.lineTo(cx-6,t+24);s.lineTo(cx-2,t+24);s.lineTo(cx,t-12);s.lineTo(cx+2,t+24);s.lineTo(cx+6,t+24);s.lineTo(cx+9,t+54);s.lineTo(cx+15,t+54);s.lineTo(cx+18,t+92);s.lineTo(cx+25,t+92);s.lineTo(cx+30,b);s.fill();
for(let wy=t+30;wy<b-4;wy+=6)for(let wx=cx-24;wx<cx+24;wx+=5){const half=wy<t+54?5:wy<t+92?12:23;if(Math.abs(wx-cx)>half)continue;if(rnd()<0.5){s.fillStyle='rgba(53,205,255,'+(0.3+rnd()*0.6).toFixed(2)+')';s.fillRect(wx,wy,2,3)}}
const sx=W*0.2;s.fillStyle='#08073f';s.beginPath();s.moveTo(sx-26,b);s.lineTo(sx-22,b-112);s.quadraticCurveTo(sx+34,b-90,sx+26,b);s.fill();s.strokeStyle='rgba(53,205,255,.7)';s.lineWidth=1;s.beginPath();s.moveTo(sx-22,b-112);s.lineTo(sx-24,b-130);s.stroke()}
function launch(tx,ty,type){const sx=tx+(Math.random()-0.5)*90;rockets.push({sx:sx,x:sx,y:HOR,tx:tx,ty:ty,p:0,d:34+Math.random()*14,hue:Math.random()*360,type:type||['peony','ring','willow','crackle','peony'][Math.floor(Math.random()*5)]});kick()}
const pts=(()=>{const o=document.createElement('canvas');o.width=420;o.height=130;const q=o.getContext('2d');let fs=118;q.font='900 '+fs+'px system-ui, sans-serif';const mw=q.measureText(WORD).width;if(mw>400){fs=Math.floor(fs*400/mw)}q.font='900 '+fs+'px system-ui, sans-serif';q.fillStyle='#fff';q.textAlign='center';q.textBaseline='middle';q.fillText(WORD,210,68);const d=q.getImageData(0,0,420,130).data,out=[];const step=fs<70?3:4;for(let yy=0;yy<130;yy+=step)for(let xx=0;xx<420;xx+=step)if(d[(yy*420+xx)*4+3]>128)out.push([xx-210,yy-65]);return out})();
function burst(r){flash=1;flashHue=r.hue;const n=r.type==='willow'?110:r.type==='ring'?64:90;
if(r.type==='text'){const sc=Math.min(0.85,(W*0.7)/420);for(const [px,py] of pts){parts.push({x:r.x,y:r.y,vx:px*sc*0.1,vy:py*sc*0.1,dr:0.9,g:0,age:0,hold:80,life:1,dc:0.006,hue:195,sat:100,lit:70,sz:1.8,tx:1})}return}
for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+Math.random()*0.2;let sp=r.type==='ring'?3.2:(1+Math.random()*3.2);if(r.type==='willow')sp=0.8+Math.random()*2.7;parts.push({x:r.x,y:r.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,dr:r.type==='willow'?0.975:0.955,g:r.type==='willow'?0.025:0.045,age:0,hold:0,life:1,dc:r.type==='willow'?0.007:0.013+Math.random()*0.008,hue:r.type==='willow'?42:r.hue+(Math.random()-0.5)*30,sat:r.type==='willow'?90:100,lit:r.type==='willow'?62:65,sz:r.type==='willow'?1.4:1.8,cr:r.type==='crackle'})}}
function simulate(){for(const g of [f,f2]){g.globalCompositeOperation='destination-out';g.fillStyle='rgba(0,0,0,0.2)';g.fillRect(0,0,W,H);g.globalCompositeOperation='lighter'}
for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.p+=1/r.d;const e=1-Math.pow(1-Math.min(r.p,1),2.2);r.x=r.sx+(r.tx-r.sx)*r.p;r.y=HOR+(r.ty-HOR)*e;f.fillStyle='hsla('+r.hue+',100%,85%,1)';f.fillRect(r.x-1.2,r.y-1.2,2.4,2.4);if(Math.random()<0.8)parts.push({x:r.x,y:r.y,vx:(Math.random()-0.5)*0.4,vy:Math.random()*0.6,dr:0.96,g:0.02,age:0,hold:0,life:0.6,dc:0.04,hue:40,sat:100,lit:70,sz:1.2});if(r.p>=1){burst(r);rockets.splice(i,1)}}
for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.age++;if(p.age>p.hold){p.vx*=p.dr;p.vy*=p.dr;p.vy+=p.g||0;if(p.hold&&p.age===p.hold+1){p.g=0.03;p.dr=0.97;p.vx+=(Math.random()-0.5)*0.6}p.life-=p.dc}else{p.vx*=p.dr;p.vy*=p.dr}p.x+=p.vx;p.y+=p.vy;if(p.life<=0||p.y>HOR+4){if(p.cr&&Math.random()<0.5)for(let k=0;k<3;k++)parts.push({x:p.x,y:p.y,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2,dr:0.9,g:0.01,age:0,hold:0,life:0.7,dc:0.08,hue:0,sat:0,lit:100,sz:1.2});parts.splice(i,1);continue}const tw=p.cr||p.hold?(0.6+Math.random()*0.4):1;const g=p.tx?f2:f;g.fillStyle='hsla('+p.hue+','+p.sat+'%,'+p.lit+'%,'+(p.life*tw).toFixed(3)+')';g.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz)}
if(parts.length>4000)parts.splice(0,parts.length-4000)}
function paint(t){x.globalCompositeOperation='source-over';const g=x.createLinearGradient(0,0,0,HOR);g.addColorStop(0,'#02011a');g.addColorStop(0.7,'#0A0952');g.addColorStop(1,'#1f1d8f');x.fillStyle=g;x.fillRect(0,0,W,HOR);
if(flash>0.01){x.fillStyle='hsla('+flashHue+',90%,60%,'+(flash*0.16).toFixed(3)+')';x.fillRect(0,0,W,HOR);flash*=0.9}
for(const st of stars){x.fillStyle='rgba(255,255,255,'+(0.25+0.75*Math.abs(Math.sin(t*st.sp+st.p))).toFixed(2)+')';x.fillRect(st.x,st.y,st.r,st.r)}
const mg=x.createRadialGradient(W-60,42,6,W-60,42,32);mg.addColorStop(0,'rgba(255,248,225,1)');mg.addColorStop(0.45,'rgba(255,248,225,.95)');mg.addColorStop(0.5,'rgba(255,248,225,.25)');mg.addColorStop(1,'rgba(255,248,225,0)');x.fillStyle=mg;x.fillRect(W-94,8,68,68);
x.globalCompositeOperation='lighter';x.drawImage(fx,0,0,W,H);x.globalCompositeOperation='source-over';x.drawImage(sk,0,0,W,H);x.globalCompositeOperation='lighter';x.drawImage(fx2,0,0,W,H);x.globalCompositeOperation='source-over';
for(const w of flick){x.fillStyle='rgba(255,255,255,'+(0.5+0.5*Math.sin(t*0.004+w.p)).toFixed(2)+')';x.fillRect(w.x,w.y,2.4,3.2)}
x.fillStyle='#03021f';x.fillRect(0,HOR,W,H-HOR);x.globalAlpha=0.42;for(let y=0;y<H-HOR;y+=2){const src=HOR-y-2;if(src<0)break;const off=Math.sin(t/380+y*0.33)*(1.5+y*0.07);x.drawImage(c,0,src*D,W*D,2*D,off,HOR+y,W,2)}x.globalAlpha=1;
x.fillStyle='rgba(53,205,255,.35)';for(let i=0;i<10;i++){const yy=HOR+6+((i*29)%(H-HOR-8));const xx=((i*173+t*0.02*(i%3+1))%(W+60))-30;x.fillRect(xx,yy,20+(i*13)%40,1)}}
function step(t){simulate();paint(t);while(queue.length&&queue[0].at<=t){const q=queue.shift();launch(q.x,q.y,q.type)}
if(queue.length||rockets.length||parts.length||t-lastActive<1500){requestAnimationFrame(step)}else{running=false}}
function kick(){lastActive=performance.now();if(!running){running=true;requestAnimationFrame(step)}}
function finale(){const t0=performance.now();for(let i=0;i<16;i++)queue.push({at:t0+i*120+Math.random()*80,x:60+Math.random()*(W-120),y:30+Math.random()*(HOR*0.42)});queue.push({at:t0+2300,x:W/2,y:HOR*0.3,type:'text'});queue.sort((a,b)=>a.at-b.at);kick()}
let down=false;c.addEventListener('pointerdown',e=>{down=true;const r=c.getBoundingClientRect();launch(e.clientX-r.left,Math.min(e.clientY-r.top,HOR-40))});
c.addEventListener('pointermove',e=>{if(!down)return;const r=c.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;for(let k=0;k<4;k++)parts.push({x:px,y:py,vx:(Math.random()-0.5)*1.6,vy:(Math.random()-0.5)*1.6,dr:0.94,g:0.03,age:0,hold:0,life:1,dc:0.025,hue:190+Math.random()*30,sat:100,lit:70,sz:1.6});kick()});
addEventListener('pointerup',()=>down=false);
host.querySelector('.again').onclick=finale;
addEventListener('resize',size);size();
let played=false;const go=()=>{if(!played){played=true;setTimeout(finale,300)}};
if('IntersectionObserver' in window){new IntersectionObserver(es=>{if(es.some(en=>en.isIntersecting))go()},{threshold:0.4}).observe(c)}else{go()}
}
function nextSteps(host){
var steps=(host.getAttribute('data-steps')||'').split('|').map(function(s){return s.trim()}).filter(Boolean).slice(0,4);
if(!steps.length)return;
host.innerHTML='';
var wrap=document.createElement('div');wrap.style.cssText='padding:4px 0';
var label=document.createElement('div');label.textContent='Next';label.style.cssText='font-size:13px;color:var(--text-secondary,#999);margin:0 0 8px';
var list=document.createElement('div');list.style.cssText='display:flex;flex-direction:column;gap:6px;align-items:flex-start';
steps.forEach(function(s,i){
var b=document.createElement('button');b.type='button';b.style.cssText='display:flex;align-items:center;gap:10px;text-align:left';
var n=document.createElement('span');n.textContent=String(i+1);n.style.cssText='font-size:12px;min-width:18px;height:18px;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;background:var(--surface-1,#333);color:var(--text-secondary,#bbb)';
var t=document.createElement('span');t.textContent=s+' \u2197';
b.appendChild(n);b.appendChild(t);
b.onclick=function(){if(host.getAttribute('data-sent'))return;host.setAttribute('data-sent','1');list.querySelectorAll('button').forEach(function(o){if(o!==b)o.disabled=true});b.style.borderColor='var(--border-accent,#35CDFF)';try{sendPrompt(s)}catch(err){console.log('sendPrompt: '+s)}};
list.appendChild(b)});
var dis=document.createElement('button');dis.type='button';dis.className='dismiss';dis.textContent='Dismiss';dis.style.cssText='margin-top:8px;font-size:13px;border:none;background:none;padding:2px 0;color:var(--text-secondary,#999)';
dis.onclick=function(){host.innerHTML='';var d=document.createElement('div');d.textContent='Dismissed';d.style.cssText='font-size:13px;color:var(--text-muted,#888)';host.appendChild(d)};
wrap.appendChild(label);wrap.appendChild(list);wrap.appendChild(dis);host.appendChild(wrap);
}
function boot(){
document.querySelectorAll('[data-nera-finale]:not([data-ready])').forEach(function(h){h.setAttribute('data-ready','');try{finale(h)}catch(err){console.error(err)}});
document.querySelectorAll('[data-nera-next]:not([data-ready])').forEach(function(h){h.setAttribute('data-ready','');h.style.marginTop=h.previousElementSibling?'14px':'0';try{nextSteps(h)}catch(err){console.error(err)}});
}
boot();
})();
