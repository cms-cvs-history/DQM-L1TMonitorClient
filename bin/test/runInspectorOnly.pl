#!/usr/bin/env perl

use File::Copy;

 
#------Configure here ---------------------------------------
$queue = "cmscaf1nh";
$curDir=`pwd`;
chomp $curDir;


$online = 1; # 0 = PromptReco, 1 = Online


$detid = 2;
$thr = 0.;

if( $online ){
    $name = "test_L1T_HDQM_Online";
}
else {
    $name = "test_L1T_HDQM_PromptReco";
}


my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime time;
$year += 1900;
$mon  += 1;
$imgdir = "Images/Images_".$year."_".$mon."_".$mday;


#-------------------------------------------------------------
$detid =2;

$par0 = "mean";
$par1 = "usrMean";
$par2 = "ymean";
$par3 = "ymeanerr";
$par4 = "myfloat";

$logy = 0;
#$frun = 108117;
$frun = 0;
$lrun = 112650;
$yrange = 0;
$ymin = -999999;
$ymax = 999999;

## Defaults
#$logy = 0;
#$frun = 0;
#$lrun = 999999;
#$yrange = 0;
#$ymin = -999999;
#$ymax = 999999;


#####
# useYRange, $yrange
# if yrange is odd, use minimum
# if yrange is >= 2, use maximum
# e.g. yrange = 3, use both min and max
#####
#-------------------------------------------------------------


copy("submitMacro.ch", $name);
chdir($name);
if( -d "Images" ){
print "Directory already exists: Images\n";
}
else{
print "Creating directory: Images\n";
mkdir("Images");
if( -d $imgdir ){
print "Directory already exists: $imgdir\n";
}
else{
print "Creating directory: $imgdir\n";
mkdir($imgdir);
}
}
system("chmod +x submitMacro.ch\n");

system("./submitMacro.ch $name\_dbfile.db $detid \"EtHad\"   $par0 0 $frun $lrun 0 0 100 $imgdir\n");
system("./submitMacro.ch $name\_dbfile.db $detid \"EtMiss\"  $par0 0 $frun $lrun 0 0 100 $imgdir\n");
system("./submitMacro.ch $name\_dbfile.db $detid \"EtTotal\" $par0 0 $frun $lrun 0 0 100 $imgdir\n");
system("./submitMacro.ch $name\_dbfile.db $detid \"HtMiss\"  $par0 0 $frun $lrun 0 0 100 $imgdir\n");
system("./submitMacro.ch $name\_dbfile.db $detid \"GMT_pt\"  $par0 0 $frun $lrun 0 0 100 $imgdir\n");

if( $online ){
system("./submitMacro.ch $name\_dbfile.db $detid \"Rate_AlgoBit_015\" $par2 0 $frun $lrun 0 0 100 $imgdir\n");
system("./submitMacro.ch $name\_dbfile.db $detid \"Rate_AlgoBit_045\" $par2 0 $frun $lrun 0 0 500 $imgdir\n");
system("./submitMacro.ch $name\_dbfile.db $detid \"Rate_AlgoBit_055\" $par2 0 $frun $lrun 0 0 500 $imgdir\n");

system("./submitMacro.ch $name\_dbfile.db $detid \"processEventRate\" $par4 0 $frun $lrun 0 0 500 $imgdir\n");
}

print "End submission...\n";

