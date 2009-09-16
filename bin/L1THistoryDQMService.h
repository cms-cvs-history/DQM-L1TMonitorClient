#ifndef DQM_L1TMonitor_L1THistoryDQMService_H
#define DQM_L1TMonitor_L1THistoryDQMService_H

#include "DQMServices/Diagnostic/interface/DQMHistoryServiceBase.h" 

/**
  @author D. Giordano, A.-C. Le Bihan
  @EDAnalyzer to read DQM root file & insert summary informations to DB 
*/

class L1THistoryDQMService : public DQMHistoryServiceBase {
 public:

  explicit L1THistoryDQMService(const edm::ParameterSet&,const edm::ActivityRegistry&);
  ~L1THistoryDQMService();
  
 private:
  //Methods to be specified by each subdet
  uint32_t returnDetComponent(const MonitorElement* ME);
  bool setDBLabelsForUser  (std::string& keyName, std::vector<std::string>& userDBContent);
  bool setDBValuesForUser(std::vector<MonitorElement*>::const_iterator iterMes, HDQMSummary::InputVector& values  );
   
   edm::ParameterSet iConfig_;
};

#endif //DQM_SiStripHistoricInfoClient_L1THistoryDQMService_H
