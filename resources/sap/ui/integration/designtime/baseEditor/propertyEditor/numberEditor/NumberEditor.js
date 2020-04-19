/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/integration/designtime/baseEditor/util/isValidBindingString","sap/ui/core/format/NumberFormat"],function(B,i,N){"use strict";var a=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.numberEditor.NumberEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.numberEditor.NumberEditor",invalidInputError:"BASE_EDITOR.NUMBER.INVALID_BINDING_OR_NUMBER",renderer:B.getMetadata().getRenderer().render});a.prototype.formatValue=function(v){if(v==null||i(v,false)){return v;}var n=parseFloat(v);if(!this.validateNumber(n)){this._setValueState(false,this.getI18nProperty(this.invalidInputError));return v;}this._setValueState(true);return this.getFormatterInstance().format(n);};a.prototype.setValue=function(v){this._parseAndSetValue(v,false,true);};a.prototype._onLiveChange=function(e){this._parseAndSetValue(e.getParameter("newValue"),true,false);};a.prototype._parseAndSetValue=function(v,I,A){var p=I?this._parseAndValidateLocalized(v):this._parseAndValidate(v);this._setValueState(!!(!v||p),this.getI18nProperty(this.invalidInputError));if(!v||p||A){B.prototype.setValue.call(this,p||v);}};a.prototype.validateNumber=function(v){return!isNaN(v);};a.prototype.getFormatterInstance=function(){return N.getFloatInstance();};a.prototype._parseAndValidate=function(v){if(!v||i(v,false)){return v;}var n=parseFloat(v);return this.validateNumber(n)?n:undefined;};a.prototype._parseAndValidateLocalized=function(v){if(!v||i(v,false)){return v;}var n=this.getFormatterInstance().parse(v);return this.validateNumber(n)?n:undefined;};a.prototype._setValueState=function(I,e){var o=this.getContent();if(I){o.setValueState("None");}else{o.setValueState("Error");o.setValueStateText(e);}};return a;});
