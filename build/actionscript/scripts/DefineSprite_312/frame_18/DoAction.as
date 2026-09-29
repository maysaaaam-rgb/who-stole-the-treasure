tellTarget("../gato")
{
   gotoAndStop("gh3");
}
if(eval("..:pt") == "1" or sb == "1")
{
   tellTarget("../gbar")
   {
      gotoAndStop(_currentframe + "4");
   }
}
else
{
   tellTarget("../gbar")
   {
      gotoAndStop(_currentframe + "2");
   }
}
