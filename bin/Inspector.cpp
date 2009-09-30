#include <iostream>
#include <fstream>
#include "FWCore/FWLite/interface/AutoLibraryLoader.h"
#include "DQMServices/Diagnostic/interface/HDQMInspector.h"
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

using namespace std;

//******************************************************************************


int main (int argc, char* argv[]) 
{

  if( (argc<5) ){
    std::cout << "  Received only " << argc 
	      << " inputs.  Inspector requires at least 5.  Please check code." 
	      << std::endl;
    return 0;
  }

  char dbString[120];
  sprintf(dbString,"sqlite_file:%s",argv[1]);
  printf("%s\n",dbString);

  Int_t DetID = atoi(argv[2]);

  std::ostringstream ss_detid;
  ss_detid << DetID;
  std::string detid_s = ss_detid.str();

  std::ostringstream ss_arg3;
  ss_arg3 << argv[3];
  std::string arg3_s = ss_arg3.str();

  std::ostringstream ss_arg4;
  ss_arg4 << argv[4];
  std::string arg4_s = ss_arg4.str();

  std::string histoString = detid_s + "@" + arg3_s + "@" + arg4_s;
  std::cout << histoString << std::endl;

  std::string gifString = arg3_s + "@" + arg4_s + ".gif";
  std::cout << gifString << std::endl;

  gROOT->Reset();


  HDQMInspector A;
  A.setDB(dbString,"HDQM_test","cms_cond_strip","w3807dev","");

  A.setDebug(1);
  A.setDoStat(1);

  int logy = 0;
  int firstrun = 0;
  int lastrun = 999999;
  int useyrange = 0;
  int ymin = -999999;
  int ymax = 999999;

  if( (argc>5) ){
    logy = atoi(argv[5]);
    if( (argc>6) ){
      firstrun = atoi(argv[6]);
      if( (argc>7) ){
	lastrun = atoi(argv[7]);
	if( (argc>8) ){
	  useyrange = atoi(argv[8]);
	  if( (argc>9)){
	    ymin = atoi(argv[9]);
	    if( (argc>10)){
	      ymax = atoi(argv[10]);
	    }
	  }
	}
      }
    }
  }


  A.createTrend(histoString,gifString,logy,"","",firstrun,lastrun,useyrange,ymin,ymax);

  cout << "Ending... " <<  endl;
  return 0;

}

