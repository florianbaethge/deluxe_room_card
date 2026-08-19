function e(e,t,i,o){var n,r=arguments.length,s=r<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(r<3?n(s):r>3?n(t,i,s):n(t,i))||s);return r>3&&s&&Object.defineProperty(t,i,s),s}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),n=new WeakMap;let r=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(t,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new r(i,e,o)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,m=globalThis,_=m.trustedTypes,f=_?_.emptyScript:"",g=m.reactiveElementPolyfillSupport,v=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},w=(e,t)=>!c(e,t),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);void 0!==o&&l(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:n}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const r=o?.call(this);n?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...d(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,o)=>{if(i)e.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of o){const o=document.createElement("style"),n=t.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,e.appendChild(o)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,o=i._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=i.getPropertyOptions(o),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=o;const r=n.fromAttribute(t,e.type);this[o]=r??this._$Ej?.get(o)??r,this._$Em=null}}requestUpdate(e,t,i,o=!1,n){if(void 0!==e){const r=this.constructor;if(!1===o&&(n=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??w)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:n},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==n||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,i,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,g?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,A=$.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,R=`<${z}>`,T=document,P=()=>T.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,I=Array.isArray,M="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,N=/>/g,H=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,j=/"/g,B=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),W=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),V=new WeakMap,q=T.createTreeWalker(T,129);function Z(e,t){if(!I(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,o=[];let n,r=2===t?"<svg>":3===t?"<math>":"",s=U;for(let t=0;t<i;t++){const i=e[t];let a,c,l=-1,h=0;for(;h<i.length&&(s.lastIndex=h,c=s.exec(i),null!==c);)h=s.lastIndex,s===U?"!--"===c[1]?s=L:void 0!==c[1]?s=N:void 0!==c[2]?(B.test(c[2])&&(n=RegExp("</"+c[2],"g")),s=H):void 0!==c[3]&&(s=H):s===H?">"===c[0]?(s=n??U,l=-1):void 0===c[1]?l=-2:(l=s.lastIndex-c[2].length,a=c[1],s=void 0===c[3]?H:'"'===c[3]?j:D):s===j||s===D?s=H:s===L||s===N?s=U:(s=H,n=void 0);const d=s===H&&e[t+1].startsWith("/>")?" ":"";r+=s===U?i+R:l>=0?(o.push(a),i.slice(0,l)+C+i.slice(l)+E+d):i+E+(-2===l?t:d)}return[Z(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class J{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let n=0,r=0;const s=e.length-1,a=this.parts,[c,l]=G(e,t);if(this.el=J.createElement(c,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=q.nextNode())&&a.length<s;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(C)){const t=l[r++],i=o.getAttribute(e).split(E),s=/([.?@])?(.*)/.exec(t);a.push({type:1,index:n,name:s[2],strings:i,ctor:"."===s[1]?te:"?"===s[1]?ie:"@"===s[1]?oe:ee}),o.removeAttribute(e)}else e.startsWith(E)&&(a.push({type:6,index:n}),o.removeAttribute(e));if(B.test(o.tagName)){const e=o.textContent.split(E),t=e.length-1;if(t>0){o.textContent=A?A.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],P()),q.nextNode(),a.push({type:2,index:++n});o.append(e[t],P())}}}else if(8===o.nodeType)if(o.data===z)a.push({type:2,index:n});else{let e=-1;for(;-1!==(e=o.data.indexOf(E,e+1));)a.push({type:7,index:n}),e+=E.length-1}n++}}static createElement(e,t){const i=T.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,o){if(t===W)return t;let n=void 0!==o?i._$Co?.[o]:i._$Cl;const r=O(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(e),n._$AT(e,i,o)),void 0!==o?(i._$Co??=[])[o]=n:i._$Cl=n),void 0!==n&&(t=X(e,n._$AS(e,t.values),n,o)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??T).importNode(t,!0);q.currentNode=o;let n=q.nextNode(),r=0,s=0,a=i[0];for(;void 0!==a;){if(r===a.index){let t;2===a.type?t=new Y(n,n.nextSibling,this,e):1===a.type?t=new a.ctor(n,a.name,a.strings,this,e):6===a.type&&(t=new ne(n,this,e)),this._$AV.push(t),a=i[++s]}r!==a?.index&&(n=q.nextNode(),r++)}return q.currentNode=T,o}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),O(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>I(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new Q(o,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new J(e)),t}k(e){I(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const n of e)o===t.length?t.push(i=new Y(this.O(P()),this.O(P()),this,this.options)):i=t[o],i._$AI(n),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,n){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(e,t=this,i,o){const n=this.strings;let r=!1;if(void 0===n)e=X(this,e,t,0),r=!O(e)||e!==this._$AH&&e!==W,r&&(this._$AH=e);else{const o=e;let s,a;for(e=n[0],s=0;s<n.length-1;s++)a=X(this,o[i+s],t,s),a===W&&(a=this._$AH[s]),r||=!O(a)||a!==this._$AH[s],a===K?e=K:e!==K&&(e+=(a??"")+n[s+1]),this._$AH[s]=a}r&&!o&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class oe extends ee{constructor(e,t,i,o,n){super(e,t,i,o,n),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??K)===W)return;const i=this._$AH,o=e===K&&i!==K||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==K&&(i===K||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(J,Y),($.litHtmlVersions??=[]).push("3.3.3");const se=globalThis;let ae=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const o=i?.renderBefore??t;let n=o._$litPart$;if(void 0===n){const e=i?.renderBefore??null;o._$litPart$=n=new Y(t.insertBefore(P(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};ae._$litElement$=!0,ae.finalized=!0,se.litElementHydrateSupport?.({LitElement:ae});const ce=se.litElementPolyfillSupport;ce?.({LitElement:ae}),(se.litElementVersions??=[]).push("4.2.2");const le=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:w},de=(e=he,t,i)=>{const{kind:o,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===o){const{name:o}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(o,n,e,!0,i)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];t.call(this,i),this.requestUpdate(o,n,e,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ue(e){return(t,i)=>"object"==typeof i?de(e,t,i):((e,t,i)=>{const o=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),o?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function pe(e){return ue({...e,state:!0,attribute:!1})}const me=1,_e=e=>(...t)=>({_$litDirective$:e,values:t});let fe=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};const ge=_e(class extends fe{constructor(e){if(super(e),e.type!==me||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const o=!!t[e];o===this.st.has(e)||this.nt?.has(e)||(o?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return W}}),ve="important",be=" !"+ve,we=_e(class extends fe{constructor(e){if(super(e),e.type!==me||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const o=e[i];return null==o?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const o=t[e];if(null!=o){this.ft.add(e);const t="string"==typeof o&&o.endsWith(be);e.includes("-")||t?i.setProperty(e,t?o.slice(0,-11):o,t?ve:""):i[e]=o}}return W}}),ye={icon:"mdi:sofa",icon_size:1,layout:"classic",width:"auto",color_style:"theme",state_style:"label",show_name:!0,show_climate:!0,show_icon:!0},xe=["classic","controls-bottom","header-bar","compact"],$e=["auto","full","half"],ke=["theme","override"],Ae=["combined","label","bar","radial","color"];class Se extends Error{}function Ce(e){if(!e||"object"!=typeof e)throw new Se("Invalid configuration");const t={...ye,...e,openings:{...e.openings,state_style:e.openings?.state_style??ye.state_style,items:e.openings?.items??[]},controls:e.controls??[],alerts:e.alerts??[],card_alerts:e.card_alerts??[],climate:e.climate??{}};if(t.layout&&!xe.includes(t.layout))throw new Se(`Unknown layout: ${t.layout}`);if(t.width&&!$e.includes(t.width))throw new Se(`Unknown width: ${t.width}`);if(t.color_style&&!ke.includes(t.color_style))throw new Se(`Unknown color_style: ${t.color_style}`);const i=t.openings?.state_style;if(i&&!Ae.includes(i))throw new Se(`Unknown state_style: ${i}`);for(const e of t.openings?.items??[])if(e.state_style&&!Ae.includes(e.state_style))throw new Se(`Unknown state_style: ${e.state_style}`);for(const e of t.controls??[])if(!e.entity)throw new Se("controls: entity is required");for(const e of t.alerts??[])if(!e.entity)throw new Se("alerts: entity is required");for(const e of t.card_alerts??[]){if(!e.outline||!["warn","warning","critical"].includes(e.outline))throw new Se("card_alerts: outline must be warning or critical");if(!Array.isArray(e.conditions))throw new Se("card_alerts: conditions must be a list")}const o=t.icon_size??1;return t.icon_size=Math.min(1.8,Math.max(.6,o)),t}function Ee(e){const t=new Set,i=e=>{e&&t.add(e)};i(e.climate?.temperature),i(e.climate?.humidity);for(const t of e.openings?.items??[])i(t.window),i(t.door),i(t.cover),i(t.control_entity);for(const t of e.controls??[])i(t.entity);for(const t of e.alerts??[])i(t.entity);for(const o of e.card_alerts??[])for(const e of o.conditions)i(e.entity),void 0===e.after&&void 0===e.before||t.add("sun.sun");return t}function ze(e,t){const i={climate:{},openings:[],controls:[],alerts:[]};for(const o of function(e,t){const i=e.entities??{},o=e.devices??{},n=[];for(const e of Object.values(i))e.hidden||e.disabled_by||(e.area_id??(e.device_id?o[e.device_id]?.area_id:void 0))===t&&n.push(e.entity_id);return n}(e,t)){const t=e.states[o],n=o.split(".")[0],r=t?.attributes.device_class,s=t?.attributes.friendly_name;"light"===n||"switch"===n?i.controls.push({entity:o}):"cover"===n?i.openings.push(r&&["door","garage","gate"].includes(r)?{cover:o,name:s,device_class:"door"}:{cover:o,name:s}):"binary_sensor"===n?"window"===r||"door"===r||"garage_door"===r?i.openings.push({window:o,name:s}):r&&["moisture","smoke","gas","carbon_monoxide","safety"].includes(r)&&i.alerts.push({entity:o,severity:"critical",full_width:!0}):"sensor"===n&&("temperature"!==r||i.climate.temperature?"humidity"!==r||i.climate.humidity||(i.climate.humidity=o):i.climate.temperature=o)}return i}function Re(e,t){const i={...e},o={...e.climate};return!o.temperature&&t.climate.temperature&&(o.temperature=t.climate.temperature),!o.humidity&&t.climate.humidity&&(o.humidity=t.climate.humidity),i.climate=o,e.openings?.items?.length||(i.openings={...e.openings,items:t.openings}),e.controls?.length||(i.controls=t.controls),e.alerts?.length||(i.alerts=t.alerts),i}const Te=new Set(["unavailable","unknown","none","nan",""]);function Pe(e){return null==e||"string"==typeof e&&Te.has(e.trim().toLowerCase())}function Oe(e,t){return!e||Pe(t?e.attributes[t]:e.state)}function Ie(e){if(null==e)return null;if("string"==typeof e&&Te.has(e.toLowerCase()))return null;const t="number"==typeof e?e:Number(e);return Number.isFinite(t)?t:null}function Me(e,t){const i=Ie(e);if(null===i)return"unknown";if(!t)return"normal";const o=t;return void 0!==o.low_crit&&i<=o.low_crit?"low_crit":void 0!==o.high_crit&&i>=o.high_crit?"high_crit":void 0!==o.high&&i>=o.high?"high":void 0!==o.low&&i<=o.low?"low":"normal"}function Ue(e,t){const i=Ie(e),o=Ie(t);if(null===i||null===o)return null;if(o<0||o>100)return null;var n;return 216.7*(o/100*(n=i,6.112*Math.exp(17.62*n/(243.12+n))))/(273.15+i)}function Le(e,t,i){return"absolute"!==i?.scale?Me(e,i):null===Ie(e)?"unknown":Me(Ue(t,e),i)}function Ne(e,t,i,o,n){const r=e.window??e.door,s=r?t(r):void 0,a=e.cover?t(e.cover):void 0,c=void 0!==r&&void 0===s||void 0!==e.cover&&void 0===a,l=r?function(e){if(!e)return"unknown";const t=e.state.toLowerCase();return Te.has(t)?"unknown":"on"===t||"open"===t||"opening"===t?"open":"tilted"===t||"tilt"===t?"tilted":"off"===t||"closed"===t||"closing"===t?"closed":"unknown"}(s):null,h=e.cover?function(e){if(!e)return null;if(Te.has(e.state.toLowerCase()))return null;const t=Ie(e.attributes.current_position);return null!==t?Math.max(0,Math.min(100,t)):"open"===e.state?100:"closed"===e.state?0:null}(a):null,d=void 0!==e.cover,u=["door","garage_door","garage","gate"],p=s?.attributes.device_class,m=void 0!==e.door||u.includes(e.device_class??"")||u.includes(p??""),_=s?.attributes.friendly_name??a?.attributes.friendly_name;return{key:`${r??""}|${e.cover??""}|${o}`,name:e.name??_??r??e.cover??"?",icon:e.icon??null,style:i,windowState:l,position:h,isDoor:m,hasCover:d,coverClosed:null!==h&&h<=1,missing:c,moreInfoEntity:e.cover??r??null,actionEntity:e.control_entity??e.cover??r??null,tapAction:e.tap_action??"more-info",service:e.service,serviceData:e.service_data,showName:n?.showName??!0,showValue:n?.showValue??!0,showIcon:n?.showIcon??!0}}const He={info:"mdi:information-outline",warning:"mdi:alert-outline",critical:"mdi:alert"};function De(e,t){return e?e.filter(e=>function(e,t){if(e.unavailable){const i=Oe(t,e.attribute);return e.invert?!i:i}if(!t)return!1;const i=e.attribute?t.attributes[e.attribute]:t.state;if(Pe(i))return!1;if(void 0!==e.below||void 0!==e.above){const t=Ie(i);return!(null===t||void 0!==e.below&&t>=e.below||void 0!==e.above&&t<=e.above)}const o=String(i)===(e.active_state??"on");return e.invert?!o:o}(e,t(e.entity))).map((e,i)=>{const o=t(e.entity),n=e.severity??"warning";return{key:`${e.entity}|${i}`,label:e.label??o?.attributes.friendly_name??e.entity,icon:e.icon??He[n],severity:n,color:e.color,fullWidth:e.full_width??!0}}):[]}function je(e,t,i){const o="below_horizon"===i;return"after"===e?"sunset"===t?o:!o:"sunrise"===t?o:!o}function Be(e,t,i){if(void 0!==e.after||void 0!==e.before){const i=t("sun.sun");if(!i)return{met:!1};const o=void 0===e.after||je("after",e.after,i.state),n=void 0===e.before||je("before",e.before,i.state);if(!o||!n)return{met:!1};if(void 0===e.entity)return{met:!0}}if(void 0===e.entity)return{met:!1};const o=t(e.entity),n=Oe(o,e.attribute);if(e.unavailable)return n?Fe(e,o,i):{met:!1};if(n||!o)return{met:!1};let r=!0;const s=e.attribute?o.attributes[e.attribute]:o.state;if(void 0!==e.state){r=(Array.isArray(e.state)?e.state:[e.state]).includes(String(s))}if(r&&(void 0!==e.above||void 0!==e.below)){const t=Ie(s);null===t?r=!1:(void 0!==e.above&&t<=e.above&&(r=!1),void 0!==e.below&&t>=e.below&&(r=!1))}return r?Fe(e,o,i):{met:!1}}function Fe(e,t,i){const o=function(e){if(void 0===e)return 0;if("number"==typeof e)return e;const t=e.split(":").map(e=>Number(e));return t.some(e=>!Number.isFinite(e))?0:3===t.length?3600*t[0]+60*t[1]+t[2]:2===t.length?60*t[0]+t[1]:t[0]??0}(e.for);if(o<=0||!t)return{met:!0};const n=Date.parse(t.last_changed);if(!Number.isFinite(n))return{met:!0};const r=i-n,s=1e3*o;return r<s?{met:!1,recheckInMs:s-r}:{met:!0}}function We(e,t,i){e.dispatchEvent(new CustomEvent(t,{detail:i,bubbles:!0,composed:!0}))}const Ke={en:{open:"Open",tilted:"Tilted",closed:"Closed",half:"Half",unknown:"Unknown",no_value:"no value",temp_no_value:"No Temp",humidity_no_value:"No Humidity",entity_missing:"Entity not found",too_cold:"Too cold",too_hot:"Too hot",too_humid:"Too humid – please ventilate!",too_dry:"Too dry",general:"General",layout:"Layout",appearance:"Appearance",entities:"Entities",title:"Title",room_icon:"Room icon",icon_size:"Icon size",width:"Width",color_style:"Color style",color:"Color",accent_color:"Accent color",bg_tint:"Background tint",state_style:"Window & cover style",show_name:"Show name",show_value:"Show value",show_opening_icon:"Show icon",show_climate:"Show climate",show_icon:"Show room icon",climate:"Climate",temperature:"Temperature sensor",humidity:"Humidity sensor",thresholds_temp:"Temperature thresholds (°C)",thresholds_hum:"Humidity thresholds (%)",threshold_low:"Low",threshold_low_crit:"Low critical",threshold_high:"High",threshold_high_crit:"High critical",humidity_scale:"Threshold scale",scale_relative:"Relative (%)",scale_absolute:"Absolute (g/m³)",humidity_scale_needs_temp:"Needs a temperature sensor — without one the humidity stays uncoloured.",humidity_scale_info_title:"Relative or absolute?",humidity_scale_info:"Relative humidity (%) is the usual reading and is always what the card displays. The thresholds can be judged on the absolute scale instead: the card then derives the water actually held by the air (g/m³) from the temperature and the relative humidity, and compares that.\n\nWhy it helps: 60 % at 22 °C is 11.6 g/m³, but 60 % at 15 °C is only 7.7 g/m³ — the same percentage means very different amounts of water. A fixed percentage therefore warns too early in summer and too late in winter.\n\nRules of thumb (absolute): below ~6 g/m³ the air is dry; from ~13 g/m³ airing out starts to pay off; from ~17 g/m³ mould becomes a risk on cold outer-wall corners in poorly insulated rooms.\n\nAbsolute thresholds need a temperature sensor. Without one the card leaves the humidity unclassified rather than comparing percentages against g/m³ limits.",alert_on_threshold:"Alert bar on critical threshold",openings:"Openings (windows, doors & covers)",opening:"Opening",contact_sensor:"Contact sensor (window / door)",cover_entity:"Cover",control_entity:"Tap entity (e.g. quiet mode)",name:"Name",icon:"Icon",tap_action:"Tap action",controls:"Controls (lights & switches)",control:"Control",entity:"Entity",alerts:"Alerts & sensors",alert:"Alert",active_state:"Active when state",invert:"Invert",unavailable:"When unavailable / no value",below:"Below",above:"Above",severity:"Severity",full_width:"Full-width bar",label:"Label",card_alerts:"Card outline rules",rule:"Rule",outline:"Outline",match:"Match",match_all:"All conditions (AND)",match_any:"Any condition (OR)",condition:"Condition",state:"State",attribute:"Attribute",after:"After",before:"Before",for:"For (duration)",sunrise:"Sunrise",sunset:"Sunset",add:"Add",remove:"Remove",reset:"Reset to theme default",move_up:"Move up",move_down:"Move down",import_from_area:"Import from area",import_from_area_hint:"Fills empty sections with the area's windows, covers, lights and sensors — freely editable afterwards.",area:"Area",severity_info:"Info",severity_warning:"Warning",severity_critical:"Critical",outline_warning:"Warning",outline_critical:"Critical",action_more_info:"More info",action_toggle:"Toggle",action_call_service:"Call service",action_none:"None",layout_classic:"Classic",layout_controls_bottom:"Classic · dock bottom left",layout_header_bar:"Header bar",layout_compact:"Compact",width_auto:"Auto",width_full:"Full",width_half:"Half",style_default:"Default (section)",style_combined:"Combined",style_label:"Icon + text",style_bar:"Bar",style_radial:"Radial",style_color:"Color words",color_theme:"Theme",color_override:"Override"},de:{open:"Offen",tilted:"Gekippt",closed:"Zu",half:"Halb",unknown:"Unbekannt",no_value:"kein Wert",temp_no_value:"Keine Temp.",humidity_no_value:"Keine Feuchte",entity_missing:"Entität nicht gefunden",too_cold:"Zu kalt",too_hot:"Zu warm",too_humid:"Zu feucht – bitte lüften!",too_dry:"Zu trocken",general:"Allgemein",layout:"Layout",appearance:"Darstellung",entities:"Entitäten",title:"Titel",room_icon:"Raum-Icon",icon_size:"Icon-Größe",width:"Breite",color_style:"Farb-Stil",color:"Farbe",accent_color:"Akzentfarbe",bg_tint:"Hintergrundfarbe",state_style:"Fenster- & Rollo-Darstellung",show_name:"Name anzeigen",show_value:"Wert anzeigen",show_opening_icon:"Icon anzeigen",show_climate:"Klima anzeigen",show_icon:"Raum-Icon anzeigen",climate:"Klima",temperature:"Temperatur-Sensor",humidity:"Feuchte-Sensor",thresholds_temp:"Temperatur-Schwellwerte (°C)",thresholds_hum:"Feuchte-Schwellwerte (%)",threshold_low:"Niedrig",threshold_low_crit:"Niedrig kritisch",threshold_high:"Hoch",threshold_high_crit:"Hoch kritisch",humidity_scale:"Grenzwert-Skala",scale_relative:"Relativ (%)",scale_absolute:"Absolut (g/m³)",humidity_scale_needs_temp:"Braucht einen Temperatursensor — ohne den bleibt die Feuchte ungefärbt.",humidity_scale_info_title:"Relativ oder absolut?",humidity_scale_info:"Relative Feuchte (%) ist der übliche Messwert und wird immer angezeigt. Für die Grenzwerte kannst du stattdessen die absolute Skala wählen: Die Karte rechnet dann aus Temperatur und relativer Feuchte den tatsächlichen Wassergehalt der Luft aus (g/m³) und vergleicht diesen.\n\nWarum das hilft: 60 % bei 22 °C sind 11,6 g/m³, 60 % bei 15 °C aber nur 7,7 g/m³ — derselbe Prozentwert bedeutet völlig unterschiedliche Wassermengen. Eine feste Prozentgrenze warnt deshalb im Sommer zu früh und im Winter zu spät.\n\nFaustregeln (absolut): unter ~6 g/m³ ist die Luft trocken, ab ~13 g/m³ lohnt sich Lüften, ab ~17 g/m³ droht in schlecht gedämmten Räumen Schimmel an kalten Außenwandecken.\n\nAbsolute Grenzwerte brauchen einen Temperatursensor. Ohne den lässt die Karte die Feuchte lieber unbewertet, statt Prozente gegen g/m³-Grenzen zu vergleichen.",alert_on_threshold:"Alarm-Leiste bei kritischem Grenzwert",openings:"Öffnungen (Fenster, Türen & Rollos)",opening:"Öffnung",contact_sensor:"Kontaktsensor (Fenster / Tür)",cover_entity:"Rollo (cover)",control_entity:"Tap-Entität (z. B. Leise-Modus)",name:"Name",icon:"Icon",tap_action:"Tap-Aktion",controls:"Steuerung (Lampen & Schalter)",control:"Element",entity:"Entität",alerts:"Alarme & Sensoren",alert:"Alarm",active_state:"Aktiv bei Zustand",invert:"Invertieren",unavailable:"Bei nicht verfügbar / kein Wert",below:"Unter",above:"Über",severity:"Schweregrad",full_width:"Volle Leiste unten",label:"Beschriftung",card_alerts:"Kachel-Rand-Regeln",rule:"Regel",outline:"Rand",match:"Verknüpfung",match_all:"Alle Bedingungen (UND)",match_any:"Eine Bedingung (ODER)",condition:"Bedingung",state:"Zustand",attribute:"Attribut",after:"Nach",before:"Vor",for:"Für (Dauer)",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",add:"Hinzufügen",remove:"Entfernen",reset:"Auf Theme-Standard zurücksetzen",move_up:"Nach oben",move_down:"Nach unten",import_from_area:"Aus Area übernehmen",import_from_area_hint:"Füllt leere Bereiche mit Fenstern, Rollos, Lampen & Sensoren der Area — danach frei anpassbar.",area:"Area",severity_info:"Info",severity_warning:"Warnung",severity_critical:"Kritisch",outline_warning:"Warnung",outline_critical:"Kritisch",action_more_info:"More-Info-Dialog",action_toggle:"Umschalten",action_call_service:"Service aufrufen",action_none:"Keine",layout_classic:"Classic",layout_controls_bottom:"Classic · Dock unten links",layout_header_bar:"Kopfzeile",layout_compact:"Kompakt",width_auto:"Auto",width_full:"Voll",width_half:"Halb",style_default:"Standard (Sektion)",style_combined:"Kombiniert",style_label:"Icon + Text",style_bar:"Bar",style_radial:"Radial",style_color:"Farb-Zustände",color_theme:"Theme",color_override:"Override"}};function Ve(e,t){const i=function(e){return(e?.locale?.language??e?.language??"en").split("-")[0]}(e);return Ke[i]?.[t]??Ke.en[t]??t}function qe(e){if(!e)return;const t=e.trim().replace(/^#/,""),i=3===t.length?t.split("").map(e=>e+e).join(""):t;return/^[0-9a-fA-F]{6}$/.test(i)?[parseInt(i.slice(0,2),16),parseInt(i.slice(2,4),16),parseInt(i.slice(4,6),16)]:void 0}let Ze=class extends ae{constructor(){super(...arguments),this._formReady=!1,this._expanded={},this._openSections={},this._importArea="",this._climateHelper=e=>{if("scale"!==e.name)return;const t=this._config?.climate;return"absolute"===t?.humidity_thresholds?.scale?t.temperature?void 0:this._t("humidity_scale_needs_temp"):void 0},this._computeLabel=e=>({title:this._t("title"),icon:this._t("room_icon"),layout:this._t("layout"),width:this._t("width"),state_style:this._t("state_style"),icon_size:this._t("icon_size"),color_style:this._t("color_style"),accent_color:this._t("accent_color"),bg_tint:this._t("bg_tint"),show_name:this._t("show_name"),show_climate:this._t("show_climate"),show_icon:this._t("show_icon"),temperature:this._t("temperature"),humidity:this._t("humidity"),temperature_thresholds:this._t("thresholds_temp"),humidity_thresholds:this._t("thresholds_hum"),low:this._t("threshold_low"),low_crit:this._t("threshold_low_crit"),high:this._t("threshold_high"),high_crit:this._t("threshold_high_crit"),scale:this._t("humidity_scale"),alert_on_threshold:this._t("alert_on_threshold"),window:this._t("contact_sensor"),cover:this._t("cover_entity"),control_entity:this._t("control_entity"),name:this._t("name"),tap_action:this._t("tap_action"),entity:this._t("entity"),label:this._t("label"),color:this._t("color"),active_state:this._t("active_state"),invert:this._t("invert"),unavailable:this._t("unavailable"),below:this._t("below"),above:this._t("above"),severity:this._t("severity"),full_width:this._t("full_width"),outline:this._t("outline"),match:this._t("match"),state:this._t("state"),attribute:this._t("attribute"),after:this._t("after"),before:this._t("before"),for:this._t("for")}[e.name]??e.name),this._addRule=()=>{const e=[...this._config?.card_alerts??[]];e.push({outline:"warning",match:"all",conditions:[]}),this._writeRules(e),this._expanded={...this._expanded,card_alerts:e.length-1}}}setConfig(e){this._config=e}connectedCallback(){super.connectedCallback(),async function(){if(!customElements.get("ha-form"))try{const e=await(window.loadCardHelpers?.());if(!e)return;const t=await e.createCardElement({type:"entities",entities:[]});await(t.constructor.getConfigElement?.())}catch{}}().then(()=>{this._formReady=!0})}_t(e){return Ve(this.hass,e)}_emit(e){this._config=e,We(this,"config-changed",{config:e})}_select(e,t){return{name:e,selector:{select:{mode:"dropdown",options:t.map(([e,t])=>({value:e,label:this._t(t)}))}}}}_generalSchema(){return[{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"",type:"grid",schema:[this._select("layout",[["classic","layout_classic"],["controls-bottom","layout_controls_bottom"],["header-bar","layout_header_bar"],["compact","layout_compact"]]),this._select("width",[["auto","width_auto"],["full","width_full"],["half","width_half"]]),this._select("state_style",[["combined","style_combined"],["label","style_label"],["bar","style_bar"],["radial","style_radial"],["color","style_color"]]),{name:"icon_size",selector:{number:{min:.6,max:1.8,step:.1,mode:"slider"}}},this._select("color_style",[["theme","color_theme"],["override","color_override"]])]},{name:"",type:"grid",schema:[{name:"show_name",selector:{boolean:{}}},{name:"show_climate",selector:{boolean:{}}},{name:"show_icon",selector:{boolean:{}}}]}]}_climateSchema(){return[{name:"temperature",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"humidity",selector:{entity:{domain:"sensor",device_class:"humidity"}}},{name:"temperature_thresholds",type:"expandable",title:this._t("thresholds_temp"),schema:[{name:"",type:"grid",schema:[{name:"low",selector:{number:{mode:"box",step:.5}}},{name:"low_crit",selector:{number:{mode:"box",step:.5}}},{name:"high",selector:{number:{mode:"box",step:.5}}},{name:"high_crit",selector:{number:{mode:"box",step:.5}}}]}]},{name:"humidity_thresholds",type:"expandable",title:this._t("thresholds_hum"),schema:[this._select("scale",[["relative","scale_relative"],["absolute","scale_absolute"]]),{name:"",type:"grid",schema:[{name:"low",selector:{number:{mode:"box",step:1}}},{name:"low_crit",selector:{number:{mode:"box",step:1}}},{name:"high",selector:{number:{mode:"box",step:1}}},{name:"high_crit",selector:{number:{mode:"box",step:1}}}]}]},{name:"alert_on_threshold",selector:{boolean:{}}}]}_openingSchema(){return[{name:"window",selector:{entity:{domain:["binary_sensor","sensor"]}}},{name:"cover",selector:{entity:{domain:"cover"}}},{name:"control_entity",selector:{entity:{}}},{name:"",type:"grid",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},this._select("state_style",[["","style_default"],["combined","style_combined"],["label","style_label"],["bar","style_bar"],["radial","style_radial"],["color","style_color"]]),this._select("tap_action",[["more-info","action_more_info"],["toggle","action_toggle"],["call-service","action_call_service"],["none","action_none"]])]},{name:"",type:"grid",schema:[{name:"show_name",selector:{boolean:{}}},{name:"show_value",selector:{boolean:{}}},{name:"show_icon",selector:{boolean:{}}}]}]}_controlSchema(){return[{name:"entity",selector:{entity:{domain:["light","switch","input_boolean","fan"]}}},{name:"",type:"grid",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"label",selector:{text:{}}}]}]}_alertSchema(){return[{name:"entity",selector:{entity:{}}},{name:"",type:"grid",schema:[{name:"label",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"active_state",selector:{text:{}}},{name:"invert",selector:{boolean:{}}},{name:"unavailable",selector:{boolean:{}}},{name:"below",selector:{number:{mode:"box"}}},{name:"above",selector:{number:{mode:"box"}}},this._select("severity",[["info","severity_info"],["warning","severity_warning"],["critical","severity_critical"]]),{name:"full_width",selector:{boolean:{}}}]}]}_ruleSchema(){return[{name:"",type:"grid",schema:[this._select("outline",[["warning","outline_warning"],["critical","outline_critical"]]),this._select("match",[["all","match_all"],["any","match_any"]])]}]}_conditionSchema(){return[{name:"entity",selector:{entity:{}}},{name:"",type:"grid",schema:[{name:"state",selector:{text:{}}},{name:"attribute",selector:{text:{}}},{name:"unavailable",selector:{boolean:{}}},{name:"above",selector:{number:{mode:"box"}}},{name:"below",selector:{number:{mode:"box"}}},this._select("after",[["sunrise","sunrise"],["sunset","sunset"]]),this._select("before",[["sunrise","sunrise"],["sunset","sunset"]]),{name:"for",selector:{text:{}}}]}]}render(){if(!this.hass||!this._config||!this._formReady)return K;const e=this._config,t={title:e.title??"",icon:e.icon??"mdi:sofa",layout:e.layout??"classic",width:e.width??"auto",state_style:e.openings?.state_style??"label",icon_size:e.icon_size??1,color_style:e.color_style??"theme",show_name:!1!==e.show_name,show_climate:!1!==e.show_climate,show_icon:!1!==e.show_icon},i=e.climate??{},o=[i.temperature,i.humidity].filter(Boolean).length;return F`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${this._generalSchema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._generalChanged}
      ></ha-form>
      ${"override"===(e.color_style??"theme")?F`
              ${this._renderColorRow(this._t("accent_color"),e.accent_color,e=>this._emit({...this._config,accent_color:e}))}
              ${this._renderColorRow(this._t("bg_tint"),e.bg_tint,e=>this._emit({...this._config,bg_tint:e}))}
            `:K}
      ${this._renderSection("climate",this._t("climate"),o,()=>F`
          <ha-form
            .hass=${this.hass}
            .data=${{temperature:i.temperature??"",humidity:i.humidity??"",temperature_thresholds:i.temperature_thresholds??{},humidity_thresholds:{scale:"relative",...i.humidity_thresholds??{}},alert_on_threshold:i.alert_on_threshold??!1}}
            .schema=${this._climateSchema()}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._climateHelper}
            @value-changed=${this._climateChanged}
          ></ha-form>
          ${this._renderInfo("humidity_scale",this._t("humidity_scale_info_title"),this._t("humidity_scale_info"))}
        `)}
      ${this._renderSection("import",this._t("import_from_area"),0,()=>this._renderAreaImport())}
      ${this._renderList(this._openingsSection())}
      ${this._renderList(this._controlsSection())}
      ${this._renderList(this._alertsSection())} ${this._renderRules()}
    `}_renderInfo(e,t,i){const o=this._openSections[`info:${e}`]??!1;return F`
      <div class="info">
        <button
          class="info-head"
          @click=${()=>this._toggleSection(`info:${e}`)}
        >
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <span class="info-title">${t}</span>
          <ha-icon
            .icon=${o?"mdi:chevron-up":"mdi:chevron-down"}
          ></ha-icon>
        </button>
        ${o?F`<div class="info-body">${i}</div>`:K}
      </div>
    `}_renderSection(e,t,i,o){const n=this._openSections[e]??!1;return F`
      <div class="section">
        <button class="section-head" @click=${()=>this._toggleSection(e)}>
          <ha-icon
            .icon=${n?"mdi:chevron-down":"mdi:chevron-right"}
          ></ha-icon>
          <span class="section-title">${t}</span>
          ${i>0?F`<span class="section-count">${i}</span>`:K}
        </button>
        ${n?F`<div class="section-body">${o()}</div>`:K}
      </div>
    `}_toggleSection(e){this._openSections={...this._openSections,[e]:!this._openSections[e]}}_renderColorRow(e,t,i){return F`
      <div class="color-row">
        <ha-form
          class="color-form"
          .hass=${this.hass}
          .data=${{color:qe(t)}}
          .schema=${[{name:"color",selector:{color_rgb:{}}}]}
          .computeLabel=${()=>e}
          @value-changed=${e=>{e.stopPropagation(),i(function(e){if(Array.isArray(e)&&3===e.length&&e.every(e=>"number"==typeof e&&e>=0&&e<=255))return"#"+e.map(e=>Math.round(e).toString(16).padStart(2,"0")).join("")}(e.detail.value.color))}}
        ></ha-form>
        <ha-icon-button
          class="color-reset"
          .label=${this._t("reset")}
          .disabled=${!t}
          @click=${()=>i(void 0)}
          ><ha-icon icon="mdi:backspace-outline"></ha-icon
        ></ha-icon-button>
      </div>
    `}_renderAreaImport(){return F`
      <div class="area-import">
        <ha-form
          .hass=${this.hass}
          .data=${{area:this._importArea}}
          .schema=${[{name:"area",selector:{area:{}}}]}
          .computeLabel=${()=>this._t("area")}
          @value-changed=${e=>{e.stopPropagation(),this._importArea=e.detail.value.area??""}}
        ></ha-form>
        <mwc-button
          .disabled=${!this._importArea}
          @click=${this._importFromArea}
        >
          ${this._t("import_from_area")}
        </mwc-button>
        <p class="hint">${this._t("import_from_area_hint")}</p>
      </div>
    `}_importFromArea(){if(!this.hass||!this._config||!this._importArea)return;const e=ze(this.hass,this._importArea);this._emit(Re(this._config,e))}_openingsSection(){return{key:"openings",titleKey:"openings",itemKey:"opening",items:this._config?.openings?.items??[],schema:()=>this._openingSchema(),newItem:()=>({}),summary:e=>e.name??e.window??e.door??e.cover??this._t("opening"),formData:e=>({...e,state_style:e.state_style??"",show_name:e.show_name??!0,show_value:e.show_value??!0,show_icon:e.show_icon??!0}),normalizeItem:e=>{const t={...e};for(const e of["show_name","show_value","show_icon"])!0===t[e]&&delete t[e];return t},computeLabel:e=>({show_name:this._t("show_name"),show_value:this._t("show_value"),show_icon:this._t("show_opening_icon")}[e.name]??this._computeLabel(e))}}_controlsSection(){return{key:"controls",titleKey:"controls",itemKey:"control",items:this._config?.controls??[],schema:()=>this._controlSchema(),newItem:()=>({entity:""}),summary:e=>e.name??e.entity??this._t("control"),colorField:!0}}_alertsSection(){return{key:"alerts",titleKey:"alerts",itemKey:"alert",items:this._config?.alerts??[],schema:()=>this._alertSchema(),newItem:()=>({entity:""}),summary:e=>e.label??e.entity??this._t("alert"),colorField:!0}}_renderList(e){return this._renderSection(e.key,this._t(e.titleKey),e.items.length,()=>this._renderListBody(e))}_renderListBody(e){const t=this._expanded[e.key]??null;return F`
      <div class="list">
        ${e.items.map((i,o)=>{const n=t===o;return F`
            <div class="list-item">
              <div class="list-head">
                <button
                  class="list-title"
                  @click=${()=>this._toggleExpanded(e.key,o)}
                >
                  <ha-icon
                    .icon=${n?"mdi:chevron-down":"mdi:chevron-right"}
                  ></ha-icon>
                  ${e.summary(i)}
                </button>
                <ha-icon-button
                  .label=${this._t("move_up")}
                  .disabled=${0===o}
                  @click=${()=>this._moveItem(e,o,-1)}
                  ><ha-icon icon="mdi:arrow-up"></ha-icon
                ></ha-icon-button>
                <ha-icon-button
                  .label=${this._t("move_down")}
                  .disabled=${o===e.items.length-1}
                  @click=${()=>this._moveItem(e,o,1)}
                  ><ha-icon icon="mdi:arrow-down"></ha-icon
                ></ha-icon-button>
                <ha-icon-button
                  .label=${this._t("remove")}
                  @click=${()=>this._removeItem(e,o)}
                  ><ha-icon icon="mdi:close"></ha-icon
                ></ha-icon-button>
              </div>
              ${n?F`
                      <ha-form
                        .hass=${this.hass}
                        .data=${e.formData?e.formData(i):i}
                        .schema=${e.schema(i)}
                        .computeLabel=${e.computeLabel??this._computeLabel}
                        @value-changed=${t=>this._itemChanged(e,o,t)}
                      ></ha-form>
                      ${e.colorField?this._renderColorRow(this._t("color"),i.color,t=>this._itemColorChanged(e,o,t)):K}
                    `:K}
            </div>
          `})}
        <mwc-button @click=${()=>this._addItem(e)}>
          + ${this._t("add")} · ${this._t(e.itemKey)}
        </mwc-button>
      </div>
    `}_toggleExpanded(e,t){this._expanded={...this._expanded,[e]:this._expanded[e]===t?null:t}}_writeSection(e,t){const i={...this._config};"openings"===e.key?i.openings={...i.openings,items:t}:"controls"===e.key?i.controls=t:"alerts"===e.key?i.alerts=t:i.card_alerts=t,this._emit(i)}_addItem(e){this._writeSection(e,[...e.items,e.newItem()]),this._expanded={...this._expanded,[e.key]:e.items.length}}_removeItem(e,t){const i=[...e.items];i.splice(t,1),this._writeSection(e,i),this._expanded={...this._expanded,[e.key]:null}}_moveItem(e,t,i){const o=t+i;if(o<0||o>=e.items.length)return;const n=[...e.items],[r]=n.splice(t,1);n.splice(o,0,r),this._writeSection(e,n),this._expanded={...this._expanded,[e.key]:o}}_itemChanged(e,t,i){i.stopPropagation();const o=[...e.items];let n=Ge({...o[t],...i.detail.value});e.normalizeItem&&(n=e.normalizeItem(n)),o[t]=n,this._writeSection(e,o)}_itemColorChanged(e,t,i){const o=[...e.items];let n=Ge({...o[t],color:i});e.normalizeItem&&(n=e.normalizeItem(n)),o[t]=n,this._writeSection(e,o)}_renderRules(){const e=this._config?.card_alerts??[];return this._renderSection("card_alerts",this._t("card_alerts"),e.length,()=>this._renderRulesBody(e))}_renderRulesBody(e){const t=this._expanded.card_alerts??null;return F`
      <div class="list">
        ${e.map((e,i)=>{const o=t===i;return F`
            <div class="list-item">
              <div class="list-head">
                <button
                  class="list-title"
                  @click=${()=>this._toggleExpanded("card_alerts",i)}
                >
                  <ha-icon
                    .icon=${o?"mdi:chevron-down":"mdi:chevron-right"}
                  ></ha-icon>
                  ${this._t("outline")}:
                  ${this._t(`outline_${"warn"===e.outline?"warning":e.outline}`)}
                  · ${e.conditions.length}× ${this._t("condition")}
                </button>
                <ha-icon-button
                  .label=${this._t("remove")}
                  @click=${()=>this._removeRule(i)}
                  ><ha-icon icon="mdi:close"></ha-icon
                ></ha-icon-button>
              </div>
              ${o?F`
                      <ha-form
                        .hass=${this.hass}
                        .data=${{outline:"warn"===e.outline?"warning":e.outline,match:e.match??"all"}}
                        .schema=${this._ruleSchema()}
                        .computeLabel=${this._computeLabel}
                        @value-changed=${e=>this._ruleChanged(i,e)}
                      ></ha-form>
                      ${e.conditions.map((e,t)=>F`
                          <div class="condition">
                            <div class="condition-head">
                              <span
                                >${this._t("condition")} ${t+1}</span
                              >
                              <ha-icon-button
                                .label=${this._t("remove")}
                                @click=${()=>this._removeCondition(i,t)}
                                ><ha-icon icon="mdi:close"></ha-icon
                              ></ha-icon-button>
                            </div>
                            <ha-form
                              .hass=${this.hass}
                              .data=${e}
                              .schema=${this._conditionSchema()}
                              .computeLabel=${this._computeLabel}
                              @value-changed=${e=>this._conditionChanged(i,t,e)}
                            ></ha-form>
                          </div>
                        `)}
                      <mwc-button @click=${()=>this._addCondition(i)}>
                        + ${this._t("add")} · ${this._t("condition")}
                      </mwc-button>
                    `:K}
            </div>
          `})}
        <mwc-button @click=${this._addRule}>
          + ${this._t("add")} · ${this._t("rule")}
        </mwc-button>
      </div>
    `}_writeRules(e){this._emit({...this._config,card_alerts:e})}_removeRule(e){const t=[...this._config?.card_alerts??[]];t.splice(e,1),this._writeRules(t),this._expanded={...this._expanded,card_alerts:null}}_ruleChanged(e,t){t.stopPropagation();const i=[...this._config?.card_alerts??[]];i[e]={...i[e],...t.detail.value},this._writeRules(i)}_addCondition(e){const t=[...this._config?.card_alerts??[]];t[e]={...t[e],conditions:[...t[e].conditions,{}]},this._writeRules(t)}_removeCondition(e,t){const i=[...this._config?.card_alerts??[]],o=[...i[e].conditions];o.splice(t,1),i[e]={...i[e],conditions:o},this._writeRules(i)}_conditionChanged(e,t,i){i.stopPropagation();const o=[...this._config?.card_alerts??[]],n=[...o[e].conditions];n[t]=Ge(i.detail.value),o[e]={...o[e],conditions:n},this._writeRules(o)}_generalChanged(e){e.stopPropagation();const t=e.detail.value,i={...this._config,title:t.title||void 0,icon:t.icon||void 0,layout:t.layout,width:t.width,icon_size:t.icon_size,color_style:t.color_style,show_name:t.show_name,show_climate:t.show_climate,show_icon:t.show_icon,openings:{...this._config?.openings,state_style:t.state_style}};this._emit(i)}_climateChanged(e){e.stopPropagation();const t=e.detail.value,i=Ge({temperature:t.temperature,humidity:t.humidity,temperature_thresholds:Ge(t.temperature_thresholds??{}),humidity_thresholds:this._humidityThresholds(t.humidity_thresholds),alert_on_threshold:t.alert_on_threshold||void 0});this._emit({...this._config,climate:i})}_humidityThresholds(e){const t=Ge(e??{});return"relative"===t.scale&&delete t.scale,t}static{this.styles=s`
    .section {
      margin-top: 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 12px;
      overflow: hidden;
    }
    .color-row {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
    }
    .color-row .color-form {
      flex: 1;
      min-width: 0;
    }
    .color-row .color-reset {
      flex-shrink: 0;
      --mdc-icon-button-size: 40px;
      --mdc-icon-size: 20px;
    }
    .info {
      margin-top: 8px;
      border: 1px solid
        color-mix(in srgb, var(--primary-text-color, #212121) 12%, transparent);
      border-radius: 10px;
      overflow: hidden;
    }
    .info-head {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 8px 10px;
      background: none;
      border: none;
      color: var(--secondary-text-color, #727272);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      text-align: left;
    }
    .info-head:hover {
      background: color-mix(
        in srgb,
        var(--primary-text-color, #212121) 4%,
        transparent
      );
    }
    .info-head ha-icon {
      --mdc-icon-size: 18px;
      flex-shrink: 0;
    }
    .info-title {
      flex: 1;
      min-width: 0;
    }
    .info-body {
      padding: 0 12px 12px 12px;
      color: var(--secondary-text-color, #727272);
      font-size: 13px;
      line-height: 1.5;
      white-space: pre-line;
    }
    .section-head {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 12px 10px;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      text-align: left;
    }
    .section-head:hover {
      background: color-mix(
        in srgb,
        var(--primary-text-color, #212121) 4%,
        transparent
      );
    }
    .section-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .section-count {
      flex-shrink: 0;
      min-width: 22px;
      padding: 1px 7px;
      border-radius: 11px;
      background: color-mix(
        in srgb,
        var(--primary-color, #2f7d54) 15%,
        transparent
      );
      color: var(--primary-color, #2f7d54);
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      box-sizing: border-box;
    }
    .section-body {
      padding: 4px 12px 16px;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .list-item {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px;
      padding: 8px 12px 14px;
    }
    .list-head {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    /* Breathing room between the item form and the actions below it. */
    .list-item ha-form {
      margin-top: 8px;
    }
    .list-item mwc-button,
    .list mwc-button {
      margin-top: 8px;
    }
    .list-title {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      padding: 6px 0;
      text-align: left;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ha-icon-button {
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 18px;
    }
    .condition {
      margin: 12px 0 0 12px;
      padding: 10px 12px 12px;
      border-left: 3px solid var(--primary-color, #2f7d54);
      background: color-mix(
        in srgb,
        var(--primary-color, #2f7d54) 6%,
        transparent
      );
      border-radius: 6px;
    }
    .condition-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 500;
      font-size: 13px;
      margin-bottom: 2px;
    }
    .area-import {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 16px;
    }
    .area-import ha-select {
      flex: 1;
      min-width: 180px;
    }
    .hint {
      flex-basis: 100%;
      margin: 2px 0 0;
      font-size: 12px;
      color: var(--secondary-text-color, #757575);
    }
    ha-form {
      display: block;
      margin-top: 4px;
    }
  `}};function Ge(e){const t={};for(const[i,o]of Object.entries(e??{}))""!==o&&null!=o&&("object"!=typeof o||Array.isArray(o)||0!==Object.keys(o).length)&&(t[i]=o);return t}e([ue({attribute:!1})],Ze.prototype,"hass",void 0),e([pe()],Ze.prototype,"_config",void 0),e([pe()],Ze.prototype,"_formReady",void 0),e([pe()],Ze.prototype,"_expanded",void 0),e([pe()],Ze.prototype,"_openSections",void 0),e([pe()],Ze.prototype,"_importArea",void 0),Ze=e([le("deluxe-room-card-editor")],Ze);const Je=2*Math.PI*15.5;let Xe=class extends ae{constructor(){super(...arguments),this._narrow=!1,this._entities=new Set,this._areaApplied=!1,this._longPressed=!1,this._getState=e=>this._hass?.states[e]}static getConfigElement(){return document.createElement("deluxe-room-card-editor")}static getStubConfig(e){return function(e){const t={type:"custom:deluxe-room-card",title:"Living room",icon:"mdi:sofa",openings:{state_style:"label",items:[]},controls:[]};if(!e)return t;const i=Object.keys(e.areas??{})[0];if(i){const o=e.areas?.[i],n=Re(t,ze(e,i));return n.title=o?.name??t.title,n}return t}(e)}setConfig(e){this._config=Ce(e),this._entities=Ee(this._config),this._areaApplied=!1,this._maybeApplyArea()}set hass(e){const t=this._hass;if(this._hass=e,this._maybeApplyArea(),t&&e){for(const i of this._entities)if(t.states[i]!==e.states[i])return void this.requestUpdate()}else this.requestUpdate()}get hass(){return this._hass}getCardSize(){if(!this._config)return 3;const e="compact"===this._config.layout?2:3,t=(this._config.alerts??[]).filter(e=>e.full_width).length;return e+Math.min(t,2)}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}_maybeApplyArea(){!this._areaApplied&&this._config?.from_area&&this._hass&&(this._areaApplied=!0,this._config=Ce(Re(this._config,ze(this._hass,this._config.from_area))),this._entities=Ee(this._config))}connectedCallback(){super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._resizeObserver=new ResizeObserver(e=>{const t=e[0]?.contentRect.width??0;t>0&&(this._narrow=t<380)}),this._resizeObserver.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._outlineTimer&&clearTimeout(this._outlineTimer)}_t(e){return Ve(this._hass,e)}_moreInfo(e){We(this,"hass-more-info",{entityId:e})}_handleOpeningTap(e){switch(e.tapAction){case"none":return;case"toggle":return void(e.actionEntity&&this._hass?.callService("homeassistant","toggle",{entity_id:e.actionEntity}));case"call-service":{if(!e.service)return;const[t,i]=e.service.split(".",2);if(!t||!i)return;return void this._hass?.callService(t,i,{...e.actionEntity?{entity_id:e.actionEntity}:{},...e.serviceData??{}})}default:e.moreInfoEntity&&this._moreInfo(e.moreInfoEntity)}}_controlPressStart(e){this._longPressed=!1,this._pressTimer=setTimeout(()=>{this._longPressed=!0,this._moreInfo(e)},500)}_controlPressEnd(e){this._pressTimer&&clearTimeout(this._pressTimer),this._longPressed||this._hass?.callService("homeassistant","toggle",{entity_id:e})}_controlPressCancel(){this._pressTimer&&clearTimeout(this._pressTimer),this._longPressed=!1}render(){const e=this._config;if(!e)return K;const t=e.layout??"classic",i="half"===e.width||"auto"===e.width&&this._narrow,o=e.icon_size??1,{outline:n,recheckInMs:r}=function(e,t,i){if(!e||0===e.length)return{outline:null};let o,n=null;for(const r of e){const e=r.match??"all",s=r.conditions.map(e=>Be(e,t,i));for(const e of s)void 0!==e.recheckInMs&&(o=Math.min(o??1/0,e.recheckInMs));const a="any"===e?s.some(e=>e.met):s.length>0&&s.every(e=>e.met);if(a){if("critical"===("warn"===r.outline?"warning":r.outline))return{outline:"critical",recheckInMs:o};n="warning"}}return{outline:n,recheckInMs:o}}(e.card_alerts,this._getState,Date.now());this._scheduleOutlineRecheck(r);const s=[...De(e.alerts,this._getState),...this._thresholdAlerts()],a=s.filter(e=>e.fullWidth),c=s.filter(e=>!e.fullWidth),l={};"override"===e.color_style&&(e.accent_color&&(l["--drc-accent"]=e.accent_color),e.bg_tint&&(l["--drc-bg"]=e.bg_tint));const h=e.colors??{};h.window_open&&(l["--drc-open"]=h.window_open),h.window_tilted&&(l["--drc-tilted"]=h.window_tilted),h.window_closed&&(l["--drc-closed"]=h.window_closed),h.warning&&(l["--drc-warning"]=h.warning),h.critical&&(l["--drc-critical"]=h.critical),l["--drc-scale"]=String(o);return F`
      <ha-card class=${ge({card:!0,narrow:i,[`layout-${t}`]:!0,"outline-warning":"warning"===n,"outline-critical":"critical"===n})} style=${we(l)}>
        ${"classic"===t||"controls-bottom"===t?this._renderClassic(c,i):"header-bar"===t?this._renderHeaderBar(c):this._renderCompact(c)}
        ${a.length>0?F`<div class="alert-bars">
                ${a.map(e=>this._renderAlertBar(e))}
              </div>`:K}
      </ha-card>
    `}_scheduleOutlineRecheck(e){this._outlineTimer&&clearTimeout(this._outlineTimer),void 0!==e&&(this._outlineTimer=setTimeout(()=>this.requestUpdate(),Math.max(1e3,e)))}_thresholdAlerts(){const e=this._config?.climate;if(!e?.alert_on_threshold)return[];const t=[],i=e.temperature?this._getState(e.temperature)?.state:void 0,o=e.humidity?this._getState(e.humidity)?.state:void 0,n=Me(i,e.temperature_thresholds),r=Le(o,i,e.humidity_thresholds);return"low_crit"===n&&t.push(this._climateAlert("temp-low","too_cold","mdi:snowflake")),"high_crit"===n&&t.push(this._climateAlert("temp-high","too_hot","mdi:thermometer-alert")),"high_crit"===r&&t.push(this._climateAlert("hum-high","too_humid","mdi:water-percent-alert")),"low_crit"===r&&t.push(this._climateAlert("hum-low","too_dry","mdi:water-off")),t}_climateAlert(e,t,i){return{key:`climate|${e}`,label:this._t(t),icon:i,severity:"critical",fullWidth:!0}}_renderClassic(e,t){const i=this._config,o="controls-bottom"===i.layout;return F`
      ${!1!==i.show_icon?F`
              <div class="backdrop"></div>
              <ha-icon class="room-icon" .icon=${i.icon}></ha-icon>
            `:K}
      <div class="content">
        <div class="row top">
          ${this._renderTitleBlock()}
          <div class="chip-stack ${t?"wrap":"column"}">
            ${this._renderOpenings()}
            ${e.map(e=>this._renderAlertChip(e))}
          </div>
        </div>
        <div class="dock-outer ${o?"left":"right"}">
          ${this._renderDock()}
        </div>
      </div>
    `}_renderHeaderBar(e){const t=this._config;return F`
      <div class="content">
        <div class="header-bar">
          ${!1!==t.show_icon?F`<span class="inline-icon"
                  ><ha-icon .icon=${t.icon}></ha-icon
                ></span>`:K}
          ${this._renderTitleBlock()}
        </div>
        <div class="row">
          <div class="chip-stack wrap">
            ${this._renderOpenings()}
            ${e.map(e=>this._renderAlertChip(e))}
          </div>
          ${this._renderDock()}
        </div>
      </div>
    `}_renderCompact(e){const t=this._config;return F`
      <div class="content compact">
        <div class="row center">
          ${!1!==t.show_icon?F`<span class="inline-icon"
                  ><ha-icon .icon=${t.icon}></ha-icon
                ></span>`:K}
          ${this._renderTitleBlock()}
          <div class="chip-stack wrap end">
            ${this._renderOpenings()}
            ${e.map(e=>this._renderAlertChip(e))}
          </div>
          ${this._renderDock()}
        </div>
      </div>
    `}_renderTitleBlock(){const e=this._config;return F`
      <div class="title-block">
        ${!1!==e.show_name?F`<span class="title">${e.title??""}</span>`:K}
        ${!1!==e.show_climate?this._renderClimate():K}
      </div>
    `}_renderClimate(){const e=this._config?.climate;return e?.temperature||e?.humidity?F`
      <div class="climate">
        ${e.temperature?this._renderClimateValue(e.temperature,"°C","mdi:thermometer",e.temperature_thresholds,"temp_no_value"):K}
        ${e.humidity?this._renderClimateValue(e.humidity,"%","mdi:water-percent",e.humidity_thresholds,"humidity_no_value",Le(this._getState(e.humidity)?.state,e.temperature?this._getState(e.temperature)?.state:void 0,e.humidity_thresholds)):K}
      </div>
    `:K}_renderClimateValue(e,t,i,o,n,r){const s=this._getState(e),a=function(e,t){const i=Ie(e);if(null===i)return null;const o=Math.round(10*i)/10,n=Number.isInteger(o)?o.toFixed(1):String(o);return t?`${n} ${t}`:n}(s?.state,t);if(null===a)return F`<span class="climate-value missing">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        ${s?this._t(n):this._t("entity_missing")}
      </span>`;const c=r??Me(s?.state,o);return F`<span class="climate-value level-${c}">
      <ha-icon .icon=${i}></ha-icon>
      ${a}
    </span>`}_renderOpenings(){const e=this._config.openings,t=e?.state_style??"label";return(e?.items??[]).map((i,o)=>{const n=i.state_style??t,r={showName:i.show_name??e?.show_name??!0,showValue:i.show_value??e?.show_value??!0,showIcon:i.show_icon??e?.show_icon??!0};return this._renderOpeningChip(Ne(i,this._getState,n,o,r))})}_openingIcon(e){if(e.icon)return e.icon;const t=this._config;if(e.hasCover)return e.isDoor?"mdi:door-sliding":t.cover_icon??"mdi:blinds";if(e.isDoor)return"open"===e.windowState?"mdi:door-open":"mdi:door-closed";switch(e.windowState){case"open":return"mdi:window-open-variant";case"tilted":return"mdi:window-open";default:return t.window_icon??"mdi:window-closed-variant"}}_renderOpeningChip(e){const t=e=>this._t(e),i=null!==e.windowState?t(e.windowState):null!==e.position?e.coverClosed?t("closed"):e.position>=99?t("open"):`${Math.round(e.position)} %`:t("unknown");let o;o="color"===e.style?e.hasCover?null===e.position?t("unknown"):e.coverClosed?t("closed"):e.position>=99?t("open"):t("half"):i:e.hasCover?null!==e.position?`${Math.round(e.position)} %`:t("no_value"):i;const n={chip:!0,[`chip-${e.style}`]:!0,[`win-${e.windowState??"none"}`]:!0,"cover-closed":e.hasCover&&e.coverClosed,"cover-open":e.hasCover&&!e.coverClosed,"has-cover":e.hasCover,missing:e.missing,tappable:"none"!==e.tapAction},r=e.position??0,s="radial"===e.style&&e.hasCover,a="bar"===e.style&&e.hasCover,c=!s&&!a&&(e.showValue||e.missing),l=!a&&(e.showName||c),h=e.missing?t("entity_missing"):o;return F`
      <button
        class=${ge(n)}
        title=${e.name}
        @click=${()=>this._handleOpeningTap(e)}
      >
        ${"combined"!==e.style||!e.hasCover&&null===e.windowState?e.showIcon?F`<ha-icon
                  class="chip-icon"
                  .icon=${this._openingIcon(e)}
                ></ha-icon>`:K:F`
                <span class="combined-box">
                  <span
                    class="combined-shade"
                    style=${we({height:100-r+"%"})}
                  ></span>
                </span>
              `}
        ${a?F`
                <span class="bar-block">
                  ${e.showName?F`<span class="bar-name">${e.name}</span>`:K}
                  <span class="bar-track"
                    ><span
                      class="bar-fill"
                      style=${we({width:`${r}%`})}
                    ></span
                  ></span>
                  ${e.showValue||e.missing?F`<span class="bar-value">${h}</span>`:K}
                </span>
              `:K}
        ${l?F`
                <span class="chip-text">
                  ${e.showName?F`<span class="chip-title">${e.name}</span>`:K}
                  ${c?F`<span class="chip-sub">
                          ${e.missing?t("entity_missing"):o}
                        </span>`:K}
                </span>
              `:K}
        ${s?this._renderRadial(r,e.showValue):K}
      </button>
    `}_renderRadial(e,t){const i=(e/100*Je).toFixed(1);return F`
      <span class="radial">
        <svg viewBox="0 0 36 36">
          <circle class="radial-track" cx="18" cy="18" r="15.5"></circle>
          <circle
            class="radial-fill"
            cx="18"
            cy="18"
            r="15.5"
            stroke-dasharray="${i} ${Je.toFixed(1)}"
          ></circle>
        </svg>
        ${t?F`<span class="radial-label">${Math.round(e)}</span>`:K}
      </span>
    `}_renderDock(){const e=this._config?.controls??[];return 0===e.length?K:F`
      <div class="dock">
        ${e.map(e=>{const t=this._getState(e.entity),i="on"===t?.state,o=void 0===t,n=e.icon??(e.entity.startsWith("switch.")?"mdi:power":"mdi:lightbulb"),r=e.name??t?.attributes.friendly_name??e.entity,s=i&&e.color?{background:e.color}:{};return F`
            <button
              class=${ge({control:!0,on:i,missing:o,labeled:!!e.label})}
              style=${we(s)}
              title=${o?`${r} (${this._t("entity_missing")})`:r}
              @pointerdown=${()=>this._controlPressStart(e.entity)}
              @pointerup=${()=>this._controlPressEnd(e.entity)}
              @pointerleave=${()=>this._controlPressCancel()}
            >
              <ha-icon .icon=${n}></ha-icon>
              ${e.label?F`<span class="control-label">${e.label}</span>`:K}
            </button>
          `})}
      </div>
    `}_renderAlertChip(e){return F`
      <span
        class="chip alert-chip severity-${e.severity}"
        style=${we(e.color?{background:e.color}:{})}
      >
        <ha-icon class="chip-icon" .icon=${e.icon}></ha-icon>
        <span class="chip-text">
          <span class="chip-title">${e.label}</span>
        </span>
      </span>
    `}_renderAlertBar(e){return F`
      <div
        class="alert-bar severity-${e.severity}"
        style=${we(e.color?{background:e.color}:{})}
      >
        <ha-icon .icon=${e.icon}></ha-icon>
        ${e.label}
      </div>
    `}static{this.styles=s`
    :host {
      display: block;
      --drc-accent: var(
        --deluxe-room-card-accent,
        var(--primary-color, #2f7d54)
      );
      --drc-bg: var(--ha-card-background, var(--card-background-color, #fff));
      --drc-text: var(--primary-text-color, #212121);
      --drc-secondary: var(--secondary-text-color, #757575);
      --drc-closed: var(
        --deluxe-room-card-closed,
        var(--success-color, #4bab77)
      );
      --drc-tilted: var(
        --deluxe-room-card-tilted,
        var(--warning-color, #d6a03f)
      );
      --drc-open: var(--deluxe-room-card-open, var(--error-color, #e2645b));
      --drc-warning: var(--warning-color, #d6a03f);
      --drc-critical: var(--error-color, #d23b34);
      --drc-control-bg: var(--secondary-background-color, #e5e5e5);
      --drc-control-on: var(--deluxe-room-card-control-on, #f2a33c);
      --drc-chip-fg: #fff;
      --drc-scale: 1;
    }
    ha-card {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      height: 100%;
      min-height: 150px;
      padding: 20px 22px;
      background: var(--drc-bg);
      color: var(--drc-text);
      display: flex;
      flex-direction: column;
    }
    ha-card.layout-compact {
      min-height: 0;
      padding: 16px 20px;
    }
    ha-card.outline-warning {
      border: 2px solid var(--drc-warning);
      box-shadow:
        0 0 0 1px var(--drc-warning),
        0 0 26px -8px var(--drc-warning);
    }
    ha-card.outline-critical {
      border: 2px solid var(--drc-critical);
      box-shadow:
        0 0 0 1px var(--drc-critical),
        0 0 26px -8px var(--drc-critical);
    }

    /* Classic backdrop icon */
    .backdrop {
      position: absolute;
      left: calc(-30px - (190px * var(--drc-scale) - 190px) / 2);
      bottom: calc(-40px - (190px * var(--drc-scale) - 190px) / 2);
      width: calc(190px * var(--drc-scale));
      height: calc(190px * var(--drc-scale));
      border-radius: 50%;
      background: var(--drc-accent);
      opacity: 0.18;
      z-index: 0;
    }
    .room-icon {
      position: absolute;
      left: 20px;
      bottom: 16px;
      z-index: 0;
      color: var(--drc-secondary);
      opacity: 0.55;
      --mdc-icon-size: calc(80px * var(--drc-scale));
    }
    .inline-icon {
      flex-shrink: 0;
      width: calc(50px * var(--drc-scale));
      height: calc(50px * var(--drc-scale));
      border-radius: 14px;
      background: color-mix(in srgb, var(--drc-accent) 20%, transparent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--drc-secondary);
      --mdc-icon-size: calc(30px * var(--drc-scale));
    }

    .content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 14px;
      min-width: 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      min-width: 0;
    }
    .row.center {
      align-items: center;
    }
    .header-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      background: color-mix(in srgb, var(--drc-text) 5%, transparent);
      border: 1px solid color-mix(in srgb, var(--drc-text) 7%, transparent);
      border-radius: 12px;
      padding: 10px 14px;
    }

    .title-block {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1 1 auto;
    }
    .title {
      font-weight: 700;
      font-size: 25px;
      line-height: 1.1;
      letter-spacing: -0.01em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ha-card.narrow .title,
    ha-card.layout-compact .title {
      font-size: 22px;
    }
    .climate {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 3px;
    }
    .climate-value {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: var(--drc-secondary);
      font-size: 15px;
      font-weight: 500;
      /* Keep "15.6 °C" on one line — never let the unit wrap. */
      white-space: nowrap;
      --mdc-icon-size: 17px;
    }
    .climate-value.level-low {
      color: var(--info-color, #5aa9e0);
    }
    .climate-value.level-high {
      color: var(--drc-warning);
    }
    .climate-value.level-low_crit,
    .climate-value.level-high_crit {
      color: var(--drc-critical);
    }
    .climate-value.missing {
      color: var(--drc-warning);
      font-size: 14px;
    }

    /* Chips */
    .chip-stack {
      display: flex;
      gap: 9px;
      min-width: 0;
    }
    .chip-stack.column {
      flex-direction: column;
      align-items: flex-end;
      flex-shrink: 0;
    }
    .chip-stack.wrap {
      flex-wrap: wrap;
      align-content: flex-start;
      flex: 1 1 auto;
    }
    .chip-stack.end {
      justify-content: flex-end;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 7px 14px;
      border-radius: 24px;
      border: 2px solid transparent;
      background: var(--drc-accent);
      color: var(--drc-chip-fg);
      min-width: 118px;
      box-sizing: border-box;
      font: inherit;
      text-align: left;
      cursor: default;
    }
    .chip.tappable {
      cursor: pointer;
    }
    .chip-icon {
      flex-shrink: 0;
      --mdc-icon-size: 22px;
    }
    .chip-text {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
      min-width: 0;
    }
    .chip-title {
      font-weight: 600;
      font-size: 14.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chip-sub {
      opacity: 0.85;
      font-size: 12.5px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    /* Window-only chips: state color as background */
    .chip:not(.has-cover).win-open {
      background: var(--drc-critical);
    }
    .chip:not(.has-cover).win-tilted {
      background: var(--drc-tilted);
      color: var(--deluxe-room-card-tilted-fg, #1c1200);
    }
    .chip:not(.has-cover).win-unknown {
      background: color-mix(in srgb, var(--drc-secondary) 35%, transparent);
      color: var(--drc-text);
    }
    /* Cover chips: accent when open, muted when fully closed */
    .chip.has-cover.cover-closed {
      background: color-mix(in srgb, var(--drc-text) 10%, transparent);
      color: var(--drc-text);
    }
    /* Contact frame around cover chips: a bold, glowing outline in the
       window-state color — reads clearly even over a filled (blue) chip. */
    .chip.has-cover.win-open {
      --chip-frame: var(--drc-open);
    }
    .chip.has-cover.win-tilted {
      --chip-frame: var(--drc-tilted);
    }
    .chip.has-cover.win-closed {
      --chip-frame: var(--drc-closed);
    }
    .chip.has-cover.win-open,
    .chip.has-cover.win-tilted,
    .chip.has-cover.win-closed {
      border-color: var(--chip-frame);
      border-width: 3px;
      box-shadow:
        0 0 0 1px var(--chip-frame),
        0 0 10px -3px var(--chip-frame);
    }
    .chip.missing {
      background: color-mix(in srgb, var(--drc-warning) 25%, transparent);
      color: var(--drc-text);
      border-color: var(--drc-warning);
    }
    .chip.chip-combined {
      background: color-mix(in srgb, var(--drc-text) 8%, transparent);
      color: var(--drc-text);
    }
    /* Bar chips size to their compact content, not the 118px chip default. */
    .chip.chip-bar {
      min-width: 0;
      gap: 8px;
    }
    /* Compact, neutral cover-position box — the state color lives on the
       chip outline now, not on this box. */
    .combined-box {
      position: relative;
      width: 24px;
      height: 24px;
      border: 1.5px solid color-mix(in srgb, var(--drc-text) 30%, transparent);
      border-radius: 5px;
      overflow: hidden;
      background: color-mix(in srgb, var(--drc-accent) 22%, transparent);
      flex-shrink: 0;
      display: inline-block;
      box-sizing: border-box;
    }
    .combined-shade {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      background: color-mix(in srgb, var(--drc-secondary) 65%, transparent);
    }

    /* Bar style: name over the bar, value below — a compact vertical stack. */
    .bar-block {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 1px;
      min-width: 58px;
      flex: 1 1 auto;
    }
    .bar-name {
      font-size: 11px;
      font-weight: 600;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bar-value {
      font-size: 9.5px;
      font-weight: 500;
      line-height: 1.05;
      opacity: 0.8;
    }
    .bar-track {
      width: 52px;
      height: 8px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.35);
      overflow: hidden;
      flex-shrink: 0;
    }
    .bar-block .bar-track {
      width: auto;
      height: 6px;
      margin: 1px 0;
    }
    .bar-fill {
      display: block;
      height: 100%;
      background: currentColor;
      border-radius: 4px;
    }

    .radial {
      position: relative;
      width: 34px;
      height: 34px;
      flex-shrink: 0;
    }
    .radial svg {
      width: 34px;
      height: 34px;
      transform: rotate(-90deg);
    }
    .radial circle {
      fill: none;
      stroke-width: 4;
    }
    .radial-track {
      stroke: rgba(0, 0, 0, 0.35);
    }
    .radial-fill {
      stroke: currentColor;
      stroke-linecap: round;
    }
    .radial-label {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
    }

    /* Dock */
    .dock-outer {
      margin-top: auto;
      display: flex;
    }
    .dock-outer.right {
      justify-content: flex-end;
    }
    .dock-outer.left {
      justify-content: flex-start;
    }
    .dock {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: flex-end;
      flex-shrink: 0;
      max-width: 230px;
    }
    .dock-outer.left .dock {
      justify-content: flex-start;
    }
    .dock-outer.left .dock,
    ha-card.layout-header-bar .dock,
    ha-card.layout-compact .dock {
      max-width: none;
    }
    ha-card.narrow .dock {
      max-width: 150px;
    }
    ha-card.narrow .dock-outer.left .dock {
      max-width: none;
    }
    .control {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      height: 46px;
      min-width: 46px;
      padding: 0;
      border: none;
      border-radius: 23px;
      background: var(--drc-control-bg);
      color: var(--drc-secondary);
      cursor: pointer;
      flex-shrink: 0;
      font: inherit;
      --mdc-icon-size: 21px;
      transition: background 120ms ease;
    }
    .control.labeled {
      padding: 0 16px;
    }
    .control.on {
      background: var(--drc-control-on);
      color: #1c1200;
    }
    .control.missing {
      opacity: 0.4;
    }
    .control-label {
      font-weight: 700;
      font-size: 14px;
    }

    /* Alerts */
    .alert-chip {
      min-width: 0;
      border: none;
    }
    .alert-chip.severity-info {
      background: var(--drc-accent);
    }
    .alert-chip.severity-warning {
      background: var(--drc-warning);
      color: var(--deluxe-room-card-tilted-fg, #1c1200);
    }
    .alert-chip.severity-critical {
      background: var(--drc-critical);
    }
    .alert-bars {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
      margin-top: 14px;
    }
    .alert-bar {
      display: flex;
      align-items: center;
      gap: 9px;
      width: 100%;
      box-sizing: border-box;
      padding: 10px 16px;
      border-radius: 14px;
      font-weight: 600;
      font-size: 14px;
      color: #fff;
      --mdc-icon-size: 18px;
    }
    .alert-bar.severity-info {
      background: var(--drc-accent);
    }
    .alert-bar.severity-warning {
      background: color-mix(in srgb, var(--drc-warning) 30%, transparent);
      color: var(--drc-warning);
    }
    .alert-bar.severity-critical {
      background: var(--drc-critical);
    }

    /* ---- Narrow (half-width) mode: shrink everything to fit ------------- */
    ha-card.narrow {
      padding: 14px 15px;
    }
    ha-card.narrow .content {
      gap: 10px;
    }
    ha-card.narrow .row {
      gap: 10px;
    }
    ha-card.narrow .title {
      font-size: 16px;
    }
    /* Guarantee the title a fair share so a normal room name is not clipped
       to "Wohnzi…" by wide chips sitting on the same row. */
    ha-card.narrow.layout-classic .title-block {
      min-width: 45%;
    }
    ha-card.narrow .climate {
      gap: 8px;
      margin-top: 2px;
    }
    ha-card.narrow .climate-value {
      font-size: 12px;
      gap: 4px;
      --mdc-icon-size: 14px;
    }
    ha-card.narrow .climate-value.missing {
      font-size: 11.5px;
    }
    ha-card.narrow .chip-stack {
      gap: 6px;
    }
    ha-card.narrow .chip {
      min-width: 0;
      gap: 7px;
      padding: 4px 10px;
      border-radius: 20px;
    }
    ha-card.narrow .chip-icon {
      --mdc-icon-size: 18px;
    }
    ha-card.narrow .chip-title {
      font-size: 12px;
    }
    ha-card.narrow .chip-sub {
      font-size: 11px;
    }
    ha-card.narrow .combined-box {
      width: 22px;
      height: 22px;
    }
    ha-card.narrow .bar-block {
      min-width: 48px;
    }
    ha-card.narrow .bar-name {
      font-size: 10px;
    }
    ha-card.narrow .bar-value {
      font-size: 9px;
    }
    ha-card.narrow .radial,
    ha-card.narrow .radial svg {
      width: 28px;
      height: 28px;
    }
    ha-card.narrow .control {
      height: 40px;
      min-width: 40px;
      border-radius: 20px;
      --mdc-icon-size: 19px;
    }
    ha-card.narrow .control.labeled {
      padding: 0 12px;
    }
    ha-card.narrow .control-label {
      font-size: 12.5px;
    }
    ha-card.narrow .dock {
      gap: 7px;
    }
    ha-card.narrow .room-icon {
      left: 15px;
      bottom: 12px;
      opacity: 0.4;
      --mdc-icon-size: calc(56px * var(--drc-scale));
    }
    ha-card.narrow .backdrop {
      width: calc(140px * var(--drc-scale));
      height: calc(140px * var(--drc-scale));
      left: calc(-30px - (140px * var(--drc-scale) - 140px) / 2);
      bottom: calc(-38px - (140px * var(--drc-scale) - 140px) / 2);
    }
    ha-card.narrow .alert-bar {
      padding: 8px 13px;
      font-size: 13px;
      --mdc-icon-size: 16px;
    }
  `}};e([pe()],Xe.prototype,"_config",void 0),e([pe()],Xe.prototype,"_narrow",void 0),e([pe()],Xe.prototype,"_hass",void 0),Xe=e([le("deluxe-room-card")],Xe),window.customCards=window.customCards??[],window.customCards.push({type:"deluxe-room-card",name:"Deluxe Room Card",description:"Room overview card: windows & covers as combined chips, climate with thresholds, light dock, alert bars and rule-based outlines.",preview:!0,documentationURL:"https://github.com/florianbaethge/deluxe_room_card"}),console.info("%c DELUXE-ROOM-CARD %c 0.3.0 ","color: #fff; background: #2f7d54; font-weight: 700;","color: #2f7d54; background: #fff; font-weight: 700;");export{Xe as DeluxeRoomCard};
//# sourceMappingURL=deluxe-room-card.js.map
