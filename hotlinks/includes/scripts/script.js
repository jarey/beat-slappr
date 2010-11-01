var Kodiak={Data:{},Util:{},Controls:{},Components:{}},dateHash={0:"today",1:"week",2:"month",3:"year",4:"all",5:"custom"},dateRangeObj={from:"",to:""},defaultDateRangeIndex=0,defaultStatType="page_visited",updateInterval=30,refreshTimer,dateModalContent="                <div id='divDateModal'>             <b>From</b> <input type='text' id='txtFromDate' />&nbsp;&nbsp;&nbsp;<b>To</b> <input type='text' id='txtToDate' />&nbsp;&nbsp;&nbsp;<input type='button' value='Set' id='cmdSetCustomDateRange' /> <input type='button' value='Cancel' id='cmdCancelDateModal' />         </div>";window.onload=function(){var divDateButtons=$("divTopBar").getElementsByTagName("div"),cmbStatType=$("cmbStatType"),lblUniqueTotal=$("lblUniqueTotal"),lblVisitTotal=$("lblVisitTotal"),n,curDateRangeIndex,dateModal,ajax,dataset,dataSort1={field:"unique_visits",dir:"DESC"},dataSort2={field:"timestamp",dir:"DESC"},grid,gridLayout1={Page:{dataField:"page",sortable:true,width:558,renderFn:function(data){var href;if(data.val.page.match(/^http/)){href=""}else{href=appPath}href+=data.val.page;return"<a href='"+href+"'>"+data.val.page+"</a>"}},Unique:{title:"Unique Visitors",align:"right",dataField:"unique_visits",sortable:true,width:180},Total:{title:"Total Visits",align:"right",dataField:"total_visits",sortable:true,width:140}},gridLayout2={IP:{dataField:"client_ip",sortable:true,renderFn:function(data){return"<a href='http://ipinfodb.com/ip_locator.php?ip="+data.val.client_ip+"'>"+data.val.client_ip+"</a>"}},"Page Visited":{dataField:"page_visited",sortable:true,renderFn:function(data){var href=appPath+data.val.page_visited;return"<a href='"+href+"'>"+data.val.page_visited+"</a>"}},"Referring Site":{dataField:"referring_site",sortable:true,renderFn:function(data){return"<a href='"+data.val.referring_site+"'>"+data.val.referring_site+"</a>"}},Date:{dataField:"timestamp",sortable:true,renderFn:function(data){var timestamp=data.val.timestamp,dateTimeArr=timestamp.split(" "),dateArr=dateTimeArr[0].split("-"),timeArr=dateTimeArr[1].split(":");return dateArr[1]+"/"+dateArr[2]+"/"+dateArr[0]+"&nbsp;&nbsp;"+timeArr[0]+":"+timeArr[1]}}},date=new Date();date.setHours(date.getHours()+4);dateRangeObj.from=(date.getMonth()+1)+"/"+(date.getDate())+"/"+(date.getFullYear());dateRangeObj.to=dateRangeObj.from;for(n=0;n<divDateButtons.length;n++){divDateButtons[n].onmousedown=_clickDateButton(n)}cmbStatType.onchange=function(){setIntervalHandler(curDateRangeIndex);setDefaultSort()};ajax=new Kodiak.Data.Ajax();dateModal=new Kodiak.Controls.Modal({applyTo:divDateButtons[5],componentId:"dateModal",modalClass:"modalWindow",orientation:"right",onBeforeShow:function(){this.setContent(dateModalContent);$("txtFromDate").value=dateRangeObj.from;$("txtToDate").value=dateRangeObj.to;$("cmdSetCustomDateRange").onclick=function(){dateRangeObj.from=$("txtFromDate").value;dateRangeObj.to=$("txtToDate").value;clickDateButton(5);removeClass(divDateButtons[5],"dateModalBtn")};$("cmdCancelDateModal").onclick=function(){removeClass(divDateButtons[5],"dateModalBtn");dateModal.hide()}},onShowComplete:function(){}});dataset=new Kodiak.Data.Dataset();grid=new Kodiak.Controls.Table({applyTo:"divGrid",componentId:"tblVisitors",tableDomId:"tblVisitors",data:dataset,sortArrow:{img:"includes/images/tblArrowSprite.png",size:{width:14,height:14},up:{x:0,y:-14},down:{x:0,y:0}}});cmbStatType.value=defaultStatType;setDefaultSort();clickDateButton(defaultDateRangeIndex);function getStats(n){ajax.request({url:"api/stats.php",method:"post",parameters:{dateRange:dateHash[n],statType:cmbStatType.value,from:dateRangeObj.from,to:dateRangeObj.to},handler:getStatsHandler})}function getStatsHandler(obj){if(obj.success&&obj.response){var result=eval("("+obj.response+")");if(cmbStatType.value=="page_visited"||cmbStatType.value=="referring_site"){grid.columns=gridLayout1}else{if(cmbStatType.value=="visitors"){grid.columns=gridLayout2}}grid.renderTable(true);dataset.setData({data:result.data,sortObj:{}});lblUniqueTotal.innerHTML=result.unique_total;lblVisitTotal.innerHTML=result.visit_total;dateModal.reposition()}else{alert("There was an error retreiving stats.  Please try again later.")}}function clickDateButton(n){var activeClass="clsActiveDateBtn",dateModalBtn="dateModalBtn",m;for(m=0;m<divDateButtons.length;m++){if(m==n){addClass(divDateButtons[m],activeClass);if(m==5){addClass(divDateButtons[m],dateModalBtn)}}else{removeClass(divDateButtons[m],activeClass);if(m==5){removeClass(divDateButtons[m],dateModalBtn)}}}dateModal.hide();curDateRangeIndex=n;setIntervalHandler(n)}function setIntervalHandler(n){getStats(n);clearInterval(refreshTimer);refreshTimer=setInterval(function(){getStats(n)},(updateInterval*1000))}function setDefaultSort(){if(cmbStatType.value=="page_visited"||cmbStatType.value=="referring_site"){dataset.sort(dataSort1)}else{if(cmbStatType.value=="visitors"){dataset.sort(dataSort2)}}}function _clickDateButton(n){return function(){clickDateButton(n);return false}}function hasClass(ele,cls){return ele.className.match(new RegExp("(\\s|^)"+cls+"(\\s|$)"))}function addClass(ele,cls,skip){if(skip||!hasClass(ele,cls)){ele.className+=" "+cls}}function removeClass(ele,cls,skip){var reg=new RegExp("(\\s|^)"+cls+"(\\s|$)");if(skip||hasClass(ele,cls)){ele.className=ele.className.replace(reg," ")}}function $(el){return document.getElementById(el)}};Kodiak.Data.Ajax=function(){this._getXMLHttpRequest()};Kodiak.Data.Ajax.prototype={_http_request:false,request:function(a){var c=this,b;a.method=a.method.toLowerCase();this._http_request.onreadystatechange=function(){c._handleResponse(a.handler)};a.parameters=this._objToPostStr(a.parameters);if(a.method=="get"&&a.parameters){a.url+="?"+a.parameters}this._http_request.open(a.method,a.url,true);if(a.method=="post"){b=a.parameters;this._http_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");this._http_request.setRequestHeader("Content-length",a.parameters.length);this._http_request.setRequestHeader("Connection","close")}this._http_request.send(b)},submitForm:function(d){var b=d.form.elements,a={},c;for(c in b){if(b[c].name&&b[c].value){a[b[c].name]=encodeURI(b[c].value)}}this.request({url:d.url,method:d.method,parameters:a,handler:d.handler})},_getXMLHttpRequest:function(){if(window.XMLHttpRequest){this._http_request=new XMLHttpRequest();if(this._http_request.overrideMimeType){this._http_request.overrideMimeType("text/html")}}else{if(window.ActiveXObject){try{this._http_request=new ActiveXObject("Msxml2.XMLHTTP")}catch(a){this._http_request=new ActiveXObject("Microsoft.XMLHTTP")}}}if(!this._http_request){return false}},_objToPostStr:function(b){if(typeof(b)=="object"){var a="",c;for(c in b){if(b[c]){a+=c+"="+escape(b[c])+"&"}}a=a.replace(/\&$/,"");return a}else{return b}},_handleResponse:function(a){if(this._http_request.readyState==4){if(this._http_request.status==200){a({success:true,response:this._http_request.responseText})}else{a({success:false})}}}};Kodiak.Data.Dataset=function(a){this.updateListener=new Kodiak.Util.Listener();this.selectListener=new Kodiak.Util.Listener();this.sortCol=[];if(a){this.setData(a)}};Kodiak.Data.Dataset.prototype={data:[],setData:function(b){var a=new Kodiak.Util();this.data=[];this.alwaysOnTop={};a.clone(b.data,this.data);if(b.alwaysOnTop){a.clone(b.alwaysOnTop,this.alwaysOnTop)}if(b.sortObj){this.sort(b.sortObj)}else{this.sortCol=[];this.updateListener.fire()}},sort:function(c){if(!c){c={}}var d=this,b=c.field,a=c.dir;if(!b&&!a){if(this.sortCol.length){b=this.sortCol[0];a=this.sortCol[1]}else{b=this.getColumns()[0];a="ASC"}}else{if(b&&a=="toggle"){if(b==this.sortCol[0]){a=(this.sortCol[1]=="ASC")?a="DESC":a="ASC"}else{a="ASC"}}}this.data.sort(function(g,f){var l=0,i,k=[],h=b.split("."),e,j;if(a=="DESC"){l=2}k[0]=g[h[0]];for(e=1;e<h.length;e++){k[0]=k[0][h[e]]}if(typeof(g[b])=="string"){k[0]=k[0].toLowerCase()}k[1]=f[h[0]];for(e=1;e<h.length;e++){k[1]=k[1][h[e]]}if(typeof(f[b])=="string"){k[1]=k[1].toLowerCase()}if(d.alwaysOnTop){for(j in d.alwaysOnTop){if(g[j]==d.alwaysOnTop[j]&&f[j]==d.alwaysOnTop[j]){i=((k[0]<k[1])?(-1+l):(k[0]>k[1])?(1-l):0)
}else{if(g[j]==d.alwaysOnTop[j]){i=-1;break}else{if(f[j]==d.alwaysOnTop[j]){i=1;break}}}}}if(!i){i=((k[0]<k[1])?(-1+l):(k[0]>k[1])?(1-l):0)}return i});this.sortCol=[b,a];this.updateListener.fire()},getColumns:function(){var c=[],b=this.data[0],a;for(a in b){if(b[a]){c.push(a)}}return c},getRowCount:function(){return this.data.length},getRow:function(a){return this.data[a]},getSelected:function(){var b=[],c,a=this.getRowCount(),d;for(d=0;d<a;d++){c=this.rowSelected(d,"",true);if(c){b.push({index:d,data:this.getRow(d)})}}return b},getSelectedRowCount:function(){var c,b=0,a=this.getRowCount(),d=0;for(d=0;d<a;d++){c=this.rowSelected(d,"",true);if(c){b++}}return b},selectAllRows:function(a,c){var b;for(b=0;b<this.getRowCount();b++){this.rowSelected(b,a,true)}if(!c){this.selectListener.fire()}},rowSelected:function(b,a,c){if(a!==true&&a!==false){return this.getRow(b)._rowSelected}else{this.getRow(b)._rowSelected=a}if(!c){this.selectListener.fire()}}};Kodiak.Util=function(){};Kodiak.Util.prototype={printObj:function(b){var a="",c;a+="<table>";for(c in b){if(b[c]){a+="<tr><td>"+c+":&nbsp;&nbsp</td><td>";if(typeof(b[c])=="object"){a+=this.printObj(b[c])}else{a+=b[c]}a+="</td></td>"}}a+="</table>";return a},toEl:function(a){if(typeof(a)=="string"){return document.getElementById(a)}else{return a}},clone:function(d,c,a){var b;if(!a){a={}}for(b in d){if(a[b]!="skip"){if(typeof(d[b])=="object"&&a[b]!="norecurse"){if(d[b].constructor==Array.prototype.constructor){c[b]=[]}else{c[b]={}}this.clone(d[b],c[b],a)}else{c[b]=d[b]}}}},getTargID:function(b){if(typeof(b)=="object"){var a;if(b.target){a=b.target}else{if(b.srcElement){a=b.srcElement}}if(a.nodeType==3){a=a.parentNode}return a.id}else{return false}},getRadioVal:function(a){var b;a=this.toEl(a);a=a.getElementsByTagName("input");for(b=0;b<a.length;b++){if(a[b].type=="radio"&&a[b].checked){return a[b].value}}}};Kodiak.Util.Listener=function(){this.eventStack=[]};Kodiak.Util.Listener.prototype={add:function(a){this.eventStack.push(a)},clear:function(){this.eventStack=[]},fire:function(){var a;for(a=0;a<this.eventStack.length;a++){this.eventStack[a]()}}};Kodiak.Controls.Table=function(a){var b=this;this.util=new Kodiak.Util();this.util.clone(a,this,{data:"norecurse",applyTo:"norecurse"});Kodiak.Components[this.componentId]=this;if(this.applyTo){this.applyTo=this.util.toEl(this.applyTo)}else{alert("table: 'applyTo' property not defined.  Check documentation.");return}this.renderTable();this.data.updateListener.add(function(){b._setSortArrow()});this.data.updateListener.add(function(){b.renderData()});this.data.selectListener.add(function(){b.renderData()})};Kodiak.Controls.Table.prototype={_tableRendered:false,renderTable:function(c){if((!this._tableRendered||c===true)){var f,b,e,d,a="<table id='"+this.tableDomId+"'><thead><tr>";for(f in this.columns){if(this.columns[f]){b=this.columns[f];if(!b.align){b.align="left"}a+="<th style='width: "+b.width+"px; text-align: "+b.align+";'>";if(b.title){e=b.title}else{e=f}if(b.sortable){if(b.align=="center"){d="margin: 0 auto;"}else{d="float: "+b.align}a+="<div style='overflow: hidden; "+d+";'><div style='float: left; cursor: pointer;'>"+e+"</div>";if(this.sortArrow){a+="<div style='float: left; display: none; cursor: pointer; margin-left: 1px; width: "+this.sortArrow.size.width+"px; height: "+this.sortArrow.size.width+"px; background-image: url("+this.sortArrow.img+");'></div>"}a+="</div></th>"}else{a+=e}}}a+="</tr></thead></table><div id='"+this.tableDomId+"_tBodyContents' style='display: none; width: 0px; height: 0px;'></div>";this.applyTo.innerHTML=a;this._tableRendered=true}},_setSortArrow:function(){var g=0,c,d,b={DESC:"up",ASC:"down"},e=this.applyTo.getElementsByTagName("th"),f,a;for(f in this.columns){if(this.columns[f]){c=this.columns[f];d=e[g].childNodes[0];if(c.sortable&&c.dataField){for(a=0;a<d.childNodes.length;a++){d.childNodes[a].onclick=this._makeSortFn(c.dataField)}d=d.childNodes[1].style;if(c.dataField==this.data.sortCol[0]){d.display="block";d.backgroundPosition=this.sortArrow[b[this.data.sortCol[1]]].x+"px "+this.sortArrow[b[this.data.sortCol[1]]].y+"px"}else{d.display="none"}}g++}}},renderData:function(){var j,e,a,d,c,g,f,h="<table><tbody>",i,b;for(c=0;c<this.data.getRowCount();c++){j=this.data.getRow(c);h+="<tr>";for(a in this.columns){if(this.columns[a]){d=this.columns[a];if(d.dataField){f=d.dataField.split(".");e=j[f[0]];for(g=1;g<f.length;g++){e=e[f[g]]}}else{e=""}h+="<td style='text-align: "+d.align+";'>";if(d.renderFn){h+=d.renderFn({val:j,index:c,scope:this})}else{if(d.selectRowCheckBox){h+="<input type='checkbox' />"}else{h+=e}}h+="</td>"}}h+="</tr>"}h+="</tbody></table>";i=this.applyTo.childNodes[0];b=this.applyTo.childNodes[1];b.innerHTML=h;if(i.childNodes.length>1){i.removeChild(i.childNodes[1])}i.appendChild(b.firstChild.firstChild);this._setSelectedRows()},_setSelectedRows:function(){var a=this.applyTo.childNodes[0].childNodes[1],e,d,g,f,c,b;for(g=0;g<this.data.getRowCount();g++){e=a.childNodes[g];b=0;for(f in this.columns){if(this.columns[f]){c=this.columns[f];if(c.selectRowCheckBox){d=e.childNodes[b].childNodes[0];if(this.data.rowSelected(g)){e.className+=" "+this.rowSelectedClass;d.checked=true}d.onclick=this._makeSelectFn(d,g)}b++}}}},_selectRow:function(a,c){var b;if(a.checked){b=true}else{b=false}this.data.rowSelected(c,b)},_makeSelectFn:function(a,c){var b=this;return function(){b._selectRow(a,c)}},_makeSortFn:function(a){var b=this;return function(){b._sortFn(a)}},_sortFn:function(a){this.data.sort({field:a,dir:"toggle"})}};Kodiak.Controls.Modal=function(a){var b=this;this.util=new Kodiak.Util();this.util.clone(a,this,{applyTo:"skip"});this.applyTo=a.applyTo;Kodiak.Components[this.componentId]=this;if(this.applyTo){this.applyTo=this.util.toEl(this.applyTo)}else{alert("table: 'applyTo' property not defined.  Check documentation.");return}this._initModal();this.applyTo.addEventListener("mousedown",function(c){b.toggleModal(c,b);return false},false);window.addEventListener("resize",function(){b.reposition()},false)};Kodiak.Controls.Modal.prototype={content:"",orientation:"left",modalClass:"",closeOnBlur:false,onBeforeShow:function(){},onShowComplete:function(){},_isModal:true,toggleModal:function(b,a){if(this._modalActive){a.hide()}else{a.show(b)}},hide:function(){this._modalEl.style.display="none";this._modalActive=false},show:function(d){var g=this,a,c,f;for(a in Kodiak.Components){if(Kodiak.Components[a]){c=a;f=Kodiak.Components[c];if(f._isModal&&f!=this){f.hide()}}}this.onBeforeShow();this._setModalPosition(this);this._modalEl.style.display="block";this._modalActive=true;this.onShowComplete();function b(i){var h=g._findElPos(g._modalEl);if(!((i.clientX>=h.left&&i.clientX<=(h.left+g._modalEl.offsetWidth))&&(i.clientY>=h.top&&i.clientY<=(h.top+g._modalEl.offsetHeight)))){g.hide();this.removeEventListener("mousedown",b,false)}}if(this.closeOnBlur){d.cancelBubble=true;if(d.stopPropagation){d.stopPropagation()}window.addEventListener("mousedown",b,false)}},setContent:function(a){this._modalEl.innerHTML=a},reposition:function(){if(this._modalActive){this._setModalPosition(this)}},_initModal:function(){var a=document.createElement("div");a.className=this.modalClass;a.style.position="absolute";a.style.visibility="hidden";document.body.appendChild(a);this._modalEl=a;this._modalDimensions={width:this._modalEl.offsetWidth,height:this._modalEl.offsetHeight};this.hide();this._modalEl.style.visibility="visible";this.setContent(this.content)},_setModalPosition:function(a){var b=a._findElPos(a.applyTo);if(a.orientation=="left"){a._modalEl.style.left=b.left+"px"}else{if(a.orientation=="right"){a._modalEl.style.left=(b.left-a._modalDimensions.width+a.applyTo.offsetWidth)+"px"}}a._modalEl.style.top=(b.top+a.applyTo.offsetHeight)+"px"},_findElPos:function(a){var b={left:0,top:0};do{b.left+=a.offsetLeft;b.top+=a.offsetTop;a=a.offsetParent}while(a);return b}};