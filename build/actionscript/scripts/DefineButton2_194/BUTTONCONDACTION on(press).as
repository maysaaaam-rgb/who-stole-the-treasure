on(press){
   if(eval("..:ckb") == "1")
   {
      set("..:gt","1");
      tellTarget("../msg1")
      {
         gotoAndPlay(25);
      }
      set("..:ckb","0");
      gotoAndStop(2);
   }
   else
   {
      stop();
   }
}
