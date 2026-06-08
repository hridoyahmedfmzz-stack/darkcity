const now = Date.now();

if(userData.premium && userData.premiumExpire > now){
   console.log("Premium Active");
}else{
   console.log("Premium Expired");
}