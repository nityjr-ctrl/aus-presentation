import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';
const skillDir=process.env.PRESENTATIONS_SKILL_DIR ?? (process.platform==='win32' ? 'C:/Users/nityj/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations' : '/opt/codex/skills/builtins/presentations');
const { finalizePresentation, applyPresentationChartFont }=await import(pathToFileURL(path.join(skillDir,'container_tools/artifact_tool_utils.mjs')).href);

process.env.RUNTIME_NODE=process.env.CODEX_PRIMARY_RUNTIME_NODE;
process.env.RUNTIME_NODE_MODULES=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
process.env.RUNTIME_PYTHON=process.env.CODEX_PRIMARY_RUNTIME_PYTHON;
process.env.RUNTIME_BIN_DIR=path.join(process.env.CODEX_PRIMARY_RUNTIME,'dependencies/bin/override');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(await fs.readFile(path.join(root,'source.json'),'utf8'));
const specs=JSON.parse(await fs.readFile(path.join(root,'slides.json'),'utf8'));
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={ink:'#183343',muted:'#526773',teal:'#147F83',red:'#A64135',white:'#FFFFFF',pale:'#EEF4F5',dark:'#15272F'};
const FONT='Arial';
const tables=[],charts=[];

function text(s,t,x,y,w,h,size=28,color=C.ink,bold=false){
 const o=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 o.text=t;o.text.style={typeface:FONT,fontSize:size,color,bold,autoFit:'none',verticalAlignment:'top',insets:{left:0,right:0,top:0,bottom:0}};return o;
}
function rule(s,x,y,w,color=C.teal){s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:3},fill:color,line:{fill:'none',width:0}});}
async function img(s,file,x,y,w,h,alt){s.images.add({...(file==='uroops-lithotomy.png'?{crop:{left:0.29,right:0.29,top:0.21,bottom:0.21}}:{}),blob:new Uint8Array(await fs.readFile(path.join(root,'assets',file))),contentType:file.endsWith('.webp')?'image/webp':'image/png',alt,fit:'contain',position:{left:x,top:y,width:w,height:h}});}
function base(d,{dark=false}={}){
 const s=p.slides.add();s.background.fill=dark?C.dark:C.white;
 text(s,d.title,64,50,1152,100,44,dark?C.white:C.ink,true);rule(s,64,150,84);
 const meta=source.slides.find(x=>x.n===d.n);
 if(meta){
  const evidence=(meta.refs.length?meta.refs.join(' · '):'Discussion');
  text(s,evidence,64,674,1060,22,15,dark?'#B5C6CB':C.muted);
  text(s,String(d.n).padStart(2,'0'),1160,674,56,22,16,dark?'#B5C6CB':C.muted);
  s.speakerNotes.textFrame.setText(`Teaching slide ${d.n}. ${meta.title}\nTime ${meta.time}. Clock ${meta.clock}.\n\n${meta.notes}`);
 }
 return s;
}
function bottom(s,t,dark=false){if(t)text(s,t,64,604,1152,58,23,dark?'#CFDBDE':C.muted);}
function list(s,items,x=64,y=190,w=1152,size=29,step=92,color=C.ink){items.forEach((t,i)=>{text(s,t,x,y+i*step,w,step-12,size,color);});}
function table(s,headers,rows,{y=188,h=382,widths,size=26}={}){
 const t=s.tables.add({rows:rows.length+1,columns:headers.length,left:64,top:y,width:1152,height:h,values:[headers,...rows],...(widths?{columnWidths:widths}:{})});
 t.borders.assign({fill:'#D5E0E3',width:1,style:'solid'});
 t.cells.block({row:0,column:0,rowCount:rows.length+1,columnCount:headers.length}).assign({textStyle:{typeface:FONT,fontSize:size,color:C.ink},margins:{left:14,right:14,top:10,bottom:8},anchor:'center'});
 for(let r=0;r<=rows.length;r++){t.rows[r].height=r===0?58:(h-58)/rows.length;for(let c=0;c<headers.length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.pale:C.white);cell.text.style={typeface:FONT,fontSize:size,color:r===0?C.white:C.ink,bold:r===0};}}
 tables.push(p.slides.items.length);return t;
}
function chart(s,type,opts){const ch=s.charts.add(type,opts);applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);return ch;}

// The cover has no speaking allocation. The 38 teaching slides retain the source clock.
{
 const s=p.slides.add();s.background.fill=C.white;
 await img(s,'theatre-illustration.png',630,0,650,720,'Illustrative operating theatre and instrument table');
 text(s,'Artificial urinary\nsphincter surgery',64,140,575,185,58,C.ink,true);
 text(s,'Patient selection, difficult bladders\nand difficult urethras',64,360,540,116,31,C.muted);
 rule(s,64,520,84);
 text(s,'[Meeting and date]',64,478,535,30,21,C.muted);
 text(s,'Mr Andrew Baird',64,533,535,27,22,C.ink,true);
 text(s,'Urology Consultant',64,561,535,24,19,C.muted);
 text(s,'Mr Abu Yousif',64,591,535,27,22,C.ink,true);
 text(s,'Urology Consultant',64,619,535,24,19,C.muted);
 text(s,'Nity G',64,649,535,27,22,C.ink,true);
 text(s,'ST5 Urology Registrar',64,677,535,24,19,C.muted);
 s.speakerNotes.textFrame.setText('Cover, displayed before the timed teaching session. Presenters supplied by the user: Mr Andrew Baird, Urology Consultant, Mr Abu Yousif, Urology Consultant, and Nity G, ST5 Urology Registrar. Add the meeting and date. Add personal disclosures to the evidence slide before presenting. Image: AI-generated illustrative theatre scene, not a record of an actual operation. No personal operative experience or local outcomes are asserted.');
}

for(const d of specs){
 const dark=d.type==='device';const s=base(d,{dark});
 if(d.type==='table')table(s,d.headers,d.rows,{h:d.n===2?340:d.n===22?408:d.n===24?410:d.rows.length===2?320:382,size:d.n===22?24:26,widths:d.n===24?[780,372]:d.headers.length===2?[355,797]:[210,390,552]});
 if(d.type==='columns')d.cols.forEach((col,j)=>{let x=64+j*600;text(s,col[0],x,190,540,45,32,C.teal,true);list(s,col.slice(1),x,252,540,28,100);});
 if(d.type==='steps')d.rows.forEach(([n,t],i)=>{const step=d.rows.length===5?77:94;const y=190+i*step;text(s,n,64,y,70,55,38,C.teal,true);text(s,t,155,y+3,1060,step-10,30);});
 if(d.type==='decisions'){
  text(s,d.lead,64,190,1152,60,32,C.muted);
  d.rows.forEach(([label,t],i)=>{text(s,label,64,280+i*77,220,50,32,[C.teal,'#997227',C.ink,C.red][i],true);text(s,t,325,282+i*77,890,65,28);});
 }
 if(d.type==='image'){
  await img(s,d.asset,64,190,680,358,'UroOps 3D teaching schematic: '+d.label);
  text(s,d.label,788,190,428,48,29,C.teal,true);
  list(s,d.items,788,254,428,27,d.items.length===3?104:80);
  s.speakerNotes.append('\nImage source: https://uroops3d.com/lab/aus . Captured 30 September–1 October 2026 (UTC). © UroOps3D / UroRef / Nity G. The site describes this as a schematic ContiClassic model with clinical review pending. Images illustrate spatial relationships, not validated anatomy, tissue perfusion or operative instructions.');
 }
 if(d.type==='case'){
  text(s,'Fictional clinical case '+d.case,64,188,630,45,25,C.teal,true);list(s,d.facts,64,252,610,28,79);
  text(s,d.question,760,220,456,210,40,C.ink,true);rule(s,760,458,80);text(s,d.options,760,484,456,90,26,C.teal);
 }
 if(d.type==='statement'){
  text(s,d.lead,64,186,1152,135,42,d.n===28?C.red:C.teal,true);list(s,d.items,64,356,1152,29,77);
 }
 if(d.type==='wash'){
  text(s,d.lead,64,182,1152,117,39,C.ink,true);
  d.rows.forEach(([a,b],i)=>{text(s,a,64,335+i*61,425,55,27,C.teal,true);text(s,b,520,335+i*61,695,55,26);});
 }
 if(d.type==='outcomes'){
  text(s,'AMS 800: zero-pad use',64,192,530,50,30,C.teal,true);text(s,'60%',64,247,500,118,88,C.ink,true);
  text(s,'61/101 at 12 months after activation\nAUSCO: 115 primary implants',64,375,535,115,29);
  text(s,'Single-arm, manufacturer-funded study.\nMissing outcomes and one-year follow-up.',64,509,535,75,24,C.muted);
  text(s,'ContiClassic: device survival',700,192,515,50,30,C.teal,true);text(s,'93.2%',700,247,515,118,88,C.ink,true);
  text(s,'12-month Kaplan–Meier estimate\nFirst 116 recipients, mixed indications',700,375,515,115,29);
  text(s,'Abstract-level, no comparator.\nA standardised continence result is unverified.',700,509,515,75,24,C.muted);
  s.speakerNotes.append('\nThe displayed percentages describe different endpoints and populations. Do not compare them as device efficacy. AMS 800 61/101 = 60.4%, rounded to 60%. ContiClassic estimate is survival, not continence.');
 }
 if(d.type==='physiology'){
  for(const [i,title,values] of [[0,'DO: transient contraction',[1,1,1,1,5,7,2,1,1,1]],[1,'Poor compliance: sustained rise',[1,1.1,1.5,2,2.6,3.4,4.3,5.3,6.5,8]]]){
   text(s,title,64+i*600,185,550,52,30,C.teal,true);
   text(s,'Pressure ↑ (arbitrary units)',64+i*600,242,552,30,19,C.muted);
   text(s,'Increasing filling volume → (arbitrary units)',64+i*600,502,552,30,19,C.muted);
   chart(s,'line',{position:{left:64+i*600,top:276,width:552,height:225},categories:Array.from({length:10},(_,k)=>String(k)),series:[{name:'Schematic detrusor pressure',values,line:{fill:i?C.red:C.teal,width:4},marker:{symbol:'none'}}],hasLegend:false,xAxis:{visible:false,majorGridlines:null},yAxis:{visible:false,min:0,max:10,majorGridlines:null},chartFill:C.white,plotAreaFill:C.white});
  }
  text(s,'Involuntary filling contraction',64,532,550,50,28);text(s,'A separate storage-safety problem',664,532,550,50,28);
  s.speakerNotes.append('\nTrace illustration: synthetic schematic values authored only to show transient contraction versus sustained pressure rise. They are not patient observations, clinical thresholds or an eligibility test. Physiology follows ICS urodynamic standards.');
 }
 if(d.type==='prepchart'){
  chart(s,'bar',{position:{left:64,top:195,width:705,height:360},categories:['Chlorhexidine–alcohol','Povidone–iodine'],series:[{name:'Positive post-preparation skin culture',values:[.08,.32],fill:C.teal,valuesFormatCode:'0%'}],barOptions:{direction:'column',grouping:'clustered',gapWidth:110},hasLegend:false,xAxis:{textStyle:{fontSize:24,typeface:FONT,fill:C.ink},majorGridlines:null},yAxis:{min:0,max:.4,majorUnit:.1,numberFormatCode:'0%',textStyle:{fontSize:20,typeface:FONT,fill:C.muted},majorGridlines:{fill:'#D5E0E3',width:1}},dataLabels:{showValue:true,position:'outEnd',textStyle:{fontSize:28,typeface:FONT,fill:C.ink,bold:true},numberFormatCode:'0%'},chartFill:C.white,plotAreaFill:C.white});
  text(s,'A microbiological endpoint',824,212,392,95,36,C.ink,true);text(s,'Direct AUS infection evidence remains limited',824,349,392,110,30,C.muted);text(s,'Correct product, anatomy and complete drying still matter',824,483,392,97,29,C.teal);
 }
 if(d.type==='device'){
  await img(s,d.asset,64,170,610,422,'ContiClassic device illustration from manufacturer IFU, page 1');
  text(s,'ContiClassic label',726,198,490,46,29,'#80CDD0',true);text(s,'60–69 cmH₂O',726,252,490,65,40,C.white,true);
  text(s,'AMS 800 consensus',726,341,490,46,29,'#80CDD0',true);text(s,'Commonly 61–70 cmH₂O',726,395,490,105,38,C.white,true);
  text(s,'These ranges are device-specific',726,519,490,60,25,'#CFDBDE');
  s.speakerNotes.append('\nImage source: Rigicon ContiClassic IFU, CC-IFU REV.03, 12 October 2023, printed page 1 (PDF page 4). https://www.rigicon.com/files/e-labeling/ContiClassic-IFU.pdf . Manufacturer illustration, shown for component identification, without a comparative superiority claim.');
 }
 if(d.type==='demo'){
  await img(s,d.asset,64,178,820,360,'UroOps AUS final configuration schematic');
  text(s,'Cuff and dorsal plane\nPump access\nBalloon pocket\nTubing route',930,210,286,275,31,C.ink);
  const link=text(s,'uroops3d.com/lab/aus',64,551,1100,45,30,C.teal,true);link.text.get('uroops3d.com/lab/aus').link={uri:'https://uroops3d.com/lab/aus',isExternal:true};
  s.speakerNotes.textFrame.setText(`Teaching slide 32. Four minutes, 46:00–50:00.\n\nOpen https://uroops3d.com/lab/aus and use the scene controls. Public page and available view labels were inspected on 30 September 2026. Schematic ContiClassic model, clinical review pending. No claim of anatomical validation.\n\n00:00–00:20: Transition to anatomical relationships.\n00:20–01:05: Cuff site view. Discuss viable bulbar tissue and supporting spongiosum.\n01:05–01:45: Surgeon’s view. Discuss the dorsal plane and why scarred tissue changes dissection.\n01:45–02:20: The three spaces view. Discuss accessible pump position.\n02:20–03:10: Space of Retzius view. Discuss how previous surgery changes balloon access. Describe alternative pockets only verbally if absent.\n03:10–03:45: Final configuration view. Trace tubing without claiming the schematic proves tension or perfusion.\n03:45–04:00: Return to postoperative care.\n\nIf loading fails, keep this slide displayed and use the original four-minute spoken fallback below. Do not spend the allocated session troubleshooting.\n\n${source.slides[31].notes.split('Fallback speaker notes:')[1]?.replace(/The UroOps model has not been accessed;[^.]*\./g,'The public model is a teaching schematic awaiting clinical review.')??''}\n\nSources: ICS16 ${source.refs.ICS16}; AP23 ${source.refs.AP23}; CCIFU ${source.refs.CCIFU}. Image © UroOps3D / UroRef / Nity G. https://uroops3d.com/lab/aus`);
 }
 if(d.type==='discussion'){
  list(s,d.items,64,216,1120,36,120);text(s,'Five minutes',64,184,1152,32,21,C.teal);
  s.speakerNotes.append('\nPrepared expert questions and balanced answers, outside the timed talk:\n'+source.questions);
 }
 bottom(s,d.bottom,dark);
 if(d.n===2){text(s,'[Personal disclosures]',64,558,1152,32,23,C.muted);s.speakerNotes.append('\nReplace the disclosure placeholder with the presenter’s accurate relationships. The source brief identifies Rigicon as organiser.');}
}

// Backup material is outside the 60-minute clock.
function backup(title){const s=base({title});text(s,'Backup: outside the timed talk',64,674,1152,24,16,C.muted);return s;}
for(const d of source.backupTables){
 const s=backup(d.title);
 table(s,d.headers,d.rows,{h:d.height,widths:d.widths,size:d.fontSize});
 s.speakerNotes.textFrame.setText(d.notes);
}
{
 const s=backup('Evidence gaps');
 list(s,['Routine versus selective UDS and meaningful outcomes','Functional eligibility in DU or chronic retention','Staging intervals after different reconstructions','Comparative protection from salvage strategies','Preparation, irrigation and prolonged prophylaxis','Independent long-term ContiClassic outcomes','Mechanisms and revision strategy in late leakage'],64,188,1152,27,57);
 s.speakerNotes.textFrame.setText('Evidence gaps preserved from section 7 of the manuscript. No new clinical thresholds or device superiority claims are introduced.');
}
const refGroups=[['BAUS25','EAU26','AUA24','EAUSTR26','ICS16','AP23','CCIFU','ICSUDS17','AUAOAB24'],['NICE','WHO09','CHLORA26','IDSA19','AUAABX20','CCSAFETY','MASTER22','UDS09','OAB11'],['DO24','DOFAIL23','DU23','CIC23','CATH13','UDS14','RT22','URETH26','TC20'],['TC23','ATROPHY20','PREP24','YEUNG13','ABX18','TOUCH23','LINDER15','AUSCO26']];
for(let start=0;start<source.evidenceAdditions.length;start+=8)refGroups.push(source.evidenceAdditions.slice(start,start+8).map(x=>x.code));
const labels={BAUS25:'BAUS consensus, BJU Int 2025',EAU26:'EAU male LUTS guidelines, 2026',AUA24:'AUA/GURS/SUFU IPT amendment, 2024',EAUSTR26:'EAU urethral strictures guidelines, 2026',ICS16:'ICS AUS consensus, NUU 2016',AP23:'Asia-Pacific AMS 800 consensus, 2023',CCIFU:'Rigicon ContiClassic IFU, REV.03, 2023',ICSUDS17:'ICS good urodynamic practices, 2017',AUAOAB24:'AUA/SUFU idiopathic OAB guideline, 2024',NICE:'NICE NG125: surgical site infection',WHO09:'WHO hand hygiene guidance, 2009',CHLORA26:'ChloraPrep UK product information, 2026',IDSA19:'IDSA asymptomatic bacteriuria, 2019',AUAABX20:'AUA antimicrobial prophylaxis, 2020',CCSAFETY:'Wilson: ContiClassic safety, IJIR 2024',MASTER22:'MASTER randomised trial, HTA 2022',UDS09:'Lai: pre-AUS urodynamics, Urology 2009',OAB11:'Lai: OAB and post-prostatectomy AUS, 2011',DO24:'Bhatt: preoperative DO systematic review, 2024',DOFAIL23:'Krughoff: earlier AUS failure, 2023',DU23:'Han: AUS with detrusor underactivity, 2023',CIC23:'Krughoff: CIC after bulbar AUS, 2023',CATH13:'Seideman: prolonged catheterisation, 2013',UDS14:'Weissbart: absent leak during UDS, 2014',RT22:'Zhang: radiation meta-analysis, 2022',URETH26:'Davis: AUS after urethroplasty, 2026',TC20:'Redmond: transcorporal fragile urethra, 2020',TC23:'Kurtzman: high-risk transcorporal AUS, 2023',ATROPHY20:'Bergeson: urethral atrophy and revision, 2020',PREP24:'Bourgi: AUS preparation protocols, 2024',YEUNG13:'Yeung: GU skin preparation RCT, 2013',ABX18:'Adamsky: postoperative antibiotics, 2018',TOUCH23:'Ziegelmann: minimal-touch AUS, 2023',LINDER15:'Linder: long-term AMS 800 outcomes, 2015',AUSCO26:'Kaufman: AMS 800 AUSCO study, 2026'};
Object.assign(labels,Object.fromEntries(source.evidenceAdditions.map(x=>[x.code,x.label])));
for(let g=0;g<refGroups.length;g++){
 const s=backup('References '+(g+1)+' of '+refGroups.length);
 refGroups[g].forEach((id,i)=>{let x=64+(i%2)*600,y=185+Math.floor(i/2)*84;text(s,id,x,y,540,28,20,C.teal,true);let t=text(s,labels[id],x,y+30,545,51,24);t.text.get(labels[id]).link={uri:source.refs[id],isExternal:true};});
 s.speakerNotes.textFrame.setText('Full bibliography with access limits:\n\n'+source.biblio+'\n\nLinked references on this slide:\n'+refGroups[g].map(x=>x+' '+source.refs[x]).join('\n'));
}

await fs.mkdir(path.join(root,'build','renders'),{recursive:true});
await fs.mkdir(path.join(root,'output'),{recursive:true});
const candidatePath=path.join(root,'build','candidate.pptx');await (await PresentationFile.exportPptx(p)).save(candidatePath);
console.log('Draft exported',p.slides.items.length,'slides');
const finalPath=path.join(root,'output',`AUS-teaching-${new Date().toISOString().replace(/[:.]/g,'-')}.pptx`);
const result=await finalizePresentation({workspaceDir:root,candidatePath,finalPath,pythonExecutable:process.env.CODEX_PRIMARY_RUNTIME_PYTHON,integrityValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(n=>['--require-native-table-slide',String(n)])],explicitTotalSlideCount:49,requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[...new Set(charts)],fontPolicy:{basis:'design',families:[FONT]},materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(root,'build',`validation-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)});
console.log('Validated final deck:',result.finalPath);
for(let i=0;i<p.slides.items.length;i++){
 const blob=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(path.join(root,'build','renders',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
 console.log('Rendered',i+1);
}
