function t(t,e,i,o){var n,r=arguments.length,s=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(s=(r<3?n(s):r>3?n(e,i,s):n(e,i))||s);return r>3&&s&&Object.defineProperty(e,i,s),s}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),n=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const s=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new r(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,_=globalThis,m=_.trustedTypes,f=m?m.emptyScript:"",g=_.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const r=o?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),n=e.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=o;const r=n.fromAttribute(e,t.type);this[o]=r??this._$Ej?.get(o)??r,this._$Em=null}}requestUpdate(t,e,i,o=!1,n){if(void 0!==t){const r=this.constructor;if(!1===o&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??b)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[v("elementProperties")]=new Map,$[v("finalized")]=new Map,g?.({ReactiveElement:$}),(_.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=t=>t,k=x.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+E,R=`<${T}>`,O=document,P=()=>O.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,U="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,H=/>/g,N=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,j=/"/g,B=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),F=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),q=new WeakMap,V=O.createTreeWalker(O,129);function Z(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,o=[];let n,r=2===e?"<svg>":3===e?"<math>":"",s=I;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(s.lastIndex=d,c=s.exec(i),null!==c);)d=s.lastIndex,s===I?"!--"===c[1]?s=L:void 0!==c[1]?s=H:void 0!==c[2]?(B.test(c[2])&&(n=RegExp("</"+c[2],"g")),s=N):void 0!==c[3]&&(s=N):s===N?">"===c[0]?(s=n??I,l=-1):void 0===c[1]?l=-2:(l=s.lastIndex-c[2].length,a=c[1],s=void 0===c[3]?N:'"'===c[3]?j:D):s===j||s===D?s=N:s===L||s===H?s=I:(s=N,n=void 0);const h=s===N&&t[e+1].startsWith("/>")?" ":"";r+=s===I?i+R:l>=0?(o.push(a),i.slice(0,l)+C+i.slice(l)+E+h):i+E+(-2===l?e:h)}return[Z(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class J{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let n=0,r=0;const s=t.length-1,a=this.parts,[c,l]=G(t,e);if(this.el=J.createElement(c,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=V.nextNode())&&a.length<s;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(C)){const e=l[r++],i=o.getAttribute(t).split(E),s=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:s[2],strings:i,ctor:"."===s[1]?et:"?"===s[1]?it:"@"===s[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:n}),o.removeAttribute(t));if(B.test(o.tagName)){const t=o.textContent.split(E),e=t.length-1;if(e>0){o.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],P()),V.nextNode(),a.push({type:2,index:++n});o.append(t[e],P())}}}else if(8===o.nodeType)if(o.data===T)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=o.data.indexOf(E,t+1));)a.push({type:7,index:n}),t+=E.length-1}n++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,o){if(e===F)return e;let n=void 0!==o?i._$Co?.[o]:i._$Cl;const r=z(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=n:i._$Cl=n),void 0!==n&&(e=X(t,n._$AS(t,e.values),n,o)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??O).importNode(e,!0);V.currentNode=o;let n=V.nextNode(),r=0,s=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Y(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=i[++s]}r!==a?.index&&(n=V.nextNode(),r++)}return V.currentNode=O,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),z(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new Q(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new J(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const n of t)o===e.length?e.push(i=new Y(this.O(P()),this.O(P()),this,this.options)):i=e[o],i._$AI(n),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,n){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,o){const n=this.strings;let r=!1;if(void 0===n)t=X(this,t,e,0),r=!z(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const o=t;let s,a;for(t=n[0],s=0;s<n.length-1;s++)a=X(this,o[i+s],e,s),a===F&&(a=this._$AH[s]),r||=!z(a)||a!==this._$AH[s],a===K?t=K:t!==K&&(t+=(a??"")+n[s+1]),this._$AH[s]=a}r&&!o&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class ot extends tt{constructor(t,e,i,o,n){super(t,e,i,o,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??K)===F)return;const i=this._$AH,o=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==K&&(i===K||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const rt=x.litHtmlPolyfillSupport;rt?.(J,Y),(x.litHtmlVersions??=[]).push("3.3.3");const st=globalThis;let at=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let n=o._$litPart$;if(void 0===n){const t=i?.renderBefore??null;o._$litPart$=n=new Y(e.insertBefore(P(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};at._$litElement$=!0,at.finalized=!0,st.litElementHydrateSupport?.({LitElement:at});const ct=st.litElementPolyfillSupport;ct?.({LitElement:at}),(st.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ht=(t=dt,e,i)=>{const{kind:o,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,n,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];e.call(this,i),this.requestUpdate(o,n,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ut(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ut({...t,state:!0,attribute:!1})}const _t=1,mt=t=>(...e)=>({_$litDirective$:t,values:e});let ft=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const gt=mt(class extends ft{constructor(t){if(super(t),t.type!==_t||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const o=!!e[t];o===this.st.has(t)||this.nt?.has(t)||(o?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return F}}),vt="important",yt=" !"+vt,bt=mt(class extends ft{constructor(t){if(super(t),t.type!==_t||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const o=t[i];return null==o?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const o=e[t];if(null!=o){this.ft.add(t);const e="string"==typeof o&&o.endsWith(yt);t.includes("-")||e?i.setProperty(t,e?o.slice(0,-11):o,e?vt:""):i[t]=o}}return F}}),wt={icon:"mdi:sofa",icon_size:1,layout:"classic",width:"auto",color_style:"theme",state_style:"label",show_name:!0,show_climate:!0,show_icon:!0},$t=["classic","controls-bottom","header-bar","compact"],xt=["auto","full","half"],At=["theme","override"],kt=["combined","label","bar","radial","color"];class St extends Error{}function Ct(t){if(!t||"object"!=typeof t)throw new St("Invalid configuration");const e={...wt,...t,openings:{state_style:t.openings?.state_style??wt.state_style,items:t.openings?.items??[]},controls:t.controls??[],alerts:t.alerts??[],card_alerts:t.card_alerts??[],climate:t.climate??{}};if(e.layout&&!$t.includes(e.layout))throw new St(`Unknown layout: ${e.layout}`);if(e.width&&!xt.includes(e.width))throw new St(`Unknown width: ${e.width}`);if(e.color_style&&!At.includes(e.color_style))throw new St(`Unknown color_style: ${e.color_style}`);const i=e.openings?.state_style;if(i&&!kt.includes(i))throw new St(`Unknown state_style: ${i}`);for(const t of e.controls??[])if(!t.entity)throw new St("controls: entity is required");for(const t of e.alerts??[])if(!t.entity)throw new St("alerts: entity is required");for(const t of e.card_alerts??[]){if(!t.outline||!["warn","warning","critical"].includes(t.outline))throw new St("card_alerts: outline must be warning or critical");if(!Array.isArray(t.conditions))throw new St("card_alerts: conditions must be a list")}const o=e.icon_size??1;return e.icon_size=Math.min(1.8,Math.max(.6,o)),e}function Et(t){const e=new Set,i=t=>{t&&e.add(t)};i(t.climate?.temperature),i(t.climate?.humidity);for(const e of t.openings?.items??[])i(e.window),i(e.door),i(e.cover),i(e.control_entity);for(const e of t.controls??[])i(e.entity);for(const e of t.alerts??[])i(e.entity);for(const o of t.card_alerts??[])for(const t of o.conditions)i(t.entity),void 0===t.after&&void 0===t.before||e.add("sun.sun");return e}function Tt(t,e){const i={climate:{},openings:[],controls:[],alerts:[]};for(const o of function(t,e){const i=t.entities??{},o=t.devices??{},n=[];for(const t of Object.values(i))t.hidden||t.disabled_by||(t.area_id??(t.device_id?o[t.device_id]?.area_id:void 0))===e&&n.push(t.entity_id);return n}(t,e)){const e=t.states[o],n=o.split(".")[0],r=e?.attributes.device_class,s=e?.attributes.friendly_name;"light"===n||"switch"===n?i.controls.push({entity:o}):"cover"===n?i.openings.push(r&&["door","garage","gate"].includes(r)?{cover:o,name:s,device_class:"door"}:{cover:o,name:s}):"binary_sensor"===n?"window"===r?i.openings.push({window:o,name:s}):"door"===r||"garage_door"===r?i.openings.push({door:o,name:s}):r&&["moisture","smoke","gas","carbon_monoxide","safety"].includes(r)&&i.alerts.push({entity:o,severity:"critical",full_width:!0}):"sensor"===n&&("temperature"!==r||i.climate.temperature?"humidity"!==r||i.climate.humidity||(i.climate.humidity=o):i.climate.temperature=o)}return i}function Rt(t,e){const i={...t},o={...t.climate};return!o.temperature&&e.climate.temperature&&(o.temperature=e.climate.temperature),!o.humidity&&e.climate.humidity&&(o.humidity=e.climate.humidity),i.climate=o,t.openings?.items?.length||(i.openings={...t.openings,items:e.openings}),t.controls?.length||(i.controls=e.controls),t.alerts?.length||(i.alerts=e.alerts),i}const Ot=new Set(["unavailable","unknown","none",""]);function Pt(t){if(null==t)return null;if("string"==typeof t&&Ot.has(t.toLowerCase()))return null;const e="number"==typeof t?t:Number(t);return Number.isFinite(e)?e:null}function zt(t,e){const i=Pt(t);if(null===i)return"unknown";if(!e)return"normal";const o=e;return void 0!==o.low_crit&&i<=o.low_crit?"low_crit":void 0!==o.high_crit&&i>=o.high_crit?"high_crit":void 0!==o.high&&i>=o.high?"high":void 0!==o.low&&i<=o.low?"low":"normal"}function Mt(t,e,i,o){const n=t.window??t.door,r=n?e(n):void 0,s=t.cover?e(t.cover):void 0,a=void 0!==n&&void 0===r||void 0!==t.cover&&void 0===s,c=n?function(t){if(!t)return"unknown";const e=t.state.toLowerCase();return Ot.has(e)?"unknown":"on"===e||"open"===e||"opening"===e?"open":"tilted"===e||"tilt"===e?"tilted":"off"===e||"closed"===e||"closing"===e?"closed":"unknown"}(r):null,l=t.cover?function(t){if(!t)return null;if(Ot.has(t.state.toLowerCase()))return null;const e=Pt(t.attributes.current_position);return null!==e?Math.max(0,Math.min(100,e)):"open"===t.state?100:"closed"===t.state?0:null}(s):null,d=void 0!==t.cover,h=void 0!==t.door||"door"===t.device_class||"garage_door"===t.device_class||"gate"===t.device_class,u=r?.attributes.friendly_name??s?.attributes.friendly_name;return{key:`${n??""}|${t.cover??""}|${o}`,name:t.name??u??n??t.cover??"?",icon:t.icon??null,style:i,windowState:c,position:l,isDoor:h,hasCover:d,coverClosed:null!==l&&l<=1,missing:a,moreInfoEntity:t.cover??n??null,actionEntity:t.control_entity??t.cover??n??null,tapAction:t.tap_action??"more-info",service:t.service,serviceData:t.service_data}}const Ut={info:"mdi:information-outline",warning:"mdi:alert-outline",critical:"mdi:alert"};function It(t,e){return t?t.filter(t=>function(t,e){if(!e)return!1;const i=t.attribute?e.attributes[t.attribute]:e.state;if("string"==typeof i&&Ot.has(i.toLowerCase()))return!1;if(void 0!==t.below||void 0!==t.above){const e=Pt(i);return!(null===e||void 0!==t.below&&e>=t.below||void 0!==t.above&&e<=t.above)}const o=String(i)===(t.active_state??"on");return t.invert?!o:o}(t,e(t.entity))).map((t,i)=>{const o=e(t.entity),n=t.severity??"warning";return{key:`${t.entity}|${i}`,label:t.label??o?.attributes.friendly_name??t.entity,icon:t.icon??Ut[n],severity:n,color:t.color,fullWidth:t.full_width??!1}}):[]}function Lt(t,e,i){const o="below_horizon"===i;return"after"===t?"sunset"===e?o:!o:"sunrise"===e?o:!o}function Ht(t,e,i){if(void 0!==t.after||void 0!==t.before){const i=e("sun.sun");if(!i)return{met:!1};const o=void 0===t.after||Lt("after",t.after,i.state),n=void 0===t.before||Lt("before",t.before,i.state);if(!o||!n)return{met:!1};if(void 0===t.entity)return{met:!0}}if(void 0===t.entity)return{met:!1};const o=e(t.entity);if(!o)return{met:!1};if(Ot.has(o.state.toLowerCase()))return{met:!1};let n=!0;const r=t.attribute?o.attributes[t.attribute]:o.state;if(void 0!==t.state){n=(Array.isArray(t.state)?t.state:[t.state]).includes(String(r))}if(n&&(void 0!==t.above||void 0!==t.below)){const e=Pt(r);null===e?n=!1:(void 0!==t.above&&e<=t.above&&(n=!1),void 0!==t.below&&e>=t.below&&(n=!1))}if(!n)return{met:!1};const s=function(t){if(void 0===t)return 0;if("number"==typeof t)return t;const e=t.split(":").map(t=>Number(t));return e.some(t=>!Number.isFinite(t))?0:3===e.length?3600*e[0]+60*e[1]+e[2]:2===e.length?60*e[0]+e[1]:e[0]??0}(t.for);if(s>0){const t=Date.parse(o.last_changed);if(Number.isFinite(t)){const e=i-t,o=1e3*s;if(e<o)return{met:!1,recheckInMs:o-e}}}return{met:!0}}function Nt(t,e,i){t.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}const Dt={en:{open:"Open",tilted:"Tilted",closed:"Closed",half:"Half",unknown:"Unknown",no_value:"no value",temp_no_value:"Temp – no value",humidity_no_value:"Humidity – no value",entity_missing:"Entity not found",too_cold:"Too cold",too_hot:"Too hot",too_humid:"Too humid – please ventilate!",too_dry:"Too dry",general:"General",layout:"Layout",appearance:"Appearance",entities:"Entities",title:"Title",room_icon:"Room icon",icon_size:"Icon size",width:"Width",color_style:"Color style",accent_color:"Accent color",bg_tint:"Background tint",state_style:"Window & cover style",show_name:"Show name",show_climate:"Show climate",show_icon:"Show room icon",climate:"Climate",temperature:"Temperature sensor",humidity:"Humidity sensor",thresholds_temp:"Temperature thresholds (°C)",thresholds_hum:"Humidity thresholds (%)",threshold_low:"Low",threshold_low_crit:"Low critical",threshold_high:"High",threshold_high_crit:"High critical",alert_on_threshold:"Alert bar on critical threshold",openings:"Openings (windows, doors & covers)",opening:"Opening",window_sensor:"Window sensor",door_sensor:"Door sensor",cover_entity:"Cover",control_entity:"Tap entity (e.g. quiet mode)",name:"Name",icon:"Icon",tap_action:"Tap action",controls:"Controls (lights & switches)",control:"Control",entity:"Entity",alerts:"Alerts & sensors",alert:"Alert",active_state:"Active when state",invert:"Invert",below:"Below",above:"Above",severity:"Severity",full_width:"Full-width bar",label:"Label",card_alerts:"Card outline rules",rule:"Rule",outline:"Outline",match:"Match",match_all:"All conditions (AND)",match_any:"Any condition (OR)",condition:"Condition",state:"State",attribute:"Attribute",after:"After",before:"Before",for:"For (duration)",sunrise:"Sunrise",sunset:"Sunset",add:"Add",remove:"Remove",move_up:"Move up",move_down:"Move down",import_from_area:"Import from area",import_from_area_hint:"Fills empty sections with the area's windows, covers, lights and sensors — freely editable afterwards.",area:"Area",severity_info:"Info",severity_warning:"Warning",severity_critical:"Critical",outline_warning:"Warning",outline_critical:"Critical",action_more_info:"More info",action_toggle:"Toggle",action_call_service:"Call service",action_none:"None",layout_classic:"Classic",layout_controls_bottom:"Classic · dock bottom left",layout_header_bar:"Header bar",layout_compact:"Compact",width_auto:"Auto",width_full:"Full",width_half:"Half",style_combined:"Combined",style_label:"Icon + text",style_bar:"Bar",style_radial:"Radial",style_color:"Color words",color_theme:"Theme",color_override:"Override"},de:{open:"Offen",tilted:"Gekippt",closed:"Zu",half:"Halb",unknown:"Unbekannt",no_value:"kein Wert",temp_no_value:"Temp – kein Wert",humidity_no_value:"Feuchte – kein Wert",entity_missing:"Entität nicht gefunden",too_cold:"Zu kalt",too_hot:"Zu warm",too_humid:"Zu feucht – bitte lüften!",too_dry:"Zu trocken",general:"Allgemein",layout:"Layout",appearance:"Darstellung",entities:"Entitäten",title:"Titel",room_icon:"Raum-Icon",icon_size:"Icon-Größe",width:"Breite",color_style:"Farb-Stil",accent_color:"Akzentfarbe",bg_tint:"Hintergrundfarbe",state_style:"Fenster- & Rollo-Darstellung",show_name:"Name anzeigen",show_climate:"Klima anzeigen",show_icon:"Raum-Icon anzeigen",climate:"Klima",temperature:"Temperatur-Sensor",humidity:"Feuchte-Sensor",thresholds_temp:"Temperatur-Schwellwerte (°C)",thresholds_hum:"Feuchte-Schwellwerte (%)",threshold_low:"Niedrig",threshold_low_crit:"Niedrig kritisch",threshold_high:"Hoch",threshold_high_crit:"Hoch kritisch",alert_on_threshold:"Alarm-Leiste bei kritischem Grenzwert",openings:"Öffnungen (Fenster, Türen & Rollos)",opening:"Öffnung",window_sensor:"Fenster-Sensor",door_sensor:"Tür-Sensor",cover_entity:"Rollo (cover)",control_entity:"Tap-Entität (z. B. Leise-Modus)",name:"Name",icon:"Icon",tap_action:"Tap-Aktion",controls:"Steuerung (Lampen & Schalter)",control:"Element",entity:"Entität",alerts:"Alarme & Sensoren",alert:"Alarm",active_state:"Aktiv bei Zustand",invert:"Invertieren",below:"Unter",above:"Über",severity:"Schweregrad",full_width:"Volle Leiste unten",label:"Beschriftung",card_alerts:"Kachel-Rand-Regeln",rule:"Regel",outline:"Rand",match:"Verknüpfung",match_all:"Alle Bedingungen (UND)",match_any:"Eine Bedingung (ODER)",condition:"Bedingung",state:"Zustand",attribute:"Attribut",after:"Nach",before:"Vor",for:"Für (Dauer)",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",add:"Hinzufügen",remove:"Entfernen",move_up:"Nach oben",move_down:"Nach unten",import_from_area:"Aus Area übernehmen",import_from_area_hint:"Füllt leere Bereiche mit Fenstern, Rollos, Lampen & Sensoren der Area — danach frei anpassbar.",area:"Area",severity_info:"Info",severity_warning:"Warnung",severity_critical:"Kritisch",outline_warning:"Warnung",outline_critical:"Kritisch",action_more_info:"More-Info-Dialog",action_toggle:"Umschalten",action_call_service:"Service aufrufen",action_none:"Keine",layout_classic:"Classic",layout_controls_bottom:"Classic · Dock unten links",layout_header_bar:"Kopfzeile",layout_compact:"Kompakt",width_auto:"Auto",width_full:"Voll",width_half:"Halb",style_combined:"Kombiniert",style_label:"Icon + Text",style_bar:"Bar",style_radial:"Radial",style_color:"Farb-Zustände",color_theme:"Theme",color_override:"Override"}};function jt(t,e){const i=function(t){return(t?.locale?.language??t?.language??"en").split("-")[0]}(t);return Dt[i]?.[e]??Dt.en[e]??e}let Bt=class extends at{constructor(){super(...arguments),this._formReady=!1,this._expanded={},this._openSections={},this._importArea="",this._computeLabel=t=>({title:this._t("title"),icon:this._t("room_icon"),layout:this._t("layout"),width:this._t("width"),state_style:this._t("state_style"),icon_size:this._t("icon_size"),color_style:this._t("color_style"),accent_color:this._t("accent_color"),bg_tint:this._t("bg_tint"),show_name:this._t("show_name"),show_climate:this._t("show_climate"),show_icon:this._t("show_icon"),temperature:this._t("temperature"),humidity:this._t("humidity"),temperature_thresholds:this._t("thresholds_temp"),humidity_thresholds:this._t("thresholds_hum"),low:this._t("threshold_low"),low_crit:this._t("threshold_low_crit"),high:this._t("threshold_high"),high_crit:this._t("threshold_high_crit"),alert_on_threshold:this._t("alert_on_threshold"),window:this._t("window_sensor"),door:this._t("door_sensor"),cover:this._t("cover_entity"),control_entity:this._t("control_entity"),name:this._t("name"),tap_action:this._t("tap_action"),entity:this._t("entity"),label:this._t("label"),color:this._t("accent_color"),active_state:this._t("active_state"),invert:this._t("invert"),below:this._t("below"),above:this._t("above"),severity:this._t("severity"),full_width:this._t("full_width"),outline:this._t("outline"),match:this._t("match"),state:this._t("state"),attribute:this._t("attribute"),after:this._t("after"),before:this._t("before"),for:this._t("for")}[t.name]??t.name),this._addRule=()=>{const t=[...this._config?.card_alerts??[]];t.push({outline:"warning",match:"all",conditions:[]}),this._writeRules(t),this._expanded={...this._expanded,card_alerts:t.length-1}}}setConfig(t){this._config=t}connectedCallback(){super.connectedCallback(),async function(){if(!customElements.get("ha-form"))try{const t=await(window.loadCardHelpers?.());if(!t)return;const e=await t.createCardElement({type:"entities",entities:[]});await(e.constructor.getConfigElement?.())}catch{}}().then(()=>{this._formReady=!0})}_t(t){return jt(this.hass,t)}_emit(t){this._config=t,Nt(this,"config-changed",{config:t})}_select(t,e){return{name:t,selector:{select:{mode:"dropdown",options:e.map(([t,e])=>({value:t,label:this._t(e)}))}}}}_generalSchema(){const t="override"===this._config?.color_style?[{name:"accent_color",selector:{text:{}}},{name:"bg_tint",selector:{text:{}}}]:[];return[{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"",type:"grid",schema:[this._select("layout",[["classic","layout_classic"],["controls-bottom","layout_controls_bottom"],["header-bar","layout_header_bar"],["compact","layout_compact"]]),this._select("width",[["auto","width_auto"],["full","width_full"],["half","width_half"]]),this._select("state_style",[["combined","style_combined"],["label","style_label"],["bar","style_bar"],["radial","style_radial"],["color","style_color"]]),{name:"icon_size",selector:{number:{min:.6,max:1.8,step:.1,mode:"slider"}}},this._select("color_style",[["theme","color_theme"],["override","color_override"]]),...t]},{name:"",type:"grid",schema:[{name:"show_name",selector:{boolean:{}}},{name:"show_climate",selector:{boolean:{}}},{name:"show_icon",selector:{boolean:{}}}]}]}_climateSchema(){return[{name:"temperature",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"humidity",selector:{entity:{domain:"sensor",device_class:"humidity"}}},{name:"temperature_thresholds",type:"expandable",title:this._t("thresholds_temp"),schema:[{name:"",type:"grid",schema:[{name:"low",selector:{number:{mode:"box",step:.5}}},{name:"low_crit",selector:{number:{mode:"box",step:.5}}},{name:"high",selector:{number:{mode:"box",step:.5}}},{name:"high_crit",selector:{number:{mode:"box",step:.5}}}]}]},{name:"humidity_thresholds",type:"expandable",title:this._t("thresholds_hum"),schema:[{name:"",type:"grid",schema:[{name:"low",selector:{number:{mode:"box",step:1}}},{name:"low_crit",selector:{number:{mode:"box",step:1}}},{name:"high",selector:{number:{mode:"box",step:1}}},{name:"high_crit",selector:{number:{mode:"box",step:1}}}]}]},{name:"alert_on_threshold",selector:{boolean:{}}}]}_openingSchema(){return[{name:"window",selector:{entity:{domain:["binary_sensor","sensor"]}}},{name:"door",selector:{entity:{domain:"binary_sensor"}}},{name:"cover",selector:{entity:{domain:"cover"}}},{name:"control_entity",selector:{entity:{}}},{name:"",type:"grid",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},this._select("tap_action",[["more-info","action_more_info"],["toggle","action_toggle"],["call-service","action_call_service"],["none","action_none"]])]}]}_controlSchema(){return[{name:"entity",selector:{entity:{domain:["light","switch","input_boolean","fan"]}}},{name:"",type:"grid",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"label",selector:{text:{}}},{name:"color",selector:{text:{}}}]}]}_alertSchema(){return[{name:"entity",selector:{entity:{}}},{name:"",type:"grid",schema:[{name:"label",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"active_state",selector:{text:{}}},{name:"invert",selector:{boolean:{}}},{name:"below",selector:{number:{mode:"box"}}},{name:"above",selector:{number:{mode:"box"}}},this._select("severity",[["info","severity_info"],["warning","severity_warning"],["critical","severity_critical"]]),{name:"full_width",selector:{boolean:{}}}]}]}_ruleSchema(){return[{name:"",type:"grid",schema:[this._select("outline",[["warning","outline_warning"],["critical","outline_critical"]]),this._select("match",[["all","match_all"],["any","match_any"]])]}]}_conditionSchema(){return[{name:"entity",selector:{entity:{}}},{name:"",type:"grid",schema:[{name:"state",selector:{text:{}}},{name:"attribute",selector:{text:{}}},{name:"above",selector:{number:{mode:"box"}}},{name:"below",selector:{number:{mode:"box"}}},this._select("after",[["sunrise","sunrise"],["sunset","sunset"]]),this._select("before",[["sunrise","sunrise"],["sunset","sunset"]]),{name:"for",selector:{text:{}}}]}]}render(){if(!this.hass||!this._config||!this._formReady)return K;const t=this._config,e={title:t.title??"",icon:t.icon??"mdi:sofa",layout:t.layout??"classic",width:t.width??"auto",state_style:t.openings?.state_style??"label",icon_size:t.icon_size??1,color_style:t.color_style??"theme",accent_color:t.accent_color??"",bg_tint:t.bg_tint??"",show_name:!1!==t.show_name,show_climate:!1!==t.show_climate,show_icon:!1!==t.show_icon},i=t.climate??{},o=[i.temperature,i.humidity].filter(Boolean).length;return W`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${this._generalSchema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._generalChanged}
      ></ha-form>

      ${this._renderSection("climate",this._t("climate"),o,()=>W`
          <ha-form
            .hass=${this.hass}
            .data=${{temperature:i.temperature??"",humidity:i.humidity??"",temperature_thresholds:i.temperature_thresholds??{},humidity_thresholds:i.humidity_thresholds??{},alert_on_threshold:i.alert_on_threshold??!1}}
            .schema=${this._climateSchema()}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._climateChanged}
          ></ha-form>
        `)}
      ${this._renderSection("import",this._t("import_from_area"),0,()=>this._renderAreaImport())}
      ${this._renderList(this._openingsSection())}
      ${this._renderList(this._controlsSection())}
      ${this._renderList(this._alertsSection())} ${this._renderRules()}
    `}_renderSection(t,e,i,o){const n=this._openSections[t]??!1;return W`
      <div class="section">
        <button class="section-head" @click=${()=>this._toggleSection(t)}>
          <ha-icon
            .icon=${n?"mdi:chevron-down":"mdi:chevron-right"}
          ></ha-icon>
          <span class="section-title">${e}</span>
          ${i>0?W`<span class="section-count">${i}</span>`:K}
        </button>
        ${n?W`<div class="section-body">${o()}</div>`:K}
      </div>
    `}_toggleSection(t){this._openSections={...this._openSections,[t]:!this._openSections[t]}}_renderAreaImport(){return W`
      <div class="area-import">
        <ha-form
          .hass=${this.hass}
          .data=${{area:this._importArea}}
          .schema=${[{name:"area",selector:{area:{}}}]}
          .computeLabel=${()=>this._t("area")}
          @value-changed=${t=>{t.stopPropagation(),this._importArea=t.detail.value.area??""}}
        ></ha-form>
        <mwc-button
          .disabled=${!this._importArea}
          @click=${this._importFromArea}
        >
          ${this._t("import_from_area")}
        </mwc-button>
        <p class="hint">${this._t("import_from_area_hint")}</p>
      </div>
    `}_importFromArea(){if(!this.hass||!this._config||!this._importArea)return;const t=Tt(this.hass,this._importArea);this._emit(Rt(this._config,t))}_openingsSection(){return{key:"openings",titleKey:"openings",itemKey:"opening",items:this._config?.openings?.items??[],schema:()=>this._openingSchema(),newItem:()=>({}),summary:t=>t.name??t.window??t.door??t.cover??this._t("opening")}}_controlsSection(){return{key:"controls",titleKey:"controls",itemKey:"control",items:this._config?.controls??[],schema:()=>this._controlSchema(),newItem:()=>({entity:""}),summary:t=>t.name??t.entity??this._t("control")}}_alertsSection(){return{key:"alerts",titleKey:"alerts",itemKey:"alert",items:this._config?.alerts??[],schema:()=>this._alertSchema(),newItem:()=>({entity:""}),summary:t=>t.label??t.entity??this._t("alert")}}_renderList(t){return this._renderSection(t.key,this._t(t.titleKey),t.items.length,()=>this._renderListBody(t))}_renderListBody(t){const e=this._expanded[t.key]??null;return W`
      <div class="list">
        ${t.items.map((i,o)=>{const n=e===o;return W`
            <div class="list-item">
              <div class="list-head">
                <button
                  class="list-title"
                  @click=${()=>this._toggleExpanded(t.key,o)}
                >
                  <ha-icon
                    .icon=${n?"mdi:chevron-down":"mdi:chevron-right"}
                  ></ha-icon>
                  ${t.summary(i)}
                </button>
                <ha-icon-button
                  .label=${this._t("move_up")}
                  .disabled=${0===o}
                  @click=${()=>this._moveItem(t,o,-1)}
                  ><ha-icon icon="mdi:arrow-up"></ha-icon
                ></ha-icon-button>
                <ha-icon-button
                  .label=${this._t("move_down")}
                  .disabled=${o===t.items.length-1}
                  @click=${()=>this._moveItem(t,o,1)}
                  ><ha-icon icon="mdi:arrow-down"></ha-icon
                ></ha-icon-button>
                <ha-icon-button
                  .label=${this._t("remove")}
                  @click=${()=>this._removeItem(t,o)}
                  ><ha-icon icon="mdi:close"></ha-icon
                ></ha-icon-button>
              </div>
              ${n?W`
                      <ha-form
                        .hass=${this.hass}
                        .data=${i}
                        .schema=${t.schema(i)}
                        .computeLabel=${this._computeLabel}
                        @value-changed=${e=>this._itemChanged(t,o,e)}
                      ></ha-form>
                    `:K}
            </div>
          `})}
        <mwc-button @click=${()=>this._addItem(t)}>
          + ${this._t("add")} · ${this._t(t.itemKey)}
        </mwc-button>
      </div>
    `}_toggleExpanded(t,e){this._expanded={...this._expanded,[t]:this._expanded[t]===e?null:e}}_writeSection(t,e){const i={...this._config};"openings"===t.key?i.openings={...i.openings,items:e}:"controls"===t.key?i.controls=e:"alerts"===t.key?i.alerts=e:i.card_alerts=e,this._emit(i)}_addItem(t){this._writeSection(t,[...t.items,t.newItem()]),this._expanded={...this._expanded,[t.key]:t.items.length}}_removeItem(t,e){const i=[...t.items];i.splice(e,1),this._writeSection(t,i),this._expanded={...this._expanded,[t.key]:null}}_moveItem(t,e,i){const o=e+i;if(o<0||o>=t.items.length)return;const n=[...t.items],[r]=n.splice(e,1);n.splice(o,0,r),this._writeSection(t,n),this._expanded={...this._expanded,[t.key]:o}}_itemChanged(t,e,i){i.stopPropagation();const o=[...t.items];o[e]=Wt(i.detail.value),this._writeSection(t,o)}_renderRules(){const t=this._config?.card_alerts??[];return this._renderSection("card_alerts",this._t("card_alerts"),t.length,()=>this._renderRulesBody(t))}_renderRulesBody(t){const e=this._expanded.card_alerts??null;return W`
      <div class="list">
        ${t.map((t,i)=>{const o=e===i;return W`
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
                  ${this._t(`outline_${"warn"===t.outline?"warning":t.outline}`)}
                  · ${t.conditions.length}× ${this._t("condition")}
                </button>
                <ha-icon-button
                  .label=${this._t("remove")}
                  @click=${()=>this._removeRule(i)}
                  ><ha-icon icon="mdi:close"></ha-icon
                ></ha-icon-button>
              </div>
              ${o?W`
                      <ha-form
                        .hass=${this.hass}
                        .data=${{outline:"warn"===t.outline?"warning":t.outline,match:t.match??"all"}}
                        .schema=${this._ruleSchema()}
                        .computeLabel=${this._computeLabel}
                        @value-changed=${t=>this._ruleChanged(i,t)}
                      ></ha-form>
                      ${t.conditions.map((t,e)=>W`
                          <div class="condition">
                            <div class="condition-head">
                              <span
                                >${this._t("condition")} ${e+1}</span
                              >
                              <ha-icon-button
                                .label=${this._t("remove")}
                                @click=${()=>this._removeCondition(i,e)}
                                ><ha-icon icon="mdi:close"></ha-icon
                              ></ha-icon-button>
                            </div>
                            <ha-form
                              .hass=${this.hass}
                              .data=${t}
                              .schema=${this._conditionSchema()}
                              .computeLabel=${this._computeLabel}
                              @value-changed=${t=>this._conditionChanged(i,e,t)}
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
    `}_writeRules(t){this._emit({...this._config,card_alerts:t})}_removeRule(t){const e=[...this._config?.card_alerts??[]];e.splice(t,1),this._writeRules(e),this._expanded={...this._expanded,card_alerts:null}}_ruleChanged(t,e){e.stopPropagation();const i=[...this._config?.card_alerts??[]];i[t]={...i[t],...e.detail.value},this._writeRules(i)}_addCondition(t){const e=[...this._config?.card_alerts??[]];e[t]={...e[t],conditions:[...e[t].conditions,{}]},this._writeRules(e)}_removeCondition(t,e){const i=[...this._config?.card_alerts??[]],o=[...i[t].conditions];o.splice(e,1),i[t]={...i[t],conditions:o},this._writeRules(i)}_conditionChanged(t,e,i){i.stopPropagation();const o=[...this._config?.card_alerts??[]],n=[...o[t].conditions];n[e]=Wt(i.detail.value),o[t]={...o[t],conditions:n},this._writeRules(o)}_generalChanged(t){t.stopPropagation();const e=t.detail.value,i={...this._config,title:e.title||void 0,icon:e.icon||void 0,layout:e.layout,width:e.width,icon_size:e.icon_size,color_style:e.color_style,accent_color:e.accent_color||void 0,bg_tint:e.bg_tint||void 0,show_name:e.show_name,show_climate:e.show_climate,show_icon:e.show_icon,openings:{...this._config?.openings,state_style:e.state_style}};this._emit(i)}_climateChanged(t){t.stopPropagation();const e=t.detail.value,i=Wt({temperature:e.temperature,humidity:e.humidity,temperature_thresholds:Wt(e.temperature_thresholds??{}),humidity_thresholds:Wt(e.humidity_thresholds??{}),alert_on_threshold:e.alert_on_threshold||void 0});this._emit({...this._config,climate:i})}static{this.styles=s`
    .section {
      margin-top: 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 12px;
      overflow: hidden;
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
      padding: 2px 10px 12px;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .list-item {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px;
      padding: 6px 10px 10px;
    }
    .list-head {
      display: flex;
      align-items: center;
      gap: 2px;
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
      margin: 8px 0 0 12px;
      padding: 8px 10px;
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
  `}};function Wt(t){const e={};for(const[i,o]of Object.entries(t??{}))""!==o&&null!=o&&("object"!=typeof o||Array.isArray(o)||0!==Object.keys(o).length)&&(e[i]=o);return e}t([ut({attribute:!1})],Bt.prototype,"hass",void 0),t([pt()],Bt.prototype,"_config",void 0),t([pt()],Bt.prototype,"_formReady",void 0),t([pt()],Bt.prototype,"_expanded",void 0),t([pt()],Bt.prototype,"_openSections",void 0),t([pt()],Bt.prototype,"_importArea",void 0),Bt=t([lt("deluxe-room-card-editor")],Bt);const Ft=2*Math.PI*15.5;let Kt=class extends at{constructor(){super(...arguments),this._narrow=!1,this._entities=new Set,this._areaApplied=!1,this._longPressed=!1,this._getState=t=>this._hass?.states[t]}static getConfigElement(){return document.createElement("deluxe-room-card-editor")}static getStubConfig(t){return function(t){const e={type:"custom:deluxe-room-card",title:"Living room",icon:"mdi:sofa",openings:{state_style:"label",items:[]},controls:[]};if(!t)return e;const i=Object.keys(t.areas??{})[0];if(i){const o=t.areas?.[i],n=Rt(e,Tt(t,i));return n.title=o?.name??e.title,n}return e}(t)}setConfig(t){this._config=Ct(t),this._entities=Et(this._config),this._areaApplied=!1,this._maybeApplyArea()}set hass(t){const e=this._hass;if(this._hass=t,this._maybeApplyArea(),e&&t){for(const i of this._entities)if(e.states[i]!==t.states[i])return void this.requestUpdate()}else this.requestUpdate()}get hass(){return this._hass}getCardSize(){if(!this._config)return 3;const t="compact"===this._config.layout?2:3,e=(this._config.alerts??[]).filter(t=>t.full_width).length;return t+Math.min(e,2)}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}_maybeApplyArea(){!this._areaApplied&&this._config?.from_area&&this._hass&&(this._areaApplied=!0,this._config=Ct(Rt(this._config,Tt(this._hass,this._config.from_area))),this._entities=Et(this._config))}connectedCallback(){super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._resizeObserver=new ResizeObserver(t=>{const e=t[0]?.contentRect.width??0;e>0&&(this._narrow=e<380)}),this._resizeObserver.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._outlineTimer&&clearTimeout(this._outlineTimer)}_t(t){return jt(this._hass,t)}_moreInfo(t){Nt(this,"hass-more-info",{entityId:t})}_handleOpeningTap(t){switch(t.tapAction){case"none":return;case"toggle":return void(t.actionEntity&&this._hass?.callService("homeassistant","toggle",{entity_id:t.actionEntity}));case"call-service":{if(!t.service)return;const[e,i]=t.service.split(".",2);if(!e||!i)return;return void this._hass?.callService(e,i,{...t.actionEntity?{entity_id:t.actionEntity}:{},...t.serviceData??{}})}default:t.moreInfoEntity&&this._moreInfo(t.moreInfoEntity)}}_controlPressStart(t){this._longPressed=!1,this._pressTimer=setTimeout(()=>{this._longPressed=!0,this._moreInfo(t)},500)}_controlPressEnd(t){this._pressTimer&&clearTimeout(this._pressTimer),this._longPressed||this._hass?.callService("homeassistant","toggle",{entity_id:t})}_controlPressCancel(){this._pressTimer&&clearTimeout(this._pressTimer),this._longPressed=!1}render(){const t=this._config;if(!t)return K;const e=t.layout??"classic",i="half"===t.width||"auto"===t.width&&this._narrow,o=t.icon_size??1,{outline:n,recheckInMs:r}=function(t,e,i){if(!t||0===t.length)return{outline:null};let o,n=null;for(const r of t){const t=r.match??"all",s=r.conditions.map(t=>Ht(t,e,i));for(const t of s)void 0!==t.recheckInMs&&(o=Math.min(o??1/0,t.recheckInMs));const a="any"===t?s.some(t=>t.met):s.length>0&&s.every(t=>t.met);if(a){if("critical"===("warn"===r.outline?"warning":r.outline))return{outline:"critical",recheckInMs:o};n="warning"}}return{outline:n,recheckInMs:o}}(t.card_alerts,this._getState,Date.now());this._scheduleOutlineRecheck(r);const s=[...It(t.alerts,this._getState),...this._thresholdAlerts()],a=s.filter(t=>t.fullWidth),c=s.filter(t=>!t.fullWidth),l={};"override"===t.color_style&&(t.accent_color&&(l["--drc-accent"]=t.accent_color),t.bg_tint&&(l["--drc-bg"]=t.bg_tint));const d=t.colors??{};d.window_open&&(l["--drc-open"]=d.window_open),d.window_tilted&&(l["--drc-tilted"]=d.window_tilted),d.window_closed&&(l["--drc-closed"]=d.window_closed),d.warning&&(l["--drc-warning"]=d.warning),d.critical&&(l["--drc-critical"]=d.critical),l["--drc-scale"]=String(o);return W`
      <ha-card class=${gt({card:!0,narrow:i,[`layout-${e}`]:!0,"outline-warning":"warning"===n,"outline-critical":"critical"===n})} style=${bt(l)}>
        ${"classic"===e||"controls-bottom"===e?this._renderClassic(c,i):"header-bar"===e?this._renderHeaderBar(c):this._renderCompact(c)}
        ${a.length>0?W`<div class="alert-bars">
                ${a.map(t=>this._renderAlertBar(t))}
              </div>`:K}
      </ha-card>
    `}_scheduleOutlineRecheck(t){this._outlineTimer&&clearTimeout(this._outlineTimer),void 0!==t&&(this._outlineTimer=setTimeout(()=>this.requestUpdate(),Math.max(1e3,t)))}_thresholdAlerts(){const t=this._config?.climate;if(!t?.alert_on_threshold)return[];const e=[],i=t.temperature?this._getState(t.temperature)?.state:void 0,o=t.humidity?this._getState(t.humidity)?.state:void 0,n=zt(i,t.temperature_thresholds),r=zt(o,t.humidity_thresholds);return"low_crit"===n&&e.push(this._climateAlert("temp-low","too_cold","mdi:snowflake")),"high_crit"===n&&e.push(this._climateAlert("temp-high","too_hot","mdi:thermometer-alert")),"high_crit"===r&&e.push(this._climateAlert("hum-high","too_humid","mdi:water-percent-alert")),"low_crit"===r&&e.push(this._climateAlert("hum-low","too_dry","mdi:water-off")),e}_climateAlert(t,e,i){return{key:`climate|${t}`,label:this._t(e),icon:i,severity:"critical",fullWidth:!0}}_renderClassic(t,e){const i=this._config,o="controls-bottom"===i.layout;return W`
      ${!1!==i.show_icon?W`
              <div class="backdrop"></div>
              <ha-icon class="room-icon" .icon=${i.icon}></ha-icon>
            `:K}
      <div class="content">
        <div class="row top">
          ${this._renderTitleBlock()}
          <div class="chip-stack ${e?"wrap":"column"}">
            ${this._renderOpenings()}
            ${t.map(t=>this._renderAlertChip(t))}
          </div>
        </div>
        <div class="dock-outer ${o?"left":"right"}">
          ${this._renderDock()}
        </div>
      </div>
    `}_renderHeaderBar(t){const e=this._config;return W`
      <div class="content">
        <div class="header-bar">
          ${!1!==e.show_icon?W`<span class="inline-icon"
                  ><ha-icon .icon=${e.icon}></ha-icon
                ></span>`:K}
          ${this._renderTitleBlock()}
        </div>
        <div class="row">
          <div class="chip-stack wrap">
            ${this._renderOpenings()}
            ${t.map(t=>this._renderAlertChip(t))}
          </div>
          ${this._renderDock()}
        </div>
      </div>
    `}_renderCompact(t){const e=this._config;return W`
      <div class="content compact">
        <div class="row center">
          ${!1!==e.show_icon?W`<span class="inline-icon"
                  ><ha-icon .icon=${e.icon}></ha-icon
                ></span>`:K}
          ${this._renderTitleBlock()}
          <div class="chip-stack wrap end">
            ${this._renderOpenings()}
            ${t.map(t=>this._renderAlertChip(t))}
          </div>
          ${this._renderDock()}
        </div>
      </div>
    `}_renderTitleBlock(){const t=this._config;return W`
      <div class="title-block">
        ${!1!==t.show_name?W`<span class="title">${t.title??""}</span>`:K}
        ${!1!==t.show_climate?this._renderClimate():K}
      </div>
    `}_renderClimate(){const t=this._config?.climate;return t?.temperature||t?.humidity?W`
      <div class="climate">
        ${t.temperature?this._renderClimateValue(t.temperature,"°C","mdi:thermometer",t.temperature_thresholds,"temp_no_value"):K}
        ${t.humidity?this._renderClimateValue(t.humidity,"%","mdi:water-percent",t.humidity_thresholds,"humidity_no_value"):K}
      </div>
    `:K}_renderClimateValue(t,e,i,o,n){const r=this._getState(t),s=function(t,e){const i=Pt(t);if(null===i)return null;const o=Math.round(10*i)/10,n=Number.isInteger(o)?o.toFixed(1):String(o);return e?`${n} ${e}`:n}(r?.state,e);if(null===s)return W`<span class="climate-value missing">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        ${r?this._t(n):this._t("entity_missing")}
      </span>`;const a=zt(r?.state,o);return W`<span class="climate-value level-${a}">
      <ha-icon .icon=${i}></ha-icon>
      ${s}
    </span>`}_renderOpenings(){const t=this._config,e=t.openings?.state_style??"label";return(t.openings?.items??[]).map((t,i)=>this._renderOpeningChip(Mt(t,this._getState,e,i)))}_openingIcon(t){if(t.icon)return t.icon;const e=this._config;if(t.hasCover)return t.isDoor?"mdi:door-sliding":e.cover_icon??"mdi:blinds";if(t.isDoor)return"open"===t.windowState?"mdi:door-open":"mdi:door-closed";switch(t.windowState){case"open":return"mdi:window-open-variant";case"tilted":return"mdi:window-open";default:return e.window_icon??"mdi:window-closed-variant"}}_windowBadgeIcon(t){if(t.isDoor)return"open"===t.windowState?"mdi:door-open":"mdi:door-closed";switch(t.windowState){case"open":return"mdi:window-open-variant";case"tilted":return"mdi:window-open";default:return"mdi:window-closed-variant"}}_renderOpeningChip(t){const e=t=>this._t(t),i=null!==t.windowState?e(t.windowState):null!==t.position?t.coverClosed?e("closed"):t.position>=99?e("open"):`${Math.round(t.position)} %`:e("unknown");let o;o="color"===t.style?t.hasCover?null===t.position?e("unknown"):t.coverClosed?e("closed"):t.position>=99?e("open"):e("half"):i:t.hasCover?null!==t.position?`${Math.round(t.position)} %`:e("no_value"):i;const n={chip:!0,[`chip-${t.style}`]:!0,[`win-${t.windowState??"none"}`]:!0,"cover-closed":t.hasCover&&t.coverClosed,"cover-open":t.hasCover&&!t.coverClosed,"has-cover":t.hasCover,missing:t.missing,tappable:"none"!==t.tapAction},r=t.position??0;return W`
      <button
        class=${gt(n)}
        title=${t.name}
        @click=${()=>this._handleOpeningTap(t)}
      >
        ${"combined"!==t.style||!t.hasCover&&null===t.windowState?W`<ha-icon
                class="chip-icon"
                .icon=${this._openingIcon(t)}
              ></ha-icon>`:W`
                <span
                  class="combined-box win-frame-${t.windowState??"none"}"
                >
                  <span
                    class="combined-shade"
                    style=${bt({height:100-r+"%"})}
                  ></span>
                </span>
              `}
        ${"radial"===t.style&&t.hasCover?this._renderRadial(r):W`
                <span class="chip-text">
                  <span class="chip-title">${t.name}</span>
                  <span class="chip-sub">
                    ${t.hasCover&&null!==t.windowState&&"combined"!==t.style?W`<ha-icon
                            class="win-badge win-badge-${t.windowState}"
                            .icon=${this._windowBadgeIcon(t)}
                          ></ha-icon>`:K}
                    ${t.missing?e("entity_missing"):o}
                  </span>
                </span>
              `}
        ${"bar"===t.style&&t.hasCover?W`<span class="bar-track"
                ><span
                  class="bar-fill"
                  style=${bt({width:`${r}%`})}
                ></span
              ></span>`:K}
      </button>
    `}_renderRadial(t){const e=(t/100*Ft).toFixed(1);return W`
      <span class="radial">
        <svg viewBox="0 0 36 36">
          <circle class="radial-track" cx="18" cy="18" r="15.5"></circle>
          <circle
            class="radial-fill"
            cx="18"
            cy="18"
            r="15.5"
            stroke-dasharray="${e} ${Ft.toFixed(1)}"
          ></circle>
        </svg>
        <span class="radial-label">${Math.round(t)}</span>
      </span>
    `}_renderDock(){const t=this._config?.controls??[];return 0===t.length?K:W`
      <div class="dock">
        ${t.map(t=>{const e=this._getState(t.entity),i="on"===e?.state,o=void 0===e,n=t.icon??(t.entity.startsWith("switch.")?"mdi:power":"mdi:lightbulb"),r=t.name??e?.attributes.friendly_name??t.entity,s=i&&t.color?{background:t.color}:{};return W`
            <button
              class=${gt({control:!0,on:i,missing:o,labeled:!!t.label})}
              style=${bt(s)}
              title=${o?`${r} (${this._t("entity_missing")})`:r}
              @pointerdown=${()=>this._controlPressStart(t.entity)}
              @pointerup=${()=>this._controlPressEnd(t.entity)}
              @pointerleave=${()=>this._controlPressCancel()}
            >
              <ha-icon .icon=${n}></ha-icon>
              ${t.label?W`<span class="control-label">${t.label}</span>`:K}
            </button>
          `})}
      </div>
    `}_renderAlertChip(t){return W`
      <span
        class="chip alert-chip severity-${t.severity}"
        style=${bt(t.color?{background:t.color}:{})}
      >
        <ha-icon class="chip-icon" .icon=${t.icon}></ha-icon>
        <span class="chip-text">
          <span class="chip-title">${t.label}</span>
        </span>
      </span>
    `}_renderAlertBar(t){return W`
      <div
        class="alert-bar severity-${t.severity}"
        style=${bt(t.color?{background:t.color}:{})}
      >
        <ha-icon .icon=${t.icon}></ha-icon>
        ${t.label}
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
      z-index: 1;
    }
    .room-icon {
      position: absolute;
      left: 20px;
      bottom: 16px;
      z-index: 1;
      color: var(--drc-secondary);
      opacity: 0.9;
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
    ha-card.narrow .chip {
      min-width: 102px;
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
    .win-badge {
      --mdc-icon-size: 14px;
    }
    .win-badge-open {
      color: var(--drc-open);
    }
    .win-badge-tilted {
      color: var(--drc-tilted);
    }
    .win-badge-closed {
      color: var(--drc-closed);
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
    /* Contact frame around cover chips */
    .chip.has-cover.win-open {
      border-color: var(--drc-open);
    }
    .chip.has-cover.win-tilted {
      border-color: var(--drc-tilted);
    }
    .chip.has-cover.win-closed {
      border-color: var(--drc-closed);
    }
    .chip.missing {
      background: color-mix(in srgb, var(--drc-warning) 25%, transparent);
      color: var(--drc-text);
      border-color: var(--drc-warning);
    }
    .chip.chip-combined {
      background: color-mix(in srgb, var(--drc-text) 8%, transparent);
      color: var(--drc-text);
      border-color: transparent;
    }
    .combined-box {
      position: relative;
      width: 30px;
      height: 30px;
      border: 2.5px solid var(--drc-secondary);
      border-radius: 5px;
      overflow: hidden;
      background: color-mix(in srgb, var(--drc-accent) 18%, transparent);
      flex-shrink: 0;
      display: inline-block;
    }
    .combined-box.win-frame-open {
      border-color: var(--drc-open);
    }
    .combined-box.win-frame-tilted {
      border-color: var(--drc-tilted);
    }
    .combined-box.win-frame-closed {
      border-color: var(--drc-closed);
    }
    .combined-shade {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      background: color-mix(in srgb, var(--drc-secondary) 65%, transparent);
    }

    .bar-track {
      width: 52px;
      height: 8px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.35);
      overflow: hidden;
      flex-shrink: 0;
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
      height: 52px;
      min-width: 52px;
      padding: 0;
      border: none;
      border-radius: 26px;
      background: var(--drc-control-bg);
      color: var(--drc-secondary);
      cursor: pointer;
      flex-shrink: 0;
      font: inherit;
      --mdc-icon-size: 23px;
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
  `}};t([pt()],Kt.prototype,"_config",void 0),t([pt()],Kt.prototype,"_narrow",void 0),t([pt()],Kt.prototype,"_hass",void 0),Kt=t([lt("deluxe-room-card")],Kt),window.customCards=window.customCards??[],window.customCards.push({type:"deluxe-room-card",name:"Deluxe Room Card",description:"Room overview card: windows & covers as combined chips, climate with thresholds, light dock, alert bars and rule-based outlines.",preview:!0,documentationURL:"https://github.com/florianbaethge/deluxe_room_card"}),console.info("%c DELUXE-ROOM-CARD %c 0.1.0 ","color: #fff; background: #2f7d54; font-weight: 700;","color: #2f7d54; background: #fff; font-weight: 700;");export{Kt as DeluxeRoomCard};
//# sourceMappingURL=deluxe-room-card.js.map
