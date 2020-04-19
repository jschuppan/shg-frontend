/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/strings/capitalize","sap/ui/fl/registry/ChangeHandlerRegistration"],function(L,c,C){"use strict";var a={};a._aChangeHandlerSettings=[];["addODataField","addODataFieldWithLabel"].forEach(function(s){["2.0","1.0"].forEach(function(v){a._aChangeHandlerSettings.push({key:{scenario:s,oDataServiceVersion:v},content:{requiredLibraries:{"sap.ui.comp":{minVersion:"1.48",lazy:false}}},scenarioInitialized:false});});});a.addChangeHandlerSettings=function(k,s){var n;if(!(k&&s)){throw new Error('New entry in ChangeHandlerMediator requires a key and settings');}n={key:k,content:s,scenarioInitialized:false};return this.getChangeHandlerSettings(k,true).then(function(e){var i=this._aChangeHandlerSettings.indexOf(e);if(i>-1){Object.assign(this._aChangeHandlerSettings[i].content,n.content);this._aChangeHandlerSettings[i].scenarioInitialized=false;}else{this._aChangeHandlerSettings.push(n);return this._createChangeHandlerSettingsGetter(n);}}.bind(this));};a.getChangeHandlerSettings=function(k,s){var K=Object.keys(k);var f;if(K.length>0){f=this._aChangeHandlerSettings.filter(function(e){var E=Object.keys(e.key);if(E.length===K.length){var m=K.filter(function(b){if(e.key[b]===k[b]){return true;}});if(m.length===K.length){return true;}}})[0];if(!s&&f&&!f.scenarioInitialized){return this._initializeScenario(f).then(function(){return f;}).catch(function(){return undefined;});}}return Promise.resolve(f);};a._initializeScenario=function(f){var l=[];if(f.content.requiredLibraries){var b=Object.keys(f.content.requiredLibraries);b.forEach(function(s){var d=s;var o=sap.ui.getCore().loadLibrary(s,{async:true}).catch(function(){L.warning("Required library not available: "+d+" - "+f.key.scenario+" could not be initialized");return Promise.reject();}).then(function(){return C.waitForChangeHandlerRegistration(d);});l.push(o);});return Promise.all(l).then(function(){f.scenarioInitialized=true;});}return Promise.resolve();};a._createChangeHandlerSettingsGetter=function(m){var g='get'+c(m.key.scenario)+'Settings';if(!a[g]){a[g]=function(o){var O;try{O=o.getModel().getMetaModel().getProperty("/dataServices/dataServiceVersion");}catch(e){L.warning("Data service version could not be retrieved");}return this.getChangeHandlerSettings({scenario:m.key.scenario,oDataServiceVersion:O}).then(function(f){if(f&&f.content&&f.content.createFunction){return f;}});};}};a._aChangeHandlerSettings.forEach(function(m){a._createChangeHandlerSettingsGetter(m);});return a;},true);
