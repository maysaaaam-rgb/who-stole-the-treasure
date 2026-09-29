on(press){
   if(eval("..:cka") == "1")
   {
      set("..:da","1");
      tellTarget("../msg")
      {
         gotoAndPlay(2);
      }
      set("..:cka","0");
      gotoAndStop(2);
   }
   else
   {
      stop();
   }
}
