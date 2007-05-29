var http_request = false;

var gif_url;
// strings containing the names of all active GifDisplays 

/*
var SourceArray = new Array();
SourceArray[0] = "Summary";
SourceArray[1] = "L1TECALTPG";
SourceArray[2] = "HCAL_TPGs";
SourceArray[3] = "L1TRCT";
SourceArray[4] = "GCT";
SourceArray[5] = "RPC";
SourceArray[6] = "CSC";
SourceArray[7] = "DT";
SourceArray[8] = "GMT";
SourceArray[9] = "GT";
SourceArray[10] = "Emulator";
*/

var sourceArray = new Array();
sourceArray[0] = new  SourceObjects("Summary");
sourceArray[1] = new  SourceObjects("L1TECALTPG");
sourceArray[2] = new  SourceObjects("L1TRCT");
sourceArray[3] = new  SourceObjects("GCT");
sourceArray[4] = new  SourceObjects("L1TDTTPG");
sourceArray[5] = new  SourceObjects("L1TGT");
sourceArray[6] = new  SourceObjects("L1TDTTF");
sourceArray[7] = new  SourceObjects("L1TGMT");

//*************************************************************/
//*************************GIF DISPLAYS************************/
//*************************************************************/


// the list of displayFrame objects 
var displays_l = new Array(); 


/*************************************************************/
/*************************************************************/
/*************************************************************/

function getMenuFrameURL()
{
  var url = window.location.href;

  // remove the cgi request from the end of the string
  var index = url.indexOf("?");
  if (index >= 0)
  {
    url = url.substring(0, index);
  }

  index = url.lastIndexOf("menu");
  url = url.substring(0, index);

  // remove the trailing '/' from the end of the string
  index = url.lastIndexOf("/");
  if (index == url.length - 1)
  {
    url = url.substring(0, index);
  }

  return url;
}


/*************************************************************/
/*************************************************************/

function makeMeListRequest(sourceName)
{
  for(var i = 0; i < sourceArray.length; i++){
  if(sourceArray[i].name == sourceName && !(sourceArray[i].status)){
    url = getMeListRequestURL(sourceArray[i].name);
    makeHttpRequest(url, sourceArray[i]);
    sourceArray[i].status=true;
  }
  }
}

/*************************************************************/
/*************************************************************/

function SourceObjects(name)
{ 
  this.name = name;
  this.status = false;
  this.displayStatus = false;
}

/*************************************************************/
/*************************************************************/

function getMeListRequestURL(source)
{

    url = getMenuFrameURL();
   
    url = url + "/Request";
    url = url + "?" + "RequestID=RetrieveMeList";
    url = url + "&" + "Source=" + source;

    return url;
}

/*************************************************************/
/*************************************************************/

/*
  This function submits a generic request in the form of a url
  and calls the receiver_function when the state of the request
  changes.
*/

function makeRequest(url, receiver_function) 
{
  http_request = false;
  if (window.XMLHttpRequest) 
  { 
    http_request = new XMLHttpRequest();
    if (http_request.overrideMimeType)
    {
      http_request.overrideMimeType('text/xml');
    }
  }
  if (!http_request) 
  {
    alert('Giving up :( Cannot create an XMLHTTP instance');
  }
  http_request.onreadystatechange = receiver_function;
  http_request.open('GET', url, true);
  http_request.send(null);

  return;
}

function makeHttpRequest(url, sourceObj) 
{
  http_request = false;
  if (window.XMLHttpRequest) 
  { 
    http_request = new XMLHttpRequest();
    if (http_request.overrideMimeType)
    {
      http_request.overrideMimeType('text/xml');
    }
  }
  if (!http_request) 
  {
    alert('Giving up :( Cannot create an XMLHTTP instance');
  }

  http_request.onreadystatechange = function() {updateMeListRequest(sourceObj);};
  http_request.open('GET', url, true);
  http_request.send(null);

  return;
}

/*************************************************************/
/*************************************************************/
function updateMeListRequest(sourceObj)
{

  if (http_request.readyState == 4) 
  {
    if (http_request.status == 200) 
    {

      var xmldoc;
      var subdirs_l;
      var subscribe_l;
      var unsubscribe_l;

      // Load the xml elements on javascript lists:
      if (http_request != false)
      {
        xmldoc = http_request.responseXML;
        subscribe_l = xmldoc.getElementsByTagName('subscribe');
      }

     if(subscribe_l.length) {

 	var mypar = parent.frames['status'].document.getElementById('formsParId');

 	var myform = parent.frames['status'].document.createElement("form");
  	    myform.setAttribute('name',sourceObj.name);
	    myform.setAttribute('id',sourceObj.name);
	    myform.setAttribute('action',"#");
            myform.onsubmit = function() { return submitSelectedMe(sourceObj);};
	 
	var myline = document.createElement("br");
	

// define check/uncheck all box

	var checkAll = document.createElement('input');
	    checkAll.setAttribute('type',"checkbox");
	    checkAll.setAttribute('name',sourceObj.name);
	    checkAll.setAttribute('id',sourceObj.name);
	    checkAll.setAttribute('value',"checkAll");

	var callToCheckAll = "if(this.checked) checkAll(\"" + sourceObj.name + "\"); else clearAll(\"" + sourceObj.name + "\")";
	    checkAll.setAttribute('onClick',callToCheckAll);

	var checkAllLabel = document.createElement('label');
	
	var checkAllLabeltext = document.createTextNode("Check/Clear All");
 	
	    checkAllLabel.setAttribute("style","color: #463E41; font-weight:bold");
	    checkAllLabel.appendChild(checkAllLabeltext);
 	
 	    myform.appendChild(checkAll);
 	    myform.appendChild(checkAllLabel);

// Define Me boxes

	  for(var i = 0; i < subscribe_l.length; i++)
 	  {
 	    var to_subscribe = subscribe_l.item(i).firstChild.data;
	    var myline = document.createElement("br");
	    var chbox = document.createElement('input');
	    var label = document.createElement('label');
	    var labeltext = document.createTextNode(to_subscribe);
	   
	    chbox.setAttribute('type','checkbox');
	    chbox.setAttribute('name',sourceObj.name);
	    chbox.setAttribute('id',sourceObj.name);
	    chbox.setAttribute('value',to_subscribe);
 	   
 	    label.appendChild(labeltext);
 	    myform.appendChild(myline);
 	    myform.appendChild(chbox);
 	    myform.appendChild(label);

         }

	    
// Write submit button

	    var mydiv = document.createElement("div");
            mydiv.setAttribute('align',"center");

	    var subbutton = document.createElement('input');
	    subbutton.setAttribute('type','submit');
	    subbutton.setAttribute('id',sourceObj.name);
	    subbutton.setAttribute('value','Subscribe!');
            mydiv.appendChild(subbutton);
	    myform.appendChild(mydiv);
            mypar.appendChild(myform);

	    }
      }
      
   }
	
}


/*************************************************************/
/*************************************************************/
// implement checkall box

function checkAll(sourceName){
//	alert(sourceName);
   for (i=0; i<document.forms[0].length; i++)
      if(document.forms[0].elements[i].name == sourceName) document.forms[0].elements[i].checked = true
}

/*************************************************************/
/*************************************************************/
// implement clearall box


function clearAll(sourceName){
//	alert(sourceName);
   for (i=0; i<document.forms[0].length; i++)
      if(document.forms[0].elements[i].name == sourceName) document.forms[0].elements[i].checked = false
}

/*************************************************************/
/*************************************************************/
// loop on selected checkboxes and submit request for display

function submitSelectedMe(currentSource)
{

 
if(currentSource.displayStatus)  return false;

var found = false;
var n=0;
var ntop=100;
var nleft = 100;

     
for (var i = 0; i < parent.frames['status'].document.forms[currentSource.name].elements.length; i++) {
      if((parent.frames['status'].document.forms[currentSource.name].elements[i].value!="checkAll") && 
              (parent.frames['status'].document.forms[currentSource.name].elements[i].checked == true)) // if checked
      {
        
//        alert("submitSelectedMe " );
	n++;
        
	var newframe = parent.frames['display'].document.createElement("iframe"); //add dynamic frame
        
	newframe.id = "frameid" + n;
//        newframe.name = "gifDisplay" + n;
//        newframe.name = currentSource.name;
        newframe.name = parent.frames['status'].document.forms[currentSource.name].elements[i].value;
        newframe.frameborder = 0;

// calculate position

	if(n>0) 
	{ 
	  ntop = 100 + 540*(n-1); 
	  nleft = 100;
	}
	
//	} else if (!(n%2) && n>1)
	
//	{
//	  nleft = 100 + 340;
//	}
	  
	var topPos = ntop.toString();
	var leftPos = nleft.toString();
 	newframe.style.top = topPos + 'px';
 	newframe.style.left = leftPos + 'px';
 	newframe.height = '500px';
 	newframe.width = '700px';
 	newframe.style.position = "absolute";

        parent.frames['display'].document.body.appendChild(newframe);

// create new display object

        displays_l[n-1] = new mydisplayFrame(newframe.name);
        
	displays_l[n-1].meName = parent.frames['status'].document.forms[currentSource.name].elements[i].value; //same name as checkbox value
        displays_l[n-1].sourceName =  parent.frames['status'].document.forms[currentSource.name].elements[i].name; //same name as checkbox value
        displays_l[n-1].frameid = newframe.id; // name of corresponding frame id

// view Me corresponding to the current checkbox
        startMeView(displays_l[n-1]);


        found = true;

     } // consider only checked
  } // end loop on checkboxes
          
    if(!found) {
 
     alert('Please choose at leats 1 element to display!');
     return false;

    } else { 
    
//    parent.frames['status'].document.forms[currentSource.name].disabled = true;
     currentSource.displayStatus = true;
     return false; 
    
    }
  
}

/*************************************************************/
/*************************************************************/


function mydisplayFrame(name)
{
  this.name = "display"+name; // the "display" is to have names and ids for this object different 
                         // from other objects in the page (like the iframes).
  this.frameid = "dummy";
  this.is_viewed = false;
  this.meName = "dummy";
  this.sourceName = "dummy";
}


/*************************************************************/
/*************************************************************/


function startMeView(display)
{

  if (display.is_viewed) 
  {
    alert('This GifViewer is already active');
    return;
  }
  display.is_viewed = true;
  updateMeView(display);
}


/*************************************************************/
/*************************************************************/

function updateMeView(display)
{
  var interval = 5000;
  if (display.is_viewed == true)
  {  
      makeMeDisplayRequest(display);
  
      parent.display.document.getElementById(display.frameid).src = getMeGifURL(display);
  }

//  var this_function_call = "updateMeView(display)";
//  alert(this_function_call);
//  setTimeout(this_function_call, interval);

  setTimeout(function(){updateMeView(display);} , interval);
}

/*************************************************************/
/*************************************************************/

function makeMeDisplayRequest(display)
{
  url = getMeDisplayRequestURL(display);
//  alert(url);
  // pass a reference to the updateGifURL function:
  makeRequest(url, updateMeGifURL); 
}

/*************************************************************/
/*************************************************************/


function getMeDisplayRequestURL(display)  
{
  url = getStatusFrameURL()
  url = url + "/Request";
  url = url + "?" + "RequestID=PlotMeList";
  url = url + "&" + "Source=" + display.sourceName;
  url = url + "&" + "View=" + display.meName;
  url = url + "&" + "DisplayFrameName=" + display.name;
//	alert(display.sourceName);


  return url;
}

/*************************************************************/
//*************************************************************/

function updateMeGifURL()
{
  if (http_request.readyState == 4) 
   {
    if (http_request.status == 200) 
    {
      var xmldoc;

       // Load the xml elements on javascript lists:
      if (http_request != false)
      {
        xmldoc  = http_request.responseXML;

        gif_url = xmldoc.getElementsByTagName('fileURL').item(0).firstChild.data;
      }
    }
  }
}

/*************************************************************/
//*************************************************************/


function getStatusFrameURL()
{
  var url = window.location.href;
//  alert(url);

  // remove the cgi request from the end of the string
  var index = url.indexOf("?");
  if (index >= 0)
  {
    url = url.substring(0, index);
  }

  index = url.lastIndexOf("menu");
  url = url.substring(0, index);

  // remove the trailing '/' from the end of the string
  index = url.lastIndexOf("/");
  if (index == url.length - 1)
  {
    url = url.substring(0, index);
  }

  return url;
}


/*************************************************************/
//*************************************************************/

function getMeGifURL(display)
{
  var url = mygetContextURL();
  url = url + "/temporary/" + display.name + ".gif";
  return url;
}


/*************************************************************/
//*************************************************************/

function mygetContextURL()
{
  var app_url = getStatusURL();
  var index = app_url.lastIndexOf("/");
  return app_url.substring(0, index);
}

/*************************************************************/
//*************************************************************/

function getStatusURL()
{
  var url = window.location.href;

  // remove the cgi request from the end of the string
  var index = url.indexOf("?");
  if (index >= 0)
  {
    url = url.substring(0, index);
  }

  index = url.lastIndexOf("status");
  url = url.substring(0, index);

  // remove the trailing '/' from the end of the string
  index = url.lastIndexOf("/");
  if (index == url.length - 1)
  {
    url = url.substring(0, index);
  }

  return url;
}

/*************************************************************/
/*************************************************************/
/*
function getSourceRequestStatus(source)
{ 
    for(loop on the list){
       if (document.getElementById(sourceList).name == source) 
       return document.getElementById(sourceList).status;
    }
}
*/
/*************************************************************/
/*************************************************************/
