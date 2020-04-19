/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/integration/designtime/baseEditor/util/isValidBindingString","sap/base/util/restricted/_uniq"],function(B,i,_){"use strict";var L=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.listEditor.ListEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.listEditor.ListEditor",renderer:B.getMetadata().getRenderer().render});L.prototype._onTokenUpdate=function(e){this._setTokens(e.getParameter("addedTokens").map(function(t){return t.getText();}),e.getParameter("removedTokens").map(function(t){return t.getText();}));};L.prototype._onTokenSubmission=function(e){if(this._setTokens([e.getParameter("value")],[])){this.getContent().setValue("");}};L.prototype._onLiveChange=function(e){var v=e.getParameter("newValue");this._validate(v);};L.prototype._setTokens=function(a,r){var v=(this.getValue()||[]).filter(function(t){return r.indexOf(t)<0;});var n=_(v.concat(a.filter(function(N){return this._validate(N);},this)));if(r.length||n.length!==v.length){this.setValue(n);this._setInputState(true);return true;}this._setInputState(false,this.getI18nProperty("BASE_EDITOR.LIST.DUPLICATE_ENTRY"));return false;};L.prototype._validate=function(t){var I=i(t);this._setInputState(I,this.getI18nProperty("BASE_EDITOR.STRING.INVALID_BINDING"));return I;};L.prototype._setInputState=function(I,e){var o=this.getContent();if(I){o.setValueState("None");}else{o.setValueState("Error");o.setValueStateText(e||"Unknown Error");}};return L;});