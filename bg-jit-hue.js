(function() {
  const F = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

  const j = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform float uTime;
uniform vec2  uRes;
uniform float uDpr;
uniform float uPieceSpeed;
uniform float uIsDark;

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
  vec2 base = (p + lightDir * 0.35) + seed;

  vec2 id1, id2; float d1, d2;
  voronoi2(base * cellScale, id1, id2, d1, d2);

  float edge = d2 - d1;
  float blendWidth = 0.10;
  float w = 0.5 + 0.5 * smoothstep(0.0, blendWidth, edge);

  vec2 p1 = applyPiece(base, id1, cellScale, tp, ampMul, rotMul, freqMul);
  vec2 p2 = applyPiece(base, id2, cellScale, tp, ampMul, rotMul, freqMul);
  vec2 projP = mix(p2, p1, w);

  vec2 q = rot(0.25) * (projP * detailScale);

  float n1 = fbm(q + vec2(0.0, t*0.12));
  float n2 = fbm(q*1.8 - vec2(t*0.08, 0.0));
  float canopy = mix(n1, n2, 0.55);

  float hole = smoothstep(0.35, 0.65, canopy);
  hole = pow(hole, 0.70);

  float micro = fbm(q*9.0 + vec2(t*0.25, -t*0.18));
  micro = smoothstep(0.62, 0.86, micro) * microStrength;
  hole = clamp(hole + micro, 0.0, 1.0);

  vec2 mv = mix(cellMove(id2, tp, ampMul, freqMul), cellMove(id1, tp, ampMul, freqMul), w);
  float edgeNoise = fbm(q*3.5 + mv*2.0);
  hole = clamp(hole + (edgeNoise - 0.5) * 0.22, 0.0, 1.0);

  return hole * layerStrength;
}

/* ---------- combine multiple layers (overlay feel) ---------- */
float leafHole(vec2 p, float t, float tp, vec2 lightDir){
  float hA = layerHole(
    p, lightDir, t, tp*0.85,
    1.25,
    vec2(0.17, -0.11),
    1.15, 1.00, 0.90,
    1.0,
    0.14,
    0.78
  );

  float hB = layerHole(
    p, lightDir, t, tp*1.00,
    1.85,
    vec2(-0.23, 0.19),
    1.00, 0.95, 1.05,
    6.2,
    0.16,
    0.72
  );

  float hC = layerHole(
    p, lightDir, t, tp*1.30,
    2.55,
    vec2(0.31, 0.27),
    0.85, 0.70, 1.25,
    7.0,
    0.12,
    0.60
  );

  float hole = 1.0 - (1.0 - clamp(hA,0.0,1.0)) * (1.0 - clamp(hB,0.0,1.0)) * (1.0 - clamp(hC,0.0,1.0));
  return clamp(hole, 0.0, 1.0);
}

void main(){
  vec2 frag = vUv * uRes;
  vec2 p = (frag - 0.5*uRes) / min(uRes.x, uRes.y);

  float t  = uTime;
  float tp = uTime * uPieceSpeed;

  vec2 lightDir = normalize(vec2(-0.6, -0.8));

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

  vec3 lightGroundA = vec3(0.20, 0.45, 0.50);
  vec3 lightGroundB = vec3(0.10, 0.35, 0.45);
  vec3 lightSunCol = vec3(1.10, 1.20, 1.20);
  
  vec3 darkGroundA = vec3(0.05, 0.15, 0.20);
  vec3 darkGroundB = vec3(0.02, 0.10, 0.15);
  vec3 darkSunCol = vec3(0.80, 0.95, 1.00);

  vec3 groundA = mix(lightGroundA, darkGroundA, uIsDark);
  vec3 groundB = mix(lightGroundB, darkGroundB, uIsDark);
  vec3 sunCol = mix(lightSunCol, darkSunCol, uIsDark);

  float gMix = clamp(0.55 + p.y*0.35, 0.0, 1.0);
  vec3 ground = mix(groundB, groundA, gMix) + grain;

  float sparkle = fbm((p)*7.0 + vec2(t*0.6, -t*0.4));

  vec2 perp = vec2(-lightDir.y, lightDir.x);
  float rayX = dot(p, lightDir);
  float rayY = dot(p, perp);

  float rayBand = fbm(vec2(rayX*2.0 + t*0.03, rayY*6.0));
  float rays = smoothstep(0.60, 0.86, rayBand) * 0.08;
  float haze = rays * (0.20 + 0.80*pen);

  float pen2 = pen * pen;
  float sunBoost = 0.45 * pen2 * (0.75 + 0.25*sparkle);
  sunBoost *= (1.0 + rays*1.2);

  vec3 col = ground * shadow;
  col += sunCol * sunBoost;

  float bloom = smoothstep(0.55, 0.95, pen) * (0.18 + 0.20*rays);
  col += sunCol * bloom;
  col += vec3(1.0) * (0.04 * bloom);

  col += sunCol * (0.10 * haze);

  col *= (0.85 + 0.15*vign);

  col = col / (col + vec3(1.0));
  col = pow(col, vec3(1.0/2.2));

  outColor = vec4(col, 1.0);
}`;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(info || "Shader compile failed");
    }
    return shader;
  }

  function createProgram(gl, vsSource, fsSource) {
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error(info || "Program link failed");
    }
    return prog;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    canvas.id = "bg-jit-hue-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
    document.body.prepend(canvas);

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
      desynchronized: true
    });

    if (!gl) {
      console.warn("WebGL2 not supported. JIT Hue background requires WebGL2.");
      return;
    }

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.BLEND);
    gl.disable(gl.DITHER);

    const program = createProgram(gl, F, j);
    gl.useProgram(program);

    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uResLoc = gl.getUniformLocation(program, "uRes");
    const uDprLoc = gl.getUniformLocation(program, "uDpr");
    const uPieceSpeedLoc = gl.getUniformLocation(program, "uPieceSpeed");
    const uIsDarkLoc = gl.getUniformLocation(program, "uIsDark");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       3, -1,
      -1,  3
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uPieceSpeed = 2.2;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const scale = 0.5;
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      const w = Math.max(1, Math.floor(rect.width * dpr * scale));
      const h = Math.max(1, Math.floor(rect.height * dpr * scale));

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);

      if (uResLoc) gl.uniform2f(uResLoc, canvas.width, canvas.height);
      if (uDprLoc) gl.uniform1f(uDprLoc, dpr);
    }

    window.addEventListener("resize", resize);
    resize();

    let startTime = performance.now();

    function render(time) {
      const t = (time - startTime) / 1000;
      gl.useProgram(program);
      if (uTimeLoc) gl.uniform1f(uTimeLoc, t);
      if (uPieceSpeedLoc) gl.uniform1f(uPieceSpeedLoc, uPieceSpeed);

      const isDarkAttr = document.documentElement.getAttribute("data-theme") === "dark" || document.body.getAttribute("data-theme") === "dark";
      const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = (isDarkAttr || (!document.documentElement.hasAttribute("data-theme") && !document.body.hasAttribute("data-theme") && isSystemDark)) ? 1.0 : 0.0;
      if (uIsDarkLoc) gl.uniform1f(uIsDarkLoc, isDark);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  });
})();
