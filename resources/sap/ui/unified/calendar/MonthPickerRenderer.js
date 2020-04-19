/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/unified/calendar/CalendarDate"],function(C){"use strict";var M={apiVersion:2};M.render=function(r,m){var a=m.getMonth(),b=m.getMonths(),s=0,c=m.getColumns(),t=m.getTooltip_AsString(),l=m._getLocaleData(),I=m.getId(),w="",d=[],e=[],f=m.getPrimaryCalendarType(),i,A,g;if(m._bLongMonth||!m._bNamesLengthChecked){d=l.getMonthsStandAlone("wide",f);}else{d=l.getMonthsStandAlone("abbreviated",f);e=l.getMonthsStandAlone("wide",f);}r.openStart("div",m);r.class("sapUiCalMonthPicker");if(t){r.attr("tooltip",t);}r.accessibilityState(m,{role:"grid",readonly:"true",multiselectable:m.getIntervalSelection(),label:sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified").getText("MONTH_PICKER")});r.openEnd();var h;if(b>12){b=12;}else if(b<12){s=Math.floor(a/b)*b;if(s+b>12){s=12-b;}}if(c>0){w=(100/c)+"%";}else{w=(100/b)+"%";}for(i=0;i<b;i++){var j=i+s,o=C.fromLocalJSDate(new Date(),m.getPrimaryCalendarType());o.setMonth(j,1);m._iYear&&o.setYear(m._iYear);h={role:"gridcell"};if(!m._bLongMonth&&m._bNamesLengthChecked){h["label"]=e[j];}if(c>0&&i%c==0){r.openStart("div");r.accessibilityState(null,{role:"row"});r.openEnd();}r.openStart("div",I+"-m"+(j));r.class("sapUiCalItem");A=m._fnShouldApplySelection(o);g=m._fnShouldApplySelectionBetween(o);if(A){r.class("sapUiCalItemSel");h["selected"]=true;}if(g){r.class("sapUiCalItemSelBetween");h["selected"]=true;}if(!A&&!g){h["selected"]=false;}if(j<m._iMinMonth||j>m._iMaxMonth){r.class("sapUiCalItemDsbl");h["disabled"]=true;}r.attr("tabindex","-1");r.style("width",w);r.accessibilityState(null,h);r.openEnd();r.text(d[j]);r.close("div");if(c>0&&((i+1)%c==0)){r.close("div");}}r.close("div");};return M;},true);
