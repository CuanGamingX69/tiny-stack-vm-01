// Dispatch table T: one char per opcode byte, v=charCode-33. im=v%5 is the
// immediate length (0-4 bytes), po=(v/5|0)%4 the values popped (0-3), and
// pu=(v/20|0) the values pushed. A char below '!' (or past the end of T)
// gives v<0: an unknown opcode, trap 5. Stack bounds (traps 2/3) and the
// immediate fit (trap 9) are checked from im/po/pu before each instruction.
import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output',T="!69&NSgl        ???????:???:??? ???             #((#!           :+              &&5&";
function run(p,q){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,c=0,pc=0,st=0,ol=0,ip=0;
 const t=x=>[o.slice(0,ol),x];
 for(;;){
  if(st===1e6)return t(10);
  if(pc<0||pc>=p.length)return t(9);
  const op=p[pc],v=(T.charCodeAt(op)|0)-33;
  if(v<0)return t(5);
  const im=v%5,po=((v/5)|0)%4,pu=(v/20)|0;
  if(pc+im>=p.length)return t(9);
  st++;
  const nx=pc+1+im;pc=nx;
  if(s<po)return t(2);
  if(s-po+pu>256)return t(3);
  switch(op){
   case 0:return t(0);
   case 1:D[s++]=(p[nx-1]<<24)>>24;break;
   case 2:D[s++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:{const a=D[s-1];D[s-1]=D[s-2];D[s-2]=a;break;}
   case 6:D[s]=D[s-2];s++;break;
   case 7:{const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;break;}
   case 23:D[s-1]=-D[s-1]|0;break;
   case 27:D[s-1]=~D[s-1];break;
   case 48:case 49:case 50:{
    const r=((p[nx-2]|p[nx-1]<<8)<<16)>>16;
    let k=op===48;
    if(!k){const z=D[--s];k=op===49?z===0:z!==0;}
    if(k)pc=nx+r;
    break;}
   case 51:if(c===64)return t(7);C[c++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
   case 52:if(!c)return t(8);pc=C[--c];break;
   case 64:{const a=D[s-1];if(a<0||a>255)return t(6);D[s-1]=M[a];break;}
   case 65:{const a=D[s-1],z=D[s-2];if(a<0||a>255)return t(6);s-=2;M[a]=z;break;}
   case 80:{const b=String(D[s-1]);if(ol+b.length>65536)return t(11);s--;for(let i=0;i<b.length;i++)o[ol++]=b.charCodeAt(i);break;}
   case 81:if(ol+1>65536)return t(11);o[ol++]=D[--s]&255;break;
   case 82:D[s++]=ip<q.length?q[ip++]:-1;break;
   case 83:return t(D[--s]&255);
   default:{
    const b=D[s-1],a=D[s-2];let r;
    if(op===16)r=a+b|0;
    else if(op===17)r=a-b|0;
    else if(op===18)r=Math.imul(a,b);
    else if(op===19){if(!b)return t(4);r=a===-2147483648&&b===-1?a:(a/b)|0;}
    else if(op===20){if(!b)return t(4);r=b===-1?0:a%b|0;}
    else if(op===21){if(!b)return t(4);r=Math.floor((a>>>0)/(b>>>0))|0;}
    else if(op===22){if(!b)return t(4);r=(a>>>0)%(b>>>0)|0;}
    else if(op===24)r=a&b;
    else if(op===25)r=a|b;
    else if(op===26)r=a^b;
    else if(op===28)r=a<<(b&31);
    else if(op===29)r=a>>(b&31);
    else if(op===30)r=a>>>(b&31)|0;
    else if(op===32)r=a===b?1:0;
    else if(op===33)r=a<b?1:0;
    else r=(a>>>0)<(b>>>0)?1:0;
    s-=2;D[s++]=r;}
  }
 }
}
for(const id of readdirSync(I).sort()){
 const r=run(readFileSync(join(I,id,'program.bin')),readFileSync(join(I,id,'input.bin')));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),r[0]);
 writeFileSync(join(O,id,'exit.txt'),r[1]+'\n');
}
