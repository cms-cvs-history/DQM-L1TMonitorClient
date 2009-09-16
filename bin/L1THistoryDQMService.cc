#include "DQM/L1TMonitorClient/bin/L1THistoryDQMService.h"
#include "FWCore/MessageLogger/interface/MessageLogger.h"
#include "DQMServices/Core/interface/MonitorElement.h"
#include "DQMServices/Diagnostic/interface/HDQMfitUtilities.h"


L1THistoryDQMService::L1THistoryDQMService(const edm::ParameterSet& iConfig,const edm::ActivityRegistry& aReg)
: DQMHistoryServiceBase::DQMHistoryServiceBase(iConfig, aReg), iConfig_(iConfig)
{
  edm::LogInfo("L1THistoryDQMService") <<  "[L1THistoryDQMService::L1THistoryDQMService]";
}


L1THistoryDQMService::~L1THistoryDQMService() { 
  edm::LogInfo("L1THistoryDQMService") <<  "[L1THistoryDQMService::~L1THistoryDQMService]";
}


uint32_t L1THistoryDQMService::returnDetComponent(const MonitorElement* ME){
  LogTrace("L1THistoryDQMService") <<  "[L1THistoryDQMService::returnDetComponent]";
  std::string str=ME->getName();
  size_t __key_length__=7;
  size_t __detid_length__=9;


  if(str.find("__det__")!= std::string::npos){
    return atoi(str.substr(str.find("__det__")+__key_length__,__detid_length__).c_str());
  }
}

//Example on how to define an user function for the statistic extraction
bool L1THistoryDQMService::setDBLabelsForUser  (std::string& keyName, std::vector<std::string>& userDBContent){
  userDBContent.push_back(keyName+std::string("@")+std::string("userExample_XMax"));
  userDBContent.push_back(keyName+std::string("@")+std::string("userExample_mean"));
  return true;
}
bool L1THistoryDQMService::setDBValuesForUser(std::vector<MonitorElement*>::const_iterator iterMes, HDQMSummary::InputVector& values  ){
  values.push_back( (*iterMes)->getTH1F()->GetXaxis()->GetBinCenter((*iterMes)->getTH1F()->GetMaximumBin()));
  values.push_back( (*iterMes)->getMean() );
  return true;
}

