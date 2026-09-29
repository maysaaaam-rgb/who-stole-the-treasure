on(press){
   if(eval("..:cka") == "1")
   {
      set("..:sb","1");
      tellTarget("../msg")
      {
         gotoAndPlay(49);
      }
      set("..:cka","0");
      gotoAndStop(2);
   }
   else
   {
      stop();
   }
}
