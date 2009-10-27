#ifndef GUARD_HDQMInspectorConfigL1Trigger_h
#define GUARD_HDQMInspectorConfigL1Trigger_h

#include <string>

#include "DQMServices/Diagnostic/interface/HDQMInspectorConfigBase.h"

class HDQMInspectorConfigL1Trigger : public HDQMInspectorConfigBase
{
 public:
  HDQMInspectorConfigL1Trigger();
  virtual ~HDQMInspectorConfigL1Trigger();
    
  std::string translateDetId(const uint32_t) const;
};

#endif
