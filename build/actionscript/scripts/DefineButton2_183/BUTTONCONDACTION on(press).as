on(press){
   if(eval("..:cka") == "1")
   {
      set("..:pt","1");
      tellTarget("../msg")
      {
         gotoAndPlay(25);
      }
      set("..:cka","0");
      gotoAndStop(2);
   }
   else
   {
      stop();
   }
}
