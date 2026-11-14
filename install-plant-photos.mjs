/** Little Leaf: download real, license-labelled botanical photographs from Wikimedia Commons.
 * Run from your project root: node install-plant-photos.mjs
 * No npm packages required (Node 18+). Existing cart/checkout untouched.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const directory = process.cwd();
const dataFile = path.join(directory,'src','data','plants.js');
const outDir = path.join(directory,'public','images','plants');
const creditsFile = path.join(directory,'docs','PLANT-PHOTO-CREDITS.md');
const reviewFile = path.join(directory,'plant-photo-review.html');
const api = 'https://commons.wikimedia.org/w/api.php';
const list = [
 ['monstera','Monstera deliciosa','Monstera deliciosa plant'],
 ['pothos','Epipremnum aureum','Epipremnum aureum pot'],
 ['snake-plant','Dracaena trifasciata','Sansevieria trifasciata plant'],
 ['peace-lily','Spathiphyllum wallisii','Spathiphyllum wallisii plant'],
 ['aloe-vera','Aloe vera','Aloe vera plant'],
 ['rubber-plant','Ficus elastica','Ficus elastica plant'],
 ['spider-plant','Chlorophytum comosum','Chlorophytum comosum plant'],
 ['zz-plant','Zamioculcas zamiifolia','Zamioculcas zamiifolia plant'],
 ['calathea','Goeppertia orbifolia','Calathea orbifolia plant'],
 ['jade-plant','Crassula ovata','Crassula ovata plant'],
 ['areca-palm','Dypsis lutescens','Dypsis lutescens palm'],
 ['boston-fern','Nephrolepis exaltata','Nephrolepis exaltata fern'],
 ['pilea','Pilea peperomioides','Pilea peperomioides plant'],
 ['fittonia','Fittonia albivenis','Fittonia albivenis plant'],
 ['peperomia','Peperomia obtusifolia','Peperomia obtusifolia plant'],
 ['tradescantia','Tradescantia zebrina','Tradescantia zebrina plant'],
 ['dracaena','Dracaena fragrans','Dracaena fragrans plant'],
 ['echeveria','Echeveria elegans','Echeveria elegans succulent'],
 ['haworthia','Haworthiopsis attenuata','Haworthia attenuata succulent'],
 ['string-of-pearls','Curio rowleyanus','Senecio rowleyanus succulent'],
];
const decode = s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
async function json(params){
 const url=api+'?'+new URLSearchParams({action:'query',format:'json',origin:'*',...params});
 const resp=await fetch(url,{headers:{'User-Agent':'LittleLeafStudentProject/1.0 (educational Wikimedia photo attribution)'}});
 if(!resp.ok)throw new Error('Wikimedia HTTP '+resp.status);
 return await resp.json();
}
function licenseAllowed(meta){
 const license=decode(meta?.LicenseShortName?.value||meta?.License?.value||'');
 return /^(CC0|CC BY|CC-BY|Public domain|PD-|PDM)/i.test(license) && !/NC|ND/i.test(license);
}
function photoScore(title,species){
 let value=0;const t=title.toLowerCase();const sp=species.toLowerCase();
 if(t.includes(sp))value+=20;
 if(/pot|houseplant|potted|container|indoor/.test(t))value+=4;
 if(/leaf|closeup|flower|fruit|stem|seed|herbarium|garden/.test(t))value-=2;
 if(/\.jpe?g$/i.test(t))value+=2;
 if(/\.png$/i.test(t))value+=1;
 return value;
}
async function choose(species,query){
 const search=await json({generator:'search',gsrsearch:`filetype:bitmap ${query}`,gsrnamespace:'6',gsrlimit:'15',prop:'imageinfo',iiprop:'url|mime|extmetadata',iiurlwidth:'700'});
 const pages=Object.values(search?.query?.pages||{});
 const candidates=pages.filter(p=>{
  const ii=p.imageinfo?.[0];const mt=ii?.mime||'';
  return ii?.thumburl && /^image\/(jpeg|png|webp)/.test(mt) && licenseAllowed(ii.extmetadata) && (p.title.toLowerCase().includes(species.toLowerCase().split(' ')[0]) || p.title.toLowerCase().includes(query.toLowerCase().split(' ')[0]));
 });
 candidates.sort((a,b)=>photoScore(b.title,species)-photoScore(a.title,species));
 return candidates[0];
}
await fs.mkdir(outDir,{recursive:true});
await fs.mkdir(path.dirname(creditsFile),{recursive:true});
let data=await fs.readFile(dataFile,'utf8');
const review=[];const credits=['# Plant photo credits','','Photos are downloaded from Wikimedia Commons for Little Leaf. **Review species identification and attribution before public submission.**',''];
let good=0;
for(const [id,species,query] of list){
 try{
  const page=await choose(species,query);
  if(!page){console.log('NO LICENSED MATCH',id);review.push({id,species,error:'No suitable licensed match found'});continue;}
  const info=page.imageinfo[0],meta=info.extmetadata||{};
  const extension=info.mime==='image/png'?'png':info.mime==='image/webp'?'webp':'jpg';
  const relative=`/images/plants/${id}.${extension}`;
  const response=await fetch(info.thumburl,{headers:{'User-Agent':'LittleLeafStudentProject/1.0 (educational image download)'}});
  if(!response.ok)throw new Error('Photo HTTP '+response.status);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length<1000)throw new Error('Image too small');
  await fs.writeFile(path.join(outDir,`${id}.${extension}`),bytes);
  const regex=new RegExp(`(id:\\s*['"]${id}['"][^\\n]*?image:\\s*)['"][^'"]+['"]`);
  if(!regex.test(data))throw new Error('Could not match image field in plants.js');
  data=data.replace(regex,(_m,begin)=>`${begin}'${relative}'`);
  const title=page.title,license=decode(meta.LicenseShortName?.value||meta.License?.value),artist=decode(meta.Artist?.value||'See Commons file page');
  const source=info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g,'_'))}`;
  credits.push(`- **${species}**: [${title.replace(/^File:/,'')}](${source}) — ${license}; attribution: ${artist}`);
  review.push({id,species,photo:relative,source,title,license});good++;
  console.log('DOWNLOADED',id,license);
 }catch(error){console.log('FAILED',id,error.message);review.push({id,species,error:error.message});}
}
await fs.writeFile(dataFile,data);
credits.push('','*Some photos may be substituted or misidentified by search. Confirm each image depicts the named species, and check the original file page for additional attribution requirements.*');
await fs.writeFile(creditsFile,credits.join('\n'));
const esc=s=>String(s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const html=`<!doctype html><html><head><meta charset="utf-8"><title>Little Leaf photo review</title><style>body{background:#E7F4D5;color:#0A3323;font:16px system-ui;margin:36px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}article{background:white;padding:14px;border-radius:18px;overflow:hidden}img{display:block;width:100%;height:220px;object-fit:cover;border-radius:12px}a{color:#105666}small{display:block;margin:8px 0}</style></head><body><h1>Little Leaf — Verify real plant photos</h1><p>Review each photograph against the species name. If a photo is incorrect, replace it manually and update the credit.</p><main>${review.map(x=>`<article><h3>${esc(x.species)}</h3>${x.photo?`<img src=".${esc(x.photo)}"><small>${esc(x.license)}</small><a href="${esc(x.source)}" target="_blank" rel="noopener">Source and attribution</a>`:`<p>Not downloaded: ${esc(x.error)}</p>`}</article>`).join('')}</main></body></html>`;
await fs.writeFile(reviewFile,html);
console.log(`\nSaved ${good}/${list.length} actual photographs. Open plant-photo-review.html in a local web server to review. Images not downloaded retain their previous illustration.`);
