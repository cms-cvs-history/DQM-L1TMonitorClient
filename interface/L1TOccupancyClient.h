#ifndef DQM_L1TMONITORCLIENT_L1TOCCUPANCYCLIENT_H
#define DQM_L1TMONITORCLIENT_L1TOCCUPANCYCLIENT_H

#include "FWCore/Framework/interface/Frameworkfwd.h"
#include "FWCore/Framework/interface/Event.h"
#include "FWCore/Framework/interface/MakerMacros.h"
#include "FWCore/ParameterSet/interface/ParameterSet.h"
#include <FWCore/Framework/interface/EDAnalyzer.h>

#include "DQMServices/Core/interface/DQMStore.h"
#include "DQMServices/Core/interface/MonitorElement.h"
#include "FWCore/Framework/interface/LuminosityBlock.h"
#include "DQM/L1TMonitorClient/interface/L1TOccupancyClientHistogramService.h"

#include <memory>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <TH1F.h>
#include <TH1D.h>
#include <TH2F.h>
#include <TF1.h>
#include <TProfile2D.h>
#include <TNamed.h>
#include <TRandom3.h>

class L1TOccupancyClient: public edm::EDAnalyzer {

  public:

    /// Constructor
    L1TOccupancyClient(const edm::ParameterSet& ps);
  
    /// Destructor
    virtual ~L1TOccupancyClient();
 
  protected:

    /// BeginJob
    void beginJob(void);
    void endJob();

    /// BeginRun
    void beginRun(const edm::Run& r, const edm::EventSetup& c);
    void endRun(const edm::Run& r, const edm::EventSetup& c);

    void beginLuminosityBlock(const edm::LuminosityBlock& lumiSeg,const edm::EventSetup& context);
    void endLuminosityBlock  (const edm::LuminosityBlock& lumiSeg,const edm::EventSetup& c);       // DQM Client Diagnostic

    /// Fake Analyze
    void analyze(const edm::Event& e, const edm::EventSetup& c) ;
  
    //DQM test routines
    double xySymmetry(edm::ParameterSet ps, 
                     std::string test_name, 
                     std::vector<std::pair<int,double> >& deadChannels, 
                     std::vector<std::pair<int,double> >& statDev, 
                     bool& enoughStats);  // Performs the checking of enough statistics and invokes compareWithStrip()

  private:

    edm::ParameterSet                   parameters_; //parameter set from python
    DQMStore*                           dbe_;        //store service
    L1TOccupancyClientHistogramService* hservice_;   //histogram service
    TFile*                              file_;       //output file for test results

    // bool
    bool verbose_;    //verbose mode

    // vector
    std::vector<edm::ParameterSet> tests_; //all tests defined in python file

    // map
    std::map<std::string,MonitorElement*> meResults;      
    std::map<std::string,MonitorElement*> meDifferential; 
    std::map<std::string,MonitorElement*> meCertification;
std::map<std::string,int> testLSs_;             //how many LSs in the past are to be certified for current block?

  private:

    // performs the actual test
    int compareWithStrip(TH2F* histo, 
                         std::string test, 
                         int binStrip, 
                         int nBins, 
                         int axis, 
                         double avg, 
                         edm::ParameterSet ps,
                         std::vector<std::pair<int,double> >& deadChannels);

    // Gets the bin-number of a bin with content and on axis
    void getBinCoordinateOnAxisWithValue(TH2F* h2f, 
                                           double content, 
                                           int& coord, 
                                           int axis);  

    // Puts out the bad and masked channels of a specific test to h2f	
    void printDeadChannels(std::vector<std::pair<int,double> > deadChannels, 
                           TH2F* h2f, 
                           std::vector<std::pair<int,double> > statDev, 
                           std::string test_name); 

    // Gets the average (avrgMode=1 arithmetic, avrgMode=2 median) for a specific binStrip in histo h2f for a specific test
    double getAvrg(TH2F* h2f, std::string test, int axis, int nBins, int binStrip, int avrgMode); 

};

#endif
