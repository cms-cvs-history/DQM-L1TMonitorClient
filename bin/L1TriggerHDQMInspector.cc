#include "DQMServices/Diagnostic/interface/HDQMInspector.h"
#include "DQMServices/Diagnostic/interface/DQMHistoryTrendsConfig.h"
#include "DQMServices/Diagnostic/interface/DQMHistoryCreateTrend.h"

#include "DQM/L1TMonitorClient/bin/HDQMInspectorConfigL1Trigger.h"

#include <iostream>
#include <fstream>
#include "FWCore/FWLite/interface/AutoLibraryLoader.h"
#include "TROOT.h"
#include "TSystem.h"
#include "TH2.h"
#include "TH1.h"
#include "TH1F.h"
#include "TFile.h"
#include "TLeaf.h"
#include "TStyle.h"
#include "TTree.h"
#include "TCanvas.h"
#include "TMath.h"
#include "TRandom.h" 
#include <string>
#include <sstream>
#include <vector>
#include <memory>
#include <algorithm>

using namespace std;

//*****************************************************************************
HDQMInspectorConfigL1Trigger::HDQMInspectorConfigL1Trigger ()
{
}

HDQMInspectorConfigL1Trigger::~HDQMInspectorConfigL1Trigger ()
{
}

std::string HDQMInspectorConfigL1Trigger::translateDetId(const uint32_t id) const
{

  if( id == 2 ) {
    return "L1T";
  }
  else return "???";

}
//*****************************************************************************

string const Condition = "";
string const BlackList = "";

void runL1TriggerInspector( const string &tagName, const string & Password, const int Start, const int End, const int nRuns )
{
  HDQMInspectorConfigL1Trigger L1TriggerConfig;
  DQMHistoryCreateTrend makeTrend(&L1TriggerConfig);

  // Database and output configuration
  //makeTrend.setDB("oracle://cms_orcoff_prep/CMS_DQM_31X_OFFLINE",tagName,"cms_dqm_31x_offline", Password,"");
  makeTrend.setDB("sqlite_file:test_L1T_HDQM_Online_dbfile.db", tagName, "", Password, "");
  makeTrend.setDebug(1);
  makeTrend.setDoStat(1);
  //makeTrend.setSkip99s(true);
  makeTrend.setBlackList(BlackList);


  // Definition of trends
  typedef DQMHistoryTrendsConfig Trend;
  vector<Trend> config;
  config.push_back(Trend( "2@EtHad@mean",  "L1T_GCT_EtHad_mean.gif",  0, Condition, "", Start, End, nRuns ));
  config.push_back(Trend( "2@EtMiss@mean", "L1T_GCT_EtMiss_mean.gif", 0, Condition, "", Start, End, nRuns ));
  config.push_back(Trend( "2@EtTotal@mean","L1T_GCT_EtTotal_mean.gif",0, Condition, "", Start, End, nRuns ));
  config.push_back(Trend( "2@HtMiss@mean", "L1T_GCT_HtMiss_mean.gif", 0, Condition, "", Start, End, nRuns ));
  config.push_back(Trend( "2@GMT_pt@mean", "L1T_GMT_GMTpt_mean.gif",  0, Condition, "", Start, End, nRuns ));

  config.push_back(Trend( "2@Rate_AlgoBit_015@ymean", "L1T_L1TScalersSCAL_RateAlgoBit015_ymean.gif",  0, Condition, "", Start, End, nRuns ));
  config.push_back(Trend( "2@Rate_AlgoBit_045@ymean", "L1T_L1TScalersSCAL_RateAlgoBit045_ymean.gif",  0, Condition, "", Start, End, nRuns ));
  config.push_back(Trend( "2@Rate_AlgoBit_055@ymean", "L1T_L1TScalersSCAL_RateAlgoBit055_ymean.gif",  0, Condition, "", Start, End, nRuns ));

  config.push_back(Trend( "2@processEventRate@myfloat", "L1T_EventInfo_processEventRate_myfloat.gif",  0, Condition, "", Start, End, nRuns ));


  // Creation of trends
  for_each(config.begin(), config.end(), makeTrend);

  // Close the output file
  makeTrend.closeFile();

}

//******************************************************************************
/// Simple method to create the trends. The actual operations are performed in runL1TriggerInspector.
void L1TriggerHDQMInspector( const string &tagName, const string & password, const int start, const int end )
{
  runL1TriggerInspector( tagName, password, start, end, 0 );
}

/// Simple method to create the trends. The actual operations are performed in runL1TriggerInspector.
void L1TriggerHDQMInspector( const string & tagName, const string & password, const int nRuns )
{
  runL1TriggerInspector( tagName, password, 0, 0, nRuns );
}
//******************************************************************************

int main (int argc, char* argv[]) 
{
  if (argc != 4 && argc != 5) {
    cerr << "Usage: " << argv[0] << " [TagName] [Password] [NRuns] " << endl;
    cerr << "Or:    " << argv[0] << " [TagName] [Password] [FirstRun] [LastRun] " << endl;
    return 1;
  }

  if (argc == 4) {
    cout << "Creating trends for NRuns = " << argv[3] << " for tag: " << argv[1] << endl;
    L1TriggerHDQMInspector( argv[1], argv[2], atoi(argv[3]) );
  } else if(argc == 5) {
    cout << "Creating trends for range:  " << argv[3] << " " << argv[4] << " for tag: " << argv[1] << endl;
    L1TriggerHDQMInspector( argv[1], argv[2], atoi(argv[3]), atoi(argv[4]) );
  }

  return 0;
}

