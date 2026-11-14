import type { IdeaSpec } from './types';

export interface Palette {
  canvas:string;surface:string;ink:string;muted:string;accent:string;onAccent:string;
  tint:string;onTint:string;border:string;
}
export interface VisualIdentity {
  light:Palette;dark:Palette;shape:'sharp'|'soft'|'round';serif:boolean;density:'spacious'|'dense';motif:string;
}
type Swatch={canvas:string;surface:string;ink:string;muted:string;accent:string;onAccent:string;tint:string;onTint:string;border:string};
const light:readonly Swatch[]=[
  {canvas:'#F3F6FB',surface:'#FFFFFF',ink:'#16273E',muted:'#425A71',accent:'#1A4C7B',onAccent:'#FFFFFF',tint:'#E6EDF8',onTint:'#183B63',border:'#CAD7E4'},
  {canvas:'#F5F8F3',surface:'#FFFFFF',ink:'#192D27',muted:'#425A4F',accent:'#185E45',onAccent:'#FFFFFF',tint:'#E5F4EB',onTint:'#164B37',border:'#CCDCD3'},
  {canvas:'#FBF7F2',surface:'#FFFFFF',ink:'#3A291D',muted:'#655346',accent:'#89432A',onAccent:'#FFFFFF',tint:'#FBEDE3',onTint:'#74351E',border:'#E4D6C9'},
  {canvas:'#F8F4FA',surface:'#FFFFFF',ink:'#302438',muted:'#61536A',accent:'#62447B',onAccent:'#FFFFFF',tint:'#F0E8F5',onTint:'#56366E',border:'#E2D8E7'},
  {canvas:'#FFF9F1',surface:'#FFFFFF',ink:'#332B23',muted:'#655747',accent:'#82511F',onAccent:'#FFFFFF',tint:'#FFF0D9',onTint:'#6E4216',border:'#E7DBC6'},
  {canvas:'#F3F9FB',surface:'#FFFFFF',ink:'#132937',muted:'#435D69',accent:'#115471',onAccent:'#FFFFFF',tint:'#E5F5F9',onTint:'#14475F',border:'#CCDFE6'},
  {canvas:'#FBF5F9',surface:'#FFFFFF',ink:'#2F2630',muted:'#655568',accent:'#78415C',onAccent:'#FFFFFF',tint:'#F9EAF2',onTint:'#642E49',border:'#E8D5DF'},
  {canvas:'#F5F6FC',surface:'#FFFFFF',ink:'#242B42',muted:'#4B566C',accent:'#434F9A',onAccent:'#FFFFFF',tint:'#E9EBFB',onTint:'#343D82',border:'#D4D9EA'},
  {canvas:'#F2FAF7',surface:'#FFFFFF',ink:'#18342F',muted:'#4D645D',accent:'#146452',onAccent:'#FFFFFF',tint:'#E6F5F1',onTint:'#105544',border:'#CDE4DC'},
  {canvas:'#FAF7F5',surface:'#FFFFFF',ink:'#332C2A',muted:'#625955',accent:'#6F4C44',onAccent:'#FFFFFF',tint:'#F5EBE7',onTint:'#5E3C35',border:'#E4D5D0'},
];
const darkAccents=['#A8C9FF','#A8E5BF','#E5B19D','#D9BFF0','#F1CA8D','#99DBF0','#EAB8D1','#C2C9FF','#9EE4D4','#E8C2B5'];
const categories=['Work & field operations','Small-business admin','Home & property','Family & caregiving','Pets & animals','Travel & vehicle','Hobbies & crafts','Learning & education','Personal admin & money','Additional specialist wedges'];
export function visualIdentity(spec:IdeaSpec):VisualIdentity {
  const index=Math.max(0,categories.indexOf(spec.category));
  const id=parseInt(spec.id,10);
  return {
    light:light[index]!,
    dark:{canvas:'#111B24',surface:'#1D2B37',ink:'#F5F8FC',muted:'#C9D3DA',accent:darkAccents[index]!,
      onAccent:'#112330',tint:'#2A3B48',onTint:'#F5F8FC',border:'#3E5261'},
    shape:spec.layout==='ledger'?'sharp':spec.layout==='tiles'||spec.layout==='hero'?'round':'soft',
    serif:spec.layout==='paper'||spec.layout==='atelier'||spec.layout==='shelf',
    density:spec.layout==='ledger'||spec.layout==='board'?'dense':'spacious',
    motif:['RHYTHM','MOMENTS','OBJECTS','EVIDENCE','PROGRESS','FOCUS','ORDER','CARE','CRAFT','RECORD'][id%10]!,
  };
}
export function contrastRatio(a:string,b:string):number{
  const lum=(hex:string)=>{
    if(!/^#[0-9a-fA-F]{6}$/.test(hex))throw new RangeError('Bad color');
    const cs=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
    return .2126*cs[0]!+.7152*cs[1]!+.0722*cs[2]!;
  };
  const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
