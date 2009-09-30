#include "DQM/L1TMonitorClient/bin/L1THistoryDQMService.h"
#include "FWCore/MessageLogger/interface/MessageLogger.h"
#include "DQMServices/Core/interface/MonitorElement.h"
#include "DQMServices/Diagnostic/interface/HDQMfitUtilities.h"


L1THistoryDQMService::L1THistoryDQMService(const edm::ParameterSet& iConfig,const edm::ActivityRegistry& aReg)
: DQMHistoryServiceBase::DQMHistoryServiceBase(iConfig, aReg), iConfig_(iConfig)
{
  edm::LogInfo("L1THistoryDQMService") <<  "[L1THistoryDQMService::L1THistoryDQMService]";
  threshold_ = iConfig.getUntrackedParameter<double>("threshold", 0.);

}


L1THistoryDQMService::~L1THistoryDQMService() { 
  edm::LogInfo("L1THistoryDQMService") <<  "[L1THistoryDQMService::~L1THistoryDQMService]";
}


uint32_t L1THistoryDQMService::returnDetComponent(const MonitorElement* ME){
  LogTrace("L1THistoryDQMService") <<  "[L1THistoryDQMService::returnDetComponent]";
//  std::string str=ME->getName();
//  size_t __key_length__=7;
//  size_t __detid_length__=9;


//  if(str.find("__det__")!= std::string::npos){
//    return atoi(str.substr(str.find("__det__")+__key_length__,__detid_length__).c_str());
//  }
    return 2;

}

//distinguere histo in base al path ed assegnare numero e poi plottare sulla base del numero.

//Example on how to define an user function for the statistic extraction
bool L1THistoryDQMService::setDBLabelsForUser  (std::string& keyName, std::vector<std::string>& userDBContent){
  userDBContent.push_back(keyName+std::string("@")+std::string("plateau"));
  userDBContent.push_back(keyName+std::string("@")+std::string("eplateau"));
  userDBContent.push_back(keyName+std::string("@")+std::string("usrMean"));
  userDBContent.push_back(keyName+std::string("@")+std::string("usrRMS"));
  userDBContent.push_back(keyName+std::string("@")+std::string("ymean"));
  userDBContent.push_back(keyName+std::string("@")+std::string("ymeanerr"));
  userDBContent.push_back(keyName+std::string("@")+std::string("myfloat"));
  return true;
}
bool L1THistoryDQMService::setDBValuesForUser(std::vector<MonitorElement*>::const_iterator iterMes, HDQMSummary::InputVector& values  ){

  // Variables to push back
  Double_t plateau=0.;
  Double_t eplateau=0.;
  Double_t usrMean=0.;
  Double_t usrRMS=0.;
  Double_t ymean=0.;
  Double_t ymeanerr=0.;
  Double_t myfloat=0.;


  Double_t wdenom=0.;
  Double_t ymeandenom=0.;
  Double_t sig_=0.;


  if( ((*iterMes)->kind()==MonitorElement::DQM_KIND_TH1F) ){

    TH1F* h = (*iterMes)->getTH1F();
    int nbins = h->GetXaxis()->GetNbins();

    double nzEventContent = 0.;
    double EventContent   = 0.;

    for( int ibin=1; ibin <= nbins ; ibin++ ){
      double content = h->GetBinContent(ibin);
      double err     = h->GetBinError(ibin);
      double center  = h->GetXaxis()->GetBinCenter(ibin);

      if( (err>0.) ) sig_ = err;
      else sig_ = 1.;

      if( (content>0.) ){ 
	nzEventContent += content;
	ymean += content/(sig_*sig_);
	ymeandenom += 1./(sig_*sig_);

	if( (center > threshold_) ) { 
	  plateau += content/(sig_*sig_); 
	  wdenom += 1./(sig_*sig_);
	}
      }
      usrMean += content * center;
      EventContent += content;

    }
    usrMean = usrMean/EventContent;


    nzEventContent = 0.;
    double di = 0.;

    for( int ibin=1; ibin <= nbins ; ibin++ ){
      double content = h->GetBinContent(ibin);
      double center  = h->GetXaxis()->GetBinCenter(ibin);

      if( (content>0.) ){ 
	di = center;
	usrRMS += ( di - usrMean ) * ( di - usrMean );
	nzEventContent += content;
      }
    }
    usrRMS  = sqrt(usrRMS/nzEventContent);


    if( (wdenom>0.) ){
      plateau  = plateau/wdenom;
      eplateau = sqrt(1/wdenom);
    }
    else {
      plateau  = 0.;
      eplateau = 0.;
    }

    if( (ymeandenom>0.) ){
      ymean = ymean/ymeandenom;
      ymeanerr = sqrt(1./ymeandenom);
    }
    else {
      ymean = 0.;
      ymeanerr = 0.;
    }

  } // end check kind() == TH1F


  if( ((*iterMes)->kind()==MonitorElement::DQM_KIND_REAL) ){
    // myfloat
    myfloat = (*iterMes)->getFloatValue();
  }

  values.push_back( plateau );
  values.push_back( eplateau );
  values.push_back( usrMean );
  values.push_back( usrRMS );
  values.push_back( ymean );
  values.push_back( ymeanerr );
  values.push_back( myfloat );

  return true;
}

