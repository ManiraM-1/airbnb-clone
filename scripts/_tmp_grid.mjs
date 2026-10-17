import { readFileSync } from "node:fs"; import { PNG } from "pngjs";
const [f,r]=process.argv.slice(2); const [X,Y,W,H]=r.split(",").map(Number);
const img=PNG.sync.read(readFileSync(f));
for(let y=Y;y<Y+H;y++){let s=String(y).padStart(5)+" ";for(let x=X;x<X+W;x++){const i=(y*img.width+x)*4;const l=0.299*img.data[i]+0.587*img.data[i+1]+0.114*img.data[i+2];s+=" .:-=+*#%@"[Math.min(9,Math.floor((255-l)/25.6))]||"@";}console.log(s);}
