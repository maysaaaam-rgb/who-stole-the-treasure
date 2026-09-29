tellTarget("../gato")
{
   gotoAndStop("gh4");
}
if(eval("..:pt") == "1" or sb == "1")
{
   tellTarget("../gbar")
   {
      gotoAndStop(_currentframe + "2");
   }
}
else
{
   tellTarget("../gbar")
   {
      gotoAndStop(_currentframe + "1");
   }
}
