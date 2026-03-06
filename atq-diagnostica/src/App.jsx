import { useState } from "react";

// ── PREGUNTES ──────────────────────────────────────────────────────────────
// visible: funció que rep respostes i retorna true/false
const PREGUNTES = [
  // PERFIL
  { id:"tipus",           seccio:"Perfil",   pregunta:"Tipus de comerç", tipus:"opcions",
    opcions:["Alimentació / mercat","Roba / tèxtil","Ferreteria / bricolatge","Llibreria / papereria","Perruqueria / estètica","Bar / cafeteria","Restaurant","Servei local (sabater, modista...)","Altra"] },
  { id:"anys",            seccio:"Perfil",   pregunta:"Anys obert al barri", tipus:"opcions",
    opcions:["Menys d'1 any","1–5 anys","5–15 anys","15–30 anys","Més de 30 anys"] },
  { id:"propietari_edat", seccio:"Perfil",   pregunta:"Edat aproximada del/la propietari/a", tipus:"opcions",
    opcions:["Menys de 40 anys","40–55 anys","55–65 anys","65–75 anys","Més de 75 anys"] },

  // FUTUR I CONTINUÏTAT (primer el pla, després el relleu)
  { id:"futur",           seccio:"Continuïtat", pregunta:"Quin pla de futur teniu per al comerç?", tipus:"opcions",
    opcions:["Continuarà molts anys","Continuarà uns pocs anys","Tancarem quan em jubili","Tancarem aviat per motius econòmics","Ja estem pensant a tancar"] },
  { id:"successio",       seccio:"Continuïtat", pregunta:"Hi ha algú que pugui agafar el relleu del negoci?",
    tipus:"opcions", visible: r => r.futur && r.futur !== "Continuarà molts anys",
    opcions:["Sí, ja preparat/da","Sí, possiblement","Ho estem pensant","No hi ha ningú","No vull continuar"] },

  // LOCAL I LLOGUER
  { id:"regim_local",     seccio:"Local i lloguer", pregunta:"El local és de propietat o de lloguer?", tipus:"opcions",
    opcions:["Propietat pròpia","Lloguer","No ho sé"] },
  { id:"propietat_qui",   seccio:"Local i lloguer", pregunta:"Qui és el/la propietari/a del local?",
    tipus:"opcions", visible: r => r.regim_local === "Lloguer",
    opcions:["Un particular (persona física)","Una empresa o promotora immobiliària","Un fons d'inversió","L'Ajuntament / patrimoni públic","No ho sabem / no ens ho han dit"] },
  { id:"fi_contracte",    seccio:"Local i lloguer", pregunta:"Quan acaba el contracte de lloguer?",
    tipus:"opcions", visible: r => r.regim_local === "Lloguer",
    opcions:["Menys d'1 any","1–2 anys","3–5 anys","Més de 5 anys","No ho sé"] },
  { id:"lloguer_import",    seccio:"Local i lloguer", pregunta:"Import aproximat del lloguer mensual",
    tipus:"opcions", visible: r => r.regim_local === "Lloguer",
    opcions:["Menys de 500€","500–1.000€","1.000–2.000€","2.000–3.500€","Més de 3.500€","Prefereixo no dir-ho"] },
  { id:"lloguer_percepcio", seccio:"Local i lloguer", pregunta:"Com valoreu el preu actual del lloguer?",
    tipus:"opcions", visible: r => r.regim_local === "Lloguer",
    opcions:["És assequible i just","És alt però assumible","És molt car per al que guanyem","És insostenible, no podem mantenir-lo"] },
  { id:"lloguer_pujada",  seccio:"Local i lloguer", pregunta:"Ha pujat el lloguer els últims anys?",
    tipus:"opcions", visible: r => r.regim_local === "Lloguer",
    opcions:["No, s'ha mantingut estable","Sí, una mica","Sí, molt (>20%)","Sí, de manera abusiva","No ho sé"] },
  { id:"negociacio",      seccio:"Local i lloguer", pregunta:"Heu intentat negociar el lloguer amb el propietari?",
    tipus:"opcions", visible: r => r.regim_local === "Lloguer",
    opcions:["No hem intentat negociar","Sí, i va anar bé","Sí, però no vam aconseguir res","Sí, i la situació va empitjorar"] },
  { id:"assessorament",   seccio:"Local i lloguer", pregunta:"Heu parlat amb algun advocat o entitat de suport?",
    tipus:"opcions", visible: r => r.regim_local === "Lloguer",
    opcions:["No, no sabem a qui acudir","No, però ens agradaria","Sí, amb un advocat particular","Sí, amb una associació o entitat","Sí, i ens ha ajudat molt"] },

  // ECONÒMIC
  { id:"rendibilitat",    seccio:"Econòmic", pregunta:"El negoci és rendible avui?", tipus:"opcions",
    opcions:["Sí, va bé","Més o menys, anem tirant","Ens costa cobrir despeses","Estem en pèrdues","Prefereixo no dir-ho"] },
  { id:"clients",         seccio:"Econòmic", pregunta:"La clientela habitual ha canviat els últims anys?", tipus:"opcions",
    opcions:["No, segueix igual","Ha millorat","Han marxat veïns de tota la vida","Ara hi ha molts turistes o expats","La clientela ha baixat molt"] },

  // PRESSIONS
  { id:"ofertes",         seccio:"Pressions", pregunta:"Heu rebut ofertes per comprar el local o el negoci?", tipus:"opcions",
    opcions:["No mai","Sí, alguna vegada","Sí, repetidament","Sí, de manera molt agressiva"] },
  { id:"ofertes_qui",     seccio:"Pressions", pregunta:"D'on venien aquestes ofertes?",
    tipus:"opcions_multiple", visible: r => r.ofertes && r.ofertes !== "No mai",
    opcions:["Una promotora o empresa immobiliària","Un fons d'inversió","Un particular","Una cadena comercial o franquícia","No sabem qui era / era anònim"] },

  // BARRI
  { id:"vincles_barri",   seccio:"Barri", pregunta:"El comerç té vincles amb entitats del barri?", tipus:"opcions_multiple",
    opcions:["Associació de veïns","Mercat municipal","Ateneu / centre cultural","Escola o AMPA","Col·lab. amb altres comerços locals","Sindicat de llogateres","Cap vincle conegut"] },
  { id:"implicacio_barri",seccio:"Barri", pregunta:"Com de present és el comerç en la vida del barri?", tipus:"opcions",
    opcions:["Punt de referència i trobada","Conegut però sense activisme","Discret, centrat en el negoci","Poc integrat, clientela externa"] },

  // PARTICIPACIÓ
  { id:"participacio",      seccio:"Participació", pregunta:"Estaria disposat/da a participar en el projecte Abans Que Tanqui?", tipus:"opcions",
    opcions:["Sí, molt interessat/da","Sí, si no implica massa feina","Potser, cal pensar-ho","Prefereixo no involucrar-me","No, gràcies"] },
  { id:"participacio_com",  seccio:"Participació", pregunta:"En quina forma podria participar?",
    tipus:"opcions_multiple", visible: r => r.participacio && !["Prefereixo no involucrar-me","No, gràcies"].includes(r.participacio),
    opcions:["Rebre informació i recursos","Aparèixer al mapa públic","Parlar amb altres comerços","Donar testimoni públic (entrevista, vídeo...)","Participar en accions col·lectives","Col·laborar amb la xarxa de comerços"] },

  // AJUDA
  { id:"ajuda",           seccio:"Ajuda", pregunta:"Quina ajuda us seria més útil?", tipus:"opcions_multiple",
    opcions:["Assessorament legal sobre el lloguer","Ajuda per trobar un relleu generacional","Visibilitat i comunicació","Suport econòmic / subvencions","Xarxa de comerços locals","Formació digital","Cap, estem bé"] },

  // NOTES
  { id:"notes",           seccio:"Notes", pregunta:"Context, història o situació especial del comerç", tipus:"text" },
];

// ── FACTORS DE RISC ────────────────────────────────────────────────────────
const FACTORS = [
  { id:"anys",            nom:"Antiguitat",          pes:1.0,
    pesos:{"Menys d'1 any":0,"1–5 anys":0,"5–15 anys":1,"15–30 anys":2,"Més de 30 anys":3},
    explica: v => v==="Més de 30 anys"?"Molt arrelat al barri, pèrdua de gran impacte cultural":v==="15–30 anys"?"Comerç consolidat":null },
  { id:"propietari_edat", nom:"Edat propietari",      pes:1.2,
    pesos:{"Menys de 40 anys":0,"40–55 anys":1,"55–65 anys":2,"65–75 anys":3,"Més de 75 anys":3},
    explica: v => ["65–75 anys","Més de 75 anys"].includes(v)?"Proper/a a la jubilació sense relleu previst":null },
  { id:"futur",           nom:"Pla de futur",         pes:1.8,
    pesos:{"Continuarà molts anys":0,"Continuarà uns pocs anys":1,"Tancarem quan em jubili":2,"Tancarem aviat per motius econòmics":3,"Ja estem pensant a tancar":3},
    explica: v => ["Tancarem aviat per motius econòmics","Ja estem pensant a tancar"].includes(v)?"El/la propietari/a preveu tancar en el curt termini":v==="Tancarem quan em jubili"?"Tancament previst a mig termini":null },
  { id:"successio",       nom:"Relleu generacional",  pes:1.5,
    pesos:{"Sí, ja preparat/da":0,"Sí, possiblement":1,"Ho estem pensant":2,"No hi ha ningú":3,"No vull continuar":3},
    explica: v => v==="No hi ha ningú"?"Sense successió identificada":v==="No vull continuar"?"Decisió presa de no continuar":null },
  { id:"regim_local",     nom:"Règim del local",      pes:1.0,
    pesos:{"Propietat pròpia":0,"Lloguer":2,"No ho sé":1},
    explica: v => v==="Lloguer"?"En règim de lloguer, vulnerable a canvis":null },
  { id:"propietat_qui",   nom:"Qui és el propietari", pes:1.5,
    pesos:{"Un particular (persona física)":1,"Una empresa o promotora immobiliària":2,"Un fons d'inversió":3,"L'Ajuntament / patrimoni públic":0,"No ho sabem / no ens ho han dit":2},
    explica: v => v==="Un fons d'inversió"?"Propietari fons d'inversió — màxim risc de pressió":v==="Una empresa o promotora immobiliària"?"Propietari empresarial, risc de pressió immobiliària":v==="No ho sabem / no ens ho han dit"?"Desconèixer el propietari és en sí un senyal d'alarma":null },
  { id:"fi_contracte",    nom:"Fi del contracte",     pes:2.0,
    pesos:{"Menys d'1 any":3,"1–2 anys":2,"3–5 anys":1,"Més de 5 anys":0,"No ho sé":1},
    explica: v => v==="Menys d'1 any"?"⚠️ Contracte acaba en menys d'1 any — URGENT":v==="1–2 anys"?"Contracte acaba aviat, cal actuar":null },
  { id:"lloguer_percepcio",nom:"Preu del lloguer",    pes:1.3,
    pesos:{"És assequible i just":0,"És alt però assumible":1,"És molt car per al que guanyem":2,"És insostenible, no podem mantenir-lo":3},
    explica: v => v==="És insostenible, no podem mantenir-lo"?"Lloguer insostenible, tancament imminent sense ajuda":v==="És molt car per al que guanyem"?"Lloguer que comprimeix la viabilitat del negoci":null },
  { id:"lloguer_pujada",  nom:"Pujada del lloguer",   pes:1.3,
    pesos:{"No, s'ha mantingut estable":0,"Sí, una mica":1,"Sí, molt (>20%)":2,"Sí, de manera abusiva":3,"No ho sé":0},
    explica: v => v==="Sí, de manera abusiva"?"Pujada abusiva del lloguer":v==="Sí, molt (>20%)"?"Pujada significativa que pressiona la viabilitat":null },
  { id:"rendibilitat",    nom:"Rendibilitat",          pes:1.3,
    pesos:{"Sí, va bé":0,"Més o menys, anem tirant":1,"Ens costa cobrir despeses":2,"Estem en pèrdues":3,"Prefereixo no dir-ho":1},
    explica: v => v==="Estem en pèrdues"?"Negoci en pèrdues":v==="Ens costa cobrir despeses"?"Marges molt ajustats":null },
  { id:"ofertes",         nom:"Pressió immobiliària",  pes:1.2,
    pesos:{"No mai":0,"Sí, alguna vegada":1,"Sí, repetidament":2,"Sí, de manera molt agressiva":3},
    explica: v => v==="Sí, de manera molt agressiva"?"Pressió immobiliària activa i agressiva":v==="Sí, repetidament"?"Interessos immobiliaris recurrents":null },
  { id:"assessorament",   nom:"Suport jurídic",        pes:0.8,
    pesos:{"No, no sabem a qui acudir":2,"No, però ens agradaria":1,"Sí, amb un advocat particular":0,"Sí, amb una associació o entitat":0,"Sí, i ens ha ajudat molt":0},
    explica: v => v==="No, no sabem a qui acudir"?"Sense accés a assessorament, molt vulnerable":null },
];

const ACCIONS = {
  BAIX: ["Incorporar al mapa de comerços saludables","Convidar a la xarxa de comerços locals","Revisió anual"],
  MITJÀ: ["Oferir assessorament legal preventiu sobre el contracte","Connectar amb xarxa de comerços locals","Explorar opcions de visibilitat i comunicació","Visita de seguiment en 3 mesos"],
  ALT: ["Derivar a assessoria jurídica especialitzada — URGENT","Contactar amb l'associació de veïns i entitats del barri","Explorar cooperativa, traspàs o relleu generacional","Documentar la història del comerç ara (entrevista, fotos)","Incorporar al programa d'atenció prioritària","Visita de seguiment en 30 dies"],
};

const URGENCIA = {
  BAIX:  { text:"Seguiment anual",   color:"#2d6a4f", bg:"#d8f3dc" },
  MITJÀ: { text:"Actuar en 3 mesos", color:"#9c5d00", bg:"#fff3cd" },
  ALT:   { text:"Actuar en 30 dies", color:"#8b1a1a", bg:"#fde8e8" },
};

function preguntesVisibles(respostes) {
  return PREGUNTES.filter(p => !p.visible || p.visible(respostes));
}

function calcularFactors(respostes) {
  return FACTORS.map(f => {
    const val = respostes[f.id];
    const punts = val && f.pesos[val] !== undefined ? f.pesos[val] : null;
    const ponderats = punts !== null ? punts * f.pes : null;
    const maxim = 3 * f.pes;
    const pct = ponderats !== null ? ponderats / maxim : null;
    return { ...f, val, punts, ponderats, maxim, pct, explicacio: val ? f.explica(val) : null };
  });
}

function calcularRisc(respostes) {
  const factors = calcularFactors(respostes);
  let total = 0, maxim = 0, n = 0;
  factors.forEach(f => {
    maxim += f.maxim;
    if (f.ponderats !== null) { total += f.ponderats; n++; }
  });
  const pct = n > 0 ? total / maxim : 0;
  const nivell = pct < 0.33 ? "BAIX" : pct < 0.62 ? "MITJÀ" : "ALT";
  const score = Math.round(pct * 100);
  const C = { BAIX:"#2d6a4f", MITJÀ:"#9c5d00", ALT:"#8b1a1a" };
  const B = { BAIX:"#d8f3dc", MITJÀ:"#fff3cd", ALT:"#fde8e8" };
  const L = { BAIX:"Risc baix", MITJÀ:"Risc mitjà", ALT:"Risc alt" };
  const D = { BAIX:"🟢", MITJÀ:"🟠", ALT:"🔴" };
  return { nivell, score, pct, factors, color:C[nivell], bg:B[nivell], label:L[nivell], dot:D[nivell] };
}

const seccions = [...new Set(PREGUNTES.map(p => p.seccio))];

// ── CSS ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  .w{background:#f4f4f6;min-height:100vh;font-family:'Barlow',sans-serif;color:#2c3e50;}
  .nav{background:#1a1a2e;height:60px;padding:0 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(0,0,0,.2);}
  .logo{font-family:'Anton',sans-serif;font-size:1rem;color:#fff;letter-spacing:.06em;}
  .logo span{color:#d4a76a;}
  .bn{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;background:#d4a76a;color:#1a1a2e;padding:5px 14px;border:none;border-radius:2px;cursor:pointer;}
  .inner{max-width:640px;margin:0 auto;padding:36px 18px 60px;}
  .tag{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:#d4a76a;border:1.5px solid #d4a76a;padding:5px 14px;display:inline-block;border-radius:2px;margin-bottom:1.2rem;}
  .h1{font-family:'Anton',sans-serif;font-size:clamp(2.6rem,8vw,4.2rem);text-transform:uppercase;line-height:.92;color:#2c3e50;margin-bottom:1.2rem;}
  .h2{font-family:'Anton',sans-serif;font-size:clamp(1.6rem,5vw,2.4rem);text-transform:uppercase;line-height:.92;color:#2c3e50;margin-bottom:1rem;}
  .lead{font-size:.92rem;font-weight:300;color:#5d6d7e;line-height:1.8;border-left:3px solid #d4a76a;padding-left:1rem;margin-bottom:2rem;}
  .card{background:#fff;border-radius:8px;padding:1.8rem;box-shadow:0 4px 24px rgba(44,62,80,.08);margin-bottom:12px;}
  .stag{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.65rem;letter-spacing:.22em;text-transform:uppercase;color:#d4a76a;display:block;margin-bottom:.5rem;}
  .lbl{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:#5d6d7e;display:block;margin-bottom:6px;}
  .inp{width:100%;background:#f4f4f6;border:1.5px solid #e0e0e5;color:#2c3e50;padding:11px 13px;font-size:.9rem;font-family:'Barlow',sans-serif;border-radius:3px;transition:border-color .2s;}
  .inp:focus{outline:none;border-color:#d4a76a;}
  .prog-wrap{margin-bottom:1.6rem;}
  .prog-seccions{display:flex;gap:4px;margin-bottom:6px;}
  .ps{flex:1;height:3px;border-radius:2px;background:#e0e0e5;transition:background .3s;}
  .ps.on{background:#d4a76a;}
  .prog-label{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:#d4a76a;}
  .ql{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.95rem;letter-spacing:.02em;color:#2c3e50;margin-bottom:.8rem;display:block;line-height:1.3;}
  .opt{display:flex;align-items:center;gap:10px;padding:10px 13px;margin-bottom:5px;border:1.5px solid #e0e0e5;border-radius:3px;cursor:pointer;font-size:.88rem;color:#5d6d7e;background:#f4f4f6;transition:all .15s;user-select:none;}
  .opt:hover{border-color:#d4a76a;color:#2c3e50;background:#fffaf5;}
  .opt.sel{border-color:#d4a76a;background:#fffaf5;color:#2c3e50;font-weight:500;}
  .rdot{width:15px;height:15px;border-radius:50%;border:1.5px solid #c0c0c8;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .opt.sel .rdot{background:#d4a76a;border-color:#d4a76a;}
  .rdot-in{width:6px;height:6px;border-radius:50%;background:#fff;}
  .sq{width:15px;height:15px;border-radius:2px;border:1.5px solid #c0c0c8;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;color:transparent;}
  .opt.sel .sq{background:#d4a76a;border-color:#d4a76a;color:#1a1a2e;}
  .ta{width:100%;background:#f4f4f6;border:1.5px solid #e0e0e5;color:#2c3e50;padding:11px 13px;font-size:.88rem;font-family:'Barlow',sans-serif;border-radius:3px;resize:vertical;min-height:90px;}
  .ta:focus{outline:none;border-color:#d4a76a;}
  .div{height:1px;background:#f0f0f3;margin:1.2rem 0;}
  .cond-aviso{background:#fffaf5;border-left:3px solid #d4a76a;padding:8px 12px;border-radius:0 3px 3px 0;font-size:.8rem;color:#9c5d00;margin-bottom:10px;font-style:italic;}
  .bp{background:#2c3e50;color:#fff;padding:13px 18px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;border:2px solid #2c3e50;cursor:pointer;border-radius:2px;transition:all .2s;}
  .bp:hover{background:#d4a76a;border-color:#d4a76a;color:#1a1a2e;}
  .bg{background:#d4a76a;color:#1a1a2e;padding:13px 18px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;border:2px solid #d4a76a;cursor:pointer;border-radius:2px;}
  .bgh{background:transparent;color:#2c3e50;padding:13px 18px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;border:2px solid #e0e0e5;cursor:pointer;border-radius:2px;transition:all .2s;}
  .bgh:hover{border-color:#2c3e50;background:#2c3e50;color:#fff;}
  .bo{background:transparent;color:#1a1a2e;padding:9px 16px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;border:1.5px solid #1a1a2e;cursor:pointer;border-radius:2px;transition:all .2s;}
  .bo:hover{background:#1a1a2e;color:#fff;}
  .fbar-bg{height:6px;background:#e0e0e5;border-radius:3px;overflow:hidden;margin-top:4px;}
  .fbar{height:100%;border-radius:3px;transition:width .6s ease;}
  .risc-btn{flex:1;padding:13px 6px;border-radius:4px;border:2px solid transparent;cursor:pointer;text-align:center;transition:all .2s;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.1em;text-transform:uppercase;}
  .risc-btn:hover{transform:translateY(-2px);}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:1.2rem;}
  .stat{background:#fff;border-radius:6px;padding:1rem;text-align:center;box-shadow:0 2px 8px rgba(44,62,80,.06);}
  .stat-n{font-family:'Anton',sans-serif;font-size:2rem;line-height:1;}
  .stat-l{font-family:'Barlow Condensed',sans-serif;font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;color:#5d6d7e;margin-top:3px;}
  .pill{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;padding:3px 10px;border-radius:2px;white-space:nowrap;}
  .row-fitxa{background:#fff;border:1.5px solid #e0e0e5;border-radius:6px;padding:1.1rem 1.3rem;margin-bottom:7px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .2s;box-shadow:0 2px 8px rgba(44,62,80,.05);}
  .row-fitxa:hover{border-color:#d4a76a;box-shadow:0 4px 20px rgba(44,62,80,.1);transform:translateY(-1px);}
  .urg{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:2px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;}
  .score-wrap{position:relative;width:88px;height:88px;flex-shrink:0;}
  .score-inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
`;

// ── COMPONENT ──────────────────────────────────────────────────────────────
export default function App() {
  const [pas, setPas] = useState("inici");
  const [nom, setNom] = useState(""); const [adreca, setAdreca] = useState(""); const [barri, setBarri] = useState("");
  const [seccioIdx, setSeccioIdx] = useState(0);
  const [respostes, setRespostes] = useState({});
  const [fitxes, setFitxes] = useState([]);
  const [fitxaVista, setFitxaVista] = useState(null);
  const [risc_override, setRiscOverride] = useState(null);
  const [notes_diag, setNotesDiag] = useState("");
  const [accions_custom, setAccionsCustom] = useState([]);
  const [estat, setEstat] = useState("Nou");
  const [data_revisio, setDataRevisio] = useState("");
  const [geo, setGeo] = useState(null);
  const [geo_loading, setGeoLoading] = useState(false);

  // Preguntes visibles donades les respostes actuals
  const visibles = preguntesVisibles(respostes);
  const seccionesActives = [...new Set(visibles.map(p => p.seccio))];
  const seccioNom = seccionesActives[seccioIdx];
  const pregSeccio = visibles.filter(p => p.seccio === seccioNom);
  const ultimaFitxa = fitxes[fitxes.length - 1];

  function resp(id, val) { setRespostes(r => ({...r, [id]: val})); }
  function respM(id, val) {
    setRespostes(r => {
      const a = r[id] || [];
      return {...r, [id]: a.includes(val) ? a.filter(v => v !== val) : [...a, val]};
    });
  }

  // Netejar respostes de preguntes que ja no són visibles
  function avancarSeccio() {
    const novisibles = PREGUNTES.filter(p => p.visible && !p.visible(respostes)).map(p => p.id);
    setRespostes(r => { const nr={...r}; novisibles.forEach(id=>delete nr[id]); return nr; });
    setSeccioIdx(s => s + 1);
  }

  function iniciarDiagnosi() {
    const risc = calcularRisc(respostes);
    setRiscOverride(null); setNotesDiag("");
    setAccionsCustom([...ACCIONS[risc.nivell]]);
    setPas("diagnosi");
  }

  function guardarFitxa() {
    const risc_auto = calcularRisc(respostes);
    const nf = risc_override || risc_auto.nivell;
    const C = {BAIX:"#2d6a4f",MITJÀ:"#9c5d00",ALT:"#8b1a1a"};
    const B = {BAIX:"#d8f3dc",MITJÀ:"#fff3cd",ALT:"#fde8e8"};
    const L = {BAIX:"Risc baix",MITJÀ:"Risc mitjà",ALT:"Risc alt"};
    const D = {BAIX:"🟢",MITJÀ:"🟠",ALT:"🔴"};
    const risc_final = {
      ...risc_auto, nivell:nf, color:C[nf], bg:B[nf], label:L[nf], dot:D[nf],
      override: risc_override && risc_override !== risc_auto.nivell,
      risc_auto: risc_auto.nivell,
    };
    const fitxa = {
      id:Date.now(), nom, adreca, barri, respostes: {...respostes},
      risc:risc_final, notes_diag, accions:accions_custom,
      estat, data_revisio, geo,
      data:new Date().toLocaleDateString("ca-ES"),
      num:`ATQ-${String(fitxes.length+1).padStart(3,"0")}`,
    };
    setFitxes(f => [...f, fitxa]);
    setPas("resultat");
  }

  function capturarGeo() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setGeo({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }); setGeoLoading(false); },
      ()  => { setGeoLoading(false); }
    );
  }

  function novaFitxa() {
    setNom(""); setAdreca(""); setBarri(""); setRespostes({});
    setSeccioIdx(0); setRiscOverride(null); setNotesDiag(""); setAccionsCustom([]);
    setEstat("Nou"); setDataRevisio(""); setGeo(null);
    setPas("formulari");
  }

  function exportCSV() {
    const cols = ["Num","Nom","Adreça","Barri","Lat","Lng","Data","Estat","Revisió","Risc auto","Risc final","Modificat","Urgència",...PREGUNTES.map(p=>p.id)];
    const rows = fitxes.map(f => {
      const urg = URGENCIA[f.risc.nivell];
      const base = [f.num,f.nom,f.adreca,f.barri,f.geo?.lat||"",f.geo?.lng||"",f.data,f.estat||"Nou",f.data_revisio||"",f.risc.risc_auto||f.risc.nivell,f.risc.nivell,f.risc.override?"Sí":"No",urg.text];
      const rs = PREGUNTES.map(p => { const v=f.respostes[p.id]; return Array.isArray(v)?v.join("|"):(v||""); });
      return [...base,...rs].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";");
    });
    const blob = new Blob(["\uFEFF"+cols.join(";")+"\n"+rows.join("\n")],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="atq-diagnostics.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  const risc_calc = calcularRisc(respostes);

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="w">
        <nav className="nav">
          <div className="logo"><span>ABANS</span> QUE TANQUI</div>
          {fitxes.length > 0 && pas !== "llista" && (
            <button className="bn" onClick={() => setPas("llista")}>{fitxes.length} fitxa{fitxes.length>1?"es":""} →</button>
          )}
        </nav>
        <div className="inner">

          {/* ── INICI ── */}
          {pas === "inici" && (
            <div>
              <div style={{marginTop:16,marginBottom:40}}>
                <span className="tag">Diagnosi de risc · v4</span>
                <h1 className="h1">Diagnosi<br/>híbrida</h1>
                <p className="lead">Les preguntes s'adapten a les respostes. L'algoritme proposa el risc, tu confirmes amb el criteri humà.</p>
              </div>
              <div className="card" style={{marginBottom:16}}>
                <span className="stag">Novetats v4</span>
                {[["🔀","Preguntes adaptatives","Si el local és en propietat, no apareixen les preguntes de lloguer"],
                  ["🏢","Qui és el propietari","Particular, empresa, fons d'inversió o Ajuntament"],
                  ["📣","Origen de les ofertes","D'on vénen les pressions: promotora, fons, cadena..."],
                  ["⚖️","Assessorament jurídic","Si han intentat negociar i si tenen suport legal"],
                ].map(([ic,t,d])=>(
                  <div key={t} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:"1px solid #f0f0f3"}}>
                    <span style={{fontSize:18,minWidth:24}}>{ic}</span>
                    <div>
                      <div style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:".85rem",letterSpacing:".06em",textTransform:"uppercase",color:"#2c3e50",marginBottom:2}}>{t}</div>
                      <div style={{fontSize:".8rem",color:"#5d6d7e"}}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="bp" onClick={() => setPas("formulari")} style={{width:"100%"}}>Iniciar diagnosi →</button>
            </div>
          )}

          {/* ── FORMULARI ── */}
          {pas === "formulari" && (
            <div>
              <span className="tag">Nova fitxa</span>
              <h2 className="h2">Fitxa de camp</h2>

              {seccioIdx === 0 && (
                <div className="card" style={{marginBottom:14}}>
                  <span className="stag">Identificació</span>
                  <div style={{height:8}}/>
                  {[["Nom del comerç",nom,setNom],["Adreça",adreca,setAdreca],["Barri",barri,setBarri]].map(([l,v,s])=>(
                    <div key={l} style={{marginBottom:10}}>
                      <label className="lbl">{l}</label>
                      <input className="inp" value={v} onChange={e=>s(e.target.value)}/>
                    </div>
                  ))}
                  {/* Geolocalització */}
                  <div style={{marginTop:4}}>
                    <label className="lbl">Ubicació GPS</label>
                    {geo ? (
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{background:"#d8f3dc",color:"#2d6a4f",padding:"6px 12px",borderRadius:3,fontSize:".8rem",fontFamily:"Barlow Condensed,sans-serif",fontWeight:700}}>
                          📍 {geo.lat}, {geo.lng}
                        </span>
                        <button onClick={()=>setGeo(null)} style={{background:"none",border:"none",color:"#ccc",cursor:"pointer",fontSize:14}}>×</button>
                      </div>
                    ) : (
                      <button onClick={capturarGeo} className="bgh" style={{padding:"9px 16px",fontSize:".76rem",letterSpacing:".1em"}} disabled={geo_loading}>
                        {geo_loading ? "Obtenint ubicació..." : "📍 Capturar coordenades"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Progrés */}
              <div className="prog-wrap">
                <div className="prog-seccions">
                  {seccionesActives.map((s,i) => <div key={s} className={`ps${i<=seccioIdx?" on":""}`}/>)}
                </div>
                <div className="prog-label">{seccioIdx+1} / {seccionesActives.length} · {seccioNom}</div>
              </div>

              <div className="card">
                <span className="stag">{seccioNom}</span>
                <div style={{height:8}}/>
                {pregSeccio.map((p, qi) => (
                  <div key={p.id}>
                    {qi > 0 && <div className="div"/>}
                    {/* Avís condicional */}
                    {p.id === "successio" && respostes.futur && respostes.futur !== "Continuarà molts anys" && (
                      <div className="cond-aviso">Has indicat que el comerç no continuarà indefinidament. Qui podria agafar el relleu?</div>
                    )}
                    {p.id === "propietat_qui" && (
                      <div className="cond-aviso">El local és de lloguer. Saber qui és el propietari és clau per avaluar el risc.</div>
                    )}
                    {p.id === "ofertes_qui" && (
                      <div className="cond-aviso">Heu rebut ofertes. D'on venien? Això ens ajuda a entendre el tipus de pressió.</div>
                    )}

                    <label className="ql">{p.pregunta}</label>

                    {p.tipus === "opcions" && p.opcions.map(op => (
                      <div key={op} className={`opt${respostes[p.id]===op?" sel":""}`} onClick={()=>resp(p.id,op)}>
                        <div className="rdot"><div className="rdot-in"/></div>{op}
                      </div>
                    ))}
                    {p.tipus === "opcions_multiple" && p.opcions.map(op => {
                      const sel = (respostes[p.id]||[]).includes(op);
                      return (
                        <div key={op} className={`opt${sel?" sel":""}`} onClick={()=>respM(p.id,op)}>
                          <div className="sq">{sel?"✓":""}</div>{op}
                        </div>
                      );
                    })}
                    {p.tipus === "text" && (
                      <textarea className="ta" value={respostes[p.id]||""} onChange={e=>resp(p.id,e.target.value)} placeholder="Escriu aquí..."/>
                    )}
                  </div>
                ))}
              </div>

              <div style={{display:"flex",gap:10,marginTop:12}}>
                {seccioIdx > 0 && <button className="bgh" onClick={()=>setSeccioIdx(s=>s-1)} style={{flex:1}}>← Anterior</button>}
                {seccioIdx < seccionesActives.length - 1
                  ? <button className="bp" onClick={avancarSeccio} style={{flex:2}}>Continuar →</button>
                  : <button className="bg" onClick={iniciarDiagnosi} style={{flex:2}}>Calcular diagnosi ↗</button>
                }
              </div>
            </div>
          )}

          {/* ── DIAGNOSI HÍBRIDA ── */}
          {pas === "diagnosi" && (
            <div>
              <span className="tag">Diagnosi</span>
              <h2 className="h2">Proposta<br/>de l'algoritme</h2>

              {/* Score + resum */}
              <div className="card" style={{marginBottom:12}}>
                <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
                  <div className="score-wrap">
                    <svg width="88" height="88" viewBox="0 0 88 88">
                      <circle cx="44" cy="44" r="37" fill="none" stroke="#e0e0e5" strokeWidth="7"/>
                      <circle cx="44" cy="44" r="37" fill="none" stroke={risc_calc.color} strokeWidth="7"
                        strokeDasharray={`${risc_calc.pct*232.5} 232.5`} strokeLinecap="round"
                        transform="rotate(-90 44 44)" style={{transition:"stroke-dasharray .8s ease"}}/>
                    </svg>
                    <div className="score-inner">
                      <span style={{fontFamily:"Anton,sans-serif",fontSize:"1.4rem",color:risc_calc.color,lineHeight:1}}>{risc_calc.score}</span>
                      <span style={{fontFamily:"Barlow Condensed,sans-serif",fontSize:".5rem",letterSpacing:"1px",color:"#bbb",textTransform:"uppercase"}}>/100</span>
                    </div>
                  </div>
                  <div style={{flex:1}}>
                    <span className="stag">Proposta automàtica</span>
                    <div style={{fontFamily:"Anton,sans-serif",fontSize:"1.7rem",textTransform:"uppercase",color:risc_calc.color,lineHeight:1,marginBottom:6}}>
                      {risc_calc.dot} {risc_calc.label.toUpperCase()}
                    </div>
                    {nom && <div style={{fontFamily:"Barlow Condensed,sans-serif",fontSize:".82rem",color:"#2c3e50",fontWeight:700}}>{nom}</div>}
                    {barri && <div style={{fontSize:".78rem",color:"#5d6d7e"}}>{barri}</div>}
                    <div style={{marginTop:10}}>
                      <span className="urg" style={{background:risc_calc.bg,color:risc_calc.color}}>
                        ⏱ {URGENCIA[risc_calc.nivell].text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Factors */}
              <div className="card" style={{marginBottom:12}}>
                <span className="stag">Factors analitzats</span>
                <div style={{height:8}}/>
                {risc_calc.factors.filter(f => f.val && f.pct !== null).map(f => {
                  const pct = f.pct;
                  const fc = pct<0.34?"#2d6a4f":pct<0.67?"#9c5d00":"#8b1a1a";
                  return (
                    <div key={f.id} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                        <span style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:".76rem",letterSpacing:".08em",textTransform:"uppercase",color:"#2c3e50"}}>{f.nom}</span>
                        <span style={{fontFamily:"Anton,sans-serif",fontSize:".85rem",color:fc}}>{Math.round(pct*100)}<span style={{fontSize:".55rem",color:"#ccc"}}>/100</span></span>
                      </div>
                      <div className="fbar-bg"><div className="fbar" style={{width:`${pct*100}%`,background:fc}}/></div>
                      <div style={{fontSize:".74rem",color:"#5d6d7e",marginTop:3}}>{f.val}</div>
                      {f.explicacio && <div style={{fontSize:".73rem",color:fc,marginTop:2,fontStyle:"italic"}}>↳ {f.explicacio}</div>}
                    </div>
                  );
                })}
              </div>

              {/* Confirmar o modificar */}
              <div className="card" style={{marginBottom:12,border:"2px solid #e0e0e5"}}>
                <span className="stag">La teva decisió final</span>
                <div style={{fontSize:".86rem",color:"#5d6d7e",marginBottom:12,marginTop:4}}>
                  L'algoritme proposa <strong style={{color:risc_calc.color}}>{risc_calc.label}</strong>. Confirmes o ho ajustes?
                </div>
                <div style={{display:"flex",gap:8,marginBottom:14}}>
                  {["BAIX","MITJÀ","ALT"].map(n => {
                    const C={BAIX:"#2d6a4f",MITJÀ:"#9c5d00",ALT:"#8b1a1a"};
                    const B={BAIX:"#d8f3dc",MITJÀ:"#fff3cd",ALT:"#fde8e8"};
                    const D={BAIX:"🟢",MITJÀ:"🟠",ALT:"🔴"};
                    const sel = (risc_override||risc_calc.nivell) === n;
                    return (
                      <button key={n} className="risc-btn"
                        onClick={()=>{setRiscOverride(n===risc_calc.nivell?null:n); setAccionsCustom([...ACCIONS[n]]);}}
                        style={{background:sel?B[n]:"#f4f4f6",color:sel?C[n]:"#aaa",borderColor:sel?C[n]:"#e0e0e5",fontWeight:sel?800:600}}>
                        {D[n]} {n}
                        {n===risc_calc.nivell&&<div style={{fontSize:".55rem",marginTop:2,opacity:.7}}>proposta</div>}
                      </button>
                    );
                  })}
                </div>
                {risc_override && risc_override !== risc_calc.nivell && (
                  <div style={{background:"#fff8e1",border:"1px solid #d4a76a",borderRadius:3,padding:"8px 12px",fontSize:".8rem",color:"#9c5d00",marginBottom:12}}>
                    ✏️ Has canviat la proposta de <strong>{risc_calc.label}</strong> a <strong>Risc {risc_override.toLowerCase()}</strong>. Explica el motiu a les notes.
                  </div>
                )}
                <label className="lbl">Notes del diagnosi</label>
                <textarea className="ta" value={notes_diag} onChange={e=>setNotesDiag(e.target.value)}
                  placeholder="Context que l'algoritme no capta: actitud del propietari, estat del local, impressió general..."/>
              </div>

              {/* Accions */}
              <div className="card" style={{marginBottom:12}}>
                <span className="stag">Accions recomanades</span>
                <div style={{height:6}}/>
                {accions_custom.map((acc,i) => (
                  <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:7}}>
                    <span style={{fontFamily:"Anton,sans-serif",fontSize:".72rem",color:"#d4a76a",minWidth:22}}>{String(i+1).padStart(2,"0")}</span>
                    <input className="inp" value={acc} onChange={e=>{const a=[...accions_custom];a[i]=e.target.value;setAccionsCustom(a);}} style={{flex:1,fontSize:".82rem",padding:"8px 10px"}}/>
                    <button onClick={()=>setAccionsCustom(a=>a.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:16,padding:"0 4px"}}>×</button>
                  </div>
                ))}
                <button onClick={()=>setAccionsCustom(a=>[...a,""])}
                  style={{background:"none",border:"1.5px dashed #d4a76a",color:"#d4a76a",padding:"7px 14px",borderRadius:3,cursor:"pointer",fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:".72rem",letterSpacing:".12em",textTransform:"uppercase",marginTop:4}}>
                  + Afegir acció
                </button>
              </div>

              {/* Estat i seguiment */}
              <div className="card" style={{marginBottom:12}}>
                <span className="stag">Estat del cas i seguiment</span>
                <div style={{height:8}}/>
                <label className="lbl">Estat actual</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                  {["Nou","En seguiment","Derivat a advocat","Derivat a xarxa","Resolt","Tancat"].map(e=>(
                    <button key={e} onClick={()=>setEstat(e)}
                      style={{padding:"7px 14px",borderRadius:3,border:`1.5px solid ${estat===e?"#1a1a2e":"#e0e0e5"}`,
                        background:estat===e?"#1a1a2e":"#f4f4f6",color:estat===e?"#d4a76a":"#5d6d7e",
                        fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:".72rem",
                        letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer"}}>
                      {e}
                    </button>
                  ))}
                </div>
                <label className="lbl">Data de propera revisió</label>
                <input type="date" className="inp" value={data_revisio} onChange={e=>setDataRevisio(e.target.value)}/>
              </div>

              <div style={{display:"flex",gap:10}}>
                <button className="bgh" onClick={()=>setPas("formulari")} style={{flex:1}}>← Tornar</button>
                <button className="bg" onClick={guardarFitxa} style={{flex:2}}>Guardar fitxa ✓</button>
              </div>
            </div>
          )}

          {/* ── RESULTAT ── */}
          {pas === "resultat" && ultimaFitxa && (() => {
            const r = ultimaFitxa.risc;
            return (
              <div>
                <div className="card" style={{textAlign:"center",padding:"2.5rem 2rem",marginBottom:12}}>
                  <span style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:800,fontSize:".7rem",letterSpacing:".2em",textTransform:"uppercase",display:"inline-block",padding:"5px 16px",borderRadius:2,background:r.bg,color:r.color,marginBottom:12}}>{r.dot} {r.label}</span>
                  {r.override && <div style={{fontSize:".72rem",color:"#d4a76a",marginBottom:8}}>✏️ Diagnosi modificada manualment</div>}
                  <div style={{fontFamily:"Anton,sans-serif",fontSize:"1.6rem",textTransform:"uppercase",color:"#2c3e50",marginBottom:4}}>{ultimaFitxa.nom||"Comerç"}</div>
                  <div style={{fontSize:".8rem",color:"#5d6d7e"}}>{ultimaFitxa.barri&&`${ultimaFitxa.barri} · `}{ultimaFitxa.num} · {ultimaFitxa.data}</div>
                  <div style={{marginTop:12}}><span className="urg" style={{background:r.bg,color:r.color}}>⏱ {URGENCIA[r.nivell].text}</span></div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="bg" onClick={novaFitxa} style={{flex:1}}>+ Nova fitxa</button>
                  <button className="bgh" onClick={()=>setPas("llista")} style={{flex:1}}>Veure totes →</button>
                </div>
              </div>
            );
          })()}

          {/* ── LLISTA ── */}
          {pas === "llista" && (
            <div>
              <span className="tag">Resum de camp</span>
              <h2 className="h2">{fitxes.length} comerç{fitxes.length!==1?"os":""}</h2>
              <div className="stats">
                {[["🟢","BAIX","#2d6a4f","#d8f3dc"],["🟠","MITJÀ","#9c5d00","#fff3cd"],["🔴","ALT","#8b1a1a","#fde8e8"]].map(([d,n,c,b])=>{
                  const cnt=fitxes.filter(f=>f.risc.nivell===n).length;
                  return <div className="stat" key={n} style={{borderTop:`3px solid ${c}`}}><div className="stat-n" style={{color:c}}>{cnt}</div><div className="stat-l">{d} {n}</div></div>;
                })}
              </div>
              <div style={{background:"#fff",border:"1px solid #e0e0e5",borderRadius:6,padding:".9rem 1.2rem",marginBottom:14,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:".65rem",letterSpacing:".16em",textTransform:"uppercase",color:"#5d6d7e",flex:1}}>Exportar ({fitxes.length})</span>
                <button className="bo" onClick={exportCSV}>📄 CSV per al mapa</button>
              </div>
              {fitxes.map(f=>(
                <div key={f.id} className="row-fitxa" onClick={()=>{setFitxaVista(f);setPas("detall");}}>
                  <div>
                    <div style={{fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:"1rem",letterSpacing:".04em",textTransform:"uppercase",color:"#2c3e50",marginBottom:2}}>{f.nom||"Sense nom"}</div>
                    <div style={{fontSize:".76rem",color:"#5d6d7e"}}>{f.barri&&`${f.barri} · `}{f.num} · {f.data}</div>
                    {f.data_revisio && <div style={{fontSize:".72rem",color:"#d4a76a",marginTop:2}}>📅 Revisió: {new Date(f.data_revisio).toLocaleDateString("ca-ES")}</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <span className="pill" style={{background:f.risc.bg,color:f.risc.color}}>{f.risc.dot} {f.risc.nivell}</span>
                    {f.risc.override&&<span style={{fontSize:".6rem",color:"#d4a76a"}}>✏️ modificat</span>}
                  </div>
                </div>
              ))}
              <button className="bp" onClick={novaFitxa} style={{width:"100%",marginTop:14}}>+ Nova fitxa</button>
            </div>
          )}

          {/* ── DETALL ── */}
          {pas === "detall" && fitxaVista && (
            <div>
              <button onClick={()=>setPas("llista")} style={{background:"none",border:"none",cursor:"pointer",color:"#5d6d7e",fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:".72rem",letterSpacing:".14em",textTransform:"uppercase",marginBottom:20,padding:0}}>← Tornar</button>
              <div className="card" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <span className="stag">{fitxaVista.barri} · {fitxaVista.num}</span>
                  <div style={{fontFamily:"Anton,sans-serif",fontSize:"1.6rem",textTransform:"uppercase",color:"#2c3e50",lineHeight:1}}>{fitxaVista.nom||"Sense nom"}</div>
                  <div style={{fontSize:".8rem",color:"#5d6d7e",marginTop:4}}>{fitxaVista.adreca}</div>
                  {fitxaVista.geo && <div style={{fontSize:".75rem",color:"#5d6d7e",marginTop:3}}>📍 {fitxaVista.geo.lat}, {fitxaVista.geo.lng}</div>}
                  <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                    <span className="urg" style={{background:fitxaVista.risc.bg,color:fitxaVista.risc.color}}>⏱ {URGENCIA[fitxaVista.risc.nivell].text}</span>
                    <span style={{background:"#1a1a2e",color:"#d4a76a",padding:"4px 10px",borderRadius:2,fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,fontSize:".65rem",letterSpacing:".12em",textTransform:"uppercase"}}>{fitxaVista.estat||"Nou"}</span>
                    {fitxaVista.data_revisio && <span style={{fontSize:".75rem",color:"#d4a76a"}}>📅 {new Date(fitxaVista.data_revisio).toLocaleDateString("ca-ES")}</span>}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <span className="pill" style={{background:fitxaVista.risc.bg,color:fitxaVista.risc.color,fontSize:".7rem",padding:"5px 12px"}}>{fitxaVista.risc.dot} {fitxaVista.risc.label.toUpperCase()}</span>
                  {fitxaVista.risc.override&&<div style={{fontSize:".65rem",color:"#d4a76a",marginTop:4}}>✏️ modificat · auto: {fitxaVista.risc.risc_auto}</div>}
                </div>
              </div>

              {fitxaVista.notes_diag&&(
                <div className="card" style={{marginBottom:12,borderLeft:"4px solid #d4a76a"}}>
                  <span className="stag">Notes del diagnosi</span>
                  <p style={{fontSize:".88rem",color:"#2c3e50",lineHeight:1.6,fontStyle:"italic"}}>{fitxaVista.notes_diag}</p>
                </div>
              )}

              {fitxaVista.accions?.length>0&&(
                <div className="card" style={{marginBottom:12}}>
                  <span className="stag">Accions</span>
                  {fitxaVista.accions.map((acc,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #f0f0f3"}}>
                      <span style={{fontFamily:"Anton,sans-serif",fontSize:".72rem",color:"#d4a76a",minWidth:22}}>{String(i+1).padStart(2,"0")}</span>
                      <span style={{fontSize:".86rem",color:"#2c3e50"}}>{acc}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="card">
                <span className="stag">Respostes</span>
                {PREGUNTES.filter(p=>fitxaVista.respostes[p.id]).map((p,i)=>(
                  <div key={p.id}>
                    {i>0&&<div className="div"/>}
                    <div style={{fontSize:".64rem",fontFamily:"Barlow Condensed,sans-serif",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:"#d4a76a",marginBottom:4}}>{p.pregunta}</div>
                    <div style={{fontSize:".88rem",color:"#2c3e50"}}>{Array.isArray(fitxaVista.respostes[p.id])?fitxaVista.respostes[p.id].join(" · "):fitxaVista.respostes[p.id]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
