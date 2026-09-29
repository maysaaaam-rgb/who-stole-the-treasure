on(press){
   if(eval("..:cka") == "1")
   {
      set("..:cka","0");
      gotoAndPlay(2);
      tellTarget("..")
      {
         gotoAndStop("cam2");
         play();
      }
   }
   else
   {
      stop();
   }
}
