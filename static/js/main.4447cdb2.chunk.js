(this["webpackJsonptwitch-bot"]=this["webpackJsonptwitch-bot"]||[]).push([[0],{35:function(e,t){},46:function(e,t,a){},47:function(e,t,a){},51:function(e,t,a){},59:function(e,t){},75:function(e,t,a){},82:function(e,t,a){"use strict";a.r(t);var n=a(2),s=a.n(n),c=a(37),o=a.n(c),i=a(21),r=(a(46),a(9)),u=a(10),h=a(12),m=a(11),l=(a(47),a(19)),d=a.n(l),p=a(26),g=a(4),b=a(22),j=a(16),f=a(17),x=a(38),v=a(41),O=a(25),k=1,y=2,w=3,G=function(){function e(t){var a=this;Object(r.a)(this,e),this.updateLastMessageTime=function(e){a.lastMessageTimes=Object(g.a)(Object(g.a)({},a.lastMessageTimes),{},Object(f.a)({},e,Date.now()))},this.minsSinceLastChatMessage=function(e){return Math.floor((Date.now()-a.lastMessageTimes[e])/6e4)},this.getChatters=function(){return O("https://thingproxy.freeboard.io/fetch/https://tmi.twitch.tv/group/user/".concat(a.channel,"/chatters")).then((function(e){return e.json()})).then((function(e){return e&&e.chatters?[].concat(Object(j.a)(e.chatters.moderators),Object(j.a)(e.chatters.viewers),Object(j.a)(e.chatters.staff),Object(j.a)(e.chatters.admins),Object(j.a)(e.chatters.global_mods)):null})).catch((function(e){return null}))},this.channel=t,this.lastMessageTimes={},this.getStatusPromise=this.getStatusPromise.bind(this)}return Object(u.a)(e,[{key:"getStatusPromise",value:function(){var e=Object(p.a)(d.a.mark((function e(t){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t!==this.channel){e.next=2;break}return e.abrupt("return",k);case 2:if(!(this.lastMessageTimes[t]&&this.minsSinceLastChatMessage(t)<10)){e.next=4;break}return e.abrupt("return",k);case 4:return e.abrupt("return",this.getChatters().then((function(e){return e&&e.includes(t)?y:w})));case 5:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),_=(a(51),a.p+"static/media/lock.6857c469.svg"),M=a(3),S=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).getFormattedTimeDiff=function(e){var t="minute",a=Math.floor((Date.now()-e)/6e4);return 0===a?"just now":(a>=60&&(t="hour",(a=Math.floor(a/60))>=24&&(t="day",a=Math.floor(a/24))),"".concat(a," ").concat(t).concat(1===a?"":"s"," ago"))},n.updateStatus=function(){n.props.getActivity(n.props.metadata.username).then((function(e){n.setState((function(){return Object(g.a)(Object(g.a)({},n.state),{},{timeDiff:n.getFormattedTimeDiff(n.props.metadata.time),activityStatus:e})}))}))},n.delete=function(e){n.props.onDelete(n.props.msg)},n.toggleLock=function(){n.props.toggleLock(n.props.msg)},n.getTooltipContents=function(){var e="";switch(n.state.activityStatus){case k:e="active";break;case y:e="idle";break;case w:e="disconnected"}return'\n      <div class="tooltip">\n        <p class="tooltipText">Requested '.concat(n.state.timeDiff," by ").concat(n.props.metadata.username,'</p>\n        <div class="status ').concat(e,'" />\n      </div>')},n.state={timeDiff:0,activityStatus:null},n}return Object(u.a)(a,[{key:"render",value:function(){var e=this.props.metadata.locked?"1":"0.2",t=this.props.metadata.chosen?"chosen":"pending";return Object(M.jsxs)("div",{children:[Object(M.jsx)(v.a,{effect:"solid",place:"right"}),Object(M.jsx)("div",{id:"baseDiv",className:t,"data-tip":this.getTooltipContents(),"data-html":!0,onMouseEnter:this.updateStatus,children:Object(M.jsxs)("div",{style:{margin:"0px 15px 7px",padding:"4px",fontSize:"16px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[this.props.msg,Object(M.jsxs)("div",{style:{display:"flex"},children:[Object(M.jsx)("img",{src:_,alt:"lock",style:{width:"16px",opacity:e,paddingRight:"8px"},className:"lock",onClick:this.toggleLock}),Object(M.jsx)("button",{type:"button",className:"deleteButton",onClick:this.delete,children:"X"})]})]})})]})}}]),a}(n.Component),N=a(33),C=a(28),q=a.n(C),L=a.p+"static/media/JackboxGames.6e3cb11a.yaml",I=a(25),T=a(57),D="!request",A=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).checkForMiscCommands=function(e,t){if("!gamelist"===e||"!gameslist"===e)return n.sendMessage("/me @".concat(t,", click here for a list of valid Jackbox games: ").concat("https://asukii314.github.io/twitch-request-wheel/#","/gamelist")),!0;if("!advancenextgame"===e)return n.props.channel===t||n.props.modList.includes(t.toLowerCase())?(n.props.advanceNextGame()?n.sendMessage("/me @".concat(t,", the next game has been advanced to ").concat(n.props.upcomingGames[0].gameName,".")):n.sendMessage("/me @".concat(t,", there are no more games in the queue to advance to!")),!0):(n.sendMessage("/me @".concat(t,", only channel moderators can use the !setNextGame command.")),!0);if(e.startsWith("!setnextgame")){if(n.props.channel!==t&&!n.props.modList.includes(t.toLowerCase()))return n.sendMessage("/me @".concat(t,", only channel moderators can use the !setNextGame command.")),!0;var a=e.replace("!setnextgame","").trim();if(""===a)return n.sendMessage("/me @".concat(t,", please specify the game you would like to insert in the queue: for example, !setNextGame TMP 2")),!0;var s=n.matchGameName(a);if(s){var c=n.props.setNextGame(s);0===c?n.sendMessage("/me @".concat(t,", ").concat(s," has been inserted as the next game in the queue.")):n.sendMessage("/me @".concat(t,", ").concat(s," has been inserted in the queue following ").concat(c," other manual game request").concat(c>1?"s":"","."))}return!0}},n.matchGameName=function(e,t){for(var a in n.state.validGames)for(var s=n.state.validGames[a],c=0,o=Object.entries(s);c<o.length;c++){var i=Object(N.a)(o[c],2),r=i[0];if(i[1].includes(e))return"".concat(r," (").concat(a,")")}return n.sendMessage("/me @".concat(t,", ").concat(e," could not be found in the list of valid Jackbox games. Click here for a list of valid games: ").concat("https://asukii314.github.io/twitch-request-wheel/#","/gamelist")),null},n.checkForGameCommand=function(e,t){if(e.startsWith(D)){var a=e.replace(D,"").trim();return""===a?(n.sendMessage("/me @".concat(t,", please specify the game you would like to request: for example, !request TMP 2")),null):n.matchGameName(a,t)}},n.onMessage=function(e,t,a,s){if(!s)if(n.props.onMessage(a,t.username,t),"!nextgame"!==a.trim()){var c=a.trim().toLowerCase();if(!n.checkForMiscCommands(c,t.username)){var o=n.checkForGameCommand(c,t.username);if(o)if(n.props.messages[o])n.sendMessage("/me @".concat(t.username,", ").concat(o," has already been requested!"));else{for(var i=null,r=0,u=Object.entries(n.props.messages);r<u.length;r++){var h=Object(N.a)(u[r],2),m=h[0];if(h[1].username===t.username){i=m;break}}i?n.props.channel===t.username?n.sendMessage("/me @".concat(t.username,", ").concat(o," has been added to the request queue. Your previous game request(s) weren't deleted, since you have special broadcaster privilege :P")):(n.props.onDelete(i),n.sendMessage("/me @".concat(t.username,", your previous request of ").concat(i," has been replaced with ").concat(o,"."))):n.sendMessage("/me @".concat(t.username,", ").concat(o," has been added to the request queue.")),n.props.addGameRequest(o,t.username)}}}else if(n.props.upcomingGames&&n.props.upcomingGames.length>0){var l=n.props.upcomingGames[0].gameName;if(n.props.upcomingGames.length>1){l+=", followed by ".concat(n.props.upcomingGames[1].gameName);for(var d=2;d<n.props.upcomingGames.length;d++)l+=" and ".concat(n.props.upcomingGames[d].gameName)}n.sendMessage("/me @".concat(t.username,", unless someone requested a different one with channel points, the next game up is ").concat(l,"!"))}else n.sendMessage("/me @".concat(t.username,", the next game hasn't been decided yet (unless someone requested one with channel points)!"))},n.sendMessage=function(e){n.state.client.say(n.props.channel,e)},n.state={client:null,validGames:[]},n}return Object(u.a)(a,[{key:"componentDidMount",value:function(e){var t=this,a=new T.client({identity:{username:this.props.channel,password:this.props.access_token},channels:[this.props.channel]});a.on("message",this.onMessage),a.connect(),I(L).then((function(e){return e.text()})).then((function(e){t.setState((function(t){return Object(g.a)(Object(g.a)({},t),{},{client:a,validGames:q.a.parse(e)})}))}))}},{key:"render",value:function(){return null}}]),a}(n.Component),P=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).printGame=function(e){return e===n.props.nextGameIdx?Object(M.jsx)("b",{style:{color:"aquamarine"},children:n.props.history[e].gameName}):n.props.history[e].gameName},n.state={index:0},n}return Object(u.a)(a,[{key:"render",value:function(){var e=this;return Object(M.jsxs)("div",{style:{marginLeft:"12px",width:"33%",textTransform:"capitalize"},children:[Object(M.jsx)("div",{style:{backgroundColor:"darkslategrey",borderRadius:"5px",marginTop:0,padding:"1px",marginBottom:"10px"},children:Object(M.jsxs)("p",{style:{fontSize:"14px",fontWeight:"700",height:"70px",padding:"8px"},children:[" Up Next:",this.props.history.length>this.props.nextGameIdx?Object(M.jsx)("p",{children:this.props.history[this.props.nextGameIdx].gameName}):Object(M.jsx)("p",{children:"not yet decided"})]})}),Object(M.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[Object(M.jsx)("button",{onClick:this.props.moveNextGameBack,style:{backgroundColor:"darkcyan",borderRadius:"5px",marginTop:0,width:"50%",marginBottom:"20px",marginRight:"5px"},children:" \u21e6 "}),Object(M.jsx)("button",{onClick:this.props.moveNextGameFwd,style:{backgroundColor:"darkcyan",borderRadius:"5px",marginTop:0,width:"50%",marginBottom:"20px",marginLeft:"5px"},children:" \u21e8 "})]}),Object(M.jsxs)("div",{style:{backgroundColor:"darkslategrey",borderRadius:"5px",marginTop:0,padding:"5px"},children:[Object(M.jsx)("p",{style:{fontSize:"14px",fontWeight:"700"},children:" History "}),Object(M.jsxs)("p",{style:{fontSize:"12px"},children:[this.props.history.map((function(t,a){return Object(M.jsx)("li",{children:e.printGame(a)},a)})),0===this.props.history.length&&Object(M.jsx)("li",{children:"No games yet"},"0")]})]})]})}}]),a}(n.Component),B=a(73),R=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).moveNextGameFwd=function(){return n.state.nextGameIdx!==n.state.history.length&&(n.setState((function(e){return Object(g.a)(Object(g.a)({},n.state),{},{nextGameIdx:e.nextGameIdx+1})})),!0)},n.moveNextGameBack=function(){n.state.nextGameIdx<=0||n.setState((function(e){return Object(g.a)(Object(g.a)({},n.state),{},{nextGameIdx:e.nextGameIdx-1})}))},n.addGameRequest=function(e,t){n.setState((function(a){return Object(g.a)(Object(g.a)({},a),{},{messages:Object(g.a)(Object(g.a)({},n.state.messages),{},Object(f.a)({},e,{username:t,time:Date.now(),locked:!1,chosen:!1})),counter:n.state.counter+1})}))},n.toggleLock=function(e){var t=Object(g.a)({},n.state.messages[e]);t.locked=!t.locked,n.setState((function(){return Object(g.a)(Object(g.a)({},n.state),{},{messages:Object(g.a)(Object(g.a)({},n.state.messages),{},Object(f.a)({},e,t))})}))},n.setNextGame=function(e){for(var t=n.state.nextGameIdx;t<n.state.history.length&&(null===(a=n.state.history[t])||void 0===a?void 0:a.override);){var a;t++}return n.setState((function(a){return Object(g.a)(Object(g.a)({},a),{},{history:[].concat(Object(j.a)(a.history.slice(0,Math.max(0,t))),[{gameName:e,override:!0}],Object(j.a)(a.history.slice(t)))})})),t-n.state.nextGameIdx},n.addGameToQueue=function(e){n.setState((function(t){return Object(g.a)(Object(g.a)({},t),{},{history:[].concat(Object(j.a)(n.state.history),[{gameName:e,override:!1}]),messages:Object(g.a)(Object(g.a)({},t.messages),{},Object(f.a)({},e,Object(g.a)(Object(g.a)({},t.messages[e]),{},{chosen:!0})))})}))},n.onWheelSpun=function(e){if(0!==Object.keys(n.state.messages).length){var t=n.state.messages[e].username;n.chatActivity.getStatusPromise(t).then((function(a){var s="";switch(a){case w:s="".concat(e," just won the spin, but it doesn't seem like @").concat(t," is still around. Hope someone else wants to play!");break;case k:s="@".concat(t,", good news - ").concat(e," just won the spin!");break;case y:default:s+="@".concat(t,", good news - ").concat(e," just won the spin! (I hope you're still around!)")}n.messageHandler.sendMessage(s)})),n.addGameToQueue(e),n.state.messages[e].locked||setTimeout((function(){n.removeGame(e,!0)}),2500)}},n.removeGame=function(e){var t=Object(g.a)({},n.state.messages);delete t[e],n.setState((function(e){return Object(g.a)(Object(g.a)({},e),{},{messages:t,counter:n.state.counter+1})}))},n.onMessage=function(e,t,a){n.chatActivity.updateLastMessageTime(t)},n.chatActivity=new G(n.props.channel),n.state={messages:{},colors:B({count:99,luminosity:"light",hue:"blue"}),counter:0,history:[],nextGameIdx:0},n}return Object(u.a)(a,[{key:"render",value:function(){var e,t=this,a=Object.keys(this.state.messages);return"function"===typeof this.props.onLogout&&(e=Object(M.jsx)("button",{style:{position:"absolute",top:0,right:0,backgroundColor:"darkcyan",borderRadius:"5px",marginTop:0,paddingBottom:"5px",paddingTop:"5px",color:"#fff"},onClick:this.props.onLogout,children:"Logout \u27a7"})),Object(M.jsxs)("div",{style:{display:"flex"},children:[Object(M.jsx)(A,{addGameRequest:this.addGameRequest,setNextGame:this.setNextGame,advanceNextGame:this.moveNextGameFwd,messages:this.state.messages,channel:this.props.channel,modList:this.props.modList,access_token:this.props.access_token,onMessage:this.onMessage,onDelete:this.removeGame,upcomingGames:this.state.history.slice(this.state.nextGameIdx),ref:function(e){return t.messageHandler=e}}),Object(M.jsxs)("div",{width:"50vw",children:[Object(M.jsx)("h2",{style:{marginBottom:"0"},children:"Game Requests"}),Object(M.jsxs)("h4",{style:{fontSize:"20px",color:"yellow",marginTop:"6px",marginBottom:"12px",fontWeight:400},children:['Type e.g. "!request Blather Round" in ',this.props.channel,"'s chat to add"]}),Object(M.jsxs)("div",{style:{display:"flex",alignItems:"flex-start",height:"100%"},children:[Object(M.jsx)(P,{history:this.state.history,nextGameIdx:this.state.nextGameIdx,moveNextGameFwd:this.moveNextGameFwd,moveNextGameBack:this.moveNextGameBack}),Object(M.jsx)("div",{style:{flexGrow:"2",marginLeft:"15px"},children:a.map((function(e,a){return Object(M.jsx)(S,{msg:e,metadata:t.state.messages[e],onDelete:t.removeGame,toggleLock:t.toggleLock.bind(e),getActivity:t.chatActivity.getStatusPromise},a)}))})]})]}),Object(M.jsx)("div",{width:"50vw",style:{textTransform:"capitalize"},children:Object(M.jsx)("div",{style:{fontSize:"16px",overflow:"hidden",width:"600px"},children:Object(M.jsx)(x.a,{segments:a,segColors:this.state.colors,onFinished:this.onWheelSpun,isOnlyOnce:!1,size:250,upDuration:100,downDuration:1e3,primaryColor:"white",contrastColor:"black"},this.state.counter)})}),e]})}}]),a}(n.Component),F=(a(75),a(25)),z=function(e){var t=Object.keys(e.metadata);return Object(M.jsxs)("div",{className:"partyPackCard",children:[Object(M.jsxs)("p",{className:"partyPackName",children:[e.partyPackName," "]}),t.map((function(t,a){return Object(M.jsx)(W,{gameName:t,possibleMatches:e.metadata[t]},a)}))]})},W=function(e){return Object(M.jsxs)("div",{children:[Object(M.jsxs)("p",{className:"gameName",children:[e.gameName," "]}),e.possibleMatches.map((function(e,t){return Object(M.jsxs)("li",{className:"possibleGameMatch",children:["!request ",e]})}))]})},J=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={validGames:[]},n}return Object(u.a)(a,[{key:"componentDidMount",value:function(e){var t=this;F(L).then((function(e){return e.text()})).then((function(e){t.setState((function(t){return Object(g.a)(Object(g.a)({},t),{},{validGames:q.a.parse(e)})}))}))}},{key:"render",value:function(){var e=this,t=Object.keys(this.state.validGames);return Object(M.jsx)("div",{className:"partyPackList",children:t.map((function(t,a){return Object(M.jsx)(z,{partyPackName:t,metadata:e.state.validGames[t]},a)}))})}}]),a}(n.Component),H=a(6),U=a(39),E=a.n(U),Q=a(25),X=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(){var e;return Object(r.a)(this,a),(e=t.call(this)).state={username:localStorage.getItem("__username"),access_token:localStorage.getItem("__access_token"),failed_login:!1},e.getAuth=e.getAuth.bind(Object(b.a)(e)),e.logOut=e.logOut.bind(Object(b.a)(e)),e}return Object(u.a)(a,[{key:"componentDidMount",value:function(){var e=this;if(!this.state.access_token)return this.getAuth();Q("https://api.twitch.tv/helix/users",{headers:{"Client-ID":"u172q64ekv1j8nxy1r48mb8vn4kk7v",Authorization:"Bearer ".concat(this.state.access_token)}}).then((function(e){return e.json()})).then((function(t){return localStorage.setItem("__username",t.data[0].login),Q("https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=".concat(t.data[0].id),{headers:{"Client-ID":"u172q64ekv1j8nxy1r48mb8vn4kk7v",Authorization:"Bearer ".concat(e.state.access_token)}}).then((function(e){return e.json()})).then((function(a){var n=a.data.map((function(e){return e.user_name.toLowerCase()}));e.setState((function(e){return Object(g.a)(Object(g.a)({},e),{},{username:t.data[0].login,modList:n})}))}))})).catch((function(t){return e.getAuth}))}},{key:"logOut",value:function(){localStorage.removeItem("__username"),localStorage.removeItem("__access_token"),Q("https://id.twitch.tv/oauth2/revoke?"+new URLSearchParams({client_id:"u172q64ekv1j8nxy1r48mb8vn4kk7v",token:this.state.access_token,redirect_uri:"https://asukii314.github.io/twitch-request-wheel/#"}),{method:"POST",headers:{Accept:"application/vnd.twitchtv.v5+json"}}).then((function(){window.location.reload()}))}},{key:"getAuth",value:function(){var e=Object(p.a)(d.a.mark((function e(t){var a,n=this;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t&&console.error(t),localStorage.removeItem("__username"),localStorage.removeItem("__access_token"),a=E.a.parse(this.props.location.search),e.next=6,Q("https://id.twitch.tv/oauth2/token?"+new URLSearchParams({grant_type:"authorization_code",code:a.code,client_id:"u172q64ekv1j8nxy1r48mb8vn4kk7v",client_secret:"7yfmbc5ka6t7frki5g8m0qsboltp2p",redirect_uri:"https://asukii314.github.io/twitch-request-wheel/#"}),{method:"POST",headers:{Accept:"application/vnd.twitchtv.v5+json"}}).then((function(e){return e.json()})).then((function(e){e.access_token?(localStorage.setItem("__access_token",e.access_token),n.setState((function(t){return Object(g.a)(Object(g.a)({},t),{},{access_token:e.access_token})})),Q("https://api.twitch.tv/helix/users",{headers:{"Client-ID":"u172q64ekv1j8nxy1r48mb8vn4kk7v",Authorization:"Bearer ".concat(e.access_token)}}).then((function(e){return e.json()})).then((function(e){return localStorage.setItem("__username",e.data[0].login),Q("https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=".concat(e.data[0].id),{headers:{"Client-ID":"u172q64ekv1j8nxy1r48mb8vn4kk7v",Authorization:"Bearer ".concat(n.state.access_token)}}).then((function(e){return e.json()})).then((function(t){var a=t.data.map((function(e){return e.user_name.toLowerCase()}));n.setState((function(t){return Object(g.a)(Object(g.a)({},t),{},{username:e.data[0].login,modList:a})}))}))}))):n.setState((function(e){return Object(g.a)(Object(g.a)({},e),{},{failed_login:!0})}))}));case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){return Object(M.jsxs)("div",{children:["/gamelist"===this.props.location.pathname&&Object(M.jsx)(J,{}),this.state.failed_login&&"/gamelist"!==this.props.location.pathname?Object(M.jsx)(H.a,{to:"/login"}):this.state.username&&Object(M.jsx)(R,{channel:this.state.username,modList:this.state.modList,access_token:this.state.access_token,onLogout:this.logOut})]})}}]),a}(n.Component),Y=Object(H.f)(X),K=function(){var e="https://id.twitch.tv/oauth2/authorize?client_id=".concat("u172q64ekv1j8nxy1r48mb8vn4kk7v","&response_type=code&scope=").concat("chat:read chat:edit moderation:read","&redirect_uri=").concat("https://asukii314.github.io/twitch-request-wheel/%23");return Object(M.jsx)("a",{href:e,style:{backgroundColor:"rebeccapurple",borderRadius:"5px",padding:"10px",color:"white"},children:"Log In With Twitch"})},V=function(e){Object(h.a)(a,e);var t=Object(m.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(u.a)(a,[{key:"render",value:function(){return Object(M.jsx)(i.b,{basename:"/",children:Object(M.jsx)("div",{className:"App",children:Object(M.jsxs)("header",{className:"App-header",children:[Object(M.jsx)(H.b,{exact:!0,path:"/login",children:K()}),Object(M.jsx)(H.b,{path:"/",component:Y}),Object(M.jsx)(H.b,{path:"/gamelist",component:J})]})})})}}]),a}(n.Component),Z=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,85)).then((function(t){var a=t.getCLS,n=t.getFID,s=t.getFCP,c=t.getLCP,o=t.getTTFB;a(e),n(e),s(e),c(e),o(e)}))};o.a.render(Object(M.jsx)(s.a.StrictMode,{children:Object(M.jsx)(i.a,{children:Object(M.jsx)(V,{})})}),document.getElementById("root")),Z()}},[[82,1,2]]]);
//# sourceMappingURL=main.4447cdb2.chunk.js.map