/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/base/util/deepClone","sap/base/util/deepEqual","sap/base/util/ObjectPath","sap/ui/model/json/JSONModel","sap/base/util/restricted/_merge","sap/ui/integration/designtime/baseEditor/util/binding/resolveBinding","sap/ui/integration/designtime/baseEditor/util/unset"],function(B,d,a,O,J,_,r,u){"use strict";var A=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.arrayEditor.ArrayEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.arrayEditor.ArrayEditor",metadata:{properties:{value:{type:"any"}}},renderer:B.getMetadata().getRenderer().render});A.prototype.init=function(){this._itemsModel=new J();this._itemsModel.setDefaultBindingMode("OneWay");this.setModel(this._itemsModel,"itemsModel");this.attachValueChange(function(e){var v=e.getParameter("value");var c=this.getConfig();if(c.template){var i=[];v.forEach(function(V,I){var o=d(V);var m={itemLabel:c.itemLabel||this.getI18nProperty("BASE_EDITOR.ARRAY.ITEM_LABEL"),index:I,total:v.length,properties:Object.keys(c.template).map(function(k){var t=c.template[k];var P=I+"/"+t.path;var b=O.get(P.split("/"),v);if(typeof b==="undefined"){O.set(t.path.split('/'),d(t.defaultValue),o);}return _({},t,{path:P,value:b});},this)};var p=new J(o);m.properties=r(m.properties,{"":p},{"":p.getContext("/")},["template","value"]);p.destroy();i.push(m);},this);this._itemsModel.setData(i);}},this);};A.prototype.setValue=function(v){v=Array.isArray(v)?v:[];B.prototype.setValue.call(this,v);};A.prototype.getExpectedWrapperCount=function(v){return v.length;};A.prototype._removeItem=function(e){var i=e.getSource().data("index");var v=(this.getValue()||[]).slice();v.splice(i,1);this.setValue(v);};A.prototype._addItem=function(){var c=this.getConfig();var v=(this.getValue()||[]).slice();var D={};Object.keys(c.template).forEach(function(k){var p=c.template[k];if(p.type==="array"){D[k]=[];}});v.push(D);this.setValue(v);};A.prototype._moveUp=function(e){var i=e.getSource().data("index");if(i>0){var v=this.getValue().slice();var R=v.splice(i,1)[0];v.splice(i-1,0,R);this.setValue(v);}};A.prototype._moveDown=function(e){var i=e.getSource().data("index");var v=this.getValue().slice();if(i<v.length-1){var R=v.splice(i,1)[0];v.splice(i+1,0,R);this.setValue(v);}};A.prototype._propertyEditorsChange=function(e){e.getParameter("previousPropertyEditors").forEach(function(p){p.detachValueChange(this._onPropertyValueChange,this);},this);e.getParameter("propertyEditors").forEach(function(p){p.attachValueChange(this._onPropertyValueChange,this);},this);};A.prototype._onPropertyValueChange=function(e){var p=e.getSource();var E=d(this.getValue()||[]);var P=e.getParameter("path");var b=P.split("/");var v=e.getParameter("value");O.set(b,v,E);if(typeof v==="undefined"||a(v,p.getConfig().defaultValue)){u(b,E);}this.setValue(E);};return A;});
