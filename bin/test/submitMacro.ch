#!/bin/csh -f

set DBFILE = $1
echo ${DBFILE}
set DETID = $2
echo "DETID = "${DETID}
set HISTO = $3
echo "ME    = "${HISTO}
set PAR = $4
echo "PAR   = "${PAR}

set LOGY   = $5
set FRUN   = $6
set LRUN   = $7
set YRANGE = $8
set YMIN   = $9
set YMAX   = $10

set IMGDIR = $11

echo "    first run = "${FRUN}", last run = "${LRUN}
echo "    log y = "${LOGY}", useyrange = "${YRANGE}", ymin = "${YMIN}", ymax = "${YMAX}

setenv runDir `pwd`
echo "RUN DIRECTORY: "${runDir}
cd ${runDir}
echo "IMG DIRECTORY: "${runDir}"/"${IMGDIR}

eval `scramv1 runtime -csh`

##
## run the inspector
##
myInspector "${DBFILE}" ${DETID} "${HISTO}" "${PAR}" ${LOGY} ${FRUN} ${LRUN} ${YRANGE} ${YMIN} ${YMAX} >& ${HISTO}.log


mv ${HISTO}@*.gif ${IMGDIR}
mv ${HISTO}*.root ${HISTO}
mv ${HISTO}.log ${HISTO}
