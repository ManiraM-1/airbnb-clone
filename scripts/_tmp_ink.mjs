import { readFileSync } from "node:fs"; import { PNG } from "pngjs";
const [a,b,y0,y1]=process.argv.slice(2);
const load=f=>PNG.sync.read(readFileSync(f));
const A=load(a),B=load(b);
const ink=(img,y)=>{let s=0;for(let x=160;x<812;x++){const i=(y*img.width+x)*4;const r=img.data[i],g=img.data[i+1],bb=img.data[i+2];if(Math.abs(r-g)>12||Math.abs(g-bb)>12)continue;s+=255-(0.299*r+0.587*g+0.114*bb);}return s;};
const out=[];for(let y=+y0;y<=+y1;y++){const ra=ink(A,y),rb=ink(B,y);if(ra+rb>0)out.push(`${y}:${(rb/ra).toFixed(2)}`);}console.log(out.join(" "));
