import { readFileSync } from "node:fs"; import { PNG } from "pngjs";
const [f,y0,y1,x0,x1]=process.argv.slice(2).map((v,i)=>i?+v:v);
const img=PNG.sync.read(readFileSync(f));
const out=[];
for(let y=y0;y<=y1;y++){let m=255;for(let x=x0;x<=x1;x++){const i=(y*img.width+x)*4;const r=img.data[i],g=img.data[i+1],b=img.data[i+2];if(Math.abs(r-g)>12||Math.abs(g-b)>12)continue;const l=0.299*r+0.587*g+0.114*b;if(l<m)m=l;}out.push(y+":"+Math.round(m));}
console.log(out.join(" "));
