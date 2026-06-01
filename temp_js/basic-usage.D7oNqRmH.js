import{u as A}from"./data.DEADKj9o.js";import{v as L}from"./vue-i18n.cjs.BGk_20ct.js";import{_ as B}from"./base-checkbox.vue_vue_type_script_setup_true_lang.Say6JFmC.js";import{h as D,b as q}from"./index.SzTuC4MQ.js";import{Y as S,aw as C,z as T,o as g,c as M,g as W,A as k,f as G,a as U,d as z,u as I,ar as N,al as V}from"./runtime-core.esm-bundler.NpIwd_Or.js";import{_ as w}from"./plugin-vue_export-helper.DlAUqK2U.js";import"./vendor-matter.TGoIE_ae.js";import"./runtime-dom.esm-bundler.CTR-Lx7i.js";import"./index.C3IFlN-c.js";const H=2.2,F=`#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,j=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform float uTime;
uniform vec2  uRes;
uniform float uDpr;
uniform float uPieceSpeed;

/* ---------- utils ---------- */
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for(int i=0;i<4;i++){
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a){
  float s = sin(a), c = cos(a);
  return mat2(c,-s,s,c);
}

/* ---------- Voronoi: 1st & 2nd nearest cell IDs ---------- */
void voronoi2(vec2 x, out vec2 id1, out vec2 id2, out float d1, out float d2){
  vec2 n = floor(x);
  vec2 f = fract(x);
  d1 = 1e9; d2 = 1e9;
  id1 = vec2(0.0); id2 = vec2(0.0);

  for(int j=-1;j<=1;j++){
    for(int i=-1;i<=1;i++){
      vec2 g = vec2(float(i), float(j));
      vec2 id = n + g;
      vec2 o = hash22(id);
      vec2 r = g + o - f;
      float d = dot(r,r);
      if(d < d1){
        d2 = d1; id2 = id1;
        d1 = d;  id1 = id;
      }else if(d < d2){
        d2 = d;  id2 = id;
      }
    }
  }
  d1 = sqrt(d1);
  d2 = sqrt(d2);
}

/* ---------- piecewise motion (rigid per cell) ---------- */
vec2 cellMove(vec2 id, float tp, float ampMul, float freqMul){
  float h  = hash12(id);
  float h2 = hash12(id + vec2(7.3, 2.1));
  float ang = h * 6.2831853;
  vec2 dir = vec2(cos(ang), sin(ang));

  float freq  = mix(0.10, 0.35, h2) * freqMul;
  float phase = h * 6.2831853;

  // 基礎位移幅度（再乘 ampMul）
  float amp = mix(0.020, 0.095, hash12(id + vec2(3.9, 9.2))) * ampMul;

  float gust = smoothstep(0.55, 0.95, noise(vec2(tp*0.08, h*7.0)));
  gust = gust*gust;

  float s1 = sin(tp*freq + phase);
  float s2 = sin(tp*(freq*1.9) + phase*1.7) * 0.35;

  return dir * (s1 + s2) * amp * (0.8 + 0.7*gust);
}

float cellRot(vec2 id, float tp, float rotMul, float freqMul){
  float h = hash12(id + vec2(5.4, 1.7));
  float freq = mix(0.10, 0.28, hash12(id + vec2(9.1, 4.2))) * freqMul;
  float amp = mix(-1.0, 1.0, h) * 0.06 * rotMul;
  return sin(tp*freq + h*6.2831853) * amp;
}

vec2 pieceCenter(vec2 id, float cellScale){
  return (id + hash22(id)) / cellScale;
}

vec2 applyPiece(vec2 pos, vec2 id, float cellScale, float tp, float ampMul, float rotMul, float freqMul){
  vec2 c = pieceCenter(id, cellScale);
  vec2 rel = pos - c;
  rel = rot(cellRot(id, tp, rotMul, freqMul)) * rel;
  return c + rel + cellMove(id, tp, ampMul, freqMul);
}

/* ---------- one canopy layer hole ---------- */
float layerHole(
  vec2 p, vec2 lightDir,
  float t, float tp,
  float cellScale,
  vec2 seed,
  float ampMul, float rotMul, float freqMul,
  float detailScale,
  float microStrength,
  float layerStrength
){
  // 投影方向一致，但每層用 seed 讓分片圖樣不同（像多張重疊）
  vec2 base = (p + lightDir * 0.35) + seed;

  vec2 id1, id2; float d1, d2;
  voronoi2(base * cellScale, id1, id2, d1, d2);

  float edge = d2 - d1;
  float blendWidth = 0.10;
  float w = 0.5 + 0.5 * smoothstep(0.0, blendWidth, edge);

  // 分片交錯只看 tp（加速）
  vec2 p1 = applyPiece(base, id1, cellScale, tp, ampMul, rotMul, freqMul);
  vec2 p2 = applyPiece(base, id2, cellScale, tp, ampMul, rotMul, freqMul);
  vec2 projP = mix(p2, p1, w);

  // 葉影細碎（閃爍維持原速，用 t）
  vec2 q = rot(0.25) * (projP * detailScale);

  float n1 = fbm(q + vec2(0.0, t*0.12));
  float n2 = fbm(q*1.8 - vec2(t*0.08, 0.0));
  float canopy = mix(n1, n2, 0.55);

  // 光點變多：門檻下修 + gamma
  float hole = smoothstep(0.48, 0.70, canopy);
  hole = pow(hole, 0.80);

  // 微亮點層（仍用 t）
  float micro = fbm(q*9.0 + vec2(t*0.25, -t*0.18));
  micro = smoothstep(0.62, 0.86, micro) * microStrength;
  hole = clamp(hole + micro, 0.0, 1.0);

  // 邊緣細化：跟著分片移動（tp）
  vec2 mv = mix(cellMove(id2, tp, ampMul, freqMul), cellMove(id1, tp, ampMul, freqMul), w);
  float edgeNoise = fbm(q*3.5 + mv*2.0);
  hole = clamp(hole + (edgeNoise - 0.5) * 0.22, 0.0, 1.0);

  return hole * layerStrength;
}

/* ---------- combine multiple layers (overlay feel) ---------- */
float leafHole(vec2 p, float t, float tp, vec2 lightDir){
  // 三層：大塊 / 中塊 / 小塊（像多張畫面重疊）
  float hA = layerHole(
    p, lightDir, t, tp*0.85,
    1.25,                // cellScale：大塊葉團
    vec2(0.17, -0.11),    // seed
    1.15, 1.00, 0.90,     // ampMul rotMul freqMul
    1.0,                 // detailScale（光點偏大）
    0.14,                // microStrength
    0.78                 // layerStrength
  );

  float hB = layerHole(
    p, lightDir, t, tp*1.00,
    1.85,                // 中塊
    vec2(-0.23, 0.19),
    1.00, 0.95, 1.05,
    6.2,                 // 原本尺度
    0.16,
    0.72
  );

  float hC = layerHole(
    p, lightDir, t, tp*1.30,
    2.55,                // 小塊（更碎、更多交錯）
    vec2(0.31, 0.27),
    0.85, 0.70, 1.25,
    7.0,                 // 更細碎
    0.12,
    0.60
  );

  // 疊加：像多層遮罩重疊（不是單純相加爆白）
  float hole = 1.0 - (1.0 - clamp(hA,0.0,1.0)) * (1.0 - clamp(hB,0.0,1.0)) * (1.0 - clamp(hC,0.0,1.0));
  return clamp(hole, 0.0, 1.0);
}

void main(){
  vec2 frag = vUv * uRes;
  vec2 p = (frag - 0.5*uRes) / min(uRes.x, uRes.y);

  float t  = uTime;                // 光點閃爍維持原速
  float tp = uTime * uPieceSpeed;  // 只有分片交錯加速

  vec2 lightDir = normalize(vec2(-0.6, -0.8));

  // 半影：取樣數稍降，補償三層成本（若你機器夠強可改回 9）
  float softness = 0.010;
  float acc = 0.0;
  float wacc = 0.0;
  for(int i=0;i<5;i++){
    float s = (float(i) - 3.0) / 3.0;
    float w = exp(-s*s*1.2);
    vec2 duv = lightDir * s * softness;

    vec2 frag2 = (vUv + duv) * uRes;
    vec2 p2 = (frag2 - 0.5*uRes) / min(uRes.x, uRes.y);

    float h = leafHole(p2, t, tp, lightDir);
    acc += h * w;
    wacc += w;
  }
  float pen = acc / wacc;

  float shadow = mix(0.35, 1.0, pen);

  float vign = smoothstep(1.2, 0.2, length(p));
  float grain = noise(frag * 0.6) * 0.04;

  vec3 groundA = vec3(0.20, 0.22, 0.20);
  vec3 groundB = vec3(0.12, 0.13, 0.12);
  float gMix = clamp(0.55 + p.y*0.35, 0.0, 1.0);
  vec3 ground = mix(groundB, groundA, gMix) + grain;

  vec3 sunCol = vec3(1.15, 1.05, 0.90);
  float sparkle = fbm((p)*7.0 + vec2(t*0.6, -t*0.4)); // 維持原速

  // ---- NEW: 淡淡光束 / 空氣感 ----
  vec2 perp = vec2(-lightDir.y, lightDir.x);
  float rayX = dot(p, lightDir);
  float rayY = dot(p, perp);

  // 很淡的光束條紋（斜陽穿林的感覺）
  // 這個很省，只多 1 次 fbm
  float rayBand = fbm(vec2(rayX*2.0 + t*0.03, rayY*6.0));
  float rays = smoothstep(0.60, 0.86, rayBand) * 0.08; // 強度 0.08~0.18
  float haze = rays * (0.20 + 0.80*pen);               // 亮點附近霧感更明顯

  // ---- 高光更亮、更集中 ----
  float pen2 = pen * pen;
  float sunBoost = 0.45 * pen2 * (0.75 + 0.25*sparkle);
  sunBoost *= (1.0 + rays*1.2); // 光束時高光略更亮

  vec3 col = ground * shadow;
  col += sunCol * sunBoost;

  // ---- NEW: 亮點泛光/微過曝（不用 blur，超省）----
  float bloom = smoothstep(0.55, 0.95, pen) * (0.18 + 0.20*rays); // 強度 0.12~0.30
  col += sunCol * bloom;
  col += vec3(1.0) * (0.04 * bloom); // 白色溢光（0.03~0.10）

  // ---- NEW: 空氣薄霧（非常淡）----
  col += sunCol * (0.10 * haze);

  // 暗角
  col *= (0.85 + 0.15*vign);

  // ---- NEW: 簡單 tonemap + gamma（高光更自然）----
  col = col / (col + vec3(1.0));
  col = pow(col, vec3(1.0/2.2));

  outColor = vec4(col, 1.0);

}
`,Y=S({__name:"bg-jit-hue",props:{modelValue:{default:""}},setup(v){const l=C("canvasRef");let o=null,t=null,s=null,f=null,p=null,u=null,h=0;function b(e,r,n){const a=e.createShader(r);if(e.shaderSource(a,n),e.compileShader(a),!e.getShaderParameter(a,e.COMPILE_STATUS)){const i=e.getShaderInfoLog(a);throw e.deleteShader(a),new Error(i??"Shader compile failed")}return a}function x(e,r,n){const a=typeof WebGL2RenderingContext<"u"&&e instanceof WebGL2RenderingContext,i=b(e,e.VERTEX_SHADER,r),d=b(e,e.FRAGMENT_SHADER,n),c=e.createProgram();if(e.attachShader(c,i),e.attachShader(c,d),e.linkProgram(c),e.deleteShader(i),e.deleteShader(d),!e.getProgramParameter(c,e.LINK_STATUS)){const m=e.getProgramInfoLog(c);throw e.deleteProgram(c),new Error(m??"Program link failed")}if(!a){const m=e.getAttribLocation(c,"aPos");c.__aPosLoc=m}return c}function y(){const e=l.value;if(!e||!o)return;const r=e.getBoundingClientRect(),n=.5,a=Math.min(window.devicePixelRatio||1,1),i=Math.max(1,Math.floor(r.width*a*n)),d=Math.max(1,Math.floor(r.height*a*n));(e.width!==i||e.height!==d)&&(e.width=i,e.height=d),o.viewport(0,0,e.width,e.height),t&&f&&o.uniform2f(f,e.width,e.height),t&&p&&o.uniform1f(p,a)}function P(){const e=l.value;if(o=e.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!0})||e.getContext("webgl",{antialias:!1,alpha:!1}),!o)throw new Error("WebGL not supported");if(o.disable(o.DEPTH_TEST),o.disable(o.STENCIL_TEST),o.disable(o.BLEND),o.disable(o.DITHER),!(typeof WebGL2RenderingContext<"u"&&o instanceof WebGL2RenderingContext))throw new Error("此範例使用 WebGL2（GLSL 300 es）。你的環境目前只拿到 WebGL1。");t=x(o,F,j),o.useProgram(t),s=o.getUniformLocation(t,"uTime"),f=o.getUniformLocation(t,"uRes"),p=o.getUniformLocation(t,"uDpr"),u=o.getUniformLocation(t,"uPieceSpeed");const n=o.createVertexArray();o.bindVertexArray(n);const a=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,a);const i=new Float32Array([-1,-1,3,-1,-1,3]);o.bufferData(o.ARRAY_BUFFER,i,o.STATIC_DRAW),o.enableVertexAttribArray(0),o.vertexAttribPointer(0,2,o.FLOAT,!1,0,0),y()}function E(e){if(!o||!t)return;h||(h=e);const r=(e-h)/1e3;o.useProgram(t),s&&o.uniform1f(s,r),u&&o.uniform1f(u,H),o.drawArrays(o.TRIANGLES,0,3)}return T(()=>{l.value&&P()}),D(({timestamp:e})=>E(e)),q("resize",()=>y()),(e,r)=>(g(),M("canvas",{ref_key:"canvasRef",ref:l},null,512))}}),X=w(Y,[["__scopeId","data-v-79240e04"]]),$={class:"w-full flex flex-col gap-4"},J={class:"example-ctrl flex flex-col gap-4"},R=S({__name:"basic-usage",setup(v){const{t:l}=L.useI18n(),o=W(!1),{isDark:t}=A(),s=t.value;return k(o,f=>{f?t.value=!1:t.value=s}),G(()=>{t.value=s}),(f,p)=>(g(),M("div",$,[U("div",J,[z(B,{modelValue:o.value,"onUpdate:modelValue":p[0]||(p[0]=u=>o.value=u),label:I(l)("showBackground")},null,8,["modelValue","label"])]),o.value?(g(),N(X,{key:0,class:"bg pointer-events-none fixed left-0 top-0 z-50 h-screen w-screen"})):V("",!0)]))}});function _(v){const l=v;l.__i18n=l.__i18n||[],l.__i18n.push({locale:"",resource:{"zh-hant":{showBackground:{t:0,b:{t:2,i:[{t:3}],s:"顯示背景"}}},en:{showBackground:{t:0,b:{t:2,i:[{t:3}],s:"Show Background"}}}}})}typeof _=="function"&&_(R);const re=w(R,[["__scopeId","data-v-9e487b37"]]);export{re as default};
