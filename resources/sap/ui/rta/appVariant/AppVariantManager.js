/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/rta/appVariant/AppVariantDialog","sap/ui/rta/appVariant/AppVariantUtils","sap/ui/rta/appVariant/Feature","sap/ui/rta/appVariant/S4HanaCloudBackend"],function(M,A,a,R,S){"use strict";var b=M.extend("sap.ui.rta.appVariant.AppVariantManager",{metadata:{library:"sap.ui.rta",properties:{rootControl:{type:"sap.ui.core.Control"},commandSerializer:{type:"object"},layer:{type:"string"}}}});b.prototype._openDialog=function(c,C){var d=new A("appVariantDialog");d.attachCreate(c);d.attachCancel(C);d.attachAfterClose(function(){this.destroy();});d.open();return d;};b.prototype._prepareAppVariantData=function(d,p){return{idRunningApp:d["sap.app"].id,title:p.title,subTitle:p.subTitle,description:p.description,icon:p.icon,inbounds:d["sap.app"].crossNavigation&&d["sap.app"].crossNavigation.inbounds?d["sap.app"].crossNavigation.inbounds:null};};b.prototype.createAllInlineChanges=function(o){var s=a.getId(o.idRunningApp);var c=[];var p;p=a.getInlinePropertyChange("title",o.title);c.push(a.createInlineChange(p,"appdescr_app_setTitle",this.getRootControl()));p=a.getInlinePropertyChange("subtitle",o.subTitle);c.push(a.createInlineChange(p,"appdescr_app_setSubTitle",this.getRootControl()));p=a.getInlinePropertyChange("description",o.description);c.push(a.createInlineChange(p,"appdescr_app_setDescription",this.getRootControl()));p=a.getInlineChangeInputIcon(o.icon);c.push(a.createInlineChange(p,"appdescr_ui_setIcon",this.getRootControl()));var i=a.getInboundInfo(o.inbounds);var C=i.currentRunningInbound;var d=i.addNewInboundRequired;if(C==="customer.savedAsAppVariant"&&d){p=a.getInlineChangeCreateInbound(C);c.push(a.createInlineChange(p,"appdescr_app_addNewInbound",this.getRootControl()));}p=a.getInlineChangeForInboundPropertySaveAs(C,s);c.push(a.createInlineChange(p,"appdescr_app_changeInbound",this.getRootControl()));p=a.getInlineChangeRemoveInbounds(C);c.push(a.createInlineChange(p,"appdescr_app_removeAllInboundsExceptOne",this.getRootControl()));p=a.getInlineChangesForInboundProperties(C,o.idRunningApp,"title",o.title);c.push(a.createInlineChange(p,"appdescr_app_changeInbound",this.getRootControl()));p=a.getInlineChangesForInboundProperties(C,o.idRunningApp,"subTitle",o.subTitle);c.push(a.createInlineChange(p,"appdescr_app_changeInbound",this.getRootControl()));p=a.getInlineChangesForInboundProperties(C,o.idRunningApp,"icon",o.icon);c.push(a.createInlineChange(p,"appdescr_app_changeInbound",this.getRootControl()));return Promise.all(c);};b.prototype.createAppVariant=function(s){var p={id:s,layer:this.getLayer()};return a.createAppVariant(this.getRootControl(),p);};b.prototype.deleteAppVariant=function(s){return a.deleteAppVariant({appId:s},this.getLayer());};b.prototype.processSaveAsDialog=function(d,s){return new Promise(function(r,c){var C=function(o){var p=o.getParameters();var e=this._prepareAppVariantData(d,p);r(e);}.bind(this);var f=function(){if(!s){return R.onGetOverview(true,this.getLayer());}c();}.bind(this);return this._openDialog(C,f);}.bind(this));};b.prototype._clearRTACommandStack=function(){return this.getCommandSerializer().clearCommandStack();};b.prototype.clearRTACommandStack=function(c){var C=this.getCommandSerializer().getCommandStack();if(c&&C.getAllExecutedCommands().length){return this._clearRTACommandStack();}return Promise.resolve();};b.prototype.triggerCatalogPublishing=function(s,r,c){var t=c?a.triggerCatalogAssignment:a.triggerCatalogUnAssignment;return t(s,this.getLayer(),r).catch(function(e){var m=c?"MSG_CATALOG_ASSIGNMENT_FAILED":"MSG_DELETE_APP_VARIANT_FAILED";return a.catchErrorDialog(e,m,s);});};b.prototype.notifyKeyUserWhenPublishingIsReady=function(i,s,c){var o=new S();return o.notifyFlpCustomizingIsReady(i,c).catch(function(e){var m=c?"MSG_TILE_CREATION_FAILED":"MSG_DELETE_APP_VARIANT_FAILED";if(!c&&e.error==="locked"){m="MSG_CATALOGS_LOCKED";}return a.catchErrorDialog(e,m,s);});};b.prototype.showSuccessMessage=function(s){return a.showRelevantDialog(s,true);};return b;},true);
