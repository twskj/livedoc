#!/usr/bin/env node

var fs = require('fs');

var indent_num = 4;
var lastkey = "";
var argv = {};
for (var i = 0; i < process.argv.length; i++) {
    if (process.argv[i].startsWith("-")) {
        lastkey = process.argv[i];
    } else {
        if (lastkey) {
            argv[lastkey] = process.argv[i];
            lastkey = "";
        }
    }
}

if (!argv["-i"]) {
    console.log("missing input file");
    process.exit(1);
}

var inputFile = argv["-i"];
var outputFile = argv["-o"] || "index.html";

function getTemplate() {
    return `
<html>
<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/css/materialize.min.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>

        [v-cloak] {
            display: none;
        }

        body {
            /*padding: 0rem 1rem 0 1rem;*/
            background: #fdfdfd;
        }

        .indent {
            padding-left: 1em;
        }

        .r-margin {
            margin-right: 2em;
        }

        .r-indent {
            padding-right: 1em;
        }

        no-overflow {
            overflow: auto;
        }

        .bold {
            font-weight: bold;
        }

        .api-block{
            border: 1px solid;
            margin: 0.5rem 0 1.5rem 0;
            border-color: #82b1ff;
        }

        .api-header{
            font-size: 13pt;
        }

        .api-header > .api-title {
            font-size: 13pt;
            padding: 0.5em 0.5em 0.5em 0.5em;
            display: inline-block;
        }

        .tag-container{
            padding: 0.3em;
            height: 2em;
        }
        .tag-container > .tag {

            display: inline-block;
            margin-right: 10px;
            padding: 0 0.5rem 0 0.5rem;
            white-space: nowrap;
            position: relative;
            min-width: 3rem;
            text-align: center;

            background: linear-gradient(to bottom, #fed970 0%,#febc4a 100%);
            background-color: #FEC95B;

            color: #963;
            font-weight: bold;
            text-decoration: none;
            text-shadow: 0 1px rgba(255,255,255,0.4);

            border-top: 1px solid #EDB14A;
            border-bottom: 1px solid #CE922E;
            border-right: 1px solid #DCA03B;
            border-left: 1px solid #EDB14A;
            border-radius: 3px 3px 3px 3px;
            box-shadow: inset 0 1px #FEE395, 0 1px 2px rgba(0,0,0,0.21);
        }

        .round-border {
            border-radius: 3px;
        }

        .showReqBtn {
            padding: 1rem 0 1rem 0;
        }

        .fade-enter-active, .fade-leave-active {
            transition: opacity .5s
        }

        .fade-leave-active {
            transition: opacity .05s
        }

        .fade-enter, .fade-leave-to {
            opacity: 0
        }

        .pointer {
            cursor: pointer;
        }

        .tool-panel{
            border: 1px solid #9e9e9e;
            padding: 1em;
            margin-bottom: 1rem;
            margin-top: 1rem;
        }

        [type="radio"].with-gap:checked + label:before {
            border-radius: 50%;
            border: 2px solid #2196f3;
        }

        [type="radio"].with-gap:checked + label:after {
            border-radius: 50%;
            border: 2px solid #2196f3;
            background-color: #2196f3;
            z-index: 0;
            -webkit-transform: scale(.5);
            -moz-transform: scale(.5);
            -ms-transform: scale(.5);
            -o-transform: scale(.5);
            transform: scale(.5);
        }


          /* label color */
        /*.input-field label {
            color: #000;
        }*/
        /* label focus color */
        .input-field input[type=text]:focus + label {
            color: #666;
        }
        /* label underline focus color */
        .input-field input[type=text]:focus {
            border-bottom: 1px solid #64b5f6;
            box-shadow: 0 1px 0 0 #42a5f5;
        }
        /* valid color */
        /*.input-field input[type=text].valid {
            border-bottom: 1px solid #000;
            box-shadow: 0 1px 0 0 #000;
        }*/
        /* invalid color */
        /*.input-field input[type=text].invalid {
            border-bottom: 1px solid #000;
            box-shadow: 0 1px 0 0 #000;
        }*/
        /* icon prefix focus color */
        /*.input-field .prefix.active {
            color: #000;
        }*/

        textarea {
            white-space: pre;
            overflow: scroll;
            overflow-x: scroll;
            overflow-y: scroll;
            height: 10em;
        }

        .console{
            font-family: monospace;
            font-weight: normal;
            font-style: normal;
        }

        .yellow-border{
            border-color: #ffc400;
        }

        blockquote{
            padding: 0.5em 0 0.5em 1em;
        }

        #toast-container {
            min-width: 100%;
            bottom: 0%;
            top: 95%;
            right: 0%;
            left:  0%;
        }

        ::-webkit-input-placeholder {
            color: #DDDDDD;
        }
        ::-moz-placeholder {
            color: #DDDDDD;
        }
        :-ms-input-placeholder {
            color: #DDDDDD;
        }
        :-moz-placeholder {
            color: #DDDDDD;
        }

        body {
            display: flex;
            min-height: 100vh;
            flex-direction: column;
        }

        main {
            flex: 1 0 auto;
        }

        .navButtonContainer {
            position:absolute;
            top:0;
            right:1rem;
        }

        .navButton{
            padding: 0 1rem 0 1rem;
        }

    </style>
    <title>Pretty-Swag</title>
</head>

<body>
    <div id="app" v-cloak>
        <nav class="blue" role="navigation">
            <div class="nav-wrapper container">
                <div class="input-field">
                    <input id="search" type="search" placeholder="search by tag" title="Use - prefix to exclude unwanted tags. Ex: -POST" required v-model="filterByTag" @keyup.enter="$event.target.blur()">
                    <label class="label-icon" for="search"><i class="material-icons">search by tags</i></label>
                    <i class="material-icons">close</i>
                </div>
            </div>
            <div class="navButtonContainer"><a class="navButton pointer" @click="collapseAllApi(false)">Collapse</a><a class="navButton pointer" @click="collapseAllApi(true)">Expand</a></div>
        </nav>

        <div class="container">
            <div class="section">
                <h4 class="grey-text text-darken-3">{{name}}</h4>
                <div class="indent">
                    <p class="grey-text text-darken-1">{{summary}}</p>
                    <div><span class="bold">Version</span> <span class="grey-text text-darken-1">{{version}}</span></div>
                    <div>
                        <span class="bold">Available Tags: </span>{{getAllTags}}
                    </div>
                </div>
            </div>

            <div class="section">
                <h5>Paths</h5>
                <div class="indent" v-for="(api,api_idx) in apis" v-if="api.visible">
                    <div class="indent">
                        <div class="row pointer blue-text text-lighten-1" @click="api.showMe=!api.showMe">{{api.path}}</div>
                        <transition name="fade">
                            <div v-if="api.showMe">
                                <div class="api-block round-border" v-for="(method,method_idx) in api.methods" v-if="method.visible">
                                    <div class="api-header blue lighten-5 round-border pointer" @click="method.showMe = !method.showMe">
                                        <div class="api-title white-text blue light">{{method.name}} {{api.path}}</div>
                                    </div>
                                    <transition name="fade">
                                        <div v-if="method.showMe">
                                            <div class="tag-container">
                                                <div class="tag right pointer no-overflow" v-for="tag in method.tags" @click="addToSearch(tag)">{{tag}}</div>
                                            </div>
                                            <div class="indent r-indent">
                                                <h5 class="blue-text">Summary</h5>
                                                <p class="indent">{{method.summary}}</p>
                                                <h5 class="blue-text">Description</h5>
                                                <p class="indent">{{method.desc}}</p>
                                                <h5 class="blue-text">Parameters</h5>
                                                <table class="bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Located In</th>
                                                            <th>Description</th>
                                                            <th>Required</th>
                                                            <th>Schema</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="param in method.params">
                                                            <td>{{param.name}}</td>
                                                            <td>{{param.location}}</td>
                                                            <td>{{param.desc}}</td>
                                                            <td>{{param.required ? 'Yes':'No'}}</td>
                                                            <td><pre><span v-for="token in getSchema(param.schema,param.schemaState)" v-bind:class="{pointer: isFoldable(token)}" @click="schemaClicked(token,param.schemaState)">{{token.val}}</span></pre></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <h5 class="blue-text">Responses</h5>
                                                <table class="bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Code</th>
                                                            <th>Description</th>
                                                            <th>Schema</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="res in method.responses">
                                                            <td v-bind:class="[res.code === '200' ? 'green-text darken-2' : '']" >{{res.code}}</td>
                                                            <td>{{res.desc}}</td>
                                                            <td><pre><span v-for="token in getSchema(res.schema,res.schemaState)" v-bind:class="{pointer: isFoldable(token)}" @click="schemaClicked(token,res.schemaState)">{{token.val}}</span></pre></td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <div class="showReqBtn">
                                                    <a class="blue btn waves-effect" @click="method.showTool = true" v-if="!method.showTool"><i class="material-icons left">mode_edit</i>Try this operation</a>
                                                    <a class="right pointer" @click="method.showTool = false" v-else>Hide</a>
                                                </div>

                                                <transition name="fade">
                                                    <div class="request-panel" v-if="method.showTool">
                                                        <h5>Request</h5>
                                                        <div class="tool-panel round-border">
                                                            <p class="600">Scheme</p>
                                                            <p>
                                                                <form>
                                                                    <span v-for="(scheme,idx) in method.request.schemes">
                                                                        <input class="with-gap" v-bind:name="scheme" type="radio" v-bind:value="scheme" v-bind:id="api_idx+'_'+method_idx+'_'+scheme" v-model="method.request.choosen.scheme"/>
                                                                        <label class="r-margin" v-bind:for="api_idx+'_'+method_idx+'_'+scheme" v-bind:class="method.request.choosen.scheme === scheme ? 'bold black-text' : ''">{{scheme}}</label>
                                                                    </span>
                                                                </form>
                                                            </p>
                                                            <p>HTTP Headers</p>
                                                            <table class="bordered" v-if="Object.keys(method.request.choosen.headers).length !== 0">
                                                                <colgroup>
                                                                    <col span="1" style="width: 42%;">
                                                                    <col span="1" style="width: 48%;">
                                                                    <col span="1" style="width: 10%;">
                                                                </colgroup>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Value</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(value, key) in method.request.choosen.headers">
                                                                        <td>{{key}}</td>
                                                                        <td><input type="text" v-model="method.request.choosen.headers[key]"></td>
                                                                        <td><a class="pointer" @click="removeFromHeaderList(key,method.request.choosen)">Remove</a></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div class="row">
                                                                <div class="input-field col s5">
                                                                    <input v-bind:id="api_idx+'_'+method_idx+'_headerName'" type="text" @keyup.enter="addToHeaderList(method.request.choosen,api_idx+'_'+method_idx+'_headerName')" v-model="method.request.choosen.headerName">
                                                                    <label v-bind:for="api_idx+'_'+method_idx+'_headerName'">name</label>
                                                                </div>
                                                                <div class="input-field col s6">
                                                                    <input v-bind:id="api_idx+'_'+method_idx+'_headerValue'" type="text" @keyup.enter="addToHeaderList(method.request.choosen,api_idx+'_'+method_idx+'_headerName')" v-model="method.request.choosen.headerValue">
                                                                    <label v-bind:for="api_idx+'_'+method_idx+'_headerValue'">value</label>
                                                                </div>
                                                                <div class="input-field col s1">
                                                                    <a class="btn-floating btn-large waves-effect waves-light blue" @click="addToHeaderList(method.request.choosen,api_idx+'_'+method_idx+'_headerName')"><i class="material-icons">add</i></a>
                                                                </div>
                                                            </div>
                                                            <h5>Parameters</h5>
                                                            <div class="tool-panel round-border">
                                                                <div v-for="(param,param_idx) in method.params">
                                                                    <div class="input-field" v-if="param.location !== 'body' && param.location !== 'header'">
                                                                        <label v-bind:for="api_idx+'_'+method_idx+'_'+param.name">{{param.name}}</label>
                                                                        <input v-bind:id="api_idx+'_'+method_idx+'_'+param.name" type="text" v-model="method.params[param_idx].value">
                                                                    </div>
                                                                </div>
                                                                <div v-if="hasBodyParam(method.params)">
                                                                    <label  v-bind:for="api_idx+'_'+method_idx+'_requestBody'">Raw Body</label>
                                                                    <textarea v-bind:id="api_idx+'_'+method_idx+'_requestBody'" v-model="method.request.choosen.body"></textarea>
                                                                </div>
                                                                <h6 class="grey-text">Request</h6>
                                                                <div class="tool-panel grey lighten-3 console">
                                                                    <span class="bold red-text">{{method.name.toUpperCase()}}</span> <a v-bind:href="getURL(method,api.path)">{{getURL(method,api.path)}}</a> HTTP/1.1
                                                                    <div><span class="bold">Host:</span> {{host}}</div>
                                                                    <div v-for="(value,key) in method.request.choosen.headers"><span class="bold">{{key}}:</span> {{value}}</div>
                                                                    <div v-if="computeBody(method)"><pre>{{computeBody(method)}}</pre></div>
                                                                </div>

                                                                <h6 class="grey-text">Response</h6>
                                                                <div class="tool-panel grey lighten-3 console">
                                                                    <textarea wrap='off' readonly>{{method.request.choosen.result}}</textarea>
                                                                </div>

                                                                <div v-if="mixContent(method.request.choosen)">
                                                                    <blockquote class="yellow-border yellow lighten-5"> <i class="material-icons left">warning</i> This is a Mixed Content call. Many browsers will block this by default. <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content" target="_blank">Learn more</a></blockquote>
                                                                </div>
                                                                <div v-else-if="crossDomain(method.request.choosen)">
                                                                    <blockquote class="yellow-border yellow lighten-5"> <i class="material-icons left">warning</i> This is a cross-origin call. Make sure the server at <span class="blue-text">{{getDestHost(method.request.choosen.scheme)}}</span> accepts POST requests from <span class="blue-text">{{currentHost}}</span>. <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS" target="_blank">Learn more</a></blockquote>
                                                                </div>

                                                                <a class="blue waves-effect waves-light btn" @click="sendRequest(method.name,getURL(method,api.path),method.request.choosen.body,method.request.choosen.headers,api_idx,method_idx)">Send Request</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </transition>
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <footer class="container grey-text text-lighten-4 thin">Generated __GENERATEDDATE__ by Pretty-Swag</footer>

    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/js/materialize.min.js"></script>
    __VUE__

    <script>
        var context = {
            el: "#app"
            , computed: {
                filterByTag: {

                    get: function () {
                        return this.search;
                    }
                    ,set: function (newValue) {

                        this.search = newValue;
                        if(newValue == ""){
                            this.setAllVisible(true);
                            return;
                        }
                        newValue = newValue || "";
                        var search_tags = newValue.toLowerCase().split(/[\\s,]+/);
                        var includeTags = [];
                        var excludeTags = [];

                        for(var i = 0;i<search_tags.length;i++){

                            if(search_tags[i] === ""){
                                continue;
                            }
                            else if(search_tags[i][0] === "-"){
                                excludeTags.push(search_tags[i].substr(1));
                            }
                            else{
                                includeTags.push(search_tags[i]);
                            }
                        }

                        for(var i=0;i<this.apis.length;i++){

                            var api_visible = false;
                            var api = this.apis[i];
                            for(var j=0;j<api.methods.length;j++){

                                var method = api.methods[j];
                                var visible = includeTags.length == 0;

                                for(var k=0;k<method.tags.length;k++){
                                    var tag = method.tags[k].toLowerCase();
                                    if(excludeTags.indexOf(tag) > -1){
                                        visible = false;
                                        break;
                                    }
                                    for(var l=0;l<includeTags.length;l++){
                                        if(tag.startsWith(includeTags[l])){
                                            visible = true;
                                            break;
                                        }
                                    }
                                }
                                method.visible = visible;
                                if(visible){
                                    api_visible = true;
                                }
                            }

                            this.apis[i].visible = api_visible;
                        }
                    }
                }
                , getAllTags: function(){

                    var result = {};
                    for(var i=0;i<this.apis.length;i++){
                        if(!this.apis[i].visible){
                            continue;
                        }
                        var api = this.apis[i];
                        for(var j=0;j<api.methods.length;j++){
                            if(!api.methods[j].visible){
                                continue;
                            }
                            var method = api.methods[j];
                            for(var k=0;k<method.tags.length;k++){
                                result[method.tags[k]] = null;
                            }
                        }
                    }

                    return Object.keys(result).sort().join(", ");
                }
            }
            , methods:{
                addToHeaderList: function(container,to_be_focused_id){
                    var name = container.headerName.trim();
                    if(!name){
                        return;
                    }
                    var val = container.headerValue.trim();
                    Vue.set(container.headers,name,val);
                    container.headerName = "";
                    container.headerValue = "";
                    Vue.nextTick(function() {
                        document.getElementById(to_be_focused_id).focus();
                    });
                }
                ,addToSearch: function(keyword){

                    var tags = this.search.split(" ");
                    tags = new Set(tags);
                    if(tags.has(keyword)){
                        return;
                    }

                    this.filterByTag = this.search+" "+keyword;
                }
                ,getDestHost: function(scheme){
                    var dest_port = ":"+this.port[scheme];
                    if((dest_port === ":80" && scheme == "http") || (dest_port == ":443" && scheme === "https")){
                        dest_port = "";
                    }
                    return this.host+dest_port;
                }
                ,crossDomain: function(choosen){

                    var abs_target_host = this.host+':'+this.port[choosen.scheme];
                    var curr_port = location.port;
                    var abs_curr_host = this.currentHost;
                    if(!curr_port){
                        if(this.currentScheme === 'https'){
                            abs_curr_host += ":443";
                        }
                        else if(this.currentScheme === 'http'){
                            abs_curr_host += ":80";
                        }
                    }
                    return abs_curr_host !== abs_target_host;
                }
                ,mixContent: function(choosen){
                    return (this.currentScheme === "https" && choosen.scheme === "http");
                }
                ,removeFromHeaderList: function(key, container){
                    Vue.delete(container.headers, key);
                }
                ,collapseAllApi: function(bool){
                    for(var i=0;i<this.apis.length;i++){
                        this.apis[i].showMe = bool;
                    }
                }
                ,setAllVisible: function(bool){

                    for(var i=0;i<this.apis.length;i++){

                        for(var j=0;j<this.apis[i].methods.length;j++){
                            this.apis[i].methods[j].visible = bool;
                        }
                        this.apis[i].visible = bool;
                    }
                }
                ,hasBodyParam: function(params){

                    var location;
                    for(var i = 0;i<params.length;i++){
                        location = params[i].location.toLowerCase();
                        if(location === 'body'){
                            return true;
                        }
                    }

                    return false;
                }
                ,getSchema: function(schema,state){
                    var tmp = schema.split("\n");
                    var tokens = [];
                    var fold = false;
                    var fold_lv = 0;
                    var current_lv;
                    var close_token ="";
                    var open_token ="";
                    for(var i = 0; i < tmp.length;i++){

                        if(fold){
                            current_lv = tmp[i].length - tmp[i].replace(/^\s+/,"").length;
                            var closeBraceRegex = new RegExp("^\\s*\\"+close_token+"\\s*,?$");
                            if(closeBraceRegex.exec(tmp[i].trim()) && fold_lv == current_lv){
                                fold = false;
                                close_token = "";
                                continue;
                            }
                        }
                        else{
                            if(state.indexOf(i) !== -1){
                                fold = true;
                                open_token = tmp[i].trim();
                                if(open_token.match(/^"[\s\S]*"\s*:\s*[{[]$/)){
                                    var match = /([[{])\s*$/.exec(tmp[i]);
                                    open_token = match[1];
                                    var brace_loc = match.index;
                                    fold_lv = tmp[i].length - tmp[i].replace(/^\s+/,"").length;
                                    close_token = open_token === "{" ? "}" : "]";
                                    tokens.push({"val":tmp[i].substr(0,brace_loc)+open_token+"..."+close_token+"\n","line":i});
                                }
                                else{
                                    fold_lv = tmp[i].length - tmp[i].replace(/^\s+/,"").length;
                                    close_token = open_token === "{" ? "}" : "]";
                                    tokens.push({"val":tmp[i].substr(0,fold_lv)+open_token+"..."+close_token+"\n","line":i});
                                }
                            }
                            else{
                                tokens.push({"val":tmp[i]+"\n","line":i});
                            }
                        }
                    }
                    return tokens;
                }
                ,schemaClicked: function(token,state){
                    var tmp = token.val.trim();
                    if(tmp !== "{" && tmp !== "[" && tmp !== "{...}" && tmp !== "[...]" && !tmp.match(/^"[\s\S]*"\s*:\s*[{[]$/) && !tmp.match(/^\s*"[\s\S]*"\s*:\s*(\[\.\.\.\])|(\{\.\.\.\})$/)){
                        return;
                    }

                    var idx = state.indexOf(token.line);
                    if(idx == -1){
                        state.push(token.line);
                    }
                    else{
                        state.splice(idx, 1);
                    }
                }
                ,isFoldable: function(token){
                    var txt = token.val.trim();
                    return  txt==='{' || txt==='[' || txt==='{...}' || txt==='[...]' || txt.match(/^"[\s\S]*"\s*:\s*[{[]$/) || txt.match(/^\s*"[\s\S]*"\s*:\s*(\[\.\.\.\])|(\{\.\.\.\})$/);
                }

                ,getFormParam: function(method){

                    var result = [];
                    var len = method.params.length;
                    for(var i=0;i<len;i++){
                        if(method.params[i].location === "form"){
                            result.push(encodeURIComponent(method.params[i].name)+"="+encodeURIComponent(method.params[i].value));
                        }
                    }

                    if(result.length == 0){
                        return "";
                    }
                    return result.join("&");
                }
                ,getURL: function(method,path){
                    if((method.request.choosen.scheme === "http" && this.port['http'] == 80) || (method.request.choosen.scheme === "https" && this.port['http'] == 443)){
                        return method.request.choosen.scheme+'://'+ this.host + this.basePath + this.computePath(method,path) + this.getUrlParamString(method);
                    }
                    var port = this.port[method.request.choosen.scheme] ? ":" + this.port[method.request.choosen.scheme]  : "";
                    return method.request.choosen.scheme+'://'+ this.host + port + this.basePath + this.computePath(method,path) + this.getUrlParamString(method);
                }
                ,getUrlParamString: function(method){

                    var params = [];
                    for(var i=0;i<method.params.length;i++){
                        if(method.params[i].location.trim().toLowerCase() === "query"){
                            params.push(method.params[i].name+'='+encodeURIComponent(method.params[i].value));
                        }
                    }

                    if(params.length === 0){
                        return "";
                    }

                    params = "?"+params.join("&");
                    return params;
                }
                ,sendRequest: function(method,url,data,headers,api_idx,method_idx){

                    var config = {
                        type: method
                        ,url: url
                        ,processData: false
                        ,context: this.apis
                    };

                    if(Object.keys(headers).length > 0){
                        config.headers = headers;
                    }

                    if(data.length > 0){
                        config.data = data;
                    }

                    $.ajax(config)
                    .done(function(dat, textStatus, jqXHR) {
                        var result = "HTTP/1.1 "+jqXHR.status+" "+textStatus+"\\r\\n";
                        result += jqXHR.getAllResponseHeaders() + "\\r\\n";
                        if (typeof(dat) === 'object')
                            dat = JSON.stringify(dat,null,3);
                        result += dat;
                        this[api_idx].methods[method_idx].request.choosen.result = result;
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        var result = "HTTP/1.1 "+jqXHR.status+" "+textStatus+"\\r\\n";
                        result += jqXHR.getAllResponseHeaders();
                        result += "\\r\\n"+errorThrown;
                        this[api_idx].methods[method_idx].request.choosen.result = result;
                    });
                    Materialize.toast('Request Sent', 1853);
                }
                , computePath: function(method,path){

                    var params = method.params;
                    var len = params.length;
                    var new_path = path;
                    for(var i=0;i<len;i++){
                        if(params[i].location.toLowerCase() === 'path' && params[i].value){
                            new_path = new_path.split(":"+params[i].name).join(params[i].value);
                        }
                    }

                    return new_path;
                }
                , computeBody: function(method){

                    var body = method.request.choosen.body;
                    var formData = this.getFormParam(method);

                    if(!body && !formData){
                        return "";
                    }
                    else if(!body){
                        return formData;
                    }
                    else{
                        return formData+"\\r\\n"+body;
                    }
                }
            }
            , data: __DATAPLACEHOLDER__
        };

        var vm = new Vue(context);
        document.title = context.data.name;
    </script>
</body>
</html>
`;
}

function initContainer() {
    return {
        name: ""
        , summary: ""
        , version: ""
        , host: ""
        , port: { http: 80, https: 443 }
        , basePath: ""
        , currentHost: "__CURRENTHOST__"
        , currentScheme: "__PROTO__"
        , search: ""
        , apis: []
    };
}

function initApi() {
    return {
        path: ""
        , visible: true
        , showMe: true
        , methods: []
    };
}

function initMethod() {
    return {
        name: ""
        , visible: true
        , tags: []
        , summary: ""
        , desc: ""
        , params: []
        , responses: []
        , request: initRequest()
        , showTool: true
        , showMe: true
    };
}

function initParam() {
    return {
        name: ""
        , location: ""
        , desc: ""
        , required: false
        , schema: ""
        , schemaState: []
        , value: ""
    };
}

function initResponse() {
    return {
        code: ""
        , desc: ""
        , schema: ""
        , schemaState: []
    };
}

function initRequest() {
    return {
        schemes: ["http","https"]
        , headers: []
        , choosen: {
            scheme: "http"
            , headers: {}
            , body: ""
            , headerName: ""
            , headerValue: ""
            , result: ""
        }
    };
}

function initHeader() {
    return {
        name: ""
        , value: ""
    };
}

function generateHTML(data_str, callback) {

    var html = getTemplate().replace("__DATAPLACEHOLDER__", data_str);
    var date = new Date();
    var options = {
        weekday: "long", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    html = html.replace("__GENERATEDDATE__", date.toLocaleTimeString("en-us", options));

    html = html.replace('"__PROTO__"', 'location.protocol.replace(":","")');
    html = html.replace('"__CURRENTHOST__"', 'location.host || "null"');

    html = html.replace("__VUE__", "<script src='https://unpkg.com/vue@2.1.10/dist/vue.min.js'></script>");
    
    fs.writeFile(outputFile, html, function (err) {
        if (err) {
            console.log(err);
        }
        callback();
    });
}

function computeSchema(schema,def) {
    if (typeof schema === "string")
        return schema;
    var tmp = JSON.parse(resolveNested(schema, def));
    return JSON.stringify(tmp, null, indent_num);
}

function resolveNested(schema,def) {
    try {
        if ("type" in schema) {

            if (schema.type === "array") {
                //need to loop
                return "[" + resolveNested(schema.items, def) + "]";
            }
            else if (schema.type === "object") {
                var keyval = [];
                for (var prop in schema.properties) {

                    if ("$ref" in schema.properties[prop]) {
                        keyval.push('"' + prop + '":' + resolveNested(schema.properties[prop],def));
                    }
                    else if (schema.properties[prop].type === "array" || schema.properties[prop].type === "object") {
                        keyval.push('"' + prop + '":' + resolveNested(schema.properties[prop],def));
                    }
                    else {
                        keyval.push('"' + prop + '":"' + schema.properties[prop]["type"] + '"');
                    }
                }
                return "{" + keyval.join(",") + "}";
            }
            else {
                return schema.type;
            }
        }
        else if ("$ref" in schema) {
            return resolveNested(def[schema["$ref"].substr(14)], def); //remove #/definitions
        }
        else {
            JSON.stringify(schema, null, indent_num);
        }
        
    }
    catch (err) {
        if (schema.type) {
            return '"'+schema.type+'"';
        }
        return JSON.stringify(schema, null, indent_num);
    }
}

function parseSourceFile() {
    fs.readFile(inputFile, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }

        var input;
        try {
            input = JSON.parse(data);
        }
        catch(json_err){
            var yaml = require('js-yaml');
            try {
                input = yaml.safeLoad(data);
            } catch (yaml_err) {
                console.log(yaml_err);
                process.exit(1);
            }
        }

        var result = initContainer();
        result.name = input.info.title;
        result.summary = input.info.description;
        result.version = input.info.version;
        result.host = input.host;
        result.basePath = input.basePath;

        for (var path in input.paths) {

            var api = initApi();
            result.apis.push(api);
            api.path = path;
            for (var method_name in input.paths[path]) {
                var method = initMethod();
                api.methods.push(method);
                var input_method = input.paths[path][method_name];
                method.name = method_name;
                method.tags = input_method.tags;
                method.summary = input_method.summary;
                method.desc = input_method.description;

                if (input_method.parameters) {
                    for (var i = 0; i < input_method.parameters.length; i++) {
                        var param = initParam();
                        method.params.push(param);
                        var parameter = input_method.parameters[i];
                        param.name = parameter.name;
                        param.location = parameter.in;
                        param.desc = parameter.description;
                        param.required = parameter.require;
                        param.schema = computeSchema(parameter.type, input.definitions);
                    }
                }

                for (var code in input_method.responses) {
                    var res = initResponse();
                    method.responses.push(res);
                    var response = input_method.responses[code];
                    res.code = code;
                    res.desc = response.description;
                    res.schema = computeSchema(response.schema, input.definitions);
                }
            }
        }
        generateHTML(JSON.stringify(result, null, indent_num), function () { console.log("DONE") });
    });
}

parseSourceFile();

//idea array --> dis play as [] ?
//idea clickable object to {...} 
//what about ref loop?
