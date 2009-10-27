#!/usr/bin/env perl

use File::Copy;

 
#------Configure here ---------------------------------------
$queue = "1nh";
$curDir=`pwd`;
chomp $curDir;


$online = 1;   #  0 = PromptReco, 1 = Online
$maxNruns = 5; # -1 = all runs


$detid = 2;
$thr = 0.;


@monitor_list_stat = ("EtHad","EtMiss","EtTotal","HtMiss","GMT_pt");
$size_monitor_list_stat = @monitor_list_stat;
$par0 = "stat";
$par1 = "usrMean";

@monitor_list_rate = ("Rate_AlgoBit_015","Rate_AlgoBit_045","Rate_AlgoBit_055","Physics Triggers");
$size_monitor_list_rate = @monitor_list_rate;
$par2 = "ymean";
$par3 = "ymeanerr";

@monitor_list_doub = ("processEventRate");
$size_monitor_list_doub = @monitor_list_doub;
$par4 = "myfloat";


if( $online ){
    $name = "test_L1T_HDQM_Online";
    $pathToFiles="/afs/cern.ch/cms/CAF/CMSCOMM/COMM_DQM/data/Online";
}
else {
    $name = "test_L1T_HDQM_PromptReco";
    $pathToFiles="/afs/cern.ch/cms/CAF/CMSCOMM/COMM_DQM/data/PromptReco";

    $size_monitor_list_rate = 0;
    $size_monitor_list_doub = 0;
}


#-------------------------------------------------------------


system("rm -f $name\_dbfile.db\n");
print("rm -f $name\_dbfile.db\n");
mkdir($name);
chdir($name);

###read file list
$input_run_list = "$curDir/data/RunSummary_dt_rpc_csc_ecal_hcal_CRAFT09_1M.txt";
open(RUNLIST, $input_run_list) || die("Could not open file $input_run_list!");
@run_list = <RUNLIST>;

close(RUNLIST);

$total_files  = 0;
$active_files = 0;
$nruns = @run_list;

foreach $run (@run_list){

$total_files++;
chomp($run);

$A = substr($run,0,3);
$B = substr($run,3);
if( $online ){
    @v = glob("$pathToFiles/$A/$B/DQM_V0002_R000$run*");
}
else { 
    @v = glob("$pathToFiles/$A/$B/DQM_V0001_R000$run\__Cosmics__*");
}

$file = @v[0];

if( $file ){

if( ($active_files<$maxNruns) || ($maxNruns==-1) ){
$active_files++;

print " \n Run $total_files of $nruns.  The current run is $run.\n";


open CFGFILE, "> historyClient_$run\_$name\_cfg.py";

print CFGFILE "import FWCore.ParameterSet.Config as cms\n";
print CFGFILE "\n";
print CFGFILE "process = cms.Process(\"PWRITE\")\n";
print CFGFILE "process.MessageLogger = cms.Service(\"MessageLogger\",\n";
print CFGFILE "			destinations = cms.untracked.vstring('readFromFile_$run'),\n";
print CFGFILE "			readFromFile_$run = cms.untracked.PSet(threshold = cms.untracked.string('DEBUG')),\n";
print CFGFILE "			debugModules = cms.untracked.vstring('*')\n";
print CFGFILE ")\n";
print CFGFILE "\n";
print CFGFILE "process.maxEvents = cms.untracked.PSet(\n";
print CFGFILE "			input = cms.untracked.int32(1))\n";
print CFGFILE "\n";
print CFGFILE "process.source = cms.Source(\"EmptySource\",\n";
print CFGFILE "			timetype = cms.string(\"runnumber\"),\n";
print CFGFILE "			firstRun = cms.untracked.uint32(1),\n";
print CFGFILE "			lastRun  = cms.untracked.uint32(1),\n";
print CFGFILE "			interval = cms.uint32(1)\n";
print CFGFILE ")\n";
print CFGFILE "\n";
print CFGFILE "process.load(\"DQMServices.Core.DQM_cfg\")\n";
print CFGFILE "\n";
print CFGFILE "process.PoolDBOutputService = cms.Service(\"PoolDBOutputService\",\n";
print CFGFILE "			BlobStreamerName = cms.untracked.string('TBufferBlobStreamingService'),\n";
print CFGFILE "			outOfOrder = cms.untracked.bool(True),\n";
print CFGFILE "			DBParameters = cms.PSet(\n";
print CFGFILE "                       messageLevel = cms.untracked.int32(2),\n";
print CFGFILE "                       authenticationPath = cms.untracked.string('/afs/cern.ch/cms/DB/conddb')\n";
print CFGFILE "                 ),\n";
print CFGFILE "\n";
print CFGFILE "			timetype = cms.untracked.string('runnumber'),\n";
print CFGFILE "			connect = cms.string('sqlite_file:$name\_dbfile.db'),\n";
print CFGFILE "			toPut = cms.VPSet(cms.PSet(\n";
print CFGFILE "			record = cms.string(\"HDQMSummary\"),\n";
print CFGFILE "			tag = cms.string(\"HDQM_test\")\n";
print CFGFILE ")),\n";
print CFGFILE "			logconnect = cms.untracked.string(\"sqlite_file:$name\_log.db\") \n";
print CFGFILE "			)\n";
print CFGFILE "\n";
print CFGFILE "process.l1tDQMHistoryPopCon = cms.EDAnalyzer(\"L1TDQMHistoryPopCon\",\n";
print CFGFILE "			record = cms.string(\"HDQMSummary\"),\n";
print CFGFILE "			loggingOn = cms.untracked.bool(True),\n";
print CFGFILE "			SinceAppendMode = cms.bool(True),\n";
print CFGFILE "			Source = cms.PSet(since = cms.untracked.uint32($run),\n";
print CFGFILE "			debug = cms.untracked.bool(False))\n";
print CFGFILE ")\n";
print CFGFILE "\n";
print CFGFILE "process.L1THistoryDQMService = cms.Service(\"L1THistoryDQMService\",\n";
print CFGFILE "			RunNb = cms.uint32($run),\n";
print CFGFILE "			accessDQMFile = cms.bool(True),\n";
print CFGFILE "			FILE_NAME = cms.untracked.string(\"$file\"),\n";
print CFGFILE "			ME_DIR = cms.untracked.string(\"Run $run/L1T/Run summary/\"),\n";
print CFGFILE "			threshold = cms.untracked.double($thr),\n";
print CFGFILE "			histoList = cms.VPSet(\n";
print CFGFILE "\n";

if( $size_monitor_list_stat ){
foreach $monitor0 (@monitor_list_stat){
mkdir($monitor0);
print CFGFILE "cms.PSet( keyName = cms.untracked.string('$monitor0'), quantitiesToExtract = cms.untracked.vstring(\"$par0\")),\n";
print CFGFILE "cms.PSet( keyName = cms.untracked.string('$monitor0'), quantitiesToExtract = cms.untracked.vstring(\"$par1\")),\n";
}
}

if( $size_monitor_list_rate ){
foreach $monitor1 (@monitor_list_rate){
mkdir($monitor1);
print CFGFILE "cms.PSet( keyName = cms.untracked.string('$monitor1'), quantitiesToExtract = cms.untracked.vstring(\"$par2\")),\n";
print CFGFILE "cms.PSet( keyName = cms.untracked.string('$monitor1'), quantitiesToExtract = cms.untracked.vstring(\"$par3\")),\n";
}
}

if( $size_monitor_list_doub ){
foreach $monitor2 (@monitor_list_doub){
mkdir($monitor2);
print CFGFILE "cms.PSet( keyName = cms.untracked.string('$monitor2'), quantitiesToExtract = cms.untracked.vstring(\"$par4\")),\n";
}
}

print CFGFILE "\n";
print CFGFILE ")\n";
print CFGFILE ")\n";
print CFGFILE "process.p = cms.Path(process.l1tDQMHistoryPopCon)\n";
print CFGFILE "\n";
close CFGFILE ;

print "cmsRun historyClient_$run\_$name\_cfg.py\n";
system("cmsRun historyClient_$run\_$name\_cfg.py >& output\_$run\_$name.log\n");

###system("bsub -J $run\_$name -q $queue cmsRun historyClient_$run\_$name\_cfg.py\n");

}
}
}
system("cmscond_list_iov -c sqlite_file:$name\_dbfile.db -t HDQM_test\n");


print "\n  Ran on $active_files of $total_files ($nruns) files.\n";
print "End submission...\n";

