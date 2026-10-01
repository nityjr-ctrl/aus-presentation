import path from 'node:path';
import {fileURLToPath} from 'node:url';
const assets=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../assets');
import { chromium } from 'playwright';
const b=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1440,height:1200}});p.setDefaultTimeout(15000);await p.goto('https://uroops3d.com/lab/aus',{waitUntil:'networkidle'});await p.getByRole('button',{name:'Pause',exact:true}).evaluate(e=>e.click());
for(const [button,file,installed] of [["Surgeon\u0027s view",'surgeon',false],['Sagittal','sagittal',false],['Exploded device','exploded',false],['Cuff site','cuff-site',true],['The three spaces','three-spaces',true],['Final configuration','final',true]]){
 if(installed)await p.locator('input.t-scrub').evaluate(e=>e.dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true})));
 if(await p.getByRole('button',{name:'Scene controls',exact:true}).count())await p.getByRole('button',{name:'Scene controls',exact:true}).evaluate(e=>e.click());
 const loc=p.getByRole('button',{name:button,exact:true});await loc.first().evaluate(e=>e.click());await p.waitForTimeout(1200);
 const dl=p.waitForEvent('download');await p.getByRole('button',{name:'Save image',exact:true}).first().evaluate(e=>e.click());await (await dl).saveAs(`${assets}/uroops-${file}.png`);console.log(file);
 if(await p.getByRole('button',{name:'Close controls',exact:true}).count())await p.getByRole('button',{name:'Close controls',exact:true}).evaluate(e=>e.click());
}
await b.close();
