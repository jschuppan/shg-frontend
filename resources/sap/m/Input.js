/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./InputBase','./Popover','sap/ui/core/Item','./ColumnListItem','./GroupHeaderListItem','./DisplayListItem','./StandardListItem','sap/ui/core/SeparatorItem','./List','./Table','./library','sap/ui/core/IconPool','sap/ui/Device','sap/ui/core/Control','./SuggestionsPopover','./Toolbar','./ToolbarSpacer','./Button',"sap/ui/dom/containsOrEquals","sap/base/assert","sap/base/util/deepEqual","./InputRenderer","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/selectText"],function(I,P,a,C,G,D,S,b,L,T,l,c,d,e,f,g,h,B,j,k,m,n,q){"use strict";var o=l.ListType;var p=l.InputTextFormatMode;var r=l.InputType;var s=l.ListMode;var t=l.ListSeparators;var u=I.extend("sap.m.Input",{metadata:{library:"sap.m",properties:{type:{type:"sap.m.InputType",group:"Data",defaultValue:r.Text},maxLength:{type:"int",group:"Behavior",defaultValue:0},dateFormat:{type:"string",group:"Misc",defaultValue:'YYYY-MM-dd',deprecated:true},showValueHelp:{type:"boolean",group:"Behavior",defaultValue:false},showSuggestion:{type:"boolean",group:"Behavior",defaultValue:false},valueHelpOnly:{type:"boolean",group:"Behavior",defaultValue:false},filterSuggests:{type:"boolean",group:"Behavior",defaultValue:true},maxSuggestionWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},startSuggestion:{type:"int",group:"Behavior",defaultValue:1},showTableSuggestionValueHelp:{type:"boolean",group:"Behavior",defaultValue:true},description:{type:"string",group:"Misc",defaultValue:null},fieldWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'50%'},valueLiveUpdate:{type:"boolean",group:"Behavior",defaultValue:false},selectedKey:{type:"string",group:"Data",defaultValue:""},textFormatMode:{type:"sap.m.InputTextFormatMode",group:"Misc",defaultValue:p.Value},textFormatter:{type:"any",group:"Misc",defaultValue:""},suggestionRowValidator:{type:"any",group:"Misc",defaultValue:""},enableSuggestionsHighlighting:{type:"boolean",group:"Behavior",defaultValue:true},autocomplete:{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"suggestionItems",aggregations:{suggestionItems:{type:"sap.ui.core.Item",multiple:true,singularName:"suggestionItem"},suggestionColumns:{type:"sap.m.Column",multiple:true,singularName:"suggestionColumn",bindable:"bindable",forwarding:{getter:"_getSuggestionsTable",aggregation:"columns"}},suggestionRows:{type:"sap.m.ColumnListItem",altTypes:["sap.m.GroupHeaderListItem"],multiple:true,singularName:"suggestionRow",bindable:"bindable",forwarding:{getter:"_getSuggestionsTable",aggregation:"items"}},_suggestionPopup:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_valueHelpIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false},selectedRow:{type:"sap.m.ColumnListItem",multiple:false}},events:{liveChange:{parameters:{value:{type:"string"},escPressed:{type:"boolean"},previousValue:{type:"string"}}},valueHelpRequest:{parameters:{fromSuggestions:{type:"boolean"}}},suggest:{parameters:{suggestValue:{type:"string"},suggestionColumns:{type:"sap.m.ListBase"}}},suggestionItemSelected:{parameters:{selectedItem:{type:"sap.ui.core.Item"},selectedRow:{type:"sap.m.ColumnListItem"}}},submit:{parameters:{value:{type:"string"}}}},designtime:"sap/m/designtime/Input.designtime"}});c.insertFontFaceStyle();u._DEFAULTFILTER_TABULAR=function(v,w){var x=w.getCells(),i=0;for(;i<x.length;i++){if(x[i].getText){if(f._wordStartsWithValue(x[i].getText(),v)){return true;}}}return false;};u._DEFAULTRESULT_TABULAR=function(v){var w=v.getCells(),i=0;for(;i<w.length;i++){if(w[i].getText){return w[i].getText();}}return"";};u.prototype.init=function(){I.prototype.init.call(this);this._fnFilter=f._DEFAULTFILTER;this._bUseDialog=d.system.phone;this._bFullScreen=d.system.phone;this._iSetCount=0;this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");};u.prototype.exit=function(){I.prototype.exit.call(this);this._deregisterEvents();this.cancelPendingSuggest();if(this._iRefreshListTimeout){clearTimeout(this._iRefreshListTimeout);this._iRefreshListTimeout=null;}if(this._oSuggestionTable){this._oSuggestionTable.destroy();this._oSuggestionTable=null;}if(this._oSuggPopover){this._oSuggPopover.destroy();this._oSuggPopover=null;}if(this._oShowMoreButton){this._oShowMoreButton.destroy();this._oShowMoreButton=null;}if(this._oButtonToolbar){this._oButtonToolbar.destroy();this._oButtonToolbar=null;}this.$().off("click");};u.prototype.onBeforeRendering=function(){var i=this.getSelectedKey(),v=this.getShowValueHelp()&&this.getEnabled()&&this.getEditable(),E=this.getAggregation("_endIcon")||[],w=E[0],x;I.prototype.onBeforeRendering.call(this);this._deregisterEvents();if(i){this.setSelectedKey(i);}if(this.getShowSuggestion()){this._oSuggPopover._bAutocompleteEnabled=this.getAutocomplete();if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton();}else{this._removeShowMoreButton();}x=this._oSuggPopover._oPopupInput;if(x){x.setType(this.getType());}}if(v){w=this._getValueHelpIcon();w.setProperty("visible",true,true);}else{if(w){w.setProperty("visible",false,true);}}!this.getWidth()&&this.setWidth("100%");this.$().off("click");};u.prototype.onAfterRendering=function(){I.prototype.onAfterRendering.call(this);if(this._oSuggPopover){this._oSuggPopover._resetTypeAhead();}if(this._bUseDialog&&this.getEditable()&&this.getEnabled()){this.$().on("click",q.proxy(function(E){if(this._onclick){this._onclick(E);}if(this.getShowSuggestion()&&this._oSuggPopover&&E.target.id!=this.getId()+"-vhi"){this._openSuggestionsPopover();}},this));}};u.prototype._getDisplayText=function(i){var v=this.getTextFormatter();if(v){return v(i);}var w=i.getText(),K=i.getKey(),x=this.getTextFormatMode();switch(x){case p.Key:return K;case p.ValueKey:return w+' ('+K+')';case p.KeyValue:return'('+K+') '+w;default:return w;}};u.prototype._onValueUpdated=function(i){if(this._bSelectingItem||i===this._sSelectedValue){return;}var K=this.getSelectedKey(),H;if(K===''){return;}if(this._hasTabularSuggestions()){H=this._oSuggestionTable&&!!this._oSuggestionTable.getSelectedItem();}else{H=this._oSuggPopover._oList&&!!this._oSuggPopover._oList.getSelectedItem();}if(H){return;}this.setProperty("selectedKey",'',true);this.setAssociation("selectedRow",null,true);this.setAssociation("selectedItem",null,true);this.fireSuggestionItemSelected({selectedItem:null,selectedRow:null});};u.prototype._updateSelectionFromList=function(){if(this._oSuggPopover._iPopupListSelectedIndex<0){return false;}var i=this._oSuggPopover._oList.getSelectedItem();if(i){if(this._hasTabularSuggestions()){this.setSelectionRow(i,true);}else{this.setSelectionItem(i._oItem,true);}}return true;};u.prototype.setSelectionItem=function(i,v){this._bSelectingItem=true;if(!i){this.setAssociation("selectedItem",null,true);this.setValue('');return;}this._oSuggPopover._iPopupListSelectedIndex=-1;var w=this._iSetCount,N;this.setAssociation("selectedItem",i,true);this.setProperty("selectedKey",i.getKey(),true);if(v){this.fireSuggestionItemSelected({selectedItem:i});}if(w!==this._iSetCount){N=this.getValue();}else{N=this._getDisplayText(i);}this._sSelectedValue=N;this.updateInputField(N);if(this.bIsDestroyed){return;}if(!(this._bUseDialog&&this instanceof sap.m.MultiInput)){this._closeSuggestionPopup();}this._bSelectingItem=false;};u.prototype.addSuggestionRowGroup=function(i,H,v){H=H||new G({title:i.text||i.key});this.addAggregation("suggestionRows",H,v);return H;};u.prototype.addSuggestionItemGroup=function(i,H,v){H=H||new b({text:i.text||i.key});this.addAggregation("suggestionItems",H,v);return H;};u.prototype.setSelectedItem=function(i){if(typeof i==="string"){i=sap.ui.getCore().byId(i);}if(i!==null&&!(i instanceof a)){return this;}this.setSelectionItem(i);return this;};u.prototype.setSelectedKey=function(K){K=this.validateProperty("selectedKey",K);this.setProperty("selectedKey",K,true);if(this._hasTabularSuggestions()){return this;}if(!K){this.setSelectionItem();return this;}var i=this.getSuggestionItemByKey(K);this.setSelectionItem(i);return this;};u.prototype.getSuggestionItemByKey=function(K){var v=this.getSuggestionItems()||[],w,i;for(i=0;i<v.length;i++){w=v[i];if(w.getKey()===K){return w;}}};u.prototype.setSelectionRow=function(i,v){if(!i){this.setAssociation("selectedRow",null,true);return;}this._oSuggPopover._iPopupListSelectedIndex=-1;this._bSelectingItem=true;var w,x=this.getSuggestionRowValidator();if(x){w=x(i);if(!(w instanceof a)){w=null;}}var y=this._iSetCount,K="",N;this.setAssociation("selectedRow",i,true);if(w){K=w.getKey();}this.setProperty("selectedKey",K,true);if(v){this.fireSuggestionItemSelected({selectedRow:i});}if(y!==this._iSetCount){N=this.getValue();}else{if(w){N=this._getDisplayText(w);}else{N=this._fnRowResultFilter?this._fnRowResultFilter(i):f._DEFAULTRESULT_TABULAR(i);}}this._sSelectedValue=N;this.updateInputField(N);if(this.bIsDestroyed){return;}if(!(this._bUseDialog&&this instanceof sap.m.MultiInput&&this._isMultiLineMode)){this._closeSuggestionPopup();}this._bSelectingItem=false;};u.prototype.setSelectedRow=function(i){if(typeof i==="string"){i=sap.ui.getCore().byId(i);}if(i!==null&&!(i instanceof C)){return this;}this.setSelectionRow(i);return this;};u.prototype._getValueHelpIcon=function(){var i=this,E=this.getAggregation("_endIcon")||[],v=E[0];if(!v){v=this.addEndIcon({id:this.getId()+"-vhi",src:c.getIconURI("value-help"),useIconTooltip:false,noTabStop:true,press:function(w){if(!i.getValueHelpOnly()){var x=this.getParent(),$;if(d.support.touch){$=x.$('inner');$.attr('readonly','readonly');x.focus();$.removeAttr('readonly');}else{x.focus();}i.bValueHelpRequested=true;i._fireValueHelpRequest(false);}}});}return v;};u.prototype._fireValueHelpRequest=function(F){var i="";if(this.getShowSuggestion()&&this._oSuggPopover){i=this._oSuggPopover._sTypedInValue||"";}else{i=this.getDOMValue();}this.fireValueHelpRequest({fromSuggestions:F,_userInputValue:i});};u.prototype._fireValueHelpRequestForValueHelpOnly=function(){if(this.getEnabled()&&this.getEditable()&&this.getShowValueHelp()&&this.getValueHelpOnly()){if(d.system.phone){this.focus();}this._fireValueHelpRequest(false);}};u.prototype.ontap=function(E){I.prototype.ontap.call(this,E);this._fireValueHelpRequestForValueHelpOnly();};u.prototype.getWidth=function(){return this.getProperty("width")||"100%";};u.prototype.setFilterFunction=function(F){if(F===null||F===undefined){this._fnFilter=f._DEFAULTFILTER;return this;}k(typeof(F)==="function","Input.setFilterFunction: first argument fnFilter must be a function on "+this);this._fnFilter=F;return this;};u.prototype.setRowResultFunction=function(F){var i;if(F===null||F===undefined){this._fnRowResultFilter=f._DEFAULTRESULT_TABULAR;return this;}k(typeof(F)==="function","Input.setRowResultFunction: first argument fnFilter must be a function on "+this);this._fnRowResultFilter=F;i=this.getSelectedRow();if(i){this.setSelectedRow(i);}return this;};u.prototype.closeSuggestions=function(){this._closeSuggestionPopup();};u.prototype._doSelect=function(i,E){if(d.support.touch){return;}var v=this._$input[0];if(v){var R=this._$input;v.focus();R.selectText(i?i:0,E?E:R.val().length);}return this;};u.prototype._isIncrementalType=function(){var i=this.getType();if(i==="Number"||i==="Date"||i==="Datetime"||i==="Month"||i==="Time"||i==="Week"){return true;}return false;};u.prototype.onsapescape=function(E){var i;if(this._isSuggestionsPopoverOpen()){E.originalEvent._sapui_handledByControl=true;this._oSuggPopover._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();if(this._sBeforeSuggest!==undefined){if(this._sBeforeSuggest!==this.getValue()){i=this._lastValue;this.setValue(this._sBeforeSuggest);this._lastValue=i;}this._sBeforeSuggest=undefined;}return;}if(this.getValueLiveUpdate()){this.setProperty("value",this._lastValue,true);}if(I.prototype.onsapescape){I.prototype.onsapescape.apply(this,arguments);}};u.prototype.onsapenter=function(E){this.cancelPendingSuggest();if(this._isSuggestionsPopoverOpen()){if(!this._updateSelectionFromList()&&!this.isComposingCharacter()){this._closeSuggestionPopup();}}if(I.prototype.onsapenter){I.prototype.onsapenter.apply(this,arguments);}if(this.getEnabled()&&this.getEditable()&&!(this.getValueHelpOnly()&&this.getShowValueHelp())){this.fireSubmit({value:this.getValue()});}};u.prototype.onsapfocusleave=function(E){var i=this._oSuggPopover,v=i&&i._oPopover,F=E.relatedControlId&&sap.ui.getCore().byId(E.relatedControlId),w=F&&F.getFocusDomRef(),H=i&&i._sProposedItemText&&this.getAutocomplete(),x=v&&w&&j(v.getDomRef(),w);if(v instanceof P){if(x){this._bPopupHasFocus=true;if(d.system.desktop&&m(v.getFocusDomRef(),w)){this.focus();}}else{if(this.getDOMValue()===this._sSelectedSuggViaKeyboard){this._sSelectedSuggViaKeyboard=null;}}}if(!x&&!H){I.prototype.onsapfocusleave.apply(this,arguments);}this.bValueHelpRequested=false;};u.prototype.onmousedown=function(E){var i=this._oSuggPopover&&this._oSuggPopover._oPopover;if((i instanceof P)&&i.isOpen()){E.stopPropagation();}};u.prototype._deregisterEvents=function(){if(this._oSuggPopover){this._oSuggPopover._deregisterResize();}if(this._bUseDialog&&this._oSuggPopover&&this._oSuggPopover._oPopover){this.$().off("click");}};u.prototype.updateSuggestionItems=function(){this._bSuspendInvalidate=true;this.updateAggregation("suggestionItems");this._synchronizeSuggestions();this._bSuspendInvalidate=false;return this;};u.prototype.invalidate=function(){if(!this._bSuspendInvalidate){e.prototype.invalidate.apply(this,arguments);}};u.prototype.cancelPendingSuggest=function(){if(this._iSuggestDelay){clearTimeout(this._iSuggestDelay);this._iSuggestDelay=null;}};u.prototype._triggerSuggest=function(v){this.cancelPendingSuggest();this._bShouldRefreshListItems=true;if(!v){v="";}if(v.length>=this.getStartSuggestion()){this._iSuggestDelay=setTimeout(function(){if(this._sPrevSuggValue!==v){this._bBindingUpdated=false;this.fireSuggest({suggestValue:v});if(!this._bBindingUpdated){this._refreshItemsDelayed();}this._sPrevSuggValue=v;}}.bind(this),300);}else if(this._bUseDialog){if(this._oSuggPopover._oList instanceof T){this._oSuggPopover._oList.addStyleClass("sapMInputSuggestionTableHidden");}else if(this._oSuggPopover._oList&&this._oSuggPopover._oList.destroyItems){this._oSuggPopover._oList.destroyItems();}}else if(this._isSuggestionsPopoverOpen()){setTimeout(function(){var N=this.getDOMValue()||'';if(N<this.getStartSuggestion()){this._oSuggPopover._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();}}.bind(this),0);}};(function(){u.prototype.setShowSuggestion=function(v){this.setProperty("showSuggestion",v,true);if(v){this._oSuggPopover=this._getSuggestionsPopover();this._oSuggPopover._iPopupListSelectedIndex=-1;if(!this._oSuggPopover._oPopover){this._createSuggestionsPopoverPopup();this._synchronizeSuggestions();this._createSuggestionPopupContent();}}else{if(this._oSuggPopover){this._oSuggPopover._destroySuggestionPopup();this._oSuggPopover._iPopupListSelectedIndex=-1;this._oButtonToolbar=null;this._oShowMoreButton=null;}}return this;};u.prototype.setShowTableSuggestionValueHelp=function(v){this.setProperty("showTableSuggestionValueHelp",v,true);if(!(this._oSuggPopover&&this._oSuggPopover._oPopover)){return this;}if(v){this._addShowMoreButton();}else{this._removeShowMoreButton();}return this;};u.prototype.onchange=function(E){if(this.getShowValueHelp()||this.getShowSuggestion()){return;}this.onChange(E);};u.prototype.oninput=function(E){I.prototype.oninput.call(this,E);if(E.isMarked("invalid")){return;}var v=this.getDOMValue();if(this.getValueLiveUpdate()){this.setProperty("value",v,true);this._onValueUpdated(v);}this.fireLiveChange({value:v,newValue:v});if(this.getShowSuggestion()&&!this._bUseDialog){this._triggerSuggest(v);}};u.prototype.getValue=function(){return this.getDomRef("inner")&&this._$input?this.getDOMValue():this.getProperty("value");};u.prototype._refreshItemsDelayed=function(){clearTimeout(this._iRefreshListTimeout);this._iRefreshListTimeout=setTimeout(function(){if(this._oSuggPopover){this._refreshListItems();}}.bind(this),0);};u.prototype._filterListItems=function(v,w){var i,x,y,z=[],H=[],F=this.getFilterSuggests(),A=false;for(i=0;i<v.length;i++){y=v[i];if(v[i].isA("sap.ui.core.SeparatorItem")){x=new G({id:y.getId()+"-ghli",title:v[i].getText()});z.push({header:x,visible:false});this._configureListItem(y,x);H.push(x);}else if(!F||this._fnFilter(w,y)){if(v[i].isA("sap.ui.core.ListItem")){x=new D(y.getId()+"-dli");x.setLabel(y.getText());x.setValue(y.getAdditionalText());}else{x=new S(y.getId()+"-sli");x.setTitle(y.getText());}if(!A&&(this._oSuggPopover._sProposedItemText===v[i].getText())){x.setSelected(true);A=true;}if(z.length){z[z.length-1].visible=true;}this._configureListItem(y,x);H.push(x);}}z.forEach(function(E){E.header.setVisible(E.visible);});return{hitItems:H,groups:z};};u.prototype._filterTabularItems=function(v,w){var i,x,F=this.getFilterSuggests(),H=[],y=[],z=false;for(i=0;i<v.length;i++){if(v[i].isA("sap.m.GroupHeaderListItem")){y.push({header:v[i],visible:false});}else{x=!F||this._fnFilter(w,v[i]);v[i].setVisible(x);x&&H.push(v[i]);if(!z&&x&&this._oSuggPopover._sProposedItemText===this._fnRowResultFilter(v[i])){v[i].setSelected(true);z=true;}if(y.length&&x){y[y.length-1].visible=true;}}}y.forEach(function(A){A.header.setVisible(A.visible);});this._getSuggestionsTable().invalidate();return{hitItems:H,groups:y};};u.prototype._clearSuggestionPopupItems=function(){if(!this._oSuggPopover._oList){return;}if(this._oSuggPopover._oList instanceof T){this._oSuggPopover._oList.removeSelections(true);}else{this._oSuggPopover._oList.destroyItems();}};u.prototype._hideSuggestionPopup=function(){var i=this._oSuggPopover._oPopover;function v(){if(d.browser.internet_explorer){var F=this.getFocusInfo();this.setDOMValue(this._oSuggPopover._sTypedInValue);this.applyFocusInfo(F);}else{this.setDOMValue(this._oSuggPopover._sTypedInValue);}}if(!this._bUseDialog){if(i.isOpen()){this._sCloseTimer=setTimeout(function(){this._oSuggPopover._iPopupListSelectedIndex=-1;this.cancelPendingSuggest();if(this._oSuggPopover._sTypedInValue){v.call(this);}this._oSuggPopover._oProposedItem=null;i.close();}.bind(this),0);}}else if(this._hasTabularSuggestions()&&this._oSuggPopover._oList){this._oSuggPopover._oList.addStyleClass("sapMInputSuggestionTableHidden");}this.$("SuggDescr").text("");this.$("inner").removeAttr("aria-haspopup");this.$("inner").removeAttr("aria-activedescendant");};u.prototype._openSuggestionPopup=function(O){var i=this._oSuggPopover._oPopover;if(!this._bUseDialog){if(this._sCloseTimer){clearTimeout(this._sCloseTimer);this._sCloseTimer=null;}if(!i.isOpen()&&!this._sOpenTimer&&O!==false){this._sOpenTimer=setTimeout(function(){this._sOpenTimer=null;this._openSuggestionsPopover();}.bind(this),0);}}this.$("inner").attr("aria-haspopup","true");};u.prototype._getFilteredSuggestionItems=function(i){var F,v=this.getSuggestionItems(),w=this.getSuggestionRows();if(this._hasTabularSuggestions()){if(this._bUseDialog&&this._oSuggPopover._oList){this._oSuggPopover._oList.removeStyleClass("sapMInputSuggestionTableHidden");}F=this._filterTabularItems(w,i);}else{F=this._filterListItems(v,i);}return F;};u.prototype._fillSimpleSuggestionPopupItems=function(F){var i,H=F.hitItems,v=F.groups,w=H.length,x=w;if(!this._hasTabularSuggestions()){for(i=0;i<w;i++){this._oSuggPopover._oList.addItem(H[i]);}x-=v.length;}return x;};u.prototype._applySuggestionAcc=function(N){var A="",R=this._oRb;if(N===1){A=R.getText("INPUT_SUGGESTIONS_ONE_HIT");}else if(N>1){A=R.getText("INPUT_SUGGESTIONS_MORE_HITS",N);}else{A=R.getText("INPUT_SUGGESTIONS_NO_HIT");}this.$("SuggDescr").text(A);};u.prototype._refreshListItems=function(){var i=this.getShowSuggestion(),v=this._oSuggPopover._sTypedInValue||this.getDOMValue()||"",F,w;this._oSuggPopover._iPopupListSelectedIndex=-1;if(!i||!this._bShouldRefreshListItems||!this.getDomRef()||(!this._bUseDialog&&!this.$().hasClass("sapMInputFocused"))){return null;}this._clearSuggestionPopupItems();if(v.length<this.getStartSuggestion()){this._hideSuggestionPopup();return false;}F=this._getFilteredSuggestionItems(v);w=this._fillSimpleSuggestionPopupItems(F);if(w>0){this._openSuggestionPopup(this.getValue().length>=this.getStartSuggestion());}else{this._hideSuggestionPopup();}this._applySuggestionAcc(w);};u.prototype._configureListItem=function(i,v){var w=o.Active;if(!i.getEnabled()||v.isA("sap.m.GroupHeaderListItem")){w=o.Inactive;}v.setType(w);v._oItem=i;v.addEventDelegate({ontouchstart:function(E){(E.originalEvent||E)._sapui_cancelAutoClose=true;}});return v;};u.prototype.addSuggestionItem=function(i){this.addAggregation("suggestionItems",i,true);if(!this._oSuggPopover){this._getSuggestionsPopover();}this._synchronizeSuggestions();this._createSuggestionPopupContent();return this;};u.prototype.insertSuggestionItem=function(i,v){this.insertAggregation("suggestionItems",v,i,true);if(!this._oSuggPopover){this._getSuggestionsPopover();}this._synchronizeSuggestions();this._createSuggestionPopupContent();return this;};u.prototype.removeSuggestionItem=function(i){var v=this.removeAggregation("suggestionItems",i,true);this._synchronizeSuggestions();return v;};u.prototype.removeAllSuggestionItems=function(){var i=this.removeAllAggregation("suggestionItems",true);this._synchronizeSuggestions();return i;};u.prototype.destroySuggestionItems=function(){this.destroyAggregation("suggestionItems",true);this._synchronizeSuggestions();return this;};u.prototype.addSuggestionRow=function(i){i.setType(o.Active);this.addAggregation("suggestionRows",i);this._synchronizeSuggestions();this._createSuggestionPopupContent(true);return this;};u.prototype.insertSuggestionRow=function(i,v){i.setType(o.Active);this.insertAggregation("suggestionRows",i,v);this._synchronizeSuggestions();this._createSuggestionPopupContent(true);return this;};u.prototype.removeSuggestionRow=function(i){var v=this.removeAggregation("suggestionRows",i);this._synchronizeSuggestions();return v;};u.prototype.removeAllSuggestionRows=function(){var i=this.removeAllAggregation("suggestionRows");this._synchronizeSuggestions();return i;};u.prototype.destroySuggestionRows=function(){this.destroyAggregation("suggestionRows");this._synchronizeSuggestions();return this;};u.prototype.bindAggregation=function(){if(arguments[0]==="suggestionRows"||arguments[0]==="suggestionColumns"||arguments[0]==="suggestionItems"){this._createSuggestionPopupContent(arguments[0]==="suggestionRows"||arguments[0]==="suggestionColumns");this._bBindingUpdated=true;}return I.prototype.bindAggregation.apply(this,arguments);};u.prototype._closeSuggestionPopup=function(){if(this._oSuggPopover&&this._oSuggPopover.isOpen()){this._bShouldRefreshListItems=false;this.cancelPendingSuggest();this._oSuggPopover._oPopover.close();if(!this._bUseDialog&&this.$().hasClass("sapMInputFocused")){this.openValueStateMessage();}this.$("SuggDescr").text("");this.$("inner").removeAttr("aria-haspopup");this.$("inner").removeAttr("aria-activedescendant");this._sPrevSuggValue=null;}};u.prototype._synchronizeSuggestions=function(){this._bShouldRefreshListItems=true;this._refreshItemsDelayed();if(!this.getDomRef()||this._isSuggestionsPopoverOpen()){return;}this._synchronizeSelection();};u.prototype._synchronizeSelection=function(){var i=this.getSelectedKey();if(!i){return;}if(this.getValue()&&!this.getSelectedItem()&&!this.getSelectedRow()){return;}this.setSelectedKey(i);};})();u.prototype.onfocusin=function(E){I.prototype.onfocusin.apply(this,arguments);this.addStyleClass("sapMInputFocused");if(!this._bUseDialog&&this._isSuggestionsPopoverOpen()){this.closeValueStateMessage();}if(!this._bPopupHasFocus&&!this.getStartSuggestion()&&!this.getValue()&&this.getShowSuggestion()){this._triggerSuggest(this.getValue());}this._bPopupHasFocus=undefined;this._sPrevSuggValue=null;};u.prototype.oncompositionend=function(E){I.prototype.oncompositionend.apply(this,arguments);if(this._oSuggPopover&&!d.browser.edge&&!d.browser.firefox){this._oSuggPopover._handleTypeAhead();}};u.prototype.onsapshow=function(E){if(!this.getEnabled()||!this.getEditable()||!this.getShowValueHelp()){return;}this.bValueHelpRequested=true;this._fireValueHelpRequest(false);E.preventDefault();E.stopPropagation();};u.prototype.onsaphide=u.prototype.onsapshow;u.prototype.onsapselect=function(E){this._fireValueHelpRequestForValueHelpOnly();};u.prototype.onfocusout=function(E){I.prototype.onfocusout.apply(this,arguments);this.removeStyleClass("sapMInputFocused");this.closeValueStateMessage(this);this.$("SuggDescr").text("");};u.prototype._hasTabularSuggestions=function(){return!!(this.getAggregation("suggestionColumns")&&this.getAggregation("suggestionColumns").length);};u.prototype._getSuggestionsTable=function(){if(this._bIsBeingDestroyed){return this._oSuggestionTable;}if(!this._oSuggestionTable){this._oSuggestionTable=new T(this.getId()+"-popup-table",{mode:s.SingleSelectMaster,showNoData:false,showSeparators:t.None,width:"100%",enableBusyIndicator:false,rememberSelections:false,itemPress:function(E){if(d.system.desktop){this.focus();}this._oSuggPopover._bSuggestionItemTapped=true;var i=E.getParameter("listItem");this.setSelectionRow(i,true);}.bind(this)});this._oSuggestionTable.addEventDelegate({onAfterRendering:function(){var i,v;if(!this.getEnableSuggestionsHighlighting()){return;}i=this._oSuggestionTable.$().find('tbody .sapMLabel');v=(this._sTypedInValue||this.getValue()).toLowerCase();this._oSuggPopover.highlightSuggestionItems(i,v);}.bind(this)});if(this._bUseDialog){this._oSuggestionTable.addStyleClass("sapMInputSuggestionTableHidden");}this._oSuggestionTable.updateItems=function(){T.prototype.updateItems.apply(this,arguments);this._refreshItemsDelayed();return this;};}return this._oSuggestionTable;};u.prototype.clone=function(){var i=e.prototype.clone.apply(this,arguments),v;v=this.getBindingInfo("suggestionColumns");if(v){i.bindAggregation("suggestionColumns",q.extend({},v));}v=this.getBindingInfo("suggestionRows");if(v){i.bindAggregation("suggestionRows",q.extend({},v));}i.setRowResultFunction(this._fnRowResultFilter);i.setValue(this.getValue());return i;};u.prototype.setValue=function(v){this._iSetCount++;I.prototype.setValue.call(this,v);this._onValueUpdated(v);return this;};u.prototype.setDOMValue=function(v){this._$input.val(v);};u.prototype.getDOMValue=function(){return this._$input.val();};u.prototype.updateInputField=function(N){if(this._isSuggestionsPopoverOpen()&&this._bUseDialog){this._oSuggPopover._oPopupInput.setValue(N);this._oSuggPopover._oPopupInput._doSelect();}else{N=this._getInputValue(N);this.setDOMValue(N);this.onChange(null,null,N);}};u.prototype.getAccessibilityInfo=function(){var i=I.prototype.getAccessibilityInfo.apply(this,arguments);i.description=((i.description||"")+" "+this.getDescription()).trim();return i;};u.prototype.preventChangeOnFocusLeave=function(E){return this.bFocusoutDueRendering||this.bValueHelpRequested;};u.prototype._getShowMoreButton=function(){return this._oShowMoreButton||(this._oShowMoreButton=new B({text:this._oRb.getText("INPUT_SUGGESTIONS_SHOW_ALL"),press:this._getShowMoreButtonPress.bind(this)}));};u.prototype._getShowMoreButtonPress=function(){var i;if(this.getShowTableSuggestionValueHelp()){if(this._oSuggPopover._sTypedInValue){i=this._oSuggPopover._sTypedInValue;this.updateDomValue(i);this._oSuggPopover._resetTypeAhead();this._oSuggPopover._sTypedInValue=i;}this._fireValueHelpRequest(true);this._oSuggPopover._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();}};u.prototype._addShowMoreButton=function(i){var v=this._oSuggPopover&&this._oSuggPopover._oPopover;if(!v||!i&&!this._hasTabularSuggestions()){return;}if(v.isA("sap.m.Dialog")){var w=this._getShowMoreButton();v.setEndButton(w);}else{var x=this._getButtonToolbar();v.setFooter(x);}};u.prototype._removeShowMoreButton=function(){var i=this._oSuggPopover&&this._oSuggPopover._oPopover;if(!i||!this._hasTabularSuggestions()){return;}if(i.isA("sap.m.Dialog")){i.setEndButton(null);}else{i.setFooter(null);}};u.prototype._getButtonToolbar=function(){var i=this._getShowMoreButton();return this._oButtonToolbar||(this._oButtonToolbar=new g({content:[new h(),i]}));};u.prototype._hasShowSelectedButton=function(){return false;};u.prototype._createSuggestionPopupContent=function(i){if(this._bIsBeingDestroyed||this._getSuggestionsPopover()._oList){return;}this._oSuggPopover._createSuggestionPopupContent(i);if(!this._hasTabularSuggestions()&&!i){this._oSuggPopover._oList.attachItemPress(function(E){if(d.system.desktop){this.focus();}var v=E.getParameter("listItem");if(!v.isA("sap.m.GroupHeaderListItem")){this._oSuggPopover._bSuggestionItemTapped=true;this.setSelectionItem(v._oItem,true);}},this);}else{if(this._fnFilter===f._DEFAULTFILTER){this._fnFilter=u._DEFAULTFILTER_TABULAR;}if(!this._fnRowResultFilter){this._fnRowResultFilter=u._DEFAULTRESULT_TABULAR;}if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton(i);}}};u.prototype._createPopupInput=function(){var i=new u(this.getId()+"-popup-input",{width:"100%",valueLiveUpdate:true,showValueStateMessage:false,valueState:this.getValueState(),showValueHelp:this.getShowValueHelp(),valueHelpRequest:function(E){this.fireValueHelpRequest({fromSuggestions:true});this._oSuggPopover._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();}.bind(this),liveChange:function(E){var v=E.getParameter("newValue");this.setDOMValue(this._getInputValue(this._oSuggPopover._oPopupInput.getValue()));this._triggerSuggest(v);this.fireLiveChange({value:v,newValue:v});}.bind(this)});return i;};u.prototype._modifyPopupInput=function(i){i.addEventDelegate({onsapenter:function(){if(this.getAutocomplete()){this._oSuggPopover._finalizeAutocomplete();}this._closeSuggestionPopup();}},this);return i;};u.prototype.forwardEventHandlersToSuggPopover=function(i){i.setOkPressHandler(this._closeSuggestionPopup.bind(this));i.setCancelPressHandler(this._closeSuggestionPopup.bind(this));};u.prototype._getSuggestionsPopover=function(){if(!this._oSuggPopover){var i=this._oSuggPopover=new f(this);if(this._bUseDialog){var v=this._createPopupInput();i._oPopupInput=this._modifyPopupInput(v);}this._oSuggPopover.setInputLabels(this.getLabels.bind(this));this._createSuggestionsPopoverPopup();this.forwardEventHandlersToSuggPopover(i);this._updateSuggestionsPopoverValueState();i._bAutocompleteEnabled=this.getAutocomplete();i.attachEvent(f.M_EVENTS.SELECTION_CHANGE,function(E){var N=E.getParameter("newValue");this.setDOMValue(N);this._sSelectedSuggViaKeyboard=N;this._doSelect();},this);if(this.getShowTableSuggestionValueHelp()){this._addShowMoreButton();}}return this._oSuggPopover;};u.prototype._createSuggestionsPopoverPopup=function(){if(!this._oSuggPopover){return;}var i=this._oSuggPopover;i._createSuggestionPopup({showSelectedButton:this._hasShowSelectedButton()});var v=i._oPopover;if(this._bUseDialog){v.attachBeforeClose(function(){this.setDOMValue(this._getInputValue(i._oPopupInput.getValue()));this.onChange();if(this instanceof sap.m.MultiInput&&this._bUseDialog){this._onDialogClose();}},this).attachAfterClose(function(){var w=i._oList;if(!w){return;}if(T&&!(w instanceof T)){w.destroyItems();}else{w.removeSelections(true);}}).attachAfterOpen(function(){this._triggerSuggest(this.getValue());this._refreshListItems();},this).attachBeforeOpen(function(){i._oPopupInput.setPlaceholder(this.getPlaceholder());i._oPopupInput.setMaxLength(this.getMaxLength());i._oPopupInput.setValue(this.getValue());},this);}else{v.attachAfterClose(function(){this._updateSelectionFromList();var w=i._oList;if(!w){return;}if(w instanceof T){w.removeSelections(true);}else{w.destroyItems();}i._deregisterResize();},this).attachBeforeOpen(function(){i._sPopoverContentWidth=this.getMaxSuggestionWidth();i._bEnableHighlighting=this.getEnableSuggestionsHighlighting();i._bAutocompleteEnabled=this.getAutocomplete();i._bIsInputIncrementalType=this._isIncrementalType();this._sBeforeSuggest=this.getValue();i._resizePopup();i._registerResize();},this);}this.setAggregation("_suggestionPopup",v);this._oSuggestionPopup=v;};u.prototype.showItems=function(F){var i,v,w=this._fnFilter;if(!this.getEnabled()||!this.getEditable()){return;}this.setFilterFunction(F||function(){return true;});this._clearSuggestionPopupItems();i=this._getFilteredSuggestionItems(this.getDOMValue());v=this._fillSimpleSuggestionPopupItems(i);if(v>0){this._openSuggestionPopup();}else{this._hideSuggestionPopup();}this._applySuggestionAcc(v);this.setFilterFunction(w);};u.prototype.shouldValueStateMessageBeOpened=function(){var i=I.prototype.shouldValueStateMessageBeOpened.apply(this,arguments);if(!i||this._isSuggestionsPopoverOpen()){return false;}return true;};u.prototype._isSuggestionsPopoverOpen=function(){return this._oSuggPopover&&this._oSuggPopover.isOpen();};u.prototype._openSuggestionsPopover=function(){this.closeValueStateMessage();this._updateSuggestionsPopoverValueState();this._oSuggPopover._oPopover.open();};u.prototype._updateSuggestionsPopoverValueState=function(){var i=this._oSuggPopover,v=this.getValueState();if(i){i.updateValueState(v,this.getValueStateText(),this.getShowValueStateMessage());if(this._bUseDialog){i._oPopupInput.setValueState(v);}}};u.prototype.setShowValueHelp=function(i){this.setProperty("showValueHelp",i);if(this._oSuggPopover&&this._oSuggPopover._oPopupInput){this._oSuggPopover._oPopupInput.setShowValueHelp(i);}return this;};u.prototype.setValueState=function(v){I.prototype.setValueState.apply(this,arguments);this._updateSuggestionsPopoverValueState();return this;};u.prototype.setValueStateText=function(v){I.prototype.setValueStateText.apply(this,arguments);this._updateSuggestionsPopoverValueState();return this;};u.prototype.setShowValueStateMessage=function(i){I.prototype.setShowValueStateMessage.apply(this,arguments);this._updateSuggestionsPopoverValueState();return this;};return u;});
