(this["webpackJsonptwitch-bot"]=this["webpackJsonptwitch-bot"]||[]).push([[0],{22:function(e,t){},32:function(e,t,n){},33:function(e,t,n){},40:function(e,t){},63:function(e,t,n){"use strict";n.r(t);var c=n(0),s=n.n(c),a=n(24),r=n.n(a),o=n(15),i=(n(32),n(8)),u=n(9),h=n(11),l=n(10),d=(n(33),n(2)),p=n(18),j=n.n(p),b=n(7),f=n(25),m=n(26),O=n(1),g=n(36),v=n(38),x="!request",w=function(e){Object(h.a)(n,e);var t=Object(l.a)(n);function n(){var e;Object(i.a)(this,n);for(var c=arguments.length,s=new Array(c),a=0;a<c;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).delete=function(t){e.props.onDelete(e.props.msg)},e}return Object(u.a)(n,[{key:"render",value:function(){return Object(O.jsx)("div",{style:{backgroundColor:"steelblue",textAlign:"left",borderRadius:"8px",textTransform:"capitalize"},children:Object(O.jsxs)("p",{style:{margin:"15px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[this.props.msg,Object(O.jsx)("button",{type:"button",onClick:this.delete,style:{backgroundColor:"red",float:"right",height:"50%",color:"white",fontSize:"16px"},children:"X"})]})})}}]),n}(c.Component),y=function(e){Object(h.a)(n,e);var t=Object(l.a)(n);function n(e){var c;return Object(i.a)(this,n),(c=t.call(this,e)).onGameChosen=function(e){console.log("Game chosen: "+e)},c.removeGame=function(e){console.log(e);var t=new Set(c.state.messages);t.delete(e),c.setState((function(e){return Object(b.a)(Object(b.a)({},e),{},{messages:t,counter:c.state.counter+1})}))},c.onMessage=function(e,t,n,s){var a=function(e){if(e.startsWith(x))return e.replace(x,"").trim().toLowerCase()}(n);if(a)if(c.state.messages.has(a))c.sendMessage("/me @".concat(t.username,", ").concat(a," has already been requested!"));else{var r=new Set(c.state.messages).add(a);c.setState((function(e){return Object(b.a)(Object(b.a)({},e),{},{messages:r,counter:c.state.counter+1})})),c.sendMessage("/me @".concat(t.username,", ").concat(a," has been added to the request queue."))}},c.sendMessage=function(e){c.state.client.say(c.props.channel,e)},c.state={messages:new Set,colors:g({count:99,luminosity:"light",hue:"blue"}),counter:0},c}return Object(u.a)(n,[{key:"componentDidMount",value:function(e){var t=new v.client({identity:{username:this.props.channel,password:this.props.access_token},channels:[this.props.channel]});t.on("message",this.onMessage),t.connect(),console.log(JSON.stringify(t)),this.setState((function(e){return Object(b.a)(Object(b.a)({},e),{},{client:t})}))}},{key:"render",value:function(){var e=this,t=Array.from(this.state.messages);return Object(O.jsxs)("div",{style:{display:"flex"},children:[Object(O.jsxs)("column",{width:"50vw",children:[Object(O.jsx)("h2",{style:{marginBottom:"0"},children:"Game Requests"}),Object(O.jsxs)("h4",{style:{fontSize:"12px",marginTop:"6px",marginBottom:"12px",fontWeight:400},children:['Type e.g. "!request Blather Round" in ',this.props.channel,"'s chat to add"]}),t.map((function(t,n){return Object(O.jsx)(w,{msg:t,onDelete:e.removeGame},n)}))]}),Object(O.jsx)("column",{width:"50vw",style:{textTransform:"capitalize"},children:Object(O.jsx)("div",{style:{fontSize:"16px",overflow:"hidden",width:"600px"},children:Object(O.jsx)(m.a,{segments:t,segColors:this.state.colors,onFinished:this.onGameChosen,isOnlyOnce:!1,size:250,upDuration:100,downDuration:1e3,primaryColor:"white",contrastColor:"black"},this.state.counter)})})]})}}]),n}(c.Component),k=n(55),C=function(e){Object(h.a)(n,e);var t=Object(l.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){return Object(O.jsx)(S,{})}}]),n}(c.Component),S=function(e){Object(h.a)(n,e);var t=Object(l.a)(n);function n(){var e;return Object(i.a)(this,n),(e=t.call(this)).state={username:"",access_token:""},e}return Object(u.a)(n,[{key:"componentDidMount",value:function(){var e=Object(f.a)(j.a.mark((function e(){var t=this;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k("https://id.twitch.tv/oauth2/token?"+new URLSearchParams({grant_type:"authorization_code",code:new URLSearchParams(window.location.search).get("code"),client_id:"u172q64ekv1j8nxy1r48mb8vn4kk7v",client_secret:"7yfmbc5ka6t7frki5g8m0qsboltp2p",redirect_uri:"https://asukii314.github.io/twitch-request-wheel/login"}),{method:"POST",headers:{Accept:"application/vnd.twitchtv.v5+json"}}).then((function(e){return e.json()})).then((function(e){e.access_token||(window.location.href=window.location.origin),t.setState((function(t){return Object(b.a)(Object(b.a)({},t),{},{access_token:e.access_token})})),k("https://api.twitch.tv/helix/users",{headers:{"Client-ID":"u172q64ekv1j8nxy1r48mb8vn4kk7v",Authorization:"Bearer ".concat(e.access_token)}}).then((function(e){return e.json()})).then((function(e){t.setState((function(t){return Object(b.a)(Object(b.a)({},t),{},{username:e.data[0].login})}))}))}));case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){return Object(O.jsx)("p",{children:this.state.username&&Object(O.jsx)(y,{channel:this.state.username,access_token:this.state.access_token})})}}]),n}(c.Component),_=function(e){Object(h.a)(n,e);var t=Object(l.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){var e="https://id.twitch.tv/oauth2/authorize?client_id=".concat("u172q64ekv1j8nxy1r48mb8vn4kk7v","&redirect_uri=").concat("https://asukii314.github.io/twitch-request-wheel/login","&response_type=code&scope=chat:read chat:edit");return Object(O.jsxs)(d.c,{children:[Object(O.jsx)(d.a,{path:"/*",children:Object(O.jsx)("div",{className:"App",children:Object(O.jsx)("header",{className:"App-header",children:Object(O.jsx)("a",{href:e,style:{backgroundColor:"rebeccapurple",borderRadius:"5px",padding:"10px",color:"white"},children:"Log In With Twitch"})})})}),Object(O.jsx)(d.a,{path:"/login",children:Object(O.jsx)(C,{})})]})}}]),n}(c.Component),q=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,64)).then((function(t){var n=t.getCLS,c=t.getFID,s=t.getFCP,a=t.getLCP,r=t.getTTFB;n(e),c(e),s(e),a(e),r(e)}))};r.a.render(Object(O.jsx)(s.a.StrictMode,{children:Object(O.jsx)(o.a,{children:Object(O.jsx)(_,{})})}),document.getElementById("root")),q()}},[[63,1,2]]]);
//# sourceMappingURL=main.985b2826.chunk.js.map