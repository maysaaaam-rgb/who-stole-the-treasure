if(eval("..:exp") == "1")
{
   y = random("3") + "1";
   if(y == "1")
   {
      gotoAndStop(2);
   }
   else if(y == "2")
   {
      gotoAndStop(16);
   }
   else if(y == "3")
   {
      gotoAndStop(9);
   }
}
else
{
   go = random("14") + "2";
   gotoAndStop(go);
}
