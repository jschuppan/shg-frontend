/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/EventProvider',"sap/base/assert","sap/base/Log","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/Selectors"],function(E,a,L,c,K,q){"use strict";var I=E.extend("sap.ui.core.delegate.ItemNavigation",{constructor:function(d,i,n){E.apply(this);this.oDomRef=null;if(d){this.setRootDomRef(d);}this.aItemDomRefs=[];if(i){this.setItemDomRefs(i);}this.iTabIndex=-1;this.iActiveTabIndex=!!n?-1:0;this.iFocusedIndex=-1;this.iSelectedIndex=-1;this.bCycling=true;this.bTableMode=false;this.iPageSize=-1;this._bMouseDownHappened=false;this.oDisabledModifiers={sapend:["alt","shift"],saphome:["alt","shift"]};}});I.Events={BeforeFocus:"BeforeFocus",AfterFocus:"AfterFocus",BorderReached:"BorderReached",FocusAgain:"FocusAgain",FocusLeave:"FocusLeave"};I.prototype.setDisabledModifiers=function(d){this.oDisabledModifiers=d;return this;};I.prototype.getDisabledModifiers=function(d){return this.oDisabledModifiers;};I.prototype.hasDisabledModifier=function(e){var d=this.oDisabledModifiers[e.type.replace("modifiers","")];if(Array.isArray(d)){for(var i=0;i<d.length;i++){if(e[d[i]+"Key"]){return true;}}}return false;};I.prototype.setRootDomRef=function(d){this.oDomRef=d;if(!q(this.oDomRef).data("sap.INItem")){if(this.iFocusedIndex>=0){q(this.oDomRef).attr("tabindex",this.iTabIndex);}else{q(this.oDomRef).attr("tabindex",this.iActiveTabIndex);}}q(this.oDomRef).data("sap.INRoot",this);return this;};I.prototype.getRootDomRef=function(){return this.oDomRef;};I.prototype.getItemDomRefs=function(){return this.aItemDomRefs;};I.prototype.setItemDomRefs=function(b){a(typeof b==="object"&&typeof b.length==="number","aItemDomRefs must be an array of DOM elements");this.aItemDomRefs=b;if(this.iFocusedIndex>-1){var d=b.length;if(this.iFocusedIndex>d-1){this.iFocusedIndex=d-1;}var A=document.activeElement;if(A&&A!=this.aItemDomRefs[this.iFocusedIndex]){for(var i=0;i<d;i++){if(A==this.aItemDomRefs[i]){this.iFocusedIndex=i;break;}}}}for(var i=0;i<this.aItemDomRefs.length;i++){if(this.aItemDomRefs[i]){var $=q(this.aItemDomRefs[i]);if(i==this.iFocusedIndex&&!$.data("sap.INRoot")){$.attr("tabindex",this.iActiveTabIndex);}else if($.attr("tabindex")=="0"){$.attr("tabindex",-1);}$.data("sap.INItem",true);$.data("sap.InNavArea",true);if($.data("sap.INRoot")&&i!=this.iFocusedIndex){$.data("sap.INRoot").setNestedItemsTabindex();}}}return this;};I.prototype.setItemsTabindex=function(){for(var i=0;i<this.aItemDomRefs.length;i++){if(this.aItemDomRefs[i]){var $=q(this.aItemDomRefs[i]);if($.is(":sapFocusable")){if(i==this.iFocusedIndex&&!$.data("sap.INRoot")){$.attr("tabindex",this.iActiveTabIndex);}else{$.attr("tabindex",-1);}}}}return this;};I.prototype.setNestedItemsTabindex=function(){if(q(this.oDomRef).data("sap.INItem")){for(var i=0;i<this.aItemDomRefs.length;i++){if(this.aItemDomRefs[i]&&q(this.aItemDomRefs[i]).attr("tabindex")=="0"){q(this.aItemDomRefs[i]).attr("tabindex",-1);}}}return this;};I.prototype.destroy=function(){if(this.oDomRef){q(this.oDomRef).removeData("sap.INRoot");this.oDomRef=null;}if(this.aItemDomRefs){for(var i=0;i<this.aItemDomRefs.length;i++){if(this.aItemDomRefs[i]){q(this.aItemDomRefs[i]).removeData("sap.INItem");q(this.aItemDomRefs[i]).removeData("sap.InNavArea");}}this.aItemDomRefs=null;}this._bItemTabIndex=undefined;this.iFocusedIndex=-1;};I.prototype.setCycling=function(C){this.bCycling=C;return this;};I.prototype.setTableMode=function(t,T){this.bTableMode=t;if(this.oConfiguration===undefined){this.oConfiguration=sap.ui.getCore().getConfiguration();}this.bTableList=t?T:false;return this;};I.prototype.setPageSize=function(p){this.iPageSize=p;return this;};I.prototype.setSelectedIndex=function(i){this.iSelectedIndex=i;return this;};I.prototype.setColumns=function(C,n){this.iColumns=C;this.bNoColumnChange=n;return this;};I.prototype.setHomeEndColumnMode=function(s,C){this._bStayInRow=s;this._bCtrlEnabled=C;return this;};I.prototype.focusItem=function(i,e){L.info("FocusItem: "+i+" iFocusedIndex: "+this.iFocusedIndex,"focusItem","ItemNavigation");if(i==this.iFocusedIndex&&this.aItemDomRefs[this.iFocusedIndex]==document.activeElement){this.fireEvent(I.Events.FocusAgain,{index:i,event:e});return;}if(!this.aItemDomRefs[i]||!q(this.aItemDomRefs[i]).is(":sapFocusable")){if(this.bTableMode){var C=i%this.iColumns;var o=i;if(e&&e.keyCode==K.ARROW_RIGHT){if(C<this.iColumns-1){i+=this.oConfiguration.getRTL()?-1:1;}}else if(e&&e.keyCode==K.ARROW_LEFT){if(C>1){i-=this.oConfiguration.getRTL()?-1:1;}}else{if(C>1){i-=1;}}if(i!=o){this.focusItem(i,e);}}return;}this.fireEvent(I.Events.BeforeFocus,{index:i,event:e});this.setFocusedIndex(i);this.bISetFocus=true;if(e&&q(this.aItemDomRefs[this.iFocusedIndex]).data("sap.INRoot")){var b=q(this.aItemDomRefs[this.iFocusedIndex]).data("sap.INRoot");b._sFocusEvent=e.type;}L.info("Set Focus on ID: "+this.aItemDomRefs[this.iFocusedIndex].id,"focusItem","ItemNavigation");this.aItemDomRefs[this.iFocusedIndex].focus();this.fireEvent(I.Events.AfterFocus,{index:i,event:e});};I.prototype.setFocusedIndex=function(i){var $;if(this.aItemDomRefs.length<0){this.iFocusedIndex=-1;return this;}if(i<0){i=0;}if(i>this.aItemDomRefs.length-1){i=this.aItemDomRefs.length-1;}q(this.oDomRef).attr("tabindex",this.iTabIndex);if(this.iFocusedIndex!==-1&&this.aItemDomRefs.length>this.iFocusedIndex){q(this.aItemDomRefs[this.iFocusedIndex]).attr("tabindex",-1);$=q(this.aItemDomRefs[this.iFocusedIndex]);if($.data("sap.INRoot")&&i!=this.iFocusedIndex){q($.data("sap.INRoot").aItemDomRefs[$.data("sap.INRoot").iFocusedIndex]).attr("tabindex",-1);}}this.iFocusedIndex=i;var f=this.aItemDomRefs[this.iFocusedIndex];$=q(this.aItemDomRefs[this.iFocusedIndex]);if(!$.data("sap.INRoot")){q(f).attr("tabindex",this.iActiveTabIndex);}return this;};I.prototype.getFocusedDomRef=function(){return this.aItemDomRefs[this.iFocusedIndex];};I.prototype.getFocusedIndex=function(){return this.iFocusedIndex;};I.prototype.onfocusin=function(e){var s=e.target;var i=0;if(s==this.oDomRef){if(!this._bItemTabIndex){this.setItemsTabindex();this._bItemTabIndex=true;}if(this._bMouseDownHappened){return;}var b;if(q(this.oDomRef).data("sap.INItem")&&this._sFocusEvent&&!q(this.oDomRef).data("sap.InNavArea")){switch(this._sFocusEvent){case"sapnext":b=0;break;case"sapprevious":b=this.aItemDomRefs.length-1;break;default:if(this.iSelectedIndex!=-1){b=this.iSelectedIndex;}else if(this.iFocusedIndex!=-1){b=this.iFocusedIndex;}else{b=0;}break;}this._sFocusEvent=undefined;}else{if(this.iSelectedIndex!=-1){b=this.iSelectedIndex;}else if(this.iFocusedIndex!=-1){b=this.iFocusedIndex;}else{b=0;}}this.focusItem(b,e);if(this.iFocusedIndex==-1){for(i=b+1;i<this.aItemDomRefs.length;i++){this.focusItem(i,e);if(this.iFocusedIndex==i){break;}}if(this.iFocusedIndex==-1&&b>0){for(i=b-1;i>=0;i--){this.focusItem(i,e);if(this.iFocusedIndex==i){break;}}}}e.preventDefault();e.stopPropagation();}else if(!this.bISetFocus){if(this.aItemDomRefs&&e.target!=this.aItemDomRefs[this.iFocusedIndex]){for(i=0;i<this.aItemDomRefs.length;i++){if(e.target==this.aItemDomRefs[i]){this.focusItem(i,e);break;}}}else{this.fireEvent(I.Events.AfterFocus,{index:this.iFocusedIndex,event:e});}}this.bISetFocus=false;};I.prototype.onsapfocusleave=function(e){if(!e.relatedControlId||!c(this.oDomRef,sap.ui.getCore().byId(e.relatedControlId).getFocusDomRef())){var i;if(this.iSelectedIndex!=-1){i=this.iSelectedIndex;}else if(this.iFocusedIndex!=-1){i=this.iFocusedIndex;}else{i=0;}this.setFocusedIndex(i);var d;if(q(this.oDomRef).data("sap.INItem")){var p;d=q(this.oDomRef);while(!p){d=d.parent();if(d.data("sap.INRoot")){p=d.get(0);}}if(!e.relatedControlId||c(p,sap.ui.getCore().byId(e.relatedControlId).getFocusDomRef())){q(this.aItemDomRefs[this.iFocusedIndex]).attr("tabindex",-1);}}d=q(this.oDomRef);if(d.data("sap.InNavArea")===false){d.data("sap.InNavArea",true);}this.fireEvent(I.Events.FocusLeave,{index:i,event:e});}};I.prototype.onmousedown=function(e){var s=e.target;var b=function(d,o){var f=false;var C=q(d);while(!C.is(":sapFocusable")&&C.get(0)!=o){C=C.parent();}if(C.get(0)!=o){f=true;}return f;};if(c(this.oDomRef,s)){for(var i=0;i<this.aItemDomRefs.length;i++){var o=this.aItemDomRefs[i];if(c(o,s)){if(!this.bTableMode){this.focusItem(i,e);}else{if(o===s||!b(s,o)){this.focusItem(i,e);}}return;}}if(s==this.oDomRef){this._bMouseDownHappened=true;var t=this;window.setTimeout(function(){t._bMouseDownHappened=false;},20);}}};I.prototype.onsapnext=function(e){if(!c(this.oDomRef,e.target)){return;}if(q(this.oDomRef).data("sap.InNavArea")){return;}if(this.bTableMode&&this.aItemDomRefs.indexOf(e.target)===-1){return;}var i=this.iFocusedIndex,f=true,b=false;if(i>-1){if(this.bTableMode){var r=this.aItemDomRefs.length/this.iColumns,R=Math.floor(i/this.iColumns),C=i%this.iColumns;if(e.keyCode==K.ARROW_DOWN){if(R<r-1){i+=this.iColumns;}}else{if(C<this.iColumns-1){i+=1;}}}else{do{if(this.iColumns>1&&e.keyCode==K.ARROW_DOWN){if((i+this.iColumns)>=this.aItemDomRefs.length){if(!this.bNoColumnChange){if((i%this.iColumns)<(this.iColumns-1)){i=(i%this.iColumns)+1;}else if(this.bCycling){i=0;}}else{i=this.iFocusedIndex;b=true;}}else{i=i+this.iColumns;}}else{if(i==this.aItemDomRefs.length-1){if(q(this.oDomRef).data("sap.INItem")){return;}else if(this.bCycling){i=0;}else{i=this.iFocusedIndex;b=true;}}else{i++;}}if(i===this.iFocusedIndex){if(f){f=false;}else{throw new Error("ItemNavigation has no visible/existing items and is hence unable to select the next one");}}}while(!this.aItemDomRefs[i]||!q(this.aItemDomRefs[i]).is(":sapFocusable"));}this.focusItem(i,e);if(b){this.fireEvent(I.Events.BorderReached,{index:i,event:e});}e.preventDefault();e.stopPropagation();}};I.prototype.onsapnextmodifiers=function(e){if(this.hasDisabledModifier(e)){return;}this.onsapnext(e);};I.prototype.onsapprevious=function(e){if(!c(this.oDomRef,e.target)){return;}if(q(this.oDomRef).data("sap.InNavArea")){return;}if(this.bTableMode&&this.aItemDomRefs.indexOf(e.target)===-1){return;}var i=this.iFocusedIndex,f=true,b=false;var C=0;if(i>-1){if(this.bTableMode){var r=Math.floor(i/this.iColumns);C=i%this.iColumns;if(e.keyCode==K.ARROW_UP){if(r>0){i-=this.iColumns;}}else{if(C>0){i-=1;}}}else{do{if(this.iColumns>1&&e.keyCode==K.ARROW_UP){if((i-this.iColumns)<0){if(!this.bNoColumnChange){C=0;if((i%this.iColumns)>0){C=(i%this.iColumns)-1;}else if(this.bCycling){C=Math.min(this.iColumns-1,this.aItemDomRefs.length-1);}if(i===0&&C===0){i=0;}else{var R=Math.ceil(this.aItemDomRefs.length/this.iColumns);i=C+((R-1)*this.iColumns);if(i>=this.aItemDomRefs.length){i=i-this.iColumns;}}}else{i=this.iFocusedIndex;b=true;}}else{i=i-this.iColumns;}}else{if(i==0){if(q(this.oDomRef).data("sap.INItem")){return;}else if(this.bCycling){i=this.aItemDomRefs.length-1;}else{i=this.iFocusedIndex;b=true;}}else{i--;}}if(i==this.iFocusedIndex){if(f){f=false;}else{throw new Error("ItemNavigation has no visible/existing items and is hence unable to select the previous one");}}}while(!this.aItemDomRefs[i]||!q(this.aItemDomRefs[i]).is(":sapFocusable"));}this.focusItem(i,e);if(b){this.fireEvent(I.Events.BorderReached,{index:i,event:e});}e.preventDefault();e.stopPropagation();}};I.prototype.onsappreviousmodifiers=function(e){if(this.hasDisabledModifier(e)){return;}this.onsapprevious(e);};I.prototype.onsappageup=function(e){if(!c(this.oDomRef,e.target)){return;}if(this.bTableMode&&this.aItemDomRefs.indexOf(e.target)===-1){return;}var i=0;var b=false;if(this.iPageSize>0){i=this.iFocusedIndex;if(i>-1){i=i-this.iPageSize;while(i>0&&!q(this.aItemDomRefs[i]).is(":sapFocusable")){i--;}if(i<0){if(!this.bNoColumnChange){i=0;}else{i=this.iFocusedIndex;b=true;}}this.focusItem(i,e);}}else if(this.bTableMode){i=this.iFocusedIndex%this.iColumns;this.focusItem(i,e);}if(b){this.fireEvent(I.Events.BorderReached,{index:i,event:e});}e.preventDefault();e.stopPropagation();};I.prototype.onsappagedown=function(e){if(!c(this.oDomRef,e.target)){return;}if(this.bTableMode&&this.aItemDomRefs.indexOf(e.target)===-1){return;}var i=0;var b=false;if(this.iPageSize>0){i=this.iFocusedIndex;if(i>-1){i=i+this.iPageSize;while(i<this.aItemDomRefs.length-1&&!q(this.aItemDomRefs[i]).is(":sapFocusable")){i++;}if(i>this.aItemDomRefs.length-1){if(!this.bNoColumnChange){i=this.aItemDomRefs.length-1;}else{i=this.iFocusedIndex;b=true;}}this.focusItem(i,e);}}else if(this.bTableMode){var r=this.aItemDomRefs.length/this.iColumns,C=this.iFocusedIndex%this.iColumns;i=(r-1)*this.iColumns+C;this.focusItem(i,e);}if(b){this.fireEvent(I.Events.BorderReached,{index:i,event:e});}e.preventDefault();e.stopPropagation();};I.prototype.onsaphome=function(e){if(!c(this.oDomRef,e.target)){return;}if(this.bTableMode&&this.aItemDomRefs.indexOf(e.target)===-1){return;}var i=0;var r=0;if(this.bTableMode){if(!this.bTableList&&!(e.metaKey||e.ctrlKey)){r=Math.floor(this.iFocusedIndex/this.iColumns);i=r*this.iColumns;}}else{if(!!(e.metaKey||e.ctrlKey)&&!this._bCtrlEnabled){return;}if(this._bStayInRow&&!(this._bCtrlEnabled&&(e.metaKey||e.ctrlKey))&&this.iColumns>0){r=Math.floor(this.iFocusedIndex/this.iColumns);i=r*this.iColumns;}else{while(!this.aItemDomRefs[i]||!q(this.aItemDomRefs[i]).is(":sapFocusable")){i++;if(i==this.aItemDomRefs.length){return;}}}}this.focusItem(i,e);e.preventDefault();e.stopPropagation();};I.prototype.onsaphomemodifiers=function(e){if(this.hasDisabledModifier(e)){return;}this.onsaphome(e);};I.prototype.onsapend=function(e){if(!c(this.oDomRef,e.target)){return;}if(this.bTableMode&&this.aItemDomRefs.indexOf(e.target)===-1){return;}var i=this.aItemDomRefs.length-1;var r=0;if(this.bTableMode){if(!this.bTableList&&!(e.metaKey||e.ctrlKey)){r=Math.floor(this.iFocusedIndex/this.iColumns);i=r*this.iColumns+this.iColumns-1;}}else{if(!!(e.metaKey||e.ctrlKey)&&!this._bCtrlEnabled){return;}if(this._bStayInRow&&!(this._bCtrlEnabled&&(e.metaKey||e.ctrlKey))&&this.iColumns>0){r=Math.floor(this.iFocusedIndex/this.iColumns);i=(r+1)*this.iColumns-1;if(i>=this.aItemDomRefs.length){i=this.aItemDomRefs.length-1;}}else{while(!this.aItemDomRefs[i]||!q(this.aItemDomRefs[i]).is(":sapFocusable")){i--;if(i<0){return;}}}}this.focusItem(i,e);e.preventDefault();e.stopPropagation();};I.prototype.onsapendmodifiers=function(e){if(this.hasDisabledModifier(e)){return;}this.onsapend(e);};I.prototype.setTabIndex0=function(){this.iTabIndex=0;this.iActiveTabIndex=0;};I.prototype.onkeyup=function(e){if(e.keyCode==K.F2){var d=q(this.oDomRef);if(d.data("sap.InNavArea")){d.data("sap.InNavArea",false);}else if(d.data("sap.InNavArea")===false){d.data("sap.InNavArea",true);}e.preventDefault();e.stopPropagation();}};return I;});
