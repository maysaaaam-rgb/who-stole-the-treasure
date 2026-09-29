on(press){
   if(eval("..:ckb") == "1")
   {
      set("..:ckb","0");
      gotoAndPlay(2);
      tellTarget("..")
      {
         gotoAndStop("cam1");
         play();
      }
   }
   else
   {
      stop();
   }
}
