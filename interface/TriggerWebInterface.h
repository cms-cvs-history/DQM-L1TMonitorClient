#ifndef TriggerWebInterface_H
#define TriggerWebInterface_H

/** \class  TriggerWebInterface
 *  Class that creates the web interface to control the L1TClient
 *  
 *  $Date: 2007/04/19 07:31:07 $
 *  $Revision: 1.1 $
 *  \author Lorenzo Agostino
  */


#include "DQMServices/WebComponents/interface/WebInterface.h"
#include "DQMServices/WebComponents/interface/ME_map.h"

class TriggerWebInterface : public WebInterface
{

   public:

  	TriggerWebInterface(std::string theContextURL, std::string theApplicationURL,std::string url, MonitorUserInterface ** _mui_p);

  /*
    you need to implement this function if you have widgets that invoke custom-made
    methods defined in your client
  */
  	void handleCustomRequest(xgi::Input * in, xgi::Output * out ) throw (xgi::exception::Exception);

  /*
    An example custom-made method that we want to bind to a widget
  */
	void CheckQTGlobalStatus(xgi::Input * in, xgi::Output * out , bool start) throw (xgi::exception::Exception);
	void CheckQTDetailedStatus(xgi::Input * in, xgi::Output * out , bool start) throw (xgi::exception::Exception);
	void GoToTriggerMonitorWI(xgi::Input * in, xgi::Output * out) throw (xgi::exception::Exception);
	void CreateWI(xgi::Input * in, xgi::Output * out) throw (xgi::exception::Exception);
	void CreateMenu(xgi::Input * in, xgi::Output * out) throw (xgi::exception::Exception);
        void RetrieveMeList(xgi::Input * in, xgi::Output * out) throw (xgi::exception::Exception);
        void PlotMeList(xgi::Input * in, xgi::Output * out) throw (xgi::exception::Exception);
	void CreateStatus(xgi::Input * in, xgi::Output * out) throw (xgi::exception::Exception);
	void CreateDisplay(xgi::Input * in, xgi::Output * out) throw (xgi::exception::Exception);

	bool globalQTStatusRequest(){return checkQTGlobalStatus;}
	bool detailedQTStatusRequest(){return checkQTDetailedStatus;}
	std::string requestType(){return request;}
	void printMeListXML(std::string source, xgi::Output * out);
	void displayMeXML(xgi::Input * in, xgi::Output * out);
        void printMeMap(ME_map view_map, std::string id);
//	void printMeListXML(xgi::Output * out);
	
private:

	bool checkQTGlobalStatus;
	bool checkQTDetailedStatus;
	std::string request;
	
	std::string url;
	std::string context_url;
	std::string application_url;
};

#endif
