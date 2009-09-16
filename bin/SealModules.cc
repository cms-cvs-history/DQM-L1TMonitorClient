#include "FWCore/Framework/interface/MakerMacros.h"
#include "FWCore/Framework/interface/SourceFactory.h"
DEFINE_SEAL_MODULE();

#include "FWCore/ServiceRegistry/interface/ServiceMaker.h"

#include "DQM/L1TMonitor/plugins/L1THistoryDQMService.h"
DEFINE_ANOTHER_FWK_SERVICE(L1THistoryDQMService);

#include "CondCore/PopCon/interface/PopConAnalyzer.h"
#include "DQMServices/Diagnostic/interface/DQMHistoryPopConHandler.h"
typedef popcon::PopConAnalyzer< popcon::DQMHistoryPopConHandler<L1THistoryDQMService > > L1TDQMHistoryPopCon;
DEFINE_ANOTHER_FWK_MODULE(L1TDQMHistoryPopCon);
