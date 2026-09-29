on(press){
   if(eval("..:ckb") == "1")
   {
      set("..:gb","1");
      tellTarget("../msg1")
      {
         gotoAndPlay(49);
      }
      set("..:ckb","0");
      gotoAndStop(2);
   }
   else
   {
      stop();
   }
}
