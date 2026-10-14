const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app.js','utf8') + '\n' + fs.readFileSync('experience.js','utf8');
function render(page, saved = {}) {
  const elements = new Map(), stars = [];
  let html = '', stored;
  function element(selector) {
    if (elements.has(selector)) return elements.get(selector);
    const handlers = {}, attrs = {};
    const e = {value:'',textContent:'',hidden:false,disabled:false,dataset:{},style:{setProperty(){}},classList:{add(){},remove(){},toggle(){},contains(){return true}},setAttribute(k,v){attrs[k]=v;},getBoundingClientRect(){return{x:0,y:0,width:50,height:50};},addEventListener(k,f){handlers[k]=f;},fire(k){handlers[k]?.({preventDefault(){}});},animate(){},remove(){},attrs};
    if(selector==='#next' && html.includes('id="next" disabled'))e.disabled=true;
    elements.set(selector,e);return e;
  }
  const app = {get innerHTML(){return html;},set innerHTML(v){html=v;}};
  const context = {console,URL,Math,innerWidth:1200,innerHeight:800,matchMedia:()=>({matches:true}),setTimeout:f=>{f();},addEventListener(){},document:{body:{dataset:{},classList:{add(){},remove(){}},append(){}},addEventListener(){},querySelector(s){
    if(s==='#app')return app;
    if(['#timeline','.flip-note','.lantern','#envelope'].includes(s) && !html.includes(s.startsWith('#')?`id="${s.slice(1)}"`:`class="${s.slice(1)}"`))return null;
    return element(s);
  },querySelectorAll(s){
    if(s==='.star')return stars;
    if(s==='.star[aria-pressed="true"]')return stars.filter(e=>e.attrs['aria-pressed']==='true');
    if(s==='[data-reveal]' && html.includes('data-reveal=')) {const b=element('reveal');b.dataset.reveal='Un mensaje';return[b];}
    return [];
  }},location:{pathname:'/'+page,href:'https://example.test/'+page,replace(v){this.href=v;}},localStorage:{getItem:()=>JSON.stringify(saved),setItem:(k,v)=>{stored=JSON.parse(v);}}};
  if(page==='capitulo-5.html')for(let i=0;i<3;i++){const star=element('star'+i);star.dataset.note='Luz '+i;stars.push(star);}
  vm.runInNewContext(source,context);
  return {element,context,stars,get html(){return html;},get stored(){return stored;}};
}
test('La fecha incorrecta mantiene cerrado el regalo; la correcta guarda y abre',()=>{
  const r=render('index.html');r.element('#date').value='01/01/2026';r.element('form').fire('submit');assert.equal(r.stored,undefined);
  r.element('#date').value='22/09/2026';r.element('form').fire('submit');assert.equal(r.stored.unlocked,true);assert.equal(r.context.location.href,'universo.html');
});
test('No se puede saltar a un capítulo cerrado',()=>{
  const r=render('capitulo-8.html',{unlocked:true,completed:0});assert.equal(r.context.location.href,'universo.html');
});
test('La fecha solo abre la siguiente puerta al terminar el deslizador',()=>{
  const r=render('capitulo-1.html',{unlocked:true,completed:0});r.element('#next').fire('click');assert.equal(r.stored,undefined);
  r.element('#timeline').value='90';r.element('#timeline').fire('input');assert.equal(r.element('#next').disabled,true);
  r.element('#timeline').value='100';r.element('#timeline').fire('input');r.element('#next').fire('click');assert.equal(r.stored.completed,1);assert.equal(r.context.location.href,'capitulo-2.html');
});
test('Las tres estrellas son necesarias y repetir una no cuenta dos veces',()=>{
  const r=render('capitulo-5.html',{unlocked:true,completed:4});r.stars[0].fire('click');r.stars[0].fire('click');r.stars[1].fire('click');assert.equal(r.element('#next').disabled,true);
  r.stars[2].fire('click');r.element('#next').fire('click');assert.equal(r.stored.completed,5);
});
test('Palabras, nota y linterna desbloquean sus capítulos',()=>{
  for(const [n,selector] of [[2,'reveal'],[3,'.flip-note'],[4,'.lantern'],[6,'reveal'],[7,'reveal']]){
    const r=render(`capitulo-${n}.html`,{unlocked:true,completed:n-1});assert.equal(r.element('#next').disabled,true);r.element(selector).fire('click');r.element('#next').fire('click');assert.equal(r.stored.completed,n);
  }
});
test('Abrir el sobre permite guardar el final y regresar al mapa',()=>{
  const r=render('capitulo-8.html',{unlocked:true,completed:7});r.element('#envelope').fire('click');assert.equal(r.element('#letter-body').hidden,false);r.element('#next').fire('click');assert.equal(r.stored.completed,8);assert.equal(r.context.location.href,'universo.html');
});
