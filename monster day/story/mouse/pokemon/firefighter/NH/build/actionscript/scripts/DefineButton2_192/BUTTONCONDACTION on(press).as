on(press){
   if(eval("..:ckb") == "1")
   {
      set("..:gda","1");
      tellTarget("../msg1")
      {
         gotoAndPlay(2);
      }
      set("..:ckb","0");
      gotoAndStop(2);
   }
   else
   {
      stop();
   }
}
