const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/vendor-peer.oiYzYgLL.js","assets/chunks/vendor-matter.TGoIE_ae.js"])))=>i.map(i=>d[i]);
import{h as te,b as z}from"./index.SzTuC4MQ.js";import"./data.DEADKj9o.js";import{u as de}from"../app.DdI-dLaJ.js";import{_ as j}from"./vendor-anime.CTXC9SUk.js";import{t as he}from"./vendor-lodash.D8qSJaWp.js";import{g as Q,f as oe,A as re,a7 as K,Y as ne,aw as ae,o as se,c as ie,aa as ve,a6 as me,z as ge,d as $e}from"./runtime-core.esm-bundler.NpIwd_Or.js";import{u as J}from"./index.C3IFlN-c.js";import"./runtime-dom.esm-bundler.CTR-Lx7i.js";import"./plugin-vue_export-helper.DlAUqK2U.js";import"./vue-i18n.cjs.BGk_20ct.js";import"./vendor-matter.TGoIE_ae.js";var O=(r=>(r.HOST="host",r.CLIENT="client",r))(O||{}),Y=(r=>(r.PEER_STATE="peer-state",r.ROOM_FULL="room-full",r.PEER_DISCONNECTED="peer-disconnected",r))(Y||{});const ye="chill-bg",v="[peer-network]";function Ae(r){const i=r.replace(/^\/|\/$/g,"").replace(/[^a-z0-9-]/gi,"-")||"home";return`${ye}-${i}`}function we(r,i){const e=Ae(r);return i===0?e:`${e}-${i+1}`}const V=50;function Se({routePath:r,onConnected:i,onPeerStateUpdated:e,onPeerDisconnected:t,onClientConnected:l}){const A=Q(!1),T=Q(""),y=Q(null);let h=null;const p=new Map;let n=0,R=0;const u=3;function w(o){R++,R>=u?(console.warn(`${v} 連續失敗 ${R} 次，跳到 room ${o+1}`),R=0,b(),setTimeout(()=>f(o+1),500)):(console.log(`${v} 連線失敗 (${R}/${u})，1 秒後重試 room ${o}`),b(),setTimeout(()=>f(o),1e3))}async function f(o=0){if(typeof window>"u")return;const $=n,a=we(r.value,o);console.log(`${v} tryConnect: roomIndex=${o}, roomId=${a}, gen=${$}`);const{Peer:E}=await j(async()=>{const{Peer:m}=await import("./vendor-peer.oiYzYgLL.js");return{Peer:m}},__vite__mapDeps([0,1]));if($!==n){console.log(`${v} tryConnect: 世代過期 (${$} !== ${n})，中止`);return}const S=new E(a);h=S;const P=()=>{if(y.value===O.CLIENT)return;console.log(`${v} 轉為 Client 模式，roomId=${a}`),b();const m=n;setTimeout(async()=>{if(m!==n){console.log(`${v} becomeClient: 世代過期，中止`);return}const{Peer:N}=await j(async()=>{const{Peer:x}=await import("./vendor-peer.oiYzYgLL.js");return{Peer:x}},__vite__mapDeps([0,1]));if(m!==n){console.log(`${v} becomeClient: import 後世代過期，中止`);return}const H=new N;h=H,H.on("open",x=>{if(m!==n){console.log(`${v} Client open: 世代過期 (${m} !== ${n})，中止`);return}T.value=x,console.log(`${v} Client peer 已開啟: peerId=${x}，嘗試連線到 Host ${a}`);const L=setTimeout(()=>{m===n&&(y.value===null||y.value===O.CLIENT)&&(console.warn(`${v} Client 連線逾時 (3s)，roomId=${a}`),w(o))},3e3),d=H.connect(a);d.on("open",()=>{if(clearTimeout(L),m!==n){console.log(`${v} Client connection open: 世代過期，中止`);return}R=0,y.value=O.CLIENT,console.log(`${v} ✓ Client 連線成功: peerId=${x}, host=${a}, room=${o}`),I(d,o)}),d.on("error",()=>{clearTimeout(L),m===n&&(console.warn(`${v} Client connection error，roomId=${a}`),w(o))})}),H.on("error",x=>{m===n&&(console.warn(`${v} Client peer error: type=${x.type}`,x.message),x.type==="peer-unavailable"&&w(o))})},500)};S.on("open",m=>{if($!==n){console.log(`${v} Host open: 世代過期，中止`);return}R=0,y.value=O.HOST,T.value=m,A.value=!0,console.log(`${v} ✓ Host 建立成功: peerId=${m}, room=${o}`),i==null||i()}),S.on("connection",m=>{$===n&&(console.log(`${v} [Host] 收到連入: peer=${m.peer}`),_(m))}),S.on("error",m=>{if($!==n){console.log(`${v} Host error: 世代過期，中止`);return}m.type==="unavailable-id"?(console.log(`${v} Host ID 已被佔用 (${a})，轉為 Client`),P()):(console.warn(`${v} Host error: type=${m.type}`,m.message),w(o))})}function _(o){o.on("open",()=>{if(p.size>=V){console.warn(`${v} [Host] 房間已滿 (${p.size}/${V})，拒絕 ${o.peer}`),o.send({type:Y.ROOM_FULL}),setTimeout(()=>o.close(),100);return}p.set(o.peer,o),console.log(`${v} [Host] Client 已連入: peer=${o.peer}, 目前連線數=${p.size}`),l==null||l(o.peer)}),o.on("data",$=>{const a=$;a.type===Y.PEER_STATE&&(e(a.peerId,a.state),p.forEach((E,S)=>{S!==o.peer&&E.open&&E.send(a)}))}),o.on("close",()=>{p.delete(o.peer),console.log(`${v} [Host] Client 已斷線: peer=${o.peer}, 剩餘連線數=${p.size}`),t(o.peer);const $={type:Y.PEER_DISCONNECTED,peerId:o.peer};p.forEach(a=>{a.open&&a.send($)})})}function I(o,$){const a=n;let E=!1;o.open&&!A.value&&(p.set(o.peer,o),A.value=!0,i==null||i()),o.on("open",()=>{p.set(o.peer,o),A.value=!0,i==null||i()}),o.on("data",S=>{if(a!==n)return;const P=S;if(P.type===Y.ROOM_FULL){E=!0;const m=$+1;console.warn(`${v} [Client] 房間已滿，跳到 room ${m}`),b(),setTimeout(()=>f(m),500)}else P.type===Y.PEER_STATE?e(P.peerId,P.state):P.type===Y.PEER_DISCONNECTED&&(console.log(`${v} [Client] 收到斷線通知: peer=${P.peerId}`),t(P.peerId))}),o.on("close",()=>{if(a!==n||E)return;const S=o.peer;p.delete(S),A.value=!1,console.warn(`${v} [Client] 與 Host 斷線: host=${S}, room=${$}，準備重連`),t(S),b(),setTimeout(()=>f($),1e3)})}function D(o,$,a){if(y.value!==O.HOST)return;const E=p.get(o);if(E!=null&&E.open){const S={type:Y.PEER_STATE,peerId:$,state:a};E.send(S)}}function C(o){if(y.value!==O.HOST)return;console.log(`${v} [Host] 廣播斷線: peer=${o}`);const $={type:Y.PEER_DISCONNECTED,peerId:o};p.forEach(a=>{a.open&&a.send($)})}const X=he(o=>{if(!A.value)return;const $={type:Y.PEER_STATE,peerId:T.value,state:o};if(y.value===O.HOST)p.forEach(a=>{a.open&&a.send($)});else if(y.value===O.CLIENT){const a=Array.from(p.values())[0];a!=null&&a.open&&a.send($)}},300,{leading:!0,trailing:!0});oe(()=>{console.log(`${v} 元件卸載，關閉所有連線`),p.forEach(o=>o.close()),p.clear(),h==null||h.destroy()});function b(){const o=n;n++,console.log(`${v} cleanup: gen ${o} → ${n}, role=${y.value}, peerId=${T.value}`),A.value=!1,y.value=null,X==null||X.cancel(),p.forEach($=>$.close()),p.clear(),h&&(h.destroy(),h=null)}return re(r,()=>{console.log(`${v} 路徑變更: ${r.value}，重新連線`),b(),R=0,t("__all__"),f(0)}),f(0),{isReady:A,currentRole:y,currentPeerId:T,sendState:X,sendStateToPeer:D,broadcastDisconnect:C}}const k=7,_e=`#version 300 es
layout(location = 0) in vec2 aQuadPos;

// instance attributes
layout(location = 1) in vec2 aPosition;
layout(location = 2) in float aAngle;
layout(location = 3) in float aScaleX;
layout(location = 4) in vec3 aColor;

uniform vec2 uResolution;
uniform float uFishSize;

out vec2 vUv;
out float vScaleX;
out vec3 vColor;

void main() {
  vUv = aQuadPos * 0.5 + 0.5;
  vScaleX = aScaleX;
  vColor = aColor;

  float cosA = cos(aAngle);
  float sinA = sin(aAngle);

  // 旋轉 + X 方向壓縮模擬 3D 翻轉
  vec2 scaled = vec2(aQuadPos.x * aScaleX, aQuadPos.y);
  vec2 rotated = vec2(
    scaled.x * cosA - scaled.y * sinA,
    scaled.x * sinA + scaled.y * cosA
  );

  // 從 normalized (0~1) 轉為 clip space (-1~1)
  vec2 fishSize = uFishSize / uResolution;
  vec2 clipPos = (aPosition * 2.0 - 1.0) + rotated * fishSize;

  gl_Position = vec4(clipPos, 0.0, 1.0);
}
`,Ee=`#version 300 es
precision mediump float;

in vec2 vUv;
in float vScaleX;
in vec3 vColor;

out vec4 fragColor;

// 正三角形 SDF
float sdTriangle(vec2 point, float size) {
  point.x = abs(point.x);
  float d = max(
    dot(point, vec2(0.866, 0.5)) - size * 0.5,
    -point.y - size * 0.5
  );
  return d;
}

void main() {
  vec2 point = vUv * 2.0 - 1.0;

  // 身體：橢圓，稍微偏右讓尾巴接在左側
  float body = length((point - vec2(0.15, 0.0)) / vec2(0.58, 0.42)) - 1.0;

  // 尾巴：圓角正三角形，尖端朝左（減去 0.06 產生圓角）
  vec2 tailPos = point - vec2(-0.6, 0.0);
  vec2 rotatedTail = vec2(-tailPos.y, tailPos.x);
  float tail = sdTriangle(rotatedTail, 0.3) - 0.06;

  float shape = min(body, tail);

  if (shape > 0.02)
    discard;

  float alpha = 1.0 - smoothstep(-0.02, 0.02, shape);

  // 光影
  float lighting = 0.75 + 0.25 * abs(vScaleX);
  vec3 color = vColor * lighting;

  // 眼睛
  float absScaleX = abs(vScaleX);
  vec2 eyeCenter = vec2(0.32, 0.06);
  float eyeDist = length(point - eyeCenter);
  float eye = 1.0 - smoothstep(0.06, 0.08, eyeDist);
  eye *= smoothstep(0.15, 0.4, absScaleX);
  color = mix(color, vec3(0.15), eye);

  fragColor = vec4(color, alpha);
}
`;function Re(r){const i=r.match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/);if(!i)return[1,1,1];const e=Number(i[1])/360,t=Number(i[2])/100,l=Number(i[3])/100;if(t===0)return[l,l,l];const A=(h,p,n)=>(n<0&&(n+=1),n>1&&(n-=1),n<1/6?h+(p-h)*6*n:n<1/2?p:n<2/3?h+(p-h)*(2/3-n)*6:h),T=l<.5?l*(1+t):l+t-l*t,y=2*l-T;return[A(y,T,e+1/3),A(y,T,e),A(y,T,e-1/3)]}function Z(){const r=Math.floor(Math.random()*4);return r===0?{x:-.2,y:Math.random()}:r===1?{x:1.2,y:Math.random()}:r===2?{x:Math.random(),y:-.2}:{x:Math.random(),y:1.2}}function ee(r,i,e){const t=r.createShader(i);if(r.shaderSource(t,e),r.compileShader(t),!r.getShaderParameter(t,r.COMPILE_STATUS)){const l=r.getShaderInfoLog(t);throw r.deleteShader(t),new Error(`Shader compile error: ${l}`)}return t}function Pe(r){const i=ee(r,r.VERTEX_SHADER,_e),e=ee(r,r.FRAGMENT_SHADER,Ee),t=r.createProgram();if(r.attachShader(t,i),r.attachShader(t,e),r.linkProgram(t),!r.getProgramParameter(t,r.LINK_STATUS)){const l=r.getProgramInfoLog(t);throw r.deleteProgram(t),new Error(`Program link error: ${l}`)}return r.deleteShader(i),r.deleteShader(e),t}function Te(r){const i=r.getContext("webgl2",{alpha:!0,premultipliedAlpha:!1,antialias:!1});if(!i)throw new Error("WebGL2 not supported");const e=i,t=Pe(e),l=e.getUniformLocation(t,"uResolution"),A=e.getUniformLocation(t,"uFishSize"),T=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),y=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,y),e.bufferData(e.ARRAY_BUFFER,T,e.STATIC_DRAW);const h=new Float32Array(V*k),p=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,p),e.bufferData(e.ARRAY_BUFFER,h.byteLength,e.DYNAMIC_DRAW);const n=e.createVertexArray();e.bindVertexArray(n),e.bindBuffer(e.ARRAY_BUFFER,y),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,p);const R=k*4;return e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,R,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,1,e.FLOAT,!1,R,8),e.vertexAttribDivisor(2,1),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,1,e.FLOAT,!1,R,12),e.vertexAttribDivisor(3,1),e.enableVertexAttribArray(4),e.vertexAttribPointer(4,3,e.FLOAT,!1,R,16),e.vertexAttribDivisor(4,1),e.bindVertexArray(null),{gl:e,canvas:r,program:t,uResolution:l,uFishSize:A,quadBuffer:y,instanceBuffer:p,instanceData:h,vao:n}}function be(r){const{gl:i,quadBuffer:e,instanceBuffer:t,vao:l,program:A}=r;i.deleteBuffer(e),i.deleteBuffer(t),i.deleteVertexArray(l),i.deleteProgram(A)}function Me({canvas:r,peerStateMap:i,fishSize:e=20}){const t=new Map;let l=null,A=0;function T(u){for(const[w,f]of t)if(!u.has(w)&&!f.exiting){f.exiting=!0;const _=Z();f.targetX=_.x,f.targetY=_.y}for(const[w,f]of t)f.exiting&&(f.currentX<-.15||f.currentX>1.15||f.currentY<-.15||f.currentY>1.15)&&t.delete(w);for(const[w,f]of u){const _=t.get(w);if(_)_.exiting=!1,_.targetX=f.x,_.targetY=f.y;else{const I=Z(),[D,C,X]=Re(f.color);t.set(w,{currentX:I.x,currentY:I.y,targetX:f.x,targetY:f.y,angle:0,scaleX:1,r:D,g:C,b:X,exiting:!1})}}}function y(u,w){const f=t.get(u);f&&(t.delete(u),f.exiting=!1,t.set(w,f))}function h(){var x,L;if(!l)return;const{gl:u,canvas:w,program:f,uResolution:_,uFishSize:I,instanceBuffer:D,instanceData:C,vao:X}=l,b=window.devicePixelRatio||1,o=w.clientWidth,$=w.clientHeight,a=Math.round(o*b),E=Math.round($*b);if((w.width!==a||w.height!==E)&&(w.width=a,w.height=E),u.viewport(0,0,a,E),u.clearColor(0,0,0,0),u.clear(u.COLOR_BUFFER_BIT),t.size===0)return;const S=.01;let P=0;const m=window.scrollY,N=((x=window.visualViewport)==null?void 0:x.height)??window.innerHeight,H=document.body.offsetHeight;for(const d of t.values()){const s=d.currentX,c=d.currentY;d.currentX+=(d.targetX-d.currentX)*S,d.currentY+=(d.targetY-d.currentY)*S;const g=d.currentX-s,M=d.currentY-c;if(Math.sqrt(g*g+M*M)>1e-4){if(Math.abs(g)>5e-5){const pe=g>0?1:-1;d.scaleX+=(pe-d.scaleX)*.1}const ue=d.scaleX>=0?1:-1,q=Math.PI/3,fe=Math.atan2(-M,Math.abs(g)+1e-4);let U=Math.max(-q,Math.min(q,fe))*ue-d.angle;for(;U>Math.PI;)U-=Math.PI*2;for(;U<-Math.PI;)U+=Math.PI*2;d.angle+=U*.1}else d.angle*=.95;const W=d.currentX,le=((L=window.visualViewport)==null?void 0:L.offsetTop)??0,ce=1-(d.currentY*H-m-le)/N,B=P*k;if(C[B]=W,C[B+1]=ce,C[B+2]=d.angle,C[B+3]=d.scaleX,C[B+4]=d.r,C[B+5]=d.g,C[B+6]=d.b,P++,P>=V)break}A=P,u.bindBuffer(u.ARRAY_BUFFER,D),u.bufferSubData(u.ARRAY_BUFFER,0,C,0,A*k),u.useProgram(f),u.uniform2f(_,a,E),u.uniform1f(I,e*b),u.enable(u.BLEND),u.blendFunc(u.SRC_ALPHA,u.ONE_MINUS_SRC_ALPHA),u.bindVertexArray(X),u.drawArraysInstanced(u.TRIANGLES,0,6,A),u.bindVertexArray(null)}function p(){l&&(be(l),l=null),t.clear()}const{pause:n,resume:R}=te(()=>{T(K(i)),h()},{immediate:!1});return re(()=>K(r),u=>{u&&!l&&(l=Te(u),R())},{immediate:!0}),oe(()=>{n(),p()}),{dispose:p,transferFish:y}}const Ce=ne({__name:"scene-canvas",props:{peerStateMap:{}},setup(r,{expose:i}){const e=r,t=ae("canvasRef"),{transferFish:l}=Me({canvas:t,peerStateMap:()=>e.peerStateMap});return i({transferFish:l}),(A,T)=>(se(),ie("canvas",{ref_key:"canvasRef",ref:t,class:"h-full w-full"},null,512))}}),xe={class:"opacity-70"},F="[base-bg]",Fe=1e4,Ge=ne({__name:"base-bg",setup(r){function i(){const s=Math.floor(Math.random()*360),c=55+Math.floor(Math.random()*20),g=75+Math.floor(Math.random()*10);return`hsl(${s}, ${c}%, ${g}%)`}const e=i(),t=ve(new Map),l=new Map,A=de(),T=me(()=>A.path.replace(".html","")),y=ae("sceneCanvasRef");let h="";const{isReady:p,currentPeerId:n,sendState:R,sendStateToPeer:u,broadcastDisconnect:w}=Se({routePath:T,onConnected(){var s;if(h&&h!==n.value){console.log(`${F} peerId 變更: ${h} → ${n.value}，遷移魚狀態`),(s=y.value)==null||s.transferFish(h,n.value);const c=t.get(h);c&&(t.delete(h),t.set(n.value,c))}console.log(`${F} onConnected: peerId=${n.value}, previousPeerId=${h}, peerStateMap.size=${t.size}`),console.log(`${F} peerStateMap keys:`,[...t.keys()]),h=n.value},onPeerStateUpdated(s,c){const g=n.value||h;if(s===g){console.warn(`${F} 收到自己的狀態回傳，忽略: peer=${s}, x=${c.x.toFixed(3)}, y=${c.y.toFixed(3)}`);return}console.log(`${F} onPeerStateUpdated: peer=${s}, x=${c.x.toFixed(3)}, y=${c.y.toFixed(3)}`),t.set(s,c),l.set(s,Date.now())},onPeerDisconnected(s){if(s==="__all__"){console.log(`${F} onPeerDisconnected: __all__，清空 peerStateMap`),t.clear(),l.clear(),_="";return}console.log(`${F} onPeerDisconnected: peer=${s}, 剩餘=${t.size-1}`),t.delete(s),l.delete(s)},onClientConnected(s){console.log(`${F} onClientConnected: ${s}，同步 ${t.size} 筆狀態`);for(const[c,g]of t)c!==s&&u(s,c,g)}});J(()=>{const s=Date.now(),c=n.value;for(const[g,M]of l)g!==c&&s-M>Fe&&(console.warn(`${F} 清除過期 peer: ${g}（${Math.round((s-M)/1e3)}s 未更新）`),t.delete(g),l.delete(g),w(g));if(t.size>0){const g=[...t.entries()].map(([M,G])=>{const W=M===c?" (me)":"";return`${M.slice(0,8)}${W}: (${G.x.toFixed(2)}, ${G.y.toFixed(2)})`});console.log(`${F} 狀態摘要 [${t.size} 隻魚]:`,g.join(" | "))}},3e3);function f(){return document.body.offsetHeight}let _="";function I(s,c){const g={x:s,y:c,color:e};if(!p.value){R(g);return}const M=n.value||h;_&&_!==M&&(console.log(`${F} peerId 變更: ${_.slice(0,8)} → ${M.slice(0,8)}，清除舊 entry`),t.delete(_)),M&&(t.set(M,g),_=M),R(g)}let D=0,C=0;function X(s){D=s.clientX,C=s.clientY;const c=s.clientX/window.innerWidth,g=(s.clientY+window.scrollY)/f();I(c,g)}let b=null,o=null;function $(s){const c=s.touches[0];c&&(b=c.clientX,o=c.clientY,L())}function a(s){const c=s.touches[0];c&&(b=c.clientX,o=c.clientY,L())}function E(){b=null,o=null}let S=Math.random(),P=.5,m=Math.random(),N=.5;const{resume:H}=J(()=>{m=.15+Math.random()*.7},2e3,{immediate:!1}),{resume:x}=te(()=>{L()},{immediate:!1});function L(){var g;b!==null&&o!==null?(m=b/window.innerWidth,N=(o+window.scrollY)/f()):N=((((g=window.visualViewport)==null?void 0:g.height)??window.innerHeight)*.5+window.scrollY)/f(),S+=(m-S)*.03,P+=(N-P)*.03;const s=Math.max(0,Math.min(1,S)),c=Math.max(0,Math.min(1,P));I(s,c)}let d=!1;return z("scroll",()=>{if(d)L();else{const s=D/window.innerWidth,c=(C+window.scrollY)/f();I(s,c)}},{passive:!0}),ge(()=>{d="ontouchstart"in window,d?(z("touchstart",$,{passive:!0}),z("touchmove",a,{passive:!0}),z("touchend",E),H(),x()):z("mousemove",X)}),(s,c)=>(se(),ie("div",xe,[$e(Ce,{ref_key:"sceneCanvasRef",ref:y,"peer-state-map":t},null,8,["peer-state-map"])]))}});export{Ge as default};
