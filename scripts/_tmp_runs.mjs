// usage: runs.mjs png x,y,w,h axis(x|y) [lum]
import { readFileSync } from "node:fs";
import { PNG } from "pngjs";
const [f, r, axis="x", L="200"] = process.argv.slice(2);
const img = PNG.sync.read(readFileSync(f));
const [X,Y,W,H] = r.split(",").map(Number);
const lum=(i)=>0.299*img.data[i]+0.587*img.data[i+1]+0.114*img.data[i+2];
const prof=[];
if(axis==="x"){for(let x=X;x<X+W;x++){let c=0;for(let y=Y;y<Y+H;y++)if(lum((y*img.width+x)*4)<+L)c++;prof.push(c);}}
else{for(let y=Y;y<Y+H;y++){let c=0;for(let x=X;x<X+W;x++)if(lum((y*img.width+x)*4)<+L)c++;prof.push(c);}}
const base=axis==="x"?X:Y; const runs=[]; let s=-1;
prof.forEach((c,i)=>{if(c&&s<0)s=i; if(!c&&s>=0){runs.push(`${base+s}-${base+i-1}`);s=-1;}}); if(s>=0)runs.push(`${base+s}-${base+prof.length-1}`);
console.log(runs.join("  "));
