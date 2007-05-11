var navigator_current = "top";
var contentViewer_current = "top";
var http_request = false;

var gif_url;
var view_all_contents = true;
// strings containing the names of all active GifDisplays 
var active_displays_l = new Array(); 

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

//*************************************************************/
//*************************GIF DISPLAYS************************/
//*************************************************************/

// the current displayFrame
var current_display;

// the list of displayFrame objects 
var displays_l = new Array(); 

function displayFrame(name)
{
  this.name = name;
  this.is_viewed = false;
  this.viewed_l = new Array();
}

/*
  This function is called onload. It creates the list of 
  displayFrame objects.
*/

function fillDisplayList()
{
  var iframes_l = parent.frames['display'].document.getElementsByTagName("iframe");
  for (i = 0; i < iframes_l.length; i++)
  {
//    alert("Ecchime!");
    displays_l[i] = new displayFrame(iframes_l[i].id);
  }

  // the default current is the first:
  current_display = displays_l[0];
}

function makeCurrent(display_frame_name)
{
  for (i = 0; i < displays_l.length; i++)
  {
    if (displays_l[i].name == display_frame_name)
    {
      break;
    }
  }
  current_display = displays_l[i];
}


//*************************************************************/
//**********************GENERIC FUNCTIONS**********************/
//*************************************************************/

/*
  This function should return the url of the application webpage
  without asking the server...
*/

function getApplicationURL()
{
  var url = window.location.href;

  // remove the cgi request from the end of the string
  var index = url.indexOf("?");
  if (index >= 0)
  {
    url = url.substring(0, index);
  }

  index = url.lastIndexOf("general");
  url = url.substring(0, index);

  // remove the trailing '/' from the end of the string
  index = url.lastIndexOf("/");
  if (index == url.length - 1)
  {
    url = url.substring(0, index);
  }

  return url;
}

function getContextURL()
{
  var app_url = getApplicationURL();
  var index = app_url.lastIndexOf("/");
  return app_url.substring(0, index);
}


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

function dummy()
{
}

//*************************************************************/
//*************************NAVIGATOR***************************/
//*************************************************************/
/* 
  This function returns the URL that should be loaded as
  a result of clicks on the drop down menus of the navigator form.
*/

function getNavigatorRequestURL()
{
  var form = document.getElementById("NavigatorForm");
  var open = form.Open;
  var subscribe   = form.Subscribe;
  var unsubscribe = form.Unsubscribe;

  url = getApplicationURL();

  if (open.value != "")
  {
    url = url + "/Request"
    url = url + "?" + "RequestID=Open";
    url = url + "&" + "Current=" + navigator_current;
    url = url + "&" + "Open=" + open.value;
  }
  else if (subscribe.value != "")
  {
    url = url + "/Request";
    url = url + "?" + "RequestID=Subscribe";
    url = url + "&" + "Current=" + navigator_current;
    url = url + "&" + "SubscribeTo=" + subscribe.value;
  }
  else if (unsubscribe.value != "")
  {
    url = url + "/Request";
    url = url + "?" + "RequestID=Unsubscribe";
    url = url + "&" + "Current=" + navigator_current;
    url = url + "&" + "UnsubscribeFrom=" + unsubscribe.value;
  }
  return url;
}

//*************************************************************/

/*
  This function updates the navigator drop down menus according
  to the xml of the server response.
*/

function updateNavigator()
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
        navigator_current = xmldoc.getElementsByTagName('current').item(0).firstChild.data;
        subdirs_l = xmldoc.getElementsByTagName('open');
        subscribe_l = xmldoc.getElementsByTagName('subscribe');
        unsubscribe_l = xmldoc.getElementsByTagName('unsubscribe');
      }

      var form = document.getElementById("NavigatorForm");
      var open = form.Open;
      var subscribe   = form.Subscribe;
      var unsubscribe = form.Unsubscribe;

      // Update the Open menu:
      open.options.length = 0;

      open.options[0] = new Option("", "", true, true);
      open.options[1] = new Option("top", "top", false, false);
      for(var i = 0; i < subdirs_l.length; i++)
      {
        var to_open = subdirs_l.item(i).firstChild.data;
        open.options[i + 2] = new Option(to_open, to_open, false, false);
      }
      open.selectedIndex = 0;

      // Update the Subscribe menu:
      subscribe.options.length = 0;
      subscribe.options[0] = new Option("", "", true, true);
      for(var i = 0; i < subscribe_l.length; i++)
      {
        var to_subscribe = subscribe_l.item(i).firstChild.data;
        subscribe.options[i + 1] = new Option(to_subscribe, to_subscribe, false, false);
      }
      subscribe.selectedIndex = 0;

      // Update the Unsubscribe menu:
      unsubscribe.options.length = 0;
      unsubscribe.options[0] = new Option("", "", true, true);
      for(var i = 0; i < unsubscribe_l.length; i++)
      {
        var to_unsubscribe = unsubscribe_l.item(i).firstChild.data;
        unsubscribe.options[i + 1] = new Option(to_unsubscribe, to_unsubscribe, false, false);
      }
      unsubscribe.selectedIndex = 0;
    }
  }
}

/*************************************************************/

function makeNavigatorRequest()
{
  url = getNavigatorRequestURL();

  // pass a reference to the updateNavigator function:
  makeRequest(url, updateNavigator); 
}


//*************************************************************/
//************************CONFIG BOX***************************/
//*************************************************************/

function submitConfigure(url, myform)
{
  navigator_form = false;
  url = url + "/Request";
  url = url + "?" + "RequestID=Configure";
  url = url + "&" + "Hostname=" + myform.Hostname.value;
  url = url + "&" + "Port=" + myform.Port.value;
  url = url + "&" + "Clientname=" + myform.Name.value;

  var funct = alertContents;
  makeRequest(url, funct);
}

//*************************************************************/

function alertContents() 
{
  if (http_request.readyState == 4) 
  {
    if (http_request.status == 200) 
    {
      alert("Configuration Submitted");
    }
    else 
    {
      alert('There was a problem with the request.');
    }
  }
}


//*************************************************************/
//***********************GIF DISPLAY***************************/
//*************************************************************/

/*
  Returns true if the display frame provided as an argument 
  is currently being viewed.
*/

function isViewed(display_frame_name)
{
  for (i = 0; i < active_displays_l.length; i++)
  { 
    if (active_displays_l[i] == display_frame_name) 
    {
      return true; 
    }
  }
  return false;
}

//*************************************************************/

/*
  These functions get called if the user clicks on the "start viewing"
  or "stop viewing" buttons of a display frame. They set the is_viewed
  field of the displayFrame object.
*/

function getDisplayFrame(display_frame_name)
{
  for (i = 0; i < displays_l.length; i++)
  {
    if (displays_l[i].name == display_frame_name) {
//     alert("getDisplayFrame "+display_frame_name);
     return displays_l[i];
     }
  }
}

function startViewing(display_frame_name)
{
  alert("startViewing "+display_frame_name);
  var display = getDisplayFrame(display_frame_name);

  if (display.is_viewed) 
  {
    alert('This GifViewer is already active');
    return;
  }

  display.is_viewed = true;
  alert("startViewing "+ display.name);
  updateDisplay(display_frame_name);
}

function stopViewing(display_frame_name)
{
  var display = getDisplayFrame(display_frame_name);
  display.is_viewed = false;
}

//*************************************************************/

/*
  This function is initially called when the "start viewing" button
  of a display frame is pressed and keeps calling itself every 
  [interval] msec, refreshing the frame until it becomes inactive. 
*/

function updateDisplay(display_frame_name)
{
  var interval = 5000;
  var display_frame = getDisplayFrame(display_frame_name);

  if (display_frame.is_viewed == true)
  {  
  alert("updateDisplay "+display_frame_name);
    makeDisplayRequest(display_frame_name);
    if (display_frame.viewed_l.length != 0)
    {
      window.frames[display_frame_name].location.href = getGifURL(display_frame_name);
    }
  }
  var this_function_call = "updateDisplay('" + display_frame_name + "')";
  setTimeout(this_function_call, interval);
}

//*************************************************************/

function getGifURL(display_frame_name)
{
  var url = getContextURL();
  url = url + "/temporary/" + display_frame_name + ".gif";
//        alert("getGifURL: " + url);
  return url;
}

//*************************************************************/

function getDisplayRequestURL(display_frame_name)  
{
  url = getApplicationURL();
  url = url + "/Request"
  url = url + "?" + "RequestID=Draw"
  url = url + "&" + "Current=" + contentViewer_current;
  url = url + "&" + "DisplayFrameName=" + display_frame_name;

  var display_frame = getDisplayFrame(display_frame_name);
  for (i = 0; i < display_frame.viewed_l.length; i++)
  {
    url = url + "&" + "View=" + display_frame.viewed_l[i];
  }
        alert("getContentViewerRequestURL: " + url);
  return url;
}

//*************************************************************/

function makeDisplayRequest(display_frame_name)
{
  url = getDisplayRequestURL(display_frame_name);
  // pass a reference to the updateGifURL function:
  makeRequest(url, updateGifURL); 
}

//*************************************************************/

function updateGifURL()
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


//*************************************************************/
//**********************CONTENT VIEWER*************************/
//*************************************************************/

/* 
  This function updates the ContentViewer "Unview" field
  after the user chooses to view or stop viewing something
*/

function updateContentViewerNoRequest()
{
  var form = document.getElementById("ContentViewerForm");
  var view = form.View;
  var unview = form.Unview;

  // first updated the list of viewed MEs
  updateViewedList();

  // then update the Unview menu, based on the updated list:
  unview.options.length = 0;
  unview.options[0] = new Option("", "", true, true);
  var viewed_from_current = getViewedFromDir(contentViewer_current);
  for (var i = 0; i < viewed_from_current.length; i++)
  {
    unview.options[i + 1] = new Option(viewed_from_current[i], viewed_from_current[i], false, false);
  }
  unview.selectedIndex = 0;

  // clear the lingering selection from the "View" menu
  view.selectedIndex = 0;
}

function updateViewedList()
{
  var form = document.getElementById("ContentViewerForm");
  var view   = form.View;
  var unview = form.Unview;

  if (view.value != "")
  {
    var addition = view.value;
    viewedListAdd(addition);
  }
  else if (unview.value != "")
  {
    var removal = unview.value;
    viewedListRemove(removal);
  }
}

//*************************************************************/

/*
  These functions add/remove something to/from the viewed_l.
*/

function viewedListAdd(addition)
{
  for (i = 0; i < current_display.viewed_l.length; i++)
  { 
    if (addition == current_display.viewed_l[i]) 
    {
      return; 
    }
  }
  current_display.viewed_l[current_display.viewed_l.length] = addition;
}

function viewedListRemove(removal)
{
  for (i = 0; i < current_display.viewed_l.length; i++)
  {
    if (removal == current_display.viewed_l[i])
    {
      current_display.viewed_l.splice(i, 1);
    }
  }
}

//*************************************************************/

function makeContentViewerRequest()
{
  url = getContentViewerRequestURL();
  makeRequest(url, updateContentViewer);
}

//*************************************************************/

function getContentViewerRequestURL()
{
  var form = document.getElementById("ContentViewerForm");
  var open = form.Open;

  url = getApplicationURL();

  if (open.value != "")
  {
    url = url + "/Request";
    url = url + "?RequestID=ContentsOpen";
    url = url + "&" + "Current=" + contentViewer_current;
    url = url + "&" + "Open=" + open.value;
  }

  return url;
}

//*************************************************************/

/*
  This function updates the fields of the content viewer widget
  after an "ContentViewerOpen" request.
*/

function updateContentViewer()
{
  if (http_request.readyState == 4) 
  {
    if (http_request.status == 200) 
    {
      var xmldoc;
      var subdirs_l;
      var view_l;
      var unview_l;

      // Load the xml elements on javascript lists:
      if (http_request != false)
      {
        xmldoc = http_request.responseXML;

        // set the contentViewer_current first:
        contentViewer_current = xmldoc.getElementsByTagName('current').item(0).firstChild.data;

        subdirs_l = xmldoc.getElementsByTagName('open');
        view_l = xmldoc.getElementsByTagName('view');
      }

      // get references to the form elements so that we can update them
      var form = document.getElementById("ContentViewerForm");
      var open = form.Open;
      var view = form.View;
      var unview = form.Unview; 

      // Update the Open menu:
      open.options.length = 0;
      open.options[0] = new Option("", "", true, true);
      open.options[1] = new Option("top", "top", false, false);
      for(var i = 0; i < subdirs_l.length; i++)
      {
        var to_open = subdirs_l.item(i).firstChild.data;
        open.options[i + 2] = new Option(to_open, to_open, false, false);
      }
      open.selectedIndex = 0;

      // Update the View menu:
      view.options.length = 0;
      view.options[0] = new Option("", "", true, true);
      for(var i = 0; i < view_l.length; i++)
      {
        var to_view = view_l.item(i).firstChild.data;
        view.options[i + 1] = new Option(to_view, to_view, false, false);
      }
      view.selectedIndex = 0;

      // Update the Unview menu:
      unview.options.length = 0;
      unview.options[0] = new Option("", "", true, true);
      var viewed_from_current = getViewedFromDir(contentViewer_current);
      for (var i = 0; i < viewed_from_current.length; i++)
      {
        unview.options[i + 1] = new Option(viewed_from_current[i], viewed_from_current[i], false, false);
      }
      unview.selectedIndex = 0;
    }
  }
}

//*************************************************************/

/*
  This function returns an array with all files in viewed_l that
  also reside in the directory dir, supplied as a parameter.
*/

function getViewedFromDir(dir)
{
  var viewed_l = current_display.viewed_l;
  var in_dir_l = new Array();
  for (var i = 0; i < current_display.viewed_l.length; i++)
  {
    var entry = viewed_l[i];
    var index = entry.lastIndexOf("/");
    if (entry.substring(0, index) == dir)
    {
      in_dir_l[in_dir_l.length] = entry;
    }
  }
  return in_dir_l;
}

/*************************************************************/
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
        newframe.name = "gifDisplay" + n;
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
