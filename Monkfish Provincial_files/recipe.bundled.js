//
// source/angular/controllers/madeItModalCtrl.js
//
"use strict";angular.module("allrecipes").controller("ar_controllers_made_it_modal",["$scope","$window","ar_facebook_api_service","datalayerEvent","perishableLocalstorage","arLogin","ar_services_photoupload","$rootScope","$document",function(c,d,e,j,o,g,f,b,a){c.facebookShare={shareData:{madeItPhotoURL:null,recipeId:null,recipeTitle:null,recipeUrl:null,recipePhotoUrl:null,recipeDescription:null},isOn:true};
c.photoUploadData={dataUrl:"",style:null,selectedFile:null,hasSelectedPhoto:false,hasUploadedPhoto:false,};c.madeIt={madeCount:0,totalRecipeMadeCount:0};
c.init=function(){var q=d.facebookShareInitScope;c.facebookShare.shareData={recipeId:q.recipeId,recipeTitle:q.recipeTitle,recipeUrl:q.recipeUrl+"?lnkid=fbimi&oid="+encodeURIComponent(d.dataLayer.user[0].analyticsId),recipePhotoUrl:q.recipePhotoUrl,recipeDescription:q.recipeDescription,madeItPhotoURL:c.ngDialogData.madeItPhotoUrl};
if(c.facebookShare.shareData.madeItPhotoURL){c.photoUploadData.hasUploadedPhoto=true}c.madeIt={madeCount:c.ngDialogData.madeCount,totalRecipeMadeCount:c.ngDialogData.totalRecipeMadeCount};
if(o.get("facebookIMadeItShare")!=null){var p=JSON.parse(o.get("facebookIMadeItShare"));c.facebookShare.isOn=p}};c.modalConfirm=function(){o.set("facebookIMadeItShare",c.facebookShare.isOn);
if(c.photoUploadData.hasSelectedPhoto){f.uploadPhoto({userId:g.userId,recipeId:c.facebookShare.shareData.recipeId,description:"",file:c.photoUploadData.selectedFile}).then(n,m)
}else{i()}};var i=function(){if(c.facebookShare.isOn){c.shareRecipe()}c.confirm()};c.shareRecipe=function(){var p=c.facebookShare.shareData;
var q={type:"allrecipes:recipe"};q.url=p.recipeUrl;q.title=p.recipeTitle;if(p.recipeDescription){q.description=p.recipeDescription
}if(p.madeItPhotoURL){q.image=p.madeItPhotoURL}else{q.image=p.recipePhotoUrl}if(q.url&&q.title&&q.image){e.openIMadeItShare(q,k)
}};function k(){var p=c.facebookShare.shareData;j.push("i made it - share on facebook",p.recipeId,"Action Complete","i made it - share on facebook")
}c.onFacebookOnOffChange=function(){o.set("facebookIMadeItShare",c.facebookShare.isOn)};var l=function(p){if(p[0]){var q=p[0];
h();f.readPhotoData(q,c).then(function(s){c.photoUploadData.selectedFile=q;c.photoUploadData.dataUrl=s.dataUrl;c.photoUploadData.hasSelectedPhoto=true;
var r=f.calculateOffsets(s.dimensions,150);c.photoUploadData.style={"background-image":"url("+s.dataUrl+")","background-position":(r.xOffset==0?"50%":r.xOffset+"px")+" "+(r.yOffset==0?"50%":r.yOffset+"px")}
},function(r){c.$emit("notify",r.error,null,"failure")})}};c.onFileSelect=l;var n=function(p){c.facebookShare.shareData.madeItPhotoURL=p.largePhotoUrl;
c.photoUploadData.hasUploadedPhoto=true;b.$broadcast("onMadeItModalPhotoUpload",p.smallPhotoUrl);j.push("add a photo",c.recipeId,"Action Complete",c.uploadFrom);
i()};var m=function(p){c.$emit("notify",p,null,"failure")};c.$on("onPhotoUpload",function(p,q){c.facebookShare.shareData.madeItPhotoURL=q;
c.photoUploadData.hasUploadedPhoto=true});var h=function(){a.find("[ng-file-select]").val("")}}]);
//
// source/angular/controllers/madeItCtrl.js
//
"use strict";angular.module("allrecipes").controller("ar_controllers_made_it",["$scope","$window","$rootScope","arLogin","ar_services_made_it","ar_services_review_rating","perishableLocalstorage","$q","$timeout","datalayerEvent","$location","$anchorScroll","ar_services_url","ar_services_user","ngDialog","Constant",function(e,g,d,l,h,i,x,c,f,n,b,a,j,k,w,m){e.madeItButtonIsHighlighted=false;
e.recipeid=0;e.madeCount=0;e.madeCountRunningTotal=0;e.rating=0;e.shouldShowReviews=false;e.showRate=false;e.isDirty=false;e.totalRecipeMadeCount=0;
e.areReviewsReadOnly=false;e.reviewLastUpdatedDate=null;e.hasMadeIt=false;e.user={};e.modalConfig=null;e.madeItPhotoURL=null;
e.isReady=false;var v="MadeRecipes"+l.userId;var u=l.userId!==0?x.get(v):[];var y;var z="";e.init=function(E,D,F,H,J,I,K,G){e.totalRecipeMadeCount=G;
e.recipeid=E;e.reviewLastUpdatedDate=H;e.user={followersCount:J,favoritesCount:I,madeRecipesCount:K};if(!g.pubsub.isListening("A.MadeIt.Add.Event","MadeIt.Controller")){g.pubsub.listen("A.MadeIt.Add.Event","MadeIt.Controller",e.save)
}if(u===null||u===undefined){u=[];if(l.isLoggedIn()){y=h.query().$promise;y.then(function(L){x.set(v,L);u=L;e.madeCount=p();e.madeCountRunningTotal=q()
})}else{y=c.when(u)}}else{y=c.when(u);e.madeCount=p();e.madeCountRunningTotal=q()}B(D);e.review=F===undefined||F===null?"":F;
z=e.review;e.showRate=(e.rating>0||e.review.length>0);e.isReadOnly=(e.rating>0||e.review.length>0);if(e.isReadOnly&&j.getQueryStringValue("editReview")==1){e.isReadOnly=false;
b.hash("recipe-toolbar");a()}t();e.modalConfig={template:"/templates/IMadeItModal.html?v="+m.version,className:"ngdialog-theme-madeit",};
e.isReady=true};var A=function(){d.$emit("onRatingClick",false)};var t=function(){if(e.review.length>0){var D=angular.element("#reviewLabel");
if(D.length>0){D.hide()}}};e.cancelEdit=function(){e.isReadOnly=true;e.review=z};var C=function(D){e.showRate=D};d.$on("onRatingClick",function(D,E,F){if(F){e.fromStickyNav=F.fromStickyNav
}C(E)});var s=function(){A()};var o=angular.element("#div-gpt-ad-footer");e.hideAds=function(){o.hide()};e.showAds=function(){o.show()
};e.starOnClick=function(D,E,F){B(D,E,F);if(F==="Recipe"){i.save({recipeId:E,rating:e.rating,text:e.review,ignoreReview:true})
}else{i.savePersonalRecipeReview({recipeId:E,rating:e.rating,text:e.review,ignoreReview:true})}d.$emit("onReviewSaved",true);
k.getPrivate().$promise.then(function(G){e.user=G})};e.reviewOnChange=function(){e.isDirty=true};e.onEditReviewClick=function(){e.isReadOnly=false;
z=e.review};var B=function(E){e.rating=E;var D=function(G){var F=G<=E?"rate-star-single star-rating":"rate-star-single";return F
};e.styleStar1=D(1);e.styleStar2=D(2);e.styleStar3=D(3);e.styleStar4=D(4);e.styleStar5=D(5)};e.saveReview=function(F,D,E){if(typeof e.rating=="undefined"||e.rating<=0){e.$emit("notify","Oops! You need to select a star rating.",null,"failure")
}else{if(E=="Recipe"){e.saved=i.save({recipeId:D,rating:e.rating,text:e.review,ignoreReview:false})}else{e.saved=i.savePersonalRecipeReview({recipeId:D,rating:e.rating,text:e.review,ignoreReview:false})
}e.saved.$promise.then(function(H){e.reviewLastUpdatedDate=H.dateUpdated;e.isDirty=false;e.$emit("notify","Review saved.",null,"success");
var G=(e.fromStickyNav?"sticky nav 4":"recipe button");n.push("rate/review recipe",D,"Action Complete",G);e.isReadOnly=true;t();
d.$emit("onReviewSaved",true);k.getPrivate().$promise.then(function(I){e.user=I})},function(G){if(G.status!==401){e.$emit("notify","Oops! We couldn’t save your review. Try again in just a moment.",null,"failure")
}})}};var r=function(D){if(D==="undo"){e.remove()}};e.save=function(){var D=ar.models.madeItPost(e.recipeid,"AddMadeIt");h.save(D).$promise.then(function(){e.updateMadeCount(1);
e.madeItButtonIsHighlighted=true;g.pubsub.broadcast("IMadeIt");n.push("i made it",e.recipeid,"Action Complete");e.modalConfig.data={madeCount:e.madeCount,totalRecipeMadeCount:e.totalRecipeMadeCount,madeItPhotoUrl:e.madeItPhotoURL};
w.openConfirm(e.modalConfig).then(function(){},r)},function(E){})};e.remove=function(){var D=ar.models.madeItUndo(e.recipeid);
h.remove(D).$promise.then(function(){e.madeItButtonIsHighlighted=false;if(e.madeCount<=1){e.shouldShowReviews=false}e.updateMadeCount(-1);
e.$emit("cancelNotification");g.pubsub.broadcast("A.Recipe.RateAndReview.ClickEvent",[e.shouldShowReviews])},function(E){})};
var p=function(){var E=u.filter(function(F){return F.recipeID===e.recipeid});var D=(E.length>0)?E[0].count:0;return D};var q=function(){var E=0;
for(var D=0;D<u.length;D++){E+=u[D].count}return E};e.updateMadeCount=function(E){e.madeCount=e.madeCount+E;e.totalRecipeMadeCount=e.totalRecipeMadeCount+E;
e.madeCountRunningTotal=e.madeCountRunningTotal+E;if(u!==null&&u!==undefined){var F=u.map(function(H,G){if(H.recipeID===e.recipeid){return G
}});if(F.length>0){for(var D=0;D<F.length;D++){if(F[D]!==undefined){u.splice(F[D],1)}}}}if(e.madeCount>0){u.push({recipeID:e.recipeid,count:e.madeCount})
}x.set(v,u)};e.$on("onPhotoUpload",function(D,E){e.madeItPhotoURL=E})}]);
//
// source/angular/controllers/madeItNotYetCtrl.js
//
"use strict";angular.module("allrecipes").controller("ar_controllers_havent_made_it_yet",["$scope","$window","$rootScope","arLogin","ar_services_made_it","ar_services_review_rating","perishableLocalstorage","$q","$timeout","datalayerEvent",function(c,e,b,h,f,g,q,a,d,i){c.madeItButtonIsHighlighted=false;
c.recipeid=0;c.madeCount=0;c.madeCountRunningTotal=0;c.rating=0;c.shouldShowReviews=false;c.showRate=false;c.isDirty=false;c.areReviewsReadOnly=false;
c.reviewLastUpdatedDate=null;var p="MadeRecipes"+h.userId;var o=h.userId!==0?q.get(p):[];var r;var s="";c.init=function(x,w,y,z){c.recipeid=x;
c.reviewLastUpdatedDate=z;if(!e.pubsub.isListening("A.MadeIt.Add.Event","MadeIt.Controller")){e.pubsub.listen("A.MadeIt.Add.Event","MadeIt.Controller",c.save)
}if(o===null||o===undefined){o=[];if(h.isLoggedIn()){r=f.query().$promise;r.then(function(A){q.set(p,A);o=A;c.madeCount=k();c.madeCountRunningTotal=l()
})}else{r=a.when(o)}}else{r=a.when(o);c.madeCount=k();c.madeCountRunningTotal=l()}u(w);c.review=y===undefined||y===null?"":y;
s=c.review;c.showRate=false;c.isReadOnly=false;n()};var t=function(){b.$emit("onRatingClick",false)};var n=function(){if(c.review.length>0){var w=angular.element(document.getElementById("reviewLabel"));
w.hide()}};c.cancelEdit=function(){c.isReadOnly=true;c.review=s};c.hide=function(){m();c.review=s};var v=function(w){c.showRate=w
};b.$on("onRatingClick",function(w,x,y){if(y){c.fromStickyNav=y.fromStickyNav}v(x)});var m=function(){t()};var j=angular.element("#div-gpt-ad-footer");
c.hideAds=function(){j.hide()};c.showAds=function(){j.show()};c.starOnClick=function(w,x,y){u(w,x,y)};c.reviewOnChange=function(){c.isDirty=true
};c.onEditReviewClick=function(){c.isReadOnly=false;s=c.review};var u=function(x){c.rating=x;var w=function(z){var y=z<=x?"rate-star-single star-rating":"rate-star-single";
return y};c.styleStar1=w(1);c.styleStar2=w(2);c.styleStar3=w(3);c.styleStar4=w(4);c.styleStar5=w(5)};c.saveReview=function(y,w,x){if(typeof c.rating=="undefined"||c.rating<=0){c.$emit("notify","Oops! You need to select a star rating.",null,"failure")
}else{if(x=="Recipe"){c.saved=g.save({recipeId:w,rating:c.rating,text:c.review,ignoreReview:false})}else{c.saved=g.savePersonalRecipeReview({recipeId:w,rating:c.rating,text:c.review,ignoreReview:false})
}c.saved.$promise.then(function(A){c.reviewLastUpdatedDate=A.dateUpdated;c.isDirty=false;c.$emit("notify","Review saved.",null,"success");
var z=(c.fromStickyNav?"sticky nav 4":"recipe button");i.push("rate/review recipe",w,"Action Complete",z);c.isReadOnly=true;n()
},function(z){if(z.status!==401){c.$emit("notify","Oops! We couldn’t save your review. Try again in just a moment.",null,"failure")
}})}};c.save=function(){var w=ar.models.madeItPost(c.recipeid,"AddMadeIt");f.save(w).$promise.then(function(){c.updateMadeCount(1);
c.shouldShowReviews=true;e.pubsub.broadcast("A.Recipe.RateAndReview.ClickEvent",[c.shouldShowReviews]);c.madeItButtonIsHighlighted=true;
e.pubsub.broadcast("IMadeIt");i.push("i made it",c.recipeid,"Action Complete");c.$emit("notify","Congrats on making this recipe!",5000,"success","Oops, I haven't made it yet","remove")
},function(x){})};c.remove=function(){var w=ar.models.madeItUndo(c.recipeid);f.remove(w).$promise.then(function(){c.madeItButtonIsHighlighted=false;
if(c.madeCount<=1){c.shouldShowReviews=false}c.updateMadeCount(-1);c.$emit("cancelNotification");e.pubsub.broadcast("A.Recipe.RateAndReview.ClickEvent",[c.shouldShowReviews])
},function(x){})};var k=function(){var x=o.filter(function(y){return y.recipeID===c.recipeid});var w=(x.length>0)?x[0].count:0;
return w};var l=function(){var w=(o)?o.length:0;return w};c.updateMadeCount=function(x){c.madeCount=c.madeCount+x;c.madeCountRunningTotal=c.madeCountRunningTotal+x;
if(o!==null&&o!==undefined){var y=o.map(function(A,z){if(A.recipeID===c.recipeid){return z}});if(y.length>0){for(var w=0;w<y.length;
w++){if(y[w]!==undefined){o.splice(y[w],1)}}}}if(c.madeCount>0){o.push({recipeID:c.recipeid,count:c.madeCount})}q.set(p,o)}}]);
//
// source/angular/controllers/reviewCtrl.js
//
"use strict";angular.module("allrecipes").controller("ar_controllers_recipe_reviews",["$scope","$window","$sce","arLogin","$compile","$location","$anchorScroll","ar_services_reviews","ar_services_review_helpful","$cookies","$rootScope","datalayerEvent",function(g,h,f,k,b,d,a,j,i,c,e,l){g.reviews=[];
g.styleHelpfulIcon="icon--helpful-thumb";g.init=function(t,r,s,u,q){g.recipeId=t;g.pageNumber=r;g.pageSize=s;g.recipeType=u;g.rateReviewIconIsHighlighted=false;
g.availablePages=q;g.moreReviewsAvailable=(q>1);a();p()};var m=false;g.dynamicAdSlotCount=0;g.adSlotId=function(){return"ad-reviews-"+g.dynamicAdSlotCount
};var p=function(){h.pubsub.listen("A.Recipe.RateAndReview.ClickEvent","RecipeReviews.Controller",o)};var n=function(q){g.rateReviewIconIsHighlighted=q
};e.$on("onRatingClick",function(q,r){n(r)});g.getReviews=function(){g.dynamicAdSlotCount+=1;l.push("more recipe reviews",g.recipeId,"Action Complete","more recipe reviews");
j.getReviews(g.recipeId,g.pageNumber,g.pageSize,g.recipeType).then(function(q){var r=f.trustAsHtml(q.data);if(r){g.reviews.push(r);
g.pageNumber++;if(g.pageNumber>g.availablePages){g.moreReviewsAvailable=false}}},function(q){g.reviewsErrorMessage=q.data.message
})};g.clickHelpful=function(q,x){var r=angular.element(q.target);var w=r.hasClass(g.styleHelpfulIcon);var t;var s;if(w){t=r.children().first();
s=r}else{t=r;s=r.parent()}var v="up";var u=s.hasClass(v);if(u){return}g.saved=i.save({recipeId:g.recipeId,reviewId:x,guid:c.ARSiteUser});
g.saved.$promise.then(function(){var y=parseInt(t.text())+1;t.text(y);s.addClass(v)},function(y){g.ClickHelpfulErrorMessage=y.data.message
})};g.recipeReviewsToggleRating=k.ensureUserIsLoggedIn(function(){m=!m;e.$emit("onRatingClick",m);d.hash("recipe-toolbar");a()
});var o=function(q,r){e.$emit("onRatingClick",q,r)}}]);
//
// source/angular/controllers/recipeSaveCtrl.js
//
"use strict";angular.module("allrecipes").controller("ar_controllers_recipe_save",["$scope","$window","arRecipeSave",function(a,b,c){var f=this;
a.recipeBoxId="";a.saved=false;a.init=function(g,h){f.id=g;f.type=h};var e=function(g){a.saved=!a.saved;a.recipeBoxItemID=g.recipeBoxItemID;
a.$emit("notify","Recipe "+(a.saved?"saved":"removed"),null,"success")};var d=function(){a.recipeBoxItemID=0};a.save=function(){if(a.saved){c.remove(a.recipeBoxItemID,f.id,{success:e,failure:d})
}else{c.save(f.id,f.type,null,null,"recipe button",{success:e,failure:d})}};a.btnSaveToRecipeBoxOnClick=function(g){b.pubsub.broadcast("A.Recipe.Save.ClickEvent",[{recipeID:f.id,type:f.type,source:"recipe button"}])
}}]);
//
// source/angular/controllers/expandDescriptionCtrl.js
//
"use strict";angular.module("allrecipes").controller("ar_controllers_expand_description",["$scope",function(a){a.style="icon--chevron-closed";
a.setStartingStyle=function(b){a.descriptionStyle=b};a.open=function(){a.style="icon--chevron-opened";a.descriptionStyle=a.descriptionStyle+" expanded"
}}]);
//
// source/angular/controllers/shareRecipeCtrl.js
//
angular.module("allrecipes").controller("ar_controllers_share_recipe",["$scope","$window","arLogin","ar_services_email","datalayerEvent",function(a,b,d,c,e){a.showForm=false;
a.success=false;a.AddEmailEnabled=false;a.errorMessage="";a.toEmailAddress="";a.fromName="";a.emailNote="";a.emailPlaceholderText="Recipient's email";
a.toEmailList=[];a.toggleEmailForm=d.ensureUserIsLoggedIn(function(){a.showForm=!a.showForm});a.socialShareStart=function(k,j){pubsub.broadcast("SocialShareStart");
e.push(j+" button",k,"Action Complete","social "+j)};a.socialShareNavigate=function(j,k){b.open(j,k)};var g=angular.element("#div-gpt-ad-footer");
a.hideAds=function(){g.hide()};a.showAds=function(){g.show()};a.addEmail=function(){if(a.emailForm.txtEmail.$error.email){a.validationMessage="Sorry, that's not a working email address.";
a.$emit("notify",a.validationMessage,null,"failure");return}if(a.toEmailList.length==5){a.$emit("notify","Sorry! Only 5 at a time!",null,"failure");
return}var j={id:a.toEmailList.length+1,address:a.toEmailAddress};a.toEmailList.push(j);a.emailPlaceholderText="Add recipient (optional)";
a.toEmailAddress="";a.AddEmailEnabled=false};a.deleteEmail=function(k){for(var l=0;l<a.toEmailList.length;l++){var j=a.toEmailList[l];
if(j.address===k){a.toEmailList.splice(l,1);break}}};var i=function(l,m){var o="";for(var k=0;k<a.toEmailList.length;k++){if(k>0){o+=","
}o+=a.toEmailList[k].address}var j={itemType:m,id:l,toAddress:o,fromName:a.fromName,note:a.emailNote,};a.sendForm=c.send(j);var n=function(p){a.success=p;
a.errorMessage=p?"":"Oops! We couldn’t send your email. Try again in just a moment.";a.showForm=!p;a.successMessage=p?"Success! Thanks for sharing.":"";
if(p){a.$emit("notify",a.successMessage,null,"success");e.push("email ".concat(j.itemType),j.id,"Action Complete")}};a.sendForm.$promise.then(function(){n(true)
},function(){n(false)})};var h=function(){return a.emailForm.$valid&&a.toEmailList.length>0};var f=function(){var j=a.emailForm;
a.validationMessage=a.toEmailList.length===0?"Oops! What's the recipient's email address?":j.txtName.$error.required?"Oops, don't forget your name!":"";
a.$emit("notify",a.validationMessage,null,"failure")};a.sendEmail=function(j,k){if(a.toEmailAddress){a.addEmail()}if(h()){i(j,k)
}else{f()}};a.cancel=function(){a.showForm=false}}]);
//
// source/angular/controllers/reviewSaveCtrl.js
//
"use strict";angular.module("allrecipes").controller("ar_controllers_review_save",["$scope","$log","ar_services_review_rating","$rootScope","datalayerEvent",function(c,a,d,b,e){c.init=function(l,m){j(l);
c.review=m;c.isReadOnly=(l>0||m.length>0);k(c.isReadOnly);h()};c.showRate=false;c.isDirty=false;c.isReadOnly=false;var i=function(){b.$emit("onRatingClick",false)
};var h=function(){if(c.review.length>0){var l=angular.element(document.getElementById("reviewLabel"));l.hide()}};c.hide=function(){g()
};var k=function(l){c.showRate=l};b.$on("onRatingClick",function(l,m,n){if(n){c.fromStickyNav=n.fromStickyNav}k(m)});var g=function(){i()
};var f=angular.element("#div-gpt-ad-footer");c.hideAds=function(){f.hide()};c.showAds=function(){f.show()};c.starOnClick=function(l){j(l);
c.isDirty=true};c.reviewOnChange=function(){c.isDirty=true};c.onEditReviewClick=function(){c.isReadOnly=false};var j=function(m){c.rating=m;
var l=function(o){var n=o<=m?"rate-star-single star-rating":"rate-star-single";return n};c.styleStar1=l(1);c.styleStar2=l(2);
c.styleStar3=l(3);c.styleStar4=l(4);c.styleStar5=l(5)};c.saveReview=function(n,l,m){if(typeof c.rating=="undefined"||c.rating<=0){c.$emit("notify","Oops! You need to select a star rating.",null,"failure")
}else{if(m=="Recipe"){c.saved=d.save({recipeId:l,rating:c.rating,text:c.review})}else{c.saved=d.savePersonalRecipeReview({recipeId:l,rating:c.rating,text:c.review})
}c.saved.$promise.then(function(){c.isDirty=false;c.$emit("notify","Review saved.",null,"success");var o=(c.fromStickyNav?"sticky nav 4":"recipe button");
e.push("rate/review recipe",l,"Action Complete",o);c.isReadOnly=true;h()},function(o){if(o.status!==401){c.$emit("notify","Oops! We couldn’t save your review. Try again in just a moment.",null,"failure")
}})}}}]);
//
// source/angular/controllers/ingredientCtrl.js
//
"use strict";angular.module("allrecipes").controller("ar_controllers_recipe_ingredient",["$scope","$log","$window","$filter","ar_services_ingredients","ar_services_shopping_list","datalayerEvent",function(c,b,d,a,e,f,g){c.ingredients=[];
c.ingredientColumns=[];c.reloaded=false;c.nutritionOn=false;c.servingsOn=false;c.isMetric=false;c.adjustedServings=0;c.footerAd=angular.element("#div-gpt-ad-footer");
c.init=function(j,h,i,k){c.servings=j;c.adjustedServings=j;c.recipeId=h;c.recipeType=i;c.userId=k};c.toggleServings=function(){c.nutritionOn=false;
c.servingsOn=!c.servingsOn};c.toggleNutrition=function(){c.servingsOn=false;c.nutritionOn=!c.nutritionOn};c.hideAds=function(){c.footerAd.hide()
};c.showAds=function(){c.footerAd.show()};c.ingredientsLoaded=function(){window.pubsub.broadcast("Ingredients.LoadedFromService")
};c.calculateColumns=function(){var j=[];var m=Math.ceil(c.ingredients.length/2);var l=1;for(var k=0;k<c.ingredients.length;k+=m){var h={index:l++,start:k,end:Math.min(k+m,c.ingredients.length)};
j.push(h)}c.ingredientColumns=j};c.getIngredients=function(i,k,h){if(k=="Recipe"){if(c.servings<1||typeof c.servings=="undefined"){c.$emit("notify","Serving must be between 1 and 300.",null,"failure");
return}if(c.servings>300){c.$emit("notify","Feeding a small army? Sorry, serving size must be between 1 and 300.",null,"failure")
}else{var j=e.query({recipeId:i,servings:c.servings,isMetric:c.isMetric});j.$promise.then(function(m){var l=[];angular.forEach(m.ingredients,function(o,n){if(o.displayType!="BlankLine"){o.sequenceNbr=n+1;
o.isSaved=false;l.push(o)}});if(c.reloaded===false){c.reloaded=true}c.ingredients=l;c.calculateColumns();c.adjustedServings=c.servings;
if(h){c.$emit("notify","Ingredient quantities updated.",null,"success")}},function(l){var m=l.data.data.message;c.$emit("notify",m,null,"failure");
c.reloaded=false})}}};c.shoppingListRecipeId="";c.saveRecipe=function(j,k){pubsub.broadcast("ShoppingListSave");if(k=="Recipe"){var i=ar.models.shoppingListRecipePost(j,c.servings,"AddRecipeToShoppingList");
c.saved=f.saveRecipe(i)}else{if(k=="Personal"||k=="Custom"){var h=ar.models.shoppingListRecipePost(j,c.servings,"AddPersonalRecipeToShoppingList");
c.saved=f.savePersonalRecipe(h)}}c.saved.$promise.then(function(l){c.shoppingListRecipeId=l.shoppingListRecipeId;c.$emit("notify","Shopping list saved.",null,"success");
g.push("add recipe to shopping list",c.recipeId,"Action Complete")},function(){c.shoppingListRecipeId=0})};c.saveIngredient=function(h,j){if(typeof j==="number"){j={ingredientID:j,isSaved:false}
}if(j.isSaved){h.target.checked=true;return}var i=h.target.checked;if(i){if(c.recipeType==="Recipe"){pubsub.broadcast("ShoppingListSave");
var k=ar.models.shoppingListIngredientPost(j.ingredientID,c.recipeId,c.servings,"AddIngredientToShoppingList");c.saved=f.saveIngredient(k);
c.saved.$promise.then(function(){c.$emit("notify","Added to shopping list.",null,"success");j.isSaved=true;g.push("add grocery item",c.recipeId,"Action Complete")
},function(){if(h!==undefined&&h!==null){h.target.checked=false}})}}}}]);
//
// source/angular/filters/slice-filter.js
//
"use strict";angular.module("allrecipes").filter("ar_filters_slice",function(){return function(a,c,b){return a.slice(c,b)}});
//
// source/angular/controllers/directionsCtrl.js
//
"use strict";angular.module("allrecipes").controller("ar_controllers_directions",["$scope","$rootScope","arRecipeBoxStorage","ar_services_recipebox",function(b,a,d,c){b.init=function(e){b.recipeId=e;
d.hasRecipeId(b.recipeId,"recipe").then(function(f){if(f){c.getRecipeById({id:e}).$promise.then(function(g){b.itemNote=g.itemNote
})}})};b.addPhoto=function(e){a.$emit("onAddPhoto",e)};b.requestVideo=function(){a.$emit("requestVideo")}}]);
//
// source/angular/controllers/videoPlayerCtrl.js
//
"use strict";var AR=AR||{};AR.Video=AR.Video||{};angular.module("allrecipes").controller("ar_controllers_video_player",["$scope","$window","$rootScope",function(b,c,a){var e;
b.showplayer=false;b.init=function(g,j,f,i,h){if(c.brightcove){c.brightcove.createExperiences();AR.Video.Brightcove.SetAdData(g,j,f);
AR.Video.Brightcove.SetKraftData(h,i)}};b.initResponsive=function(g,i,f,h){if(c.videojs){e=c.videojs("video-player");e.ima3.settings.serverUrl=d(g,i,f,h);
e.ima3.settings.prerollTimeout=5000;e.ima3.settings.loadingSpinner=true;e.endScreen();e.ready(function(){this.one("contentplayback",function(){pubsub.broadcast("VideoStart",[{videoId:h}])
})})}};b.enablePlayer=function(){b.showplayer=true;e.play()};a.$on("requestVideo",function(){b.enablePlayer()});var d=function(i,k,h,j){var g=false;
var f="http://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/3865/";if(i!=="undefined"&&i.length>0){f=f+"ar.mobile.video"
}if(k!=="undefined"&&k.length>0){f=f+"/"+k}if(j!=="undefined"&&j>0){f=f+"&cust_params=v%3D"+j;g=true}if(h!=="undefined"&&h.length>0){if(!g){f=f+"&cust_params="
}f=f+"%26advertest%3D"+h}return f+"&ciu_szs=300x250%2C728x90&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]"
}}]);(function(i){var g;var l;var a;var f;var c=false;var d=false;var b;var h;var e;var k;i.SetKraftData=function(n,m){e=n;k=parseInt(m);
f=Math.floor(Math.random()*1e+16)};i.SetAdData=function(n,p,m){var o="http://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/3865/";
if(n!=="undefined"&&n.length>0){o=o+"ar.mobile.video"}if(p!=="undefined"&&p.length>0){o=o+"/"+p}o=o+"&ciu_szs&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&m_ast=vast";
b=o;if(m!=="undefined"&&m.length>0){h="advertest="+m}};i.OnMediaEventBegin=function(){if(!c&&e.indexOf(k)>-1){$("body").append('<IFRAME SRC="http://ad.doubleclick.net/adi/N7954.1043.MEREDITHCORPORATION/B7989229.106008831;sz=1x1;click=;ord='+f+'?" WIDTH=1 HEIGHT=1 MARGINWIDTH=0 MARGINHEIGHT=0 HSPACE=0 VSPACE=0 FRAMEBORDER=0 SCROLLING=no BORDERCOLOR="#000000"><SCRIPT language="JavaScript1.1" SRC="http://ad.doubleclick.net/adj/N7954.1043.MEREDITHCORPORATION/B7989229.106008831;abr=!ie;sz=1x1;click=;ord='+AR.Ads.Ord+'?"></SCRIPT><NOSCRIPT><A HREF="http://ad.doubleclick.net/jump/N7954.1043.MEREDITHCORPORATION/B7989229.106008831;abr=!ie4;abr=!ie5;sz=1x1;ord='+AR.Ads.Ord+'?"><IMG SRC="http://ad.doubleclick.net/ad/N7954.1043.MEREDITHCORPORATION/B7989229.106008831;abr=!ie4;abr=!ie5;sz=1x1;ord='+AR.Ads.Ord+'?" BORDER=0 WIDTH=1 HEIGHT=1 ALT="Advertisement"></A></NOSCRIPT></IFRAME>');
c=true}if(!d){pubsub.broadcast("VideoStart");d=true}};i.OnAdEventStart=function(){if(!d){pubsub.broadcast("VideoStart");d=true
}};var j=(function(){a.getAdPolicy(function(m){var n=m;n.adServerUrl=b;n.prerollAdKeys=h;a.setAdPolicy(n)})});i.OnTemplateLoaded=function(m){g=window.brightcove.api.getExperience(m)
};i.OnTemplateReady=function(){l=g.getModule(window.brightcove.api.modules.APIModules.VIDEO_PLAYER);a=g.getModule(window.brightcove.api.modules.APIModules.ADVERTISING);
if(l){l.addEventListener(window.brightcove.api.events.MediaEvent.BEGIN,i.OnMediaEventBegin)}if(a){a.addEventListener(window.brightcove.api.events.AdEvent.START,i.OnAdEventStart)
}j()}}(AR.Video.Brightcove=AR.Video.Brightcove||{}));
//
// source/angular/directives/scrollToAnchor.js
//
"use strict";angular.module("allrecipes").directive("scrollToAnchor",["$anchorScroll",function(a){return{link:function(e,d,c){var b=c.scrollToAnchor;
d.click(function(){if(typeof b!=="undefined"&&b){var f=$("#"+b);var g=f.offset().top-60;var h=(g)<0?0:g;$("html, body").animate({scrollTop:h},"5000");
a()}})}}}]);
//
// source/angular/directives/repeatComplete.js
//
"use strict";angular.module("allrecipes").directive("repeatComplete",function(){return{restrict:"A",link:function(c,b,a){if(c.$last===true){console.debug("repeat complete");
c.$evalAsync(a.repeatComplete)}}}});
//
// source/angular/directives/recipeNav.js
//
"use strict";angular.module("allrecipes").directive("scroll",["$window",function(a){return function(d,c,b){angular.element(a).bind("scroll touchend",function(){if(this.pageYOffset>=90){d.boolChangeClass=true
}else{d.boolChangeClass=false}d.$apply()})}}]);
//
// source/angular/controllers/recipeNavCtrl.js 
//
"use strict";angular.module("allrecipes").controller("ar_controllers_recipe_nav",["$scope","$window","arLogin","$location","$anchorScroll",function(c,d,e,b,a){c.enableNavPhotoUpload=e.ensureUserIsLoggedIn();
c.saveOnClick=function(g,i,h,f){d.pubsub.broadcast("A.Recipe.Save.ClickEvent",[{recipeID:parseInt(g),type:i,title:h,imageUrl:f,source:"sticky nav 1"}])
};c.rateItOnClick=function(f){if(!f){var g=((window.location.href.indexOf("?")<0)?"?":"&")+"deferred="+JSON.stringify({deferredActionName:"OpenRatingSection"});
e.goToSignInPage(encodeURIComponent(window.location.href+g))}else{d.pubsub.broadcast("A.Recipe.RateAndReview.ClickEvent",[f,{fromStickyNav:true}]);
b.hash("recipe-toolbar");a()}};c.addPicOnClick=function(f){d.pubsub.broadcast("A.Recipe.AddPhoto.ClickEvent",[{files:f,source:"sticky nav 3"}])
};c.printCss=function(){c.isPrint=true;var h=navigator.userAgent.toLowerCase();var f=/android/i;var g=f.exec(h);if(g=="android"){c.isPrint=false
}};c.printCss()}]);
//
// source/angular/services/facebookapi-service.js
//
"use strict";angular.module("allrecipes").service("ar_facebook_api_service",["$window",function(a){a.fbAsyncInit=function(){FB.init({appId:66102450266,status:true,cookie:true,xfbml:true,version:"v2.3",})
};(function(b,g,e){var f,c=b.getElementsByTagName(g)[0];if(b.getElementById(e)){return}f=b.createElement(g);f.id=e;f.src="//connect.facebook.net/en_US/sdk.js";
c.parentNode.insertBefore(f,c)}(document,"script","facebook-jssdk"));return{openIMadeItShare:function(c,b){a.FB.ui({method:"share_open_graph",action_type:"allrecipes:make",action_properties:JSON.stringify({recipe:c})},function(){if(b){b()
}})}}}]);
//
// source/angular/services/email-provider.js
//
angular.module("allrecipes").factory("ar_services_email",["ar_services_environment","$resource","ar_services_token",function(b,a,c){var d=b.url+"v1/email";
return a(d,{},{send:{url:d,method:"POST",isArray:false,headers:{Authorization:function(){var e=c.token();return e}}}})}]);
//
// source/angular/services/ingredient-provider.js
//
"use strict";angular.module("allrecipes").factory("ar_services_ingredients",["ar_services_environment","$resource","ar_services_token",function(b,a,c){var d=b.url+"v1/recipes/:recipeId";
return a(d,{servings:"@servings",ismetric:"@ismetric"},{query:{url:d,method:"GET",isArray:false,headers:{Authorization:function(){var e=c.token();
return e}}}})}]);
//
// source/angular/services/review-provider.js
//
"use strict";angular.module("allrecipes").factory("ar_services_reviews",["$http",function(a){var b=function(e,c,d,f){var g="/recipe/getreviews/?recipeid="+e+"&pagenumber="+c+"&pagesize="+d+"&recipeType="+f;
return a.get(g)};return{getReviews:b}}]).factory("ar_rest_services_reviews",["ar_services_environment","$resource","ar_services_token",function(b,a,c){var d=b.url+"v1/reviews/:reviewId/";
return a(d,{recipeId:"@recipeId",userid:"@userid"},{save:{url:d,method:"POST",isArray:false,headers:{Authorization:function(){var e=c.token();
return e}}},remove:{url:d,method:"DELETE",isArray:false,headers:{Authorization:function(){var e=c.token();return e}}},privateProfile:{url:b.url+"v1/users/me/reviews",method:"GET",isArray:false,headers:{Authorization:function(){var e=c.token();
return e}}},publicProfile:{url:b.url+"v1/users/:userid/reviews",method:"GET",isArray:false,headers:{Authorization:function(){var e=c.token();
return e}}}})}]);
//
// source/angular/services/reviewhelpful-provider.js
//
"use strict";angular.module("allrecipes").factory("ar_services_review_helpful",["ar_services_environment","$resource","ar_services_token",function(b,a,c){var d=b.url+"v2/recipes/:recipeId/reviews/:reviewId/user/:guid/increment-helpful-count-anon";
return a(d,{recipeId:"@recipeId",reviewId:"@reviewId",guid:"@guid"},{save:{url:d,method:"POST",isArray:false,headers:{Authorization:function(){var e=c.token();
return e}}}})}]);
//
// source/angular/services/reviewsave-provider.js
//
"use strict";angular.module("allrecipes").factory("ar_services_review_rating",["ar_services_environment","$resource","ar_services_token",function(b,a,c){return a(b.url+"v1/recipes/:recipeId/reviews",{recipeId:"@recipeId"},{save:{url:b.url+"v1/recipes/:recipeId/reviews",method:"POST",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}},savePersonalRecipeReview:{url:b.url+"v1/personal-recipes/:recipeId/reviews",method:"POST",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}}})}]);
//
// source/angular/services/recipebox-provider.js
//
"use strict";angular.module("allrecipes").factory("ar_services_recipebox",["ar_services_environment","$resource","ar_services_token",function(b,a,c){var e=b.url+"v1/users/me/recipe-box/recipes";
var d=b.url+"v1/users/me/recipe-box/folders/";return a(e,{id:"@id",cookid:"@cookid"},{query:{url:e,method:"GET",isArray:false,headers:{Authorization:function(){var f=c.token();
return f}}},save:{url:e,method:"POST",isArray:false,headers:{Authorization:function(){var f=c.token();return f}}},remove:{url:b.url+"v1/users/me/recipe-box/recipe/:id",method:"DELETE",isArray:false,headers:{Authorization:c.token}},removeFavorite:{url:b.url+"v1/users/me/recipe-box/recipes/:id",method:"DELETE",isArray:false,headers:{Authorization:c.token}},queryFolder:{url:d+":folderId/recipes",method:"GET",isArray:false,headers:{Authorization:function(){var f=c.token();
return f}}},getFolders:{url:d,method:"GET",isArray:false,headers:{Authorization:function(){var f=c.token();return f}}},getRecipeIds:{url:b.url+"v1/users/me/recipe-box/recipeids",method:"GET",isArray:true,headers:{Authorization:c.token}},getRecipeById:{url:b.url+"v1/users/me/recipe-box/recipe/:id",method:"GET",isArray:false,headers:{Authorization:c.token}},getRecipes:{url:b.url+"v1/users/me/recipes",method:"GET",isArray:false,headers:{Authorization:function(){var f=c.token();
return f}}},getSharedRecipes:{url:b.url+"v1/users/:userId/recipe-box/shared-recipes",method:"GET",isArray:false,headers:{Authorization:function(){var f=c.token();
return f}}},publicProfile:{url:b.url+"v1/users/:cookid/recipes",method:"GET",isArray:false,headers:{Authorization:function(){var f=c.token();
return f}}},getRecipeBoxRecipes:{url:b.url+"v1/users/me/recipe-box/recipesonly",method:"GET",isArray:false,headers:{Authorization:function(){var f=c.token();
return f}}},getRecipeBoxRecipesWithCollectionInfo:{url:b.url+"v1/users/me/recipe-box/recipesWithAdditionalCollectionInfo",method:"GET",isArray:false,headers:{Authorization:function(){var f=c.token();
return f}}},saveRecipeFromAd:{url:b.url+"v1/users/me/recipe-box/multiplerecipes",method:"POST",isArray:true,headers:{Authorization:function(){var f=c.token();
return f}}},})}]);
//
// source/angular/services/login-service.js
//
"use strict";angular.module("allrecipes").factory("arLogin",["$window",function(a){return{userId:((a.dataLayer&&a.dataLayer.user)?a.dataLayer.user[0].profile[0].profileInfo.profileId:0),goToSignInPage:function(b){a.location.href="/account/signin/?loginreferrerurl="+b+"&actionsource="+a.dataLayer.page.category.contentType
},isLoggedIn:function(){var b=AR.Account.VisitorInfo.VisitorStatus();return b!=null&&b.indexOf("loggedin")>0},ensureUserIsLoggedIn:function(b){var c=this;
return function(d){if(!d){c.goToSignInPage(a.location.href);return null}else{if(typeof b==="function"){return b()}else{return null
}}}}}}]);
//
// source/angular/services/shoppinglist-provider.js
//
"use strict";angular.module("allrecipes").factory("ar_services_shopping_list",["ar_services_environment","$resource","ar_services_token",function(b,a,c){return a(b.url+"v1/users/me/shopping-lists/default/recipes",{shoppinglistgroceryitemid:"@shoppinglistgroceryitemid",shoppinglistrecipeid:"@shoppinglistrecipeid",shoppinglistid:"@shoppinglistid",collectionId:"@collectionId"},{saveRecipe:{url:b.url+"v1/users/me/shopping-lists/default/recipes",method:"POST",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}},savePersonalRecipe:{url:b.url+"v1/users/me/shopping-lists/default/personal-recipes",method:"POST",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}},saveIngredient:{url:b.url+"v1/users/me/shopping-lists/default/ingredients",method:"POST",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}},query:{url:b.url+"v1/users/me/shopping-lists/default",method:"GET",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}},queryShoppingList:{url:b.url+"v1/users/me/shopping-lists/:shoppingListId",method:"GET",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}},queryShoppingLists:{url:b.url+"v1/users/me/shopping-lists/",method:"GET",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}},deleteIngredient:{url:b.url+"v1/users/me/shopping-lists/:shoppinglistid/grocery-items/:shoppinglistgroceryitemid",method:"DELETE",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}},deleteRecipe:{url:b.url+"v1/users/me/shopping-lists/:shoppinglistid/recipes/:shoppinglistrecipeid",method:"DELETE",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}},deletePersonalRecipe:{url:b.url+"v1/users/me/shopping-lists/:shoppinglistid/personal-recipes/:shoppinglistrecipeid",method:"DELETE",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}},saveWriteIns:{url:b.url+"v1/users/me/shopping-lists/default/write-ins",method:"POST",isArray:true,headers:{Authorization:function(){var d=c.token();
return d}}},saveRecipeFromAd:{url:b.url+"v1/users/me/shopping-lists/default/multiplerecipes",method:"POST",isArray:true,headers:{Authorization:function(){var d=c.token();
return d}}},saveCollection:{url:b.url+"v1/users/me/shopping-lists/default/:collectionId",method:"POST",isArray:false,headers:{Authorization:function(){var d=c.token();
return d}}}})}]);
//
// vendor/jquery/plugins/jquery-carousel.js
//
(function(a){var j="carousel",e="."+j,k="data-transition",l=j+"-transitioning",f=j+"-item",b=j+"-active",d=j+"-in",i=j+"-out",h=j+"-nav",m="transparent-nav",c=(function(){var n="webkit Moz O ms".split(" "),p=false,o;
while(n.length){o=n.shift()+"Transition";if(o in document.documentElement.style!==undefined&&o in document.documentElement.style!==false){p=true;
break}}return p}()),g={_create:function(){a(this).trigger("beforecreate."+j)[j]("_init")[j]("_addNextPrev").trigger("create."+j)
},_init:function(){var o=a(this).attr(k);if(!o){c=false}var n=a(this).children().first();return a(this).addClass(j+" "+(o?j+"-"+o:"")+" ").children().addClass(f).first().addClass(b)
},next:function(){a(this)[j]("goTo","+1")},prev:function(){a(this)[j]("goTo","-1")},goTo:function(s){var o=a(this),w=o.attr(k),v=" "+j+"-"+w+"-reverse";
a(this).find("."+f).removeClass([i,d,v].join(" "));var n=a(this).find("."+b),t=n.index(),q=(t<0?0:t)+1,r=typeof(s)==="number"?s:q+parseFloat(s),p=a(this).find(".carousel-item").eq(r-1),u=(typeof(s)==="string"&&!(parseFloat(s)))||r>q?"":v;
if(!p.length){p=a(this).find("."+f)[u.length?"last":"first"]()}o[j]("_unbindNavEventListeners");if(c){o[j]("_transitionStart",n,p,u)
}else{if(w=="slide"){if(p.data(m)===true){a(this).find("nav").addClass(m)}else{a(this).find("nav").removeClass(m)}a(":animated").promise().done(function(){var x="-100%";
p.css("z-index",3);if(t>=r){p.css("left","-100%");x="100%"}n.animate({left:x},300,function(){n.css("left","")});p.animate({left:0},300,function(){o[j]("_transitionEnd",n,p,u);
p.css("z-index","");p.css("left","")})})}else{p.addClass(b);o[j]("_transitionEnd",n,p,u)}}o.trigger("goto."+j,p);if(pubsub){pubsub.broadcast("JqueryCarousel.GoTo",[p.index()]);
if(o.data("pub-id")){pubsub.broadcast("JqueryCarousel.GoTo."+o.data("pub-id"),[p.index()])}}},update:function(){a(this).children().not("."+h).addClass(f);
return a(this).trigger("update."+j)},slideComplete:function(){},_transitionStart:function(n,p,r){var o=a(this);var q=false;p.one(navigator.userAgent.indexOf("AppleWebKit")>-1?"webkitTransitionEnd":"transitionend otransitionend",function(){if(!q){o[j]("_transitionEnd",n,p,r);
q=true}});if(navigator.userAgent.indexOf("MSIE 10")>-1){setTimeout(function(){if(!q){o[j]("_transitionEnd",n,p,r);q=true}},500)
}if(p.data(m)===true){a(this).find("nav").addClass(m)}else{a(this).find("nav").removeClass(m)}a(this).addClass(r);n.addClass(i);
p.addClass(d)},_transitionEnd:function(n,p,q){var o=a(this);o.removeClass(q);n.removeClass(i+" "+b);p.removeClass(d).addClass(b);
if(p.lazyload!=undefined){p.find("img").trigger("appear")}setTimeout(function(){o[j]("_bindEventListeners")},350)},_bindEventListeners:function(){var n=a(this).unbind("click.carouselNav").bind("click.carouselNav",function(p){var r=a(p.target).closest("a[href='#next'],a[href='#prev']");
if(r.length){var q=r.is("[href='#next']")?"next":"prev";n[j](q);if("pubsub" in window){var o=a(this).find("."+b);pubsub.broadcast("JqueryCarousel."+q,[o.index()+1])
}p.preventDefault();a(this)[j]("slideComplete",q)}});return this},_unbindNavEventListeners:function(){var n=a(this).unbind("click.carouselNav")
},_addNextPrev:function(){var n=(a(this).children().first().data(m)===true)?" "+m:"";return a(this).append("<nav class='"+h+n+"' style='"+(a(this).children(".carousel-item").length>1?"":"display:none")+"'><!--<a href='#' class='locate input-circle' title=''></a>--><a href='#next' class='next arrows input-circle' aria-hidden='true' title='Next'><span class='icon icon--chevron-right'></span></a></nav>")[j]("_bindEventListeners")
},destroy:function(){}};a.fn[j]=function(o,n,p,q){return this.each(function(){if(o&&typeof(o)==="string"){return a.fn[j].prototype[o].call(this,n,p,q)
}if(a(this).data(j+"data")){return a(this)}a(this).data(j+"active",true);a.fn[j].prototype._create.call(this)})};a.extend(a.fn[j].prototype,g);
a(function(){a(e)[j]()})}(jQuery));
//
// vendor/jquery/plugins/jquery-carousel.pagination.js
//
(function(a,g){var f="carousel",c="."+f+"[data-paginate]",d="pagination",b="page-active",e={_createPagination:function(){var j=a(this).find("."+f+"-nav"),i=a(this).find("."+f+"-item"),l=a("<div class='"+d+"'></div>"),k,m,h;
j.find("."+d).remove();i.each(function(n){k=n+1;m=a(this).attr("data-thumb");h="&nbsp;";if(m){h="<img src='"+m+"' alt=''>"}l.append(a("<div />").append(a("<a href='#"+k+"' title='Go to slide "+k+"'/>").html(h)))
});if(m){l.addClass(f+"-nav-thumbs")}a(this).append(l)},_bindPaginationEvents:function(){a(this).bind("click",function(h){var j=a(h.target);
if(h.target.nodeName==="IMG"){j=j.parent()}j=j.closest("a");var i=j.attr("href");if(j.closest("."+d).length&&i&&!j.parent().hasClass(b)){a(this)[f]("goTo",parseFloat(i.split("#")[1]));
h.preventDefault()}}).bind("goto."+f,function(h,i){a(this).trigger("updatePagination",i)}).bind("updatePagination",function(h,j){var i=j?a(j).index():0;
a(this).find("div."+d+" div").removeClass(b).eq(i).addClass(b)}).trigger("goto."+f)}};a.extend(a.fn[f].prototype,e);a(document).on("create."+f,c,function(){a(this)[f]("_createPagination")[f]("_bindPaginationEvents")
}).on("update."+f,c,function(){a(this)[f]("_createPagination")})}(jQuery));
//
// vendor/jquery/plugins/jquery-carousel.touch.js
//
(function(a){var e="carousel",b="."+e,d=e+"-no-transition",c=/iPhone|iPad|iPod/.test(navigator.platform)&&navigator.userAgent.indexOf("AppleWebKit")>-1,f={_dragBehavior:function(){var g=a(this),j,h={},l,m,k=function(o){var p=o.touches||o.originalEvent.touches,n=a(o.target).closest(b);
if(o.type==="touchstart"){j={x:p[0].pageX,y:p[0].pageY}}if(p[0]&&p[0].pageX){h.touches=p;h.deltaX=p[0].pageX-j.x;h.deltaY=p[0].pageY-j.y;
h.w=n.width();h.h=n.height();h.xPercent=h.deltaX/h.w;h.yPercent=h.deltaY/h.h;h.srcEvent=o}},i=function(n){k(n);if(h.touches.length===1){a(n.target).closest(b).trigger("drag"+n.type.split("touch")[1],h)
}};a(this).bind("touchstart",function(n){a(this).addClass(d);i(n)}).bind("touchmove",function(n){if(!c){n.preventDefault()}k(n);
i(n)}).bind("touchend",function(n){a(this).removeClass(d);i(n)})}};a.extend(a.fn[e].prototype,f);a(b).live("create."+e,function(){a(this)[e]("_dragBehavior")
})}(jQuery));
//
// vendor/jquery/plugins/jquery-carousel.drag.js
//
(function(a){var g="carousel",e="."+g,b=g+"-active",f=g+"-item",c=function(h){return Math.abs(h)>4},d=function(h,l){var i=h.find("."+g+"-active"),k=i.prevAll().length+1,m=l<0,n=k+(m?1:-1),j=h.find("."+f).eq(n-1);
if(!j.length){j=h.find("."+f)[m?"first":"last"]()}return[i,j]};a(e).live("dragmove",function(j,i){if(!c(i.deltaX)){return}var h=d(a(this),i.deltaX);
h[0].css("left",i.deltaX+"px");h[1].css("left",i.deltaX<0?i.w+i.deltaX+"px":-i.w+i.deltaX+"px")}).live("dragend",function(j,i){if(!c(i.deltaX)){return
}var h=d(a(this),i.deltaX),k=Math.abs(i.deltaX)>45;a(this).one(navigator.userAgent.indexOf("AppleWebKit")?"webkitTransitionEnd":"transitionEnd",function(){h[0].add(h[1]).css("left","")
});if(k){h[0].removeClass(b).css("left",i.deltaX>0?i.w+"px":-i.w+"px");h[1].addClass(b).css("left",0);a(this).trigger("updatePagination",h[1]);
if(pubsub){pubsub.broadcast("JqueryCarousel.GoTo",[h[1].index()])}}else{h[0].css("left",0);h[1].css("left",i.deltaX>0?-i.w+"px":i.w+"px")
}})}(jQuery));
//
// vendor/jquery/plugins/jquery.jqote2.js
//
(function(a){var g="UndefinedTemplateError",e="TemplateCompilationError",f="TemplateExecutionError";var b="[object Array]",l="[object String]",d="[object Function]";
var i=1,m="%",j=/^[^<]*(<[\w\W]+>)[^>]*$/,o=Object.prototype.toString;function k(n,p){throw (a.extend(n,p),n)}function c(n){var r=[];
if(o.call(n)!==b){return false}for(var p=0,q=n.length;p<q;p++){r[p]=n[p].jqote_id}return r.length?r.sort().join(".").replace(/(\b\d+\b)\.(?:\1(\.|$))+/g,"$1$2"):false
}function h(u,s){var n,p=[],s=s||m,v=o.call(u);if(v===d){return u.jqote_id?[u]:false}if(v!==b){return[a.jqotec(u,s)]}if(v===b){for(var q=0,r=u.length;
q<r;q++){if(n=h(u[q],s)){p.push(n[0])}}}return p.length?p:false}a.fn.extend({jqote:function(n,q){var n=o.call(n)===b?n:[n],p="";
this.each(function(s){var r=a.jqotec(this,q);for(var t=0;t<n.length;t++){p+=r.call(n[t],s,t,n,r)}});return p}});a.each({app:"append",pre:"prepend",sub:"html"},function(p,n){a.fn["jqote"+p]=function(s,r,x){var u,v,w=a.jqote(s,r,x),q=!j.test(w)?function(t){return a(document.createTextNode(t))
}:a;if(!!(u=c(h(s)))){v=new RegExp("(^|\\.)"+u.split(".").join("\\.(.*)?")+"(\\.|$)")}return this.each(function(){var t=q(w);
a(this)[n](t);(t[0].nodeType===3?a(this):t).trigger("jqote."+p,[t,v])})}});a.extend({jqote:function(p,n,w){var v="",w=w||m,q=h(p);
if(q===false){k(new Error("Empty or undefined template passed to $.jqote"),{type:g})}n=o.call(n)!==b?[n]:n;for(var r=0,u=q.length;
r<u;r++){for(var s=0;s<n.length;s++){v+=q[r].call(n[s],r,s,n,q[r])}}return v},jqotec:function(z,y){var p,r,A,y=y||m,B=o.call(z);
if(B===l&&j.test(z)){r=A=z;if(p=a.jqotecache[z]){return p}}else{r=B===l||z.nodeType?a(z):z instanceof jQuery?z:null;if(!r[0]||!(A=r[0].innerHTML)&&!(A=r.text())){k(new Error("Empty or undefined template passed to $.jqotec"),{type:g})
}if(p=a.jqotecache[a.data(r[0],"jqote_id")]){return p}}var x="",u,n=A.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]/g,"").split("<"+y).join(y+">\x1b").split(y+">");
for(var w=0,v=n.length;w<v;w++){x+=n[w].charAt(0)!=="\x1b"?"out+='"+n[w].replace(/(\\|["'])/g,"\\$1")+"'":(n[w].charAt(1)==="="?";out+=("+n[w].substr(2)+");":(n[w].charAt(1)==="!"?";out+=$.jqotenc(("+n[w].substr(2)+"));":";"+n[w].substr(1)))
}x="try{"+('var out="";'+x+";return out;").split("out+='';").join("").split('var out="";out+=').join("var out=")+'}catch(e){e.type="'+f+'";e.args=arguments;e.template=arguments.callee.toString();throw e;}';
try{var s=new Function("i, j, data, fn",x)}catch(q){k(q,{type:e})}u=r instanceof jQuery?a.data(r[0],"jqote_id",i):r;return a.jqotecache[u]=(s.jqote_id=i++,s)
},jqotefn:function(n){var q=o.call(n),p=q===l&&j.test(n)?n:a.data(a(n)[0],"jqote_id");return a.jqotecache[p]||false},jqotetag:function(n){if(o.call(n)===l){m=n
}},jqotenc:function(n){return n==undefined?"":n.toString().replace(/&(?!\w+;)/g,"&#38;").split("<").join("&#60;").split(">").join("&#62;").split('"').join("&#34;").split("'").join("&#39;")
},jqotecache:{}});a.event.special.jqote={add:function(r){var q,p=r.handler,n=!r.data?[]:o.call(r.data)!==b?[r.data]:r.data;if(!r.namespace){r.namespace="app.pre.sub"
}if(!n.length||!(q=c(h(n)))){return}r.handler=function(t,s,u){return !u||u.test(q)?p.apply(this,[t,s]):null}}}})(jQuery);
//
// vendor/jquery/plugins/jquery.placeholder.js
//
/* http://mths.be/placeholder v2.0.8 by @mathias */
(function(o,d,a){var g=Object.prototype.toString.call(o.operamini)=="[object OperaMini]";
var f="placeholder" in d.createElement("input")&&!g;var h="placeholder" in d.createElement("textarea")&&!g;var k=a.fn;var n=a.valHooks;
var j=a.propHooks;var e;var i;if(f&&h){i=k.placeholder=function(){return this};i.input=i.textarea=true}else{i=k.placeholder=function(){var p=this;
p.filter((f?"textarea":":input")+"[placeholder]").not(".placeholder").bind({"focus.placeholder":c,"blur.placeholder":m}).data("placeholder-enabled",true).trigger("blur.placeholder");
return p};i.input=f;i.textarea=h;e={get:function(r){var p=a(r);var q=p.data("placeholder-password");if(q){return q[0].value}return p.data("placeholder-enabled")&&p.hasClass("placeholder")?"":r.value
},set:function(r,s){var p=a(r);var q=p.data("placeholder-password");if(q){return q[0].value=s}if(!p.data("placeholder-enabled")){return r.value=s
}if(s==""){r.value=s;if(r!=l()){m.call(r)}}else{if(p.hasClass("placeholder")){c.call(r,true,s)||(r.value=s)}else{r.value=s}}return p
}};if(!f){n.input=e;j.value=e}if(!h){n.textarea=e;j.value=e}a(function(){a(d).delegate("form","submit.placeholder",function(){var p=a(".placeholder",this).each(c);
setTimeout(function(){p.each(m)},10)})});a(o).bind("beforeunload.placeholder",function(){a(".placeholder").each(function(){this.value=""
})})}function b(p){var q={};var r=/^jQuery\d+$/;a.each(p.attributes,function(t,s){if(s.specified&&!r.test(s.name)){q[s.name]=s.value
}});return q}function c(q,s){var r=this;var p=a(r);if(r.value==p.attr("placeholder")&&p.hasClass("placeholder")){if(p.data("placeholder-password")){p=p.hide().next().show().attr("id",p.removeAttr("id").data("placeholder-id"));
if(q===true){return p[0].value=s}p.focus()}else{r.value="";p.removeClass("placeholder");r==l()&&r.select()}}}function m(){var q;
var t=this;var p=a(t);var s=this.id;if(t.value==""){if(t.type=="password"){if(!p.data("placeholder-textinput")){try{q=p.clone().attr({type:"text"})
}catch(r){q=a("<input>").attr(a.extend(b(this),{type:"text"}))}q.removeAttr("name").data({"placeholder-password":p,"placeholder-id":s}).bind("focus.placeholder",c);
p.data({"placeholder-textinput":q,"placeholder-id":s}).before(q)}p=p.removeAttr("id").hide().prev().attr("id",s).show()}p.addClass("placeholder");
p[0].value=p.attr("placeholder")}else{p.removeClass("placeholder")}}function l(){try{return d.activeElement}catch(p){}}}(this,document,jQuery));
//
// vendor/jquery/plugins/jquery.textTruncate.js
//
(function(a){a.fn.textTruncate=function(){var g={},d=arguments,e=d.callee;if(d.length){if(d[0].constructor==Object){g=d[0]}else{if(d[0]=="options"){return a(this).eq(0).data("options-truncate")
}else{g={width:parseInt(d[0]),height:parseInt(d[1]),tail:d[2]}}}}this.css("visibility","hidden");var f=a.extend({},e.defaults,g);
return this.each(function(){var j=a(this);j.data("options-truncate",f);if(f.tail=="..."&&e._native){this.style[e._native]="ellipsis";
j.css("visibility","visible");return true}var E=f.width||j.parent().width();var q=f.height||j.parent().height();var C=j.text();
var r=C.length;var l="padding:0; margin:0; border:none; font:inherit;";var h;if(f.multiline){h=a('<table style="'+l+"width:"+E+'px;zoom:1;position:absolute;"><tr style="'+l+'"><td style="'+l+'white-space:normal;">'+f.tail+"</td></tr></table>")
}else{h=a('<table style="'+l+'width:auto;zoom:1;position:absolute;"><tr style="'+l+'"><td style="'+l+'white-space:nowrap;">'+f.tail+"</td></tr></table>")
}var i=a("td",h);j.html(h);var z=i.width();var t=C.length;var B=(f.multiline)?E:E-z;var A=q;var y=f.tail.text!==undefined?f.tail.text().length+1:2;
var k=0;i.text(C);if(f.alwaysAppendTail===true){i.append(f.tail)}var D=false;if(f.tooltip){j.attr("title",a.trim(C));D=true}var v=i.width();
var u=i.height();var x=B*1.1;var w=A*1.1;if(v-x>0){var m=x/v,s=Math.ceil(t*m),n=C.substring(0,s),p=i.text(C).append(f.tail).width();
if(p>B){C=n;t=C.length}}if(u-w>0){var m=w/u,s=Math.ceil(t*m),n=C.substring(0,s),o=i.text(C).append(f.tail).height;if(p>B){C=n;
t=C.length}}if(f.multiline&&(i.height()>A||i.width()>B)){if(f.tail.text!==undefined&&f.prependHellip===true){f.tail.prepend("&hellip;")
}while(i.height()>A||i.width()>B){k++;if(f.wrap=="word"&&i.text().lastIndexOf(" ")!=-1){i.text(i.text().substring(0,i.text().lastIndexOf(" ")-y)).append(f.tail)
}else{i.text(i.text().substring(0,i.text().length-y)).append(f.tail)}if(k>=r){console.warn("Max loop count ("+r+") encountered in textTruncate plug-in.");
return}}C=a.trim(i.html());j.html(C)}else{if(i.width()>E){while(i.width()>B){k++;if(f.wrap=="word"&&i.text().lastIndexOf(" ")!=-1){i.text(i.text().substring(0,i.text().lastIndexOf(" ")))
}else{i.text(i.text().substring(0,i.text().length-1))}if(k>=r){console.warn("Max loop count ("+r+") encountered in textTruncate plug-in.");
return}}C=a.trim(i.text());j.text(C).append(f.tail)}else{if(D){a(this).removeAttr("title")}j.text(C);if(f.alwaysAppendTail===true){j.append(f.tail)
}}}this.style.visibility="visible";return true});return true};var c=document.documentElement.style;var b=false;if("textOverflow" in c){b="textOverflow"
}else{if("OTextOverflow" in c){b="OTextOverflow"}}a.fn.textTruncate._native=b;a.fn.textTruncate.defaults={multiline:false,tail:"&hellip;",tooltip:true,wrap:"word",prependHellip:false,alwaysAppendTail:false}
})(jQuery);
//
// vendor/jquery/plugins/iscroll.js
//
/*
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(){var n=Math,p=function(m){return m>>0
},v=(/webkit/i).test(navigator.appVersion)?"webkit":(/firefox/i).test(navigator.userAgent)?"Moz":(/trident/i).test(navigator.userAgent)?"ms":"opera" in window?"O":"",h=(/android/gi).test(navigator.appVersion),j=(/iphone|ipad/gi).test(navigator.appVersion),k=(/playbook/gi).test(navigator.appVersion),l=(/hp-tablet/gi).test(navigator.appVersion),d="WebKitCSSMatrix" in window&&"m11" in new WebKitCSSMatrix(),e="ontouchstart" in window&&!l,f=v+"Transform" in document.documentElement.style,g=j||k,q=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(m){return setTimeout(m,1)
}})(),b=(function(){return window.cancelRequestAnimationFrame||window.webkitCancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||clearTimeout
})(),r="onorientationchange" in window?"orientationchange":"resize",s=e?"touchstart":"mousedown",o=e?"touchmove":"mousemove",c=e?"touchend":"mouseup",a=e?"touchcancel":"mouseup",w=v=="Moz"?"DOMMouseScroll":"mousewheel",u="translate"+(d?"3d(":"("),t=d?",0)":")",i=function(x,z){var A=this,m=document,y;
A.wrapper=typeof x=="object"?x:m.getElementById(x);A.wrapper.style.overflow="hidden";A.scroller=A.wrapper.children[0];A.options={hScroll:true,vScroll:true,x:0,y:0,bounce:true,bounceLock:false,momentum:true,lockDirection:true,useTransform:true,useTransition:false,topOffset:0,checkDOMChanges:false,hScrollbar:true,vScrollbar:true,fixedScrollbar:h,hideScrollbar:j,fadeScrollbar:j&&d,scrollbarClass:"",zoom:false,zoomMin:1,zoomMax:4,doubleTapZoom:2,wheelAction:"scroll",snap:false,snapThreshold:1,onRefresh:null,onBeforeScrollStart:function(B){B.preventDefault()
},onScrollStart:null,onBeforeScrollMove:null,onScrollMove:null,onBeforeScrollEnd:null,onScrollEnd:null,onTouchEnd:null,onDestroy:null,onZoomStart:null,onZoom:null,onZoomEnd:null};
for(y in z){A.options[y]=z[y]}A.x=A.options.x;A.y=A.options.y;A.options.useTransform=f?A.options.useTransform:false;A.options.hScrollbar=A.options.hScroll&&A.options.hScrollbar;
A.options.vScrollbar=A.options.vScroll&&A.options.vScrollbar;A.options.zoom=A.options.useTransform&&A.options.zoom;A.options.useTransition=g&&A.options.useTransition;
if(A.options.zoom&&h){u="translate(";t=")"}A.scroller.style[v+"TransitionProperty"]=A.options.useTransform?"-"+v.toLowerCase()+"-transform":"top left";
A.scroller.style[v+"TransitionDuration"]="0";A.scroller.style[v+"TransformOrigin"]="0 0";if(A.options.useTransition){A.scroller.style[v+"TransitionTimingFunction"]="cubic-bezier(0.33,0.66,0.66,1)"
}if(A.options.useTransform){A.scroller.style[v+"Transform"]=u+A.x+"px,"+A.y+"px"+t}else{A.scroller.style.cssText+=";position:absolute;top:"+A.y+"px;left:"+A.x+"px"
}if(A.options.useTransition){A.options.fixedScrollbar=true}A.refresh();A._bind(r,window);A._bind(s);if(!e){A._bind("mouseout",A.wrapper);
if(A.options.wheelAction!="none"){A._bind(w)}}if(A.options.checkDOMChanges){A.checkDOMTime=setInterval(function(){A._checkDOMChanges()
},500)}};i.prototype={enabled:true,x:0,y:0,steps:[],scale:1,currPageX:0,currPageY:0,pagesX:[],pagesY:[],aniTime:null,wheelZoomCount:0,handleEvent:function(m){var x=this;
switch(m.type){case s:if(!e&&m.button!==0){return}x._start(m);break;case o:x._move(m);break;case c:case a:x._end(m);break;case r:x._resize();
break;case w:x._wheel(m);break;case"mouseout":x._mouseout(m);break;case"webkitTransitionEnd":x._transitionEnd(m);break}},_checkDOMChanges:function(){if(this.moved||this.zoomed||this.animating||(this.scrollerW==this.scroller.offsetWidth*this.scale&&this.scrollerH==this.scroller.offsetHeight*this.scale)){return
}this.refresh()},_scrollbar:function(x){var z=this,y=document,m;if(!z[x+"Scrollbar"]){if(z[x+"ScrollbarWrapper"]){if(f){z[x+"ScrollbarIndicator"].style[v+"Transform"]=""
}z[x+"ScrollbarWrapper"].parentNode.removeChild(z[x+"ScrollbarWrapper"]);z[x+"ScrollbarWrapper"]=null;z[x+"ScrollbarIndicator"]=null
}return}if(!z[x+"ScrollbarWrapper"]){m=y.createElement("div");if(z.options.scrollbarClass){m.className=z.options.scrollbarClass+x.toUpperCase()
}else{m.style.cssText="position:absolute;z-index:100;"+(x=="h"?"height:7px;bottom:1px;left:2px;right:"+(z.vScrollbar?"7":"2")+"px":"width:7px;bottom:"+(z.hScrollbar?"7":"2")+"px;top:2px;right:1px")
}m.style.cssText+=";pointer-events:none;-"+v+"-transition-property:opacity;-"+v+"-transition-duration:"+(z.options.fadeScrollbar?"350ms":"0")+";overflow:hidden;opacity:"+(z.options.hideScrollbar?"0":"1");
z.wrapper.appendChild(m);z[x+"ScrollbarWrapper"]=m;m=y.createElement("div");if(!z.options.scrollbarClass){m.style.cssText="position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-"+v+"-background-clip:padding-box;-"+v+"-box-sizing:border-box;"+(x=="h"?"height:100%":"width:100%")+";-"+v+"-border-radius:3px;border-radius:3px"
}m.style.cssText+=";pointer-events:none;-"+v+"-transition-property:-"+v+"-transform;-"+v+"-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-"+v+"-transition-duration:0;-"+v+"-transform:"+u+"0,0"+t;
if(z.options.useTransition){m.style.cssText+=";-"+v+"-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)"}z[x+"ScrollbarWrapper"].appendChild(m);
z[x+"ScrollbarIndicator"]=m}if(x=="h"){z.hScrollbarSize=z.hScrollbarWrapper.clientWidth;z.hScrollbarIndicatorSize=n.max(p(z.hScrollbarSize*z.hScrollbarSize/z.scrollerW),8);
z.hScrollbarIndicator.style.width=z.hScrollbarIndicatorSize+"px";z.hScrollbarMaxScroll=z.hScrollbarSize-z.hScrollbarIndicatorSize;
z.hScrollbarProp=z.hScrollbarMaxScroll/z.maxScrollX}else{z.vScrollbarSize=z.vScrollbarWrapper.clientHeight;z.vScrollbarIndicatorSize=n.max(p(z.vScrollbarSize*z.vScrollbarSize/z.scrollerH),8);
z.vScrollbarIndicator.style.height=z.vScrollbarIndicatorSize+"px";z.vScrollbarMaxScroll=z.vScrollbarSize-z.vScrollbarIndicatorSize;
z.vScrollbarProp=z.vScrollbarMaxScroll/z.maxScrollY}z._scrollbarPos(x,true)},_resize:function(){var m=this;setTimeout(function(){m.refresh()
},h?200:0)},_pos:function(m,z){m=this.hScroll?m:0;z=this.vScroll?z:0;if(this.options.useTransform){this.scroller.style[v+"Transform"]=u+m+"px,"+z+"px"+t+" scale("+this.scale+")"
}else{m=p(m);z=p(z);this.scroller.style.left=m+"px";this.scroller.style.top=z+"px"}this.x=m;this.y=z;this._scrollbarPos("h");
this._scrollbarPos("v")},_scrollbarPos:function(m,x){var A=this,y=m=="h"?A.x:A.y,z;if(!A[m+"Scrollbar"]){return}y=A[m+"ScrollbarProp"]*y;
if(y<0){if(!A.options.fixedScrollbar){z=A[m+"ScrollbarIndicatorSize"]+p(y*3);if(z<8){z=8}A[m+"ScrollbarIndicator"].style[m=="h"?"width":"height"]=z+"px"
}y=0}else{if(y>A[m+"ScrollbarMaxScroll"]){if(!A.options.fixedScrollbar){z=A[m+"ScrollbarIndicatorSize"]-p((y-A[m+"ScrollbarMaxScroll"])*3);
if(z<8){z=8}A[m+"ScrollbarIndicator"].style[m=="h"?"width":"height"]=z+"px";y=A[m+"ScrollbarMaxScroll"]+(A[m+"ScrollbarIndicatorSize"]-z)
}else{y=A[m+"ScrollbarMaxScroll"]}}}A[m+"ScrollbarWrapper"].style[v+"TransitionDelay"]="0";A[m+"ScrollbarWrapper"].style.opacity=x&&A.options.hideScrollbar?"0":"1";
A[m+"ScrollbarIndicator"].style[v+"Transform"]=u+(m=="h"?y+"px,0":"0,"+y+"px")+t},_start:function(A){var D=this,C=e?A.touches[0]:A,B,E,F,m,z;
if(!D.enabled){return}if(D.options.onBeforeScrollStart){D.options.onBeforeScrollStart.call(D,A)}if(D.options.useTransition||D.options.zoom){D._transitionTime(0)
}D.moved=false;D.animating=false;D.zoomed=false;D.distX=0;D.distY=0;D.absDistX=0;D.absDistY=0;D.dirX=0;D.dirY=0;if(D.options.zoom&&e&&A.touches.length>1){m=n.abs(A.touches[0].pageX-A.touches[1].pageX);
z=n.abs(A.touches[0].pageY-A.touches[1].pageY);D.touchesDistStart=n.sqrt(m*m+z*z);D.originX=n.abs(A.touches[0].pageX+A.touches[1].pageX-D.wrapperOffsetLeft*2)/2-D.x;
D.originY=n.abs(A.touches[0].pageY+A.touches[1].pageY-D.wrapperOffsetTop*2)/2-D.y;if(D.options.onZoomStart){D.options.onZoomStart.call(D,A)
}}if(D.options.momentum){if(D.options.useTransform){B=getComputedStyle(D.scroller,null)[v+"Transform"].replace(/[^0-9-.,]/g,"").split(",");
E=B[4]*1;F=B[5]*1}else{E=getComputedStyle(D.scroller,null).left.replace(/[^0-9-]/g,"")*1;F=getComputedStyle(D.scroller,null).top.replace(/[^0-9-]/g,"")*1
}if(E!=D.x||F!=D.y){if(D.options.useTransition){D._unbind("webkitTransitionEnd")}else{b(D.aniTime)}D.steps=[];D._pos(E,F)}}D.absStartX=D.x;
D.absStartY=D.y;D.startX=D.x;D.startY=D.y;D.pointX=C.pageX;D.pointY=C.pageY;D.startTime=A.timeStamp||Date.now();if(D.options.onScrollStart){D.options.onScrollStart.call(D,A)
}D._bind(o);D._bind(c);D._bind(a)},_move:function(A){var F=this,D=e?A.touches[0]:A,y=D.pageX-F.pointX,z=D.pageY-F.pointY,B=F.x+y,C=F.y+z,m,x,E,G=A.timeStamp||Date.now();
if(F.options.onBeforeScrollMove){F.options.onBeforeScrollMove.call(F,A)}if(F.options.zoom&&e&&A.touches.length>1){m=n.abs(A.touches[0].pageX-A.touches[1].pageX);
x=n.abs(A.touches[0].pageY-A.touches[1].pageY);F.touchesDist=n.sqrt(m*m+x*x);F.zoomed=true;E=1/F.touchesDistStart*F.touchesDist*this.scale;
if(E<F.options.zoomMin){E=0.5*F.options.zoomMin*Math.pow(2,E/F.options.zoomMin)}else{if(E>F.options.zoomMax){E=2*F.options.zoomMax*Math.pow(0.5,F.options.zoomMax/E)
}}F.lastScale=E/this.scale;B=this.originX-this.originX*F.lastScale+this.x,C=this.originY-this.originY*F.lastScale+this.y;this.scroller.style[v+"Transform"]=u+B+"px,"+C+"px"+t+" scale("+E+")";
if(F.options.onZoom){F.options.onZoom.call(F,A)}return}F.pointX=D.pageX;F.pointY=D.pageY;if(B>0||B<F.maxScrollX){B=F.options.bounce?F.x+(y/2):B>=0||F.maxScrollX>=0?0:F.maxScrollX
}if(C>F.minScrollY||C<F.maxScrollY){C=F.options.bounce?F.y+(z/2):C>=F.minScrollY||F.maxScrollY>=0?F.minScrollY:F.maxScrollY}F.distX+=y;
F.distY+=z;F.absDistX=n.abs(F.distX);F.absDistY=n.abs(F.distY);if(F.absDistX<6&&F.absDistY<6){return}if(F.options.lockDirection){if(F.absDistX>F.absDistY+5){C=F.y;
z=0}else{if(F.absDistY>F.absDistX+5){B=F.x;y=0}}}F.moved=true;F._pos(B,C);F.dirX=y>0?-1:y<0?1:0;F.dirY=z>0?-1:z<0?1:0;if(G-F.startTime>300){F.startTime=G;
F.startX=F.x;F.startY=F.y}if(F.options.onScrollMove){F.options.onScrollMove.call(F,A)}},_end:function(z){if(e&&z.touches.length!=0){return
}var K=this,G=e?z.changedTouches[0]:z,J,A,B={dist:0,time:0},C={dist:0,time:0},y=(z.timeStamp||Date.now())-K.startTime,E=K.x,F=K.y,m,x,D,I,H;
K._unbind(o);K._unbind(c);K._unbind(a);if(K.options.onBeforeScrollEnd){K.options.onBeforeScrollEnd.call(K,z)}if(K.zoomed){H=K.scale*K.lastScale;
H=Math.max(K.options.zoomMin,H);H=Math.min(K.options.zoomMax,H);K.lastScale=H/K.scale;K.scale=H;K.x=K.originX-K.originX*K.lastScale+K.x;
K.y=K.originY-K.originY*K.lastScale+K.y;K.scroller.style[v+"TransitionDuration"]="200ms";K.scroller.style[v+"Transform"]=u+K.x+"px,"+K.y+"px"+t+" scale("+K.scale+")";
K.zoomed=false;K.refresh();if(K.options.onZoomEnd){K.options.onZoomEnd.call(K,z)}return}if(!K.moved){if(e){if(K.doubleTapTimer&&K.options.zoom){clearTimeout(K.doubleTapTimer);
K.doubleTapTimer=null;if(K.options.onZoomStart){K.options.onZoomStart.call(K,z)}K.zoom(K.pointX,K.pointY,K.scale==1?K.options.doubleTapZoom:1);
if(K.options.onZoomEnd){setTimeout(function(){K.options.onZoomEnd.call(K,z)},200)}}else{K.doubleTapTimer=setTimeout(function(){K.doubleTapTimer=null;
J=G.target;while(J.nodeType!=1){J=J.parentNode}if(J.tagName!="SELECT"&&J.tagName!="INPUT"&&J.tagName!="TEXTAREA"){A=document.createEvent("MouseEvents");
A.initMouseEvent("click",true,true,z.view,1,G.screenX,G.screenY,G.clientX,G.clientY,z.ctrlKey,z.altKey,z.shiftKey,z.metaKey,0,null);
A._fake=true;J.dispatchEvent(A)}},K.options.zoom?250:0)}}K._resetPos(200);if(K.options.onTouchEnd){K.options.onTouchEnd.call(K,z)
}return}if(y<300&&K.options.momentum){B=E?K._momentum(E-K.startX,y,-K.x,K.scrollerW-K.wrapperW+K.x,K.options.bounce?K.wrapperW:0):B;
C=F?K._momentum(F-K.startY,y,-K.y,(K.maxScrollY<0?K.scrollerH-K.wrapperH+K.y-K.minScrollY:0),K.options.bounce?K.wrapperH:0):C;
E=K.x+B.dist;F=K.y+C.dist;if((K.x>0&&E>0)||(K.x<K.maxScrollX&&E<K.maxScrollX)){B={dist:0,time:0}}if((K.y>K.minScrollY&&F>K.minScrollY)||(K.y<K.maxScrollY&&F<K.maxScrollY)){C={dist:0,time:0}
}}if(B.dist||C.dist){D=n.max(n.max(B.time,C.time),10);if(K.options.snap){m=E-K.absStartX;x=F-K.absStartY;if(n.abs(m)<K.options.snapThreshold&&n.abs(x)<K.options.snapThreshold){K.scrollTo(K.absStartX,K.absStartY,200)
}else{I=K._snap(E,F);E=I.x;F=I.y;D=n.max(I.time,D)}}K.scrollTo(p(E),p(F),D);if(K.options.onTouchEnd){K.options.onTouchEnd.call(K,z)
}return}if(K.options.snap){m=E-K.absStartX;x=F-K.absStartY;if(n.abs(m)<K.options.snapThreshold&&n.abs(x)<K.options.snapThreshold){K.scrollTo(K.absStartX,K.absStartY,200)
}else{I=K._snap(K.x,K.y);if(I.x!=K.x||I.y!=K.y){K.scrollTo(I.x,I.y,I.time)}}if(K.options.onTouchEnd){K.options.onTouchEnd.call(K,z)
}return}K._resetPos(200);if(K.options.onTouchEnd){K.options.onTouchEnd.call(K,z)}},_resetPos:function(z){var y=this,m=y.x>=0?0:y.x<y.maxScrollX?y.maxScrollX:y.x,x=y.y>=y.minScrollY||y.maxScrollY>0?y.minScrollY:y.y<y.maxScrollY?y.maxScrollY:y.y;
if(m==y.x&&x==y.y){if(y.moved){y.moved=false;if(y.options.onScrollEnd){y.options.onScrollEnd.call(y)}}if(y.hScrollbar&&y.options.hideScrollbar){if(v=="webkit"){y.hScrollbarWrapper.style[v+"TransitionDelay"]="300ms"
}y.hScrollbarWrapper.style.opacity="0"}if(y.vScrollbar&&y.options.hideScrollbar){if(v=="webkit"){y.vScrollbarWrapper.style[v+"TransitionDelay"]="300ms"
}y.vScrollbarWrapper.style.opacity="0"}return}y.scrollTo(m,x,z||0)},_wheel:function(z){var A=this,B,C,x,y,m;if("wheelDeltaX" in z){B=z.wheelDeltaX/12;
C=z.wheelDeltaY/12}else{if("wheelDelta" in z){B=C=z.wheelDelta/12}else{if("detail" in z){B=C=-z.detail*3}else{return}}}if(A.options.wheelAction=="zoom"){m=A.scale*Math.pow(2,1/3*(C?C/Math.abs(C):0));
if(m<A.options.zoomMin){m=A.options.zoomMin}if(m>A.options.zoomMax){m=A.options.zoomMax}if(m!=A.scale){if(!A.wheelZoomCount&&A.options.onZoomStart){A.options.onZoomStart.call(A,z)
}A.wheelZoomCount++;A.zoom(z.pageX,z.pageY,m,400);setTimeout(function(){A.wheelZoomCount--;if(!A.wheelZoomCount&&A.options.onZoomEnd){A.options.onZoomEnd.call(A,z)
}},400)}return}x=A.x+B;y=A.y+C;if(x>0){x=0}else{if(x<A.maxScrollX){x=A.maxScrollX}}if(y>A.minScrollY){y=A.minScrollY}else{if(y<A.maxScrollY){y=A.maxScrollY
}}A.scrollTo(x,y,0)},_mouseout:function(m){var x=m.relatedTarget;if(!x){this._end(m);return}while(x=x.parentNode){if(x==this.wrapper){return
}}this._end(m)},_transitionEnd:function(m){var x=this;if(m.target!=x.scroller){return}x._unbind("webkitTransitionEnd");x._startAni()
},_startAni:function(){var C=this,z=C.x,A=C.y,y=Date.now(),B,x,m;if(C.animating){return}if(!C.steps.length){C._resetPos(400);
return}B=C.steps.shift();if(B.x==z&&B.y==A){B.time=0}C.animating=true;C.moved=true;if(C.options.useTransition){C._transitionTime(B.time);
C._pos(B.x,B.y);C.animating=false;if(B.time){C._bind("webkitTransitionEnd")}else{C._resetPos(0)}return}m=function(){var F=Date.now(),D,E;
if(F>=y+B.time){C._pos(B.x,B.y);C.animating=false;if(C.options.onAnimationEnd){C.options.onAnimationEnd.call(C)}C._startAni();
return}F=(F-y)/B.time-1;x=n.sqrt(1-F*F);D=(B.x-z)*x+z;E=(B.y-A)*x+A;C._pos(D,E);if(C.animating){C.aniTime=q(m)}};m()},_transitionTime:function(m){m+="ms";
this.scroller.style[v+"TransitionDuration"]=m;if(this.hScrollbar){this.hScrollbarIndicator.style[v+"TransitionDuration"]=m}if(this.vScrollbar){this.vScrollbarIndicator.style[v+"TransitionDuration"]=m
}},_momentum:function(x,F,z,y,D){var m=0.0006,E=n.abs(x)/F,A=(E*E)/(2*m),B=0,C=0;if(x>0&&A>z){C=D/(6/(A/E*m));z=z+C;E=E*z/A;A=z
}else{if(x<0&&A>y){C=D/(6/(A/E*m));y=y+C;E=E*y/A;A=y}}A=A*(x<0?-1:1);B=E/m;return{dist:A,time:p(B)}},_offset:function(m){var x=-m.offsetLeft,y=-m.offsetTop;
while(m=m.offsetParent){x-=m.offsetLeft;y-=m.offsetTop}if(m!=this.wrapper){x*=this.scale;y*=this.scale}return{left:x,top:y}},_snap:function(F,G){var D=this,m,z,A,E,B,C;
A=D.pagesX.length-1;for(m=0,z=D.pagesX.length;m<z;m++){if(F>=D.pagesX[m]){A=m;break}}if(A==D.currPageX&&A>0&&D.dirX<0){A--}F=D.pagesX[A];
B=n.abs(F-D.pagesX[D.currPageX]);B=B?n.abs(D.x-F)/B*500:0;D.currPageX=A;A=D.pagesY.length-1;for(m=0;m<A;m++){if(G>=D.pagesY[m]){A=m;
break}}if(A==D.currPageY&&A>0&&D.dirY<0){A--}G=D.pagesY[A];C=n.abs(G-D.pagesY[D.currPageY]);C=C?n.abs(D.y-G)/C*500:0;D.currPageY=A;
E=p(n.max(B,C))||200;return{x:F,y:G,time:E}},_bind:function(y,x,m){(x||this.scroller).addEventListener(y,this,!!m)},_unbind:function(y,x,m){(x||this.scroller).removeEventListener(y,this,!!m)
},destroy:function(){var m=this;m.scroller.style[v+"Transform"]="";m.hScrollbar=false;m.vScrollbar=false;m._scrollbar("h");m._scrollbar("v");
m._unbind(r,window);m._unbind(s);m._unbind(o);m._unbind(c);m._unbind(a);if(!m.options.hasTouch){m._unbind("mouseout",m.wrapper);
m._unbind(w)}if(m.options.useTransition){m._unbind("webkitTransitionEnd")}if(m.options.checkDOMChanges){clearInterval(m.checkDOMTime)
}if(m.options.onDestroy){m.options.onDestroy.call(m)}},refresh:function(){var C=this,z,x,y,m,B=0,A=0;if(C.scale<C.options.zoomMin){C.scale=C.options.zoomMin
}C.wrapperW=C.wrapper.clientWidth||1;C.wrapperH=C.wrapper.clientHeight||1;C.minScrollY=-C.options.topOffset||0;C.scrollerW=p(C.scroller.offsetWidth*C.scale);
C.scrollerH=p((C.scroller.offsetHeight+C.minScrollY)*C.scale);C.maxScrollX=C.wrapperW-C.scrollerW;C.maxScrollY=C.wrapperH-C.scrollerH+C.minScrollY;
C.dirX=0;C.dirY=0;if(C.options.onRefresh){C.options.onRefresh.call(C)}C.hScroll=C.options.hScroll&&C.maxScrollX<0;C.vScroll=C.options.vScroll&&(!C.options.bounceLock&&!C.hScroll||C.scrollerH>C.wrapperH);
C.hScrollbar=C.hScroll&&C.options.hScrollbar;C.vScrollbar=C.vScroll&&C.options.vScrollbar&&C.scrollerH>C.wrapperH;z=C._offset(C.wrapper);
C.wrapperOffsetLeft=-z.left;C.wrapperOffsetTop=-z.top;if(typeof C.options.snap=="string"){C.pagesX=[];C.pagesY=[];m=C.scroller.querySelectorAll(C.options.snap);
for(x=0,y=m.length;x<y;x++){B=C._offset(m[x]);B.left+=C.wrapperOffsetLeft;B.top+=C.wrapperOffsetTop;C.pagesX[x]=B.left<C.maxScrollX?C.maxScrollX:B.left*C.scale;
C.pagesY[x]=B.top<C.maxScrollY?C.maxScrollY:B.top*C.scale}}else{if(C.options.snap){C.pagesX=[];while(B>=C.maxScrollX){C.pagesX[A]=B;
B=B-C.wrapperW;A++}if(C.maxScrollX%C.wrapperW){C.pagesX[C.pagesX.length]=C.maxScrollX-C.pagesX[C.pagesX.length-1]+C.pagesX[C.pagesX.length-1]
}B=0;A=0;C.pagesY=[];while(B>=C.maxScrollY){C.pagesY[A]=B;B=B-C.wrapperH;A++}if(C.maxScrollY%C.wrapperH){C.pagesY[C.pagesY.length]=C.maxScrollY-C.pagesY[C.pagesY.length-1]+C.pagesY[C.pagesY.length-1]
}}}C._scrollbar("h");C._scrollbar("v");if(!C.zoomed){C.scroller.style[v+"TransitionDuration"]="0";C._resetPos(200)}},scrollTo:function(E,F,D,A){var C=this,B=E,m,z;
C.stop();if(!B.length){B=[{x:E,y:F,time:D,relative:A}]}for(m=0,z=B.length;m<z;m++){if(B[m].relative){B[m].x=C.x-B[m].x;B[m].y=C.y-B[m].y
}C.steps.push({x:B[m].x,y:B[m].y,time:B[m].time||0})}C._startAni()},scrollToElement:function(m,z){var y=this,x;m=m.nodeType?m:y.scroller.querySelector(m);
if(!m){return}x=y._offset(m);x.left+=y.wrapperOffsetLeft;x.top+=y.wrapperOffsetTop;x.left=x.left>0?0:x.left<y.maxScrollX?y.maxScrollX:x.left;
x.top=x.top>y.minScrollY?y.minScrollY:x.top<y.maxScrollY?y.maxScrollY:x.top;z=z===undefined?n.max(n.abs(x.left)*2,n.abs(x.top)*2):z;
y.scrollTo(x.left,x.top,z)},scrollToPage:function(m,z,B){var A=this,C,D;B=B===undefined?400:B;if(A.options.onScrollStart){A.options.onScrollStart.call(A)
}if(A.options.snap){m=m=="next"?A.currPageX+1:m=="prev"?A.currPageX-1:m;z=z=="next"?A.currPageY+1:z=="prev"?A.currPageY-1:z;m=m<0?0:m>A.pagesX.length-1?A.pagesX.length-1:m;
z=z<0?0:z>A.pagesY.length-1?A.pagesY.length-1:z;A.currPageX=m;A.currPageY=z;C=A.pagesX[m];D=A.pagesY[z]}else{C=-A.wrapperW*m;
D=-A.wrapperH*z;if(C<A.maxScrollX){C=A.maxScrollX}if(D<A.maxScrollY){D=A.maxScrollY}}A.scrollTo(C,D,B)},disable:function(){this.stop();
this._resetPos(0);this.enabled=false;this._unbind(o);this._unbind(c);this._unbind(a)},enable:function(){this.enabled=true},stop:function(){if(this.options.useTransition){this._unbind("webkitTransitionEnd")
}else{b(this.aniTime)}this.steps=[];this.moved=false;this.animating=false},zoom:function(C,D,z,B){var A=this,m=z/A.scale;if(!A.options.useTransform){return
}A.zoomed=true;B=B===undefined?200:B;C=C-A.wrapperOffsetLeft-A.x;D=D-A.wrapperOffsetTop-A.y;A.x=C-C*m+A.x;A.y=D-D*m+A.y;A.scale=z;
A.refresh();A.x=A.x>0?0:A.x<A.maxScrollX?A.maxScrollX:A.x;A.y=A.y>A.minScrollY?A.minScrollY:A.y<A.maxScrollY?A.maxScrollY:A.y;
A.scroller.style[v+"TransitionDuration"]=B+"ms";A.scroller.style[v+"Transform"]=u+A.x+"px,"+A.y+"px"+t+" scale("+z+")";A.zoomed=false
},isReady:function(){return !this.moved&&!this.zoomed&&!this.animating}};if(typeof exports!=="undefined"){exports.iScroll=i}else{window.iScroll=i
}})();
//
// vendor/jquery/plugins/moment.js
//
(function(ak){var N,ao="2.2.1",ah=Math.round,u,A={},t=(typeof module!=="undefined"&&module.exports),d=/^\/?Date\((\-?\d+)/i,e=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)\:(\d+)\.?(\d{3})?/,p=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,D=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,W=/\d\d?/,X=/\d{1,3}/,aa=/\d{3}/,V=/\d{1,4}/,Y=/[+\-]?\d{1,6}/,ad=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,ac=/Z|[\+\-]\d\d:?\d\d/i,Z=/T/i,ab=/[\+\-]?\d+(\.\d{1,3})?/,x=/^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,w="YYYY-MM-DDTHH:mm:ssZ",y=[["HH:mm:ss.S",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],U=/([\+\-]|\d\d)/gi,ae="Date|Hours|Minutes|Seconds|Milliseconds".split("|"),am={Milliseconds:1,Seconds:1000,Minutes:60000,Hours:3600000,Days:86400000,Months:2592000000,Years:31536000000},al={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",w:"week",W:"isoweek",M:"month",y:"year"},n={},R="DDD w W M D d".split(" "),S="M D H h m s w W".split(" "),q={M:function(){return this.month()+1
},MMM:function(i){return this.lang().monthsShort(this,i)},MMMM:function(i){return this.lang().months(this,i)},D:function(){return this.date()
},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(i){return this.lang().weekdaysMin(this,i)
},ddd:function(i){return this.lang().weekdaysShort(this,i)},dddd:function(i){return this.lang().weekdays(this,i)},w:function(){return this.week()
},W:function(){return this.isoWeek()},YY:function(){return B(this.year()%100,2)},YYYY:function(){return B(this.year(),4)},YYYYY:function(){return B(this.year(),5)
},gg:function(){return B(this.weekYear()%100,2)},gggg:function(){return this.weekYear()},ggggg:function(){return B(this.weekYear(),5)
},GG:function(){return B(this.isoWeekYear()%100,2)},GGGG:function(){return this.isoWeekYear()},GGGGG:function(){return B(this.isoWeekYear(),5)
},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),true)
},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),false)},H:function(){return this.hours()},h:function(){return this.hours()%12||12
},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return ~~(this.milliseconds()/100)},SS:function(){return B(~~(this.milliseconds()/10),2)
},SSS:function(){return B(this.milliseconds(),3)},Z:function(){var i=-this.zone(),aq="+";if(i<0){i=-i;aq="-"}return aq+B(~~(i/60),2)+":"+B(~~i%60,2)
},ZZ:function(){var i=-this.zone(),aq="+";if(i<0){i=-i;aq="-"}return aq+B(~~(10*i/6),4)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()
},X:function(){return this.unix()}};function T(aq,i){return function(ar){return B(aq.call(this,ar),i)}}function Q(i,aq){return function(ar){return this.lang().ordinal(i.call(this,ar),aq)
}}while(R.length){u=R.pop();q[u+"o"]=Q(q[u],u)}while(S.length){u=S.pop();q[u+u]=T(q[u],2)}q.DDDD=T(q.DDD,3);function z(){}function O(i){m(this,i)
}function k(aq){var ay=aq.years||aq.year||aq.y||0,av=aq.months||aq.month||aq.M||0,ax=aq.weeks||aq.week||aq.w||0,i=aq.days||aq.day||aq.d||0,ar=aq.hours||aq.hour||aq.h||0,au=aq.minutes||aq.minute||aq.m||0,aw=aq.seconds||aq.second||aq.s||0,at=aq.milliseconds||aq.millisecond||aq.ms||0;
this._input=aq;this._milliseconds=+at+aw*1000+au*60000+ar*3600000;this._days=+i+ax*7;this._months=+av+ay*12;this._data={};this._bubble()
}function m(aq,ar){for(var at in ar){if(ar.hasOwnProperty(at)){aq[at]=ar[at]}}return aq}function a(i){if(i<0){return Math.ceil(i)
}else{return Math.floor(i)}}function B(i,ar){var aq=i+"";while(aq.length<ar){aq="0"+aq}return aq}function b(ax,aq,au,at){var av=aq._milliseconds,i=aq._days,ay=aq._months,aw,ar;
if(av){ax._d.setTime(+ax._d+av*au)}if(i||ay){aw=ax.minute();ar=ax.hour()}if(i){ax.date(ax.date()+i*au)}if(ay){ax.month(ax.month()+ay*au)
}if(av&&!at){N.updateOffset(ax)}if(i||ay){ax.minute(aw);ax.hour(ar)}}function v(i){return Object.prototype.toString.call(i)==="[object Array]"
}function f(aq,ar){var av=Math.min(aq.length,ar.length),aw=Math.abs(aq.length-ar.length),at=0,au;for(au=0;au<av;au++){if(~~aq[au]!==~~ar[au]){at++
}}return at+aw}function P(i){return i?al[i]||i.toLowerCase().replace(/(.)s$/,"$1"):i}m(z.prototype,{set:function(aq){var at,ar;
for(ar in aq){at=aq[ar];if(typeof at==="function"){this[ar]=at}else{this["_"+ar]=at}}},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(i){return this._months[i.month()]
},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(i){return this._monthsShort[i.month()]
},monthsParse:function(at){var aq,ar,au;if(!this._monthsParse){this._monthsParse=[]}for(aq=0;aq<12;aq++){if(!this._monthsParse[aq]){ar=N.utc([2000,aq]);
au="^"+this.months(ar,"")+"|^"+this.monthsShort(ar,"");this._monthsParse[aq]=new RegExp(au.replace(".",""),"i")}if(this._monthsParse[aq].test(at)){return aq
}}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(i){return this._weekdays[i.day()]
},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(i){return this._weekdaysShort[i.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(i){return this._weekdaysMin[i.day()]
},weekdaysParse:function(au){var aq,ar,at;if(!this._weekdaysParse){this._weekdaysParse=[]}for(aq=0;aq<7;aq++){if(!this._weekdaysParse[aq]){ar=N([2000,1]).day(aq);
at="^"+this.weekdays(ar,"")+"|^"+this.weekdaysShort(ar,"")+"|^"+this.weekdaysMin(ar,"");this._weekdaysParse[aq]=new RegExp(at.replace(".",""),"i")
}if(this._weekdaysParse[aq].test(au)){return aq}}},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(i){var aq=this._longDateFormat[i];
if(!aq&&this._longDateFormat[i.toUpperCase()]){aq=this._longDateFormat[i.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(ar){return ar.slice(1)
});this._longDateFormat[i]=aq}return aq},isPM:function(i){return((i+"").toLowerCase().charAt(0)==="p")},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(i,ar,aq){if(i>11){return aq?"pm":"PM"
}else{return aq?"am":"AM"}},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(i,aq){var ar=this._calendar[i];
return typeof ar==="function"?ar.apply(aq):ar},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(aq,au,at,i){var ar=this._relativeTime[at];
return(typeof ar==="function")?ar(aq,au,at,i):ar.replace(/%d/i,aq)},pastFuture:function(i,ar){var aq=this._relativeTime[i>0?"future":"past"];
return typeof aq==="function"?aq(ar):aq.replace(/%s/i,ar)},ordinal:function(i){return this._ordinal.replace("%d",i)},_ordinal:"%d",preparse:function(i){return i
},postformat:function(i){return i},week:function(i){return ap(i,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6}});function C(i,aq){aq.abbr=i;
if(!A[i]){A[i]=new z()}A[i].set(aq);return A[i]}function an(i){delete A[i]}function r(aq){if(!aq){return N.fn._lang}if(!A[aq]&&t){try{require("./lang/"+aq)
}catch(i){return N.fn._lang}}return A[aq]||N.fn._lang}function ag(i){if(i.match(/\[.*\]/)){return i.replace(/^\[|\]$/g,"")}return i.replace(/\\/g,"")
}function K(ar){var aq=ar.match(p),at,au;for(at=0,au=aq.length;at<au;at++){if(q[aq[at]]){aq[at]=q[aq[at]]}else{aq[at]=ag(aq[at])
}}return function(i){var av="";for(at=0;at<au;at++){av+=aq[at] instanceof Function?aq[at].call(i,ar):aq[at]}return av}}function o(aq,i){i=l(i,aq.lang());
if(!n[i]){n[i]=K(i)}return n[i](aq)}function l(aq,at){var ar=5;function au(i){return at.longDateFormat(i)||i}while(ar--&&(D.lastIndex=0,D.test(aq))){aq=aq.replace(D,au)
}return aq}function s(aq,i){switch(aq){case"DDDD":return aa;case"YYYY":return V;case"YYYYY":return Y;case"S":case"SS":case"SSS":case"DDD":return X;
case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return ad;case"a":case"A":return r(i._l)._meridiemParse;case"X":return ab;
case"Z":case"ZZ":return ac;case"T":return Z;case"MM":case"DD":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return W;
default:return new RegExp(aq.replace("\\",""))}}function aj(ar){var at=(ac.exec(ar)||[])[0],aq=(at+"").match(U)||["-",0,0],i=+(aq[1]*60)+~~aq[2];
return aq[0]==="+"?-i:i}function c(au,at,aq){var i,ar=aq._a;switch(au){case"M":case"MM":if(at!=null){ar[1]=~~at-1}break;case"MMM":case"MMMM":i=r(aq._l).monthsParse(at);
if(i!=null){ar[1]=i}else{aq._isValid=false}break;case"D":case"DD":if(at!=null){ar[2]=~~at}break;case"DDD":case"DDDD":if(at!=null){ar[1]=0;
ar[2]=~~at}break;case"YY":ar[0]=~~at+(~~at>68?1900:2000);break;case"YYYY":case"YYYYY":ar[0]=~~at;break;case"a":case"A":aq._isPm=r(aq._l).isPM(at);
break;case"H":case"HH":case"h":case"hh":ar[3]=~~at;break;case"m":case"mm":ar[4]=~~at;break;case"s":case"ss":ar[5]=~~at;break;
case"S":case"SS":case"SSS":ar[6]=~~(("0."+at)*1000);break;case"X":aq._d=new Date(parseFloat(at)*1000);break;case"Z":case"ZZ":aq._useUTC=true;
aq._tzm=aj(at);break}if(at==null){aq._isValid=false}}function h(aq){var au,at,av=[],ar;if(aq._d){return}ar=g(aq);for(au=0;au<3&&aq._a[au]==null;
++au){aq._a[au]=av[au]=ar[au]}for(;au<7;au++){aq._a[au]=av[au]=(aq._a[au]==null)?(au===2?1:0):aq._a[au]}av[3]+=~~((aq._tzm||0)/60);
av[4]+=~~((aq._tzm||0)%60);at=new Date(0);if(aq._useUTC){at.setUTCFullYear(av[0],av[1],av[2]);at.setUTCHours(av[3],av[4],av[5],av[6])
}else{at.setFullYear(av[0],av[1],av[2]);at.setHours(av[3],av[4],av[5],av[6])}aq._d=at}function j(i){var aq=i._i;if(i._d){return
}i._a=[aq.years||aq.year||aq.y,aq.months||aq.month||aq.M,aq.days||aq.day||aq.d,aq.hours||aq.hour||aq.h,aq.minutes||aq.minute||aq.m,aq.seconds||aq.second||aq.s,aq.milliseconds||aq.millisecond||aq.ms];
h(i)}function g(i){var aq=new Date();if(i._useUTC){return[aq.getUTCFullYear(),aq.getUTCMonth(),aq.getUTCDate()]}else{return[aq.getFullYear(),aq.getMonth(),aq.getDate()]
}}function H(aq){var at=r(aq._l),av=""+aq._i,ar,au,aw;aw=l(aq._f,at).match(p);aq._a=[];for(ar=0;ar<aw.length;ar++){au=(s(aw[ar],aq).exec(av)||[])[0];
if(au){av=av.slice(av.indexOf(au)+au.length)}if(q[aw[ar]]){c(aw[ar],au,aq)}}if(av){aq._il=av}if(aq._isPm&&aq._a[3]<12){aq._a[3]+=12
}if(aq._isPm===false&&aq._a[3]===12){aq._a[3]=0}h(aq)}function G(ar){var aw,ax,aq,av=99,au,at;for(au=0;au<ar._f.length;au++){aw=m({},ar);
aw._f=ar._f[au];H(aw);ax=new O(aw);at=f(aw._a,ax.toArray());if(ax._il){at+=ax._il.length}if(at<av){av=at;aq=ax}}m(ar,aq)}function F(aq){var ar,au=aq._i,at=x.exec(au);
if(at){aq._f="YYYY-MM-DD"+(at[2]||" ");for(ar=0;ar<4;ar++){if(y[ar][1].exec(au)){aq._f+=y[ar][0];break}}if(ac.exec(au)){aq._f+=" Z"
}H(aq)}else{aq._d=new Date(au)}}function E(i){var aq=i._i,ar=d.exec(aq);if(aq===ak){i._d=new Date()}else{if(ar){i._d=new Date(+ar[1])
}else{if(typeof aq==="string"){F(i)}else{if(v(aq)){i._a=aq.slice(0);h(i)}else{if(aq instanceof Date){i._d=new Date(+aq)}else{if(typeof(aq)==="object"){j(i)
}else{i._d=new Date(aq)}}}}}}}function ai(at,ar,au,i,aq){return aq.relativeTime(ar||1,!!au,at,i)}function af(au,ax,at){var aw=ah(Math.abs(au)/1000),av=ah(aw/60),ar=ah(av/60),aq=ah(ar/24),ay=ah(aq/365),i=aw<45&&["s",aw]||av===1&&["m"]||av<45&&["mm",av]||ar===1&&["h"]||ar<22&&["hh",ar]||aq===1&&["d"]||aq<=25&&["dd",aq]||aq<=45&&["M"]||aq<345&&["MM",ah(aq/30)]||ay===1&&["y"]||["yy",ay];
i[2]=ax;i[3]=au>0;i[4]=at;return ai.apply({},i)}function ap(av,at,au){var ar=au-at,aq=au-av.day(),i;if(aq>ar){aq-=7}if(aq<ar-7){aq+=7
}i=N(av).add("d",aq);return{week:Math.ceil(i.dayOfYear()/7),year:i.year()}}function M(i){var ar=i._i,aq=i._f;if(ar===null||ar===""){return null
}if(typeof ar==="string"){i._i=ar=r().preparse(ar)}if(N.isMoment(ar)){i=m({},ar);i._d=new Date(+ar._d)}else{if(aq){if(v(aq)){G(i)
}else{H(i)}}else{E(i)}}return new O(i)}N=function(aq,i,ar){return M({_i:aq,_f:i,_l:ar,_isUTC:false})};N.utc=function(aq,i,ar){return M({_useUTC:true,_isUTC:true,_l:ar,_i:aq,_f:i}).utc()
};N.unix=function(i){return N(i*1000)};N.duration=function(aq,au){var ar=N.isDuration(aq),at=(typeof aq==="number"),i=(ar?aq._input:(at?{}:aq)),av=e.exec(aq),ax,aw;
if(at){if(au){i[au]=aq}else{i.milliseconds=aq}}else{if(av){ax=(av[1]==="-")?-1:1;i={y:0,d:~~av[2]*ax,h:~~av[3]*ax,m:~~av[4]*ax,s:~~av[5]*ax,ms:~~av[6]*ax}
}}aw=new k(i);if(ar&&aq.hasOwnProperty("_lang")){aw._lang=aq._lang}return aw};N.version=ao;N.defaultFormat=w;N.updateOffset=function(){};
N.lang=function(i,aq){if(!i){return N.fn._lang._abbr}i=i.toLowerCase();i=i.replace("_","-");if(aq){C(i,aq)}else{if(aq===null){an(i);
i="en"}else{if(!A[i]){r(i)}}}N.duration.fn._lang=N.fn._lang=r(i)};N.langData=function(i){if(i&&i._lang&&i._lang._abbr){i=i._lang._abbr
}return r(i)};N.isMoment=function(i){return i instanceof O};N.isDuration=function(i){return i instanceof k};m(N.fn=O.prototype,{clone:function(){return N(this)
},valueOf:function(){return +this._d+((this._offset||0)*60000)},unix:function(){return Math.floor(+this/1000)},toString:function(){return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){return o(N(this).utc(),"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
},toArray:function(){var i=this;return[i.year(),i.month(),i.date(),i.hours(),i.minutes(),i.seconds(),i.milliseconds()]},isValid:function(){if(this._isValid==null){if(this._a){this._isValid=!f(this._a,(this._isUTC?N.utc(this._a):N(this._a)).toArray())
}else{this._isValid=!isNaN(this._d.getTime())}}return !!this._isValid},invalidAt:function(){var at,aq=this._a,ar=(this._isUTC?N.utc(this._a):N(this._a)).toArray();
for(at=6;at>=0&&aq[at]===ar[at];--at){}return at},utc:function(){return this.zone(0)},local:function(){this.zone(0);this._isUTC=false;
return this},format:function(i){var aq=o(this,i||N.defaultFormat);return this.lang().postformat(aq)},add:function(aq,ar){var i;
if(typeof aq==="string"){i=N.duration(+ar,aq)}else{i=N.duration(aq,ar)}b(this,i,1);return this},subtract:function(aq,ar){var i;
if(typeof aq==="string"){i=N.duration(+ar,aq)}else{i=N.duration(aq,ar)}b(this,i,-1);return this},diff:function(ar,av,i){var au=this._isUTC?N(ar).zone(this._offset||0):N(ar).local(),aw=(this.zone()-au.zone())*60000,aq,at;
av=P(av);if(av==="year"||av==="month"){aq=(this.daysInMonth()+au.daysInMonth())*43200000;at=((this.year()-au.year())*12)+(this.month()-au.month());
at+=((this-N(this).startOf("month"))-(au-N(au).startOf("month")))/aq;at-=((this.zone()-N(this).startOf("month").zone())-(au.zone()-N(au).startOf("month").zone()))*60000/aq;
if(av==="year"){at=at/12}}else{aq=(this-au);at=av==="second"?aq/1000:av==="minute"?aq/60000:av==="hour"?aq/3600000:av==="day"?(aq-aw)/86400000:av==="week"?(aq-aw)/604800000:aq
}return i?at:a(at)},from:function(i,aq){return N.duration(this.diff(i)).lang(this.lang()._abbr).humanize(!aq)},fromNow:function(i){return this.from(N(),i)
},calendar:function(){var i=this.diff(N().zone(this.zone()).startOf("day"),"days",true),aq=i<-6?"sameElse":i<-1?"lastWeek":i<0?"lastDay":i<1?"sameDay":i<2?"nextDay":i<7?"nextWeek":"sameElse";
return this.format(this.lang().calendar(aq,this))},isLeapYear:function(){var i=this.year();return(i%4===0&&i%100!==0)||i%400===0
},isDST:function(){return(this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone())},day:function(aq){var i=this._isUTC?this._d.getUTCDay():this._d.getDay();
if(aq!=null){if(typeof aq==="string"){aq=this.lang().weekdaysParse(aq);if(typeof aq!=="number"){return this}}return this.add({d:aq-i})
}else{return i}},month:function(aq){var ar=this._isUTC?"UTC":"",i;if(aq!=null){if(typeof aq==="string"){aq=this.lang().monthsParse(aq);
if(typeof aq!=="number"){return this}}i=this.date();this.date(1);this._d["set"+ar+"Month"](aq);this.date(Math.min(i,this.daysInMonth()));
N.updateOffset(this);return this}else{return this._d["get"+ar+"Month"]()}},startOf:function(i){i=P(i);switch(i){case"year":this.month(0);
case"month":this.date(1);case"week":case"isoweek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);
case"second":this.milliseconds(0)}if(i==="week"){this.weekday(0)}else{if(i==="isoweek"){this.isoWeekday(1)}}return this},endOf:function(i){i=P(i);
return this.startOf(i).add((i==="isoweek"?"week":i),1).subtract("ms",1)},isAfter:function(i,aq){aq=typeof aq!=="undefined"?aq:"millisecond";
return +this.clone().startOf(aq)>+N(i).startOf(aq)},isBefore:function(i,aq){aq=typeof aq!=="undefined"?aq:"millisecond";return +this.clone().startOf(aq)<+N(i).startOf(aq)
},isSame:function(i,aq){aq=typeof aq!=="undefined"?aq:"millisecond";return +this.clone().startOf(aq)===+N(i).startOf(aq)},min:function(i){i=N.apply(null,arguments);
return i<this?this:i},max:function(i){i=N.apply(null,arguments);return i>this?this:i},zone:function(i){var aq=this._offset||0;
if(i!=null){if(typeof i==="string"){i=aj(i)}if(Math.abs(i)<16){i=i*60}this._offset=i;this._isUTC=true;if(aq!==i){b(this,N.duration(aq-i,"m"),1,true)
}}else{return this._isUTC?aq:this._d.getTimezoneOffset()}return this},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""
},hasAlignedHourOffset:function(i){if(!i){i=0}else{i=N(i).zone()}return(this.zone()-i)%60===0},daysInMonth:function(){return N.utc([this.year(),this.month()+1,0]).date()
},dayOfYear:function(aq){var i=ah((N(this).startOf("day")-N(this).startOf("year"))/86400000)+1;return aq==null?i:this.add("d",(aq-i))
},weekYear:function(i){var aq=ap(this,this.lang()._week.dow,this.lang()._week.doy).year;return i==null?aq:this.add("y",(i-aq))
},isoWeekYear:function(i){var aq=ap(this,1,4).year;return i==null?aq:this.add("y",(i-aq))},week:function(i){var aq=this.lang().week(this);
return i==null?aq:this.add("d",(i-aq)*7)},isoWeek:function(i){var aq=ap(this,1,4).week;return i==null?aq:this.add("d",(i-aq)*7)
},weekday:function(i){var aq=(this._d.getDay()+7-this.lang()._week.dow)%7;return i==null?aq:this.add("d",i-aq)},isoWeekday:function(i){return i==null?this.day()||7:this.day(this.day()%7?i:i-7)
},get:function(i){i=P(i);return this[i.toLowerCase()]()},set:function(i,aq){i=P(i);this[i.toLowerCase()](aq)},lang:function(i){if(i===ak){return this._lang
}else{this._lang=r(i);return this}}});function L(aq,i){N.fn[aq]=N.fn[aq+"s"]=function(ar){var at=this._isUTC?"UTC":"";if(ar!=null){this._d["set"+at+i](ar);
N.updateOffset(this);return this}else{return this._d["get"+at+i]()}}}for(u=0;u<ae.length;u++){L(ae[u].toLowerCase().replace(/s$/,""),ae[u])
}L("year","FullYear");N.fn.days=N.fn.day;N.fn.months=N.fn.month;N.fn.weeks=N.fn.week;N.fn.isoWeeks=N.fn.isoWeek;N.fn.toJSON=N.fn.toISOString;
m(N.duration.fn=k.prototype,{_bubble:function(){var at=this._milliseconds,aq=this._days,av=this._months,i=this._data,aw,au,ar,ax;
i.milliseconds=at%1000;aw=a(at/1000);i.seconds=aw%60;au=a(aw/60);i.minutes=au%60;ar=a(au/60);i.hours=ar%24;aq+=a(ar/24);i.days=aq%30;
av+=a(aq/30);i.months=av%12;ax=a(av/12);i.years=ax},weeks:function(){return a(this.days()/7)},valueOf:function(){return this._milliseconds+this._days*86400000+(this._months%12)*2592000000+~~(this._months/12)*31536000000
},humanize:function(ar){var i=+this,aq=af(i,!ar,this.lang());if(ar){aq=this.lang().pastFuture(i,aq)}return this.lang().postformat(aq)
},add:function(aq,ar){var i=N.duration(aq,ar);this._milliseconds+=i._milliseconds;this._days+=i._days;this._months+=i._months;
this._bubble();return this},subtract:function(aq,ar){var i=N.duration(aq,ar);this._milliseconds-=i._milliseconds;this._days-=i._days;
this._months-=i._months;this._bubble();return this},get:function(i){i=P(i);return this[i.toLowerCase()+"s"]()},as:function(i){i=P(i);
return this["as"+i.charAt(0).toUpperCase()+i.slice(1)+"s"]()},lang:N.fn.lang});function J(i){N.duration.fn[i]=function(){return this._data[i]
}}function I(aq,i){N.duration.fn["as"+aq]=function(){return +this/i}}for(u in am){if(am.hasOwnProperty(u)){I(u,am[u]);J(u.toLowerCase())
}}I("Weeks",604800000);N.duration.fn.asMonths=function(){return(+this-this.years()*31536000000)/2592000000+this.years()*12};N.lang("en",{ordinal:function(aq){var i=aq%10,ar=(~~(aq%100/10)===1)?"th":(i===1)?"st":(i===2)?"nd":(i===3)?"rd":"th";
return aq+ar}});if(t){module.exports=N}if(typeof ender==="undefined"){this["moment"]=N}if(typeof define==="function"&&define.amd){define("moment",[],function(){return N
})}}).call(this);
//
// source/js/local-offers_v1/script_v02.js
//
function loadGsApi(){try{var cv=s3.cookie.getRaw("GS_IRIPANELIST");if((!cv||cv.length<=0)&&(document.location+"").indexOf("groceryserver.com")<0){s3.ajax.encOD("http://allrecipes.groceryserver.com/groceryserver/api/session/serviceBinder.jsp",{callback:function(d){var c;
if(d&&d.echo&&d.echo.length>0){for(var i=0;i<d.echo.length;i++){if((c=d.echo[i]).name=="GS_IRIPANELIST"){s3.cookie.setRaw("GS_IRIPANELIST",c.value,new Date(2015,1,1,1,1,1,1))
}}}}})}}catch(e){}var _globalResponseHandler=null;var s3={elemCache:new Object(),$:function(id,reload){if(!s3.elemCache[id]||reload){var e=document.getElementById(id);
s3.elemCache[id]=e;return e}else{return s3.elemCache[id]}},x$:function(id){s3.elemCache[id]=null},$$:function(id){return s3.$(id,true)
},pos:function(e,m){e=s3.c(e);if(!m){m={x:0,y:0}}var x=0,y=0;while(e){x+=e.offsetLeft;y+=e.offsetTop;try{e=e.offsetParent}catch(ex){e=null
}}return{x:x+m.x,y:y+m.y}},vp:function(){var w=window,d=document;var ox=0,oy=0;if(typeof(w.pageYOffset)=="number"){oy=w.pageYOffset;
ox=w.pageXOffset}else{if(d.body&&(d.body.scrollLeft||d.body.scrollTop)){oy=d.body.scrollTop;ox=d.body.scrollLeft}else{if(d.documentElement&&(d.documentElement.scrollLeft||d.documentElement.scrollTop)){oy=d.documentElement.scrollTop;
ox=d.documentElement.scrollLeft}}}return{w:(w.innerWidth||(d.documentElement.clientWidth||d.body.clientWidth)),h:(w.innerHeight||(d.documentElement.clientHeight||d.body.clientHeight)),x:ox,y:oy}
},modpos:function(p,t){return{x:p.x+t.x,y:p.y+t.y}},cpos:function(d){var vp=s3.vp();return{x:((vp.w/2)-((d.w)/2)+vp.x),y:((vp.h/2)-((d.h)/2)+vp.y),w:d.w,h:d.h}
},dim:function(e){e=s3.c(e);return(!e||!e.offsetWidth)?{w:0,h:0}:{w:e.offsetWidth,h:e.offsetHeight}},absolute:function(e){e=s3.c(e);
if(e.style.position=="absolute"){return}var p=s3.pos(e);var w=e.clientWidth;var h=e.clientHeight;e.style.position="absolute";
e.style.left=(document.all?p.x+1:p.x)+"px";e.style.top=(document.all?p.y+1:p.y)+"px"},inject:function(d,s){for(var p in s){d[p]=s[p]
}return d},extend:function(d,s){for(var p in s){if(!d[p]){d[p]=s[p]}}return d},create:function(id,cname){var e=document.createElement("div");
s3.absolute(e);s3.hide(e);if(cname){e.className=cname}if(id){e.id=id}document.body.insertBefore(e,document.body.childNodes[0]);
return e},img:function(id,src,cname){var e=document.createElement("img");e.src=src;s3.absolute(e);s3.hide(e);if(cname){e.className=cname
}if(id){e.id=id}document.body.insertBefore(e,document.body.childNodes[0]);return e},trim:function(str){return(""+str).replace(/^(\s)*/,"").replace(/(\s)*$/,"")
},empty:function(s){return s==null||s3.trim(s)==""},replaceAll:function(str,s1,s2){return(""+str).split(s1).join(s2)},escapeURI:function(s){var s2=""+s;
try{s2=encodeURIComponent(s2)}catch(ex){s2=escape(s2)}return s2.replace(/%20/g,"+")},getElementsByClassName:function(className,tag,elm){var tc=new RegExp("(^|\\s)"+className+"(\\s|$)");
tag=tag||"*";elm=elm||document;var es=(tag=="*"&&elm.all)?elm.all:elm.getElementsByTagName(tag);var re=[];var l=es.length;for(var i=0;
i<l;i++){if(tc.test(es[i].className)){re.push(es[i])}}return re}};s3.obj=s3.inject(new Object(),{count:0,ects:new Object(),timeout:function(o,f,t){var id=s3.chr.fromNum(this.count++);
this.ects[id]=o;setTimeout('s3.obj.cb("'+id+'","'+f+'")',t)},cb:function(i,f){var o=s3.obj.ects[i];if(o!=null){o[f]();this.ects[i]=null
}}});s3._try=s3.inject(new Object(),{these:function(){for(var i=0,a=arguments;i<a.length;i++){try{return(a[i])()}catch(e){}}return null
}});s3.chr=s3.inject(new Object(),{chrs:"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",fromNum:function(n){return this.base(n,10)
},toNum:function(s){return this.from(s,10)},base:function(n,b){var s="";while(n>=b){s=this.chrs.charAt(n%b)+s;n=Math.floor(n/b)
}return this.chrs.charAt(n)+s},from:function(s,b){if(!this.revc){this.revc=new Object();for(var i=0;i<this.chrs.length;i++){this.revc[this.chrs.charAt(i)]=i
}}var r=0,i=0;for(var p=0;i=s.length-p-1,p<s.length;p++){r+=this.revc[s.charAt(p)]*(i>0?Math.pow(b,i):1)}return r},guid:function(){return this.base(new Date().getTime(),62)+s3.rnd.str(8)
}});s3.rnd=s3.inject(new Object(),{num:function(x,y){return(Math.floor(Math.random()*(y-x)))+x},str:function(len){var s="";while(s.length<len){s+=s3.chr.chrs.charAt(this.num(0,62))
}return s}});s3.time=function(){return(new Date()).getTime()};s3.a={ary:function(o){if(o==null){return[]}return typeof(o)!="string"&&o.length!=null?o:[o]
},add:function(a,o){a[a.length]=o},addAll:function(a,a2){if(a){for(var i=0;i<a2.length;i++){a[a.length]=a2[i]}}},insert:function(a,p,o){if(p<0){p=0
}if(p>a.length){p=a.length}for(var i=a.length;i>p;i--){a[i]=a[i-1]}a[p]=o},removeAt:function(a,p){if(p==-1||!a||a.length<=0){return null
}var tmp=a[p];for(var i=p+1;i<a.length;i++){a[i-1]=a[i]}a.length=a.length-1;return tmp},remove:function(a,o){return s3.a.removeAt(a,s3.a.indexOf(a,o))
},indexOf:function(a,tst){for(var i=0;i<a.length;i++){if(a[i]==tst){return i}}return -1},call:function(a,f){if(a&&a.length>0){for(var i in a){f(a[i])
}}},runAll:function(a,f){for(var i=0;i<a.length;i++){f(a[i])}}};s3.ajax=s3.inject(new Object(),{odh:{},encOD:function(u,ha){var rid=s3.ajax.newId();
var s=document.createElement("script");s.setAttribute("type","text/javascript");s.setAttribute("src",u+"?!"+rid+"!xx");this.odh[rid]=ha;
document.getElementsByTagName("head")[0].appendChild(s)},count:1,asy:new Object(),callbackOD:function(d){s3.debug("response:"+s3.json.toString(d?d.dat:d));
if(s3.ajax.odh&&s3.ajax.odh[d.rid]){try{if(_globalResponseHandler){_globalResponseHandler(s3.json.toString(d.dat))}}catch(e){}s3.ajax.odh[d.rid].callback(d.dat);
s3.ajax.odh[d.rid]=null}},newId:function(){return s3.chr.fromNum(this.count++)},handle:function(i,h,c){return s3._try.these(function(){if(this.handlers){h[this.handlers[i]](c)
}})}});var _pop=function(s){alert(s3.json.toString(s))};s3.json={toString:function(o){if(typeof(o)=="array"){return s3.json.array(o)
}else{return s3.json.object(o)}},m:{"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},array:function(x){var a=["["],b,f,i,l=x.length,v;
for(i=0;i<l;i+=1){v=x[i];f=s3.json[typeof v];if(f){v=f(v);if(typeof v=="string"){if(b){a[a.length]=","}a[a.length]=v;b=true}}}a[a.length]="]";
return a.join("")},"boolean":function(x){return String(x)},"null":function(x){return"null"},number:function(x){return isFinite(x)?String(x):"null"
},object:function(x){if(!x){return"null"}if(x instanceof Array){return s3.json.array(x)}var a=["{"],b,f,i,v;for(i in x){v=x[i];
f=s3.json[typeof v];if(f){v=f(v);if(typeof v=="string"){if(b){a[a.length]=","}a.push(s3.json.string(i,true),":",v);b=true}}}a[a.length]="}";
return a.join("")},string:function(x,n){if(/["\\\x00-\x1f]/.test(x)){x=x.replace(/([\x00-\x1f\\"])/g,function(a,b){var c=s3.json.m[b];
if(c){return c}c=b.charCodeAt();return"\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16)})}return(n&&x.match(/^([A-Za-z0-9_]+)$/))?x:'"'+x+'"'
},parse:function(s){try{if(s.charCodeAt(s.length-1)==0){s=s.substring(0,s.length-1)}return eval("("+s+")")}catch(e){s=s.substring(0,s.length-1);
try{return eval("("+s+")")}catch(ex){return"{}"}}}};s3.b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-~";
s3.cc=function(c){return String.fromCharCode(c)};s3.crypto={encode:function(k,t){return s3.crypto.enc(s3.crypto.rc4(k,t))},decode:function(k,t){return s3.crypto.rc4(k,s3.crypto.dec(t))
},enc:function(s){var o="";var c1,c2,c3,e1,e2,e3,e4;var i=0;s=s3.crypto.utf8enc(s);while(i<s.length){c1=s.charCodeAt(i++);c2=s.charCodeAt(i++);
c3=s.charCodeAt(i++);e1=c1>>2;e2=((c1&3)<<4)|(c2>>4);e3=((c2&15)<<2)|(c3>>6);e4=c3&63;if(isNaN(c2)){e3=e4=64}else{if(isNaN(c3)){e4=64
}}o+=s3.b64.charAt(e1)+s3.b64.charAt(e2)+s3.b64.charAt(e3)+s3.b64.charAt(e4)}return o},dec:function(s){var o="";var c1,c2,c3;
var e1,e2,e3,e4;var i=0;s=s.replace(/[^A-Za-z0-9\_\-\~]/g,"");while(i<s.length){e1=s3.b64.indexOf(s.charAt(i++));e2=s3.b64.indexOf(s.charAt(i++));
e3=s3.b64.indexOf(s.charAt(i++));e4=s3.b64.indexOf(s.charAt(i++));c1=(e1<<2)|(e2>>4);c2=((e2&15)<<4)|(e3>>2);c3=((e3&3)<<6)|e4;
o+=s3.cc(c1);if(e3!=64){o+=s3.cc(c2)}if(e4!=64){o+=s3.cc(c3)}}o=s3.crypto.utf8dnc(o);return o},utf8enc:function(s){s=s.replace(/\r\n/g,"\n");
var u="";for(var n=0;n<s.length;n++){var c=s.charCodeAt(n);if(c<128){u+=s3.cc(c)}else{if((c>127)&&(c<2048)){u+=s3.cc((c>>6)|192);
u+=s3.cc((c&63)|128)}else{u+=s3.cc((c>>12)|224);u+=s3.cc(((c>>6)&63)|128);u+=s3.cc((c&63)|128)}}}return u},utf8dnc:function(u){var s="";
var i=0;var c,c1,c2,c3;c=c1=c2=c3=0;while(i<u.length){c=u.charCodeAt(i);if(c<128){s+=s3.cc(c);i++}else{if((c>191)&&(c<224)){c2=u.charCodeAt(i+1);
s+=s3.cc(((c&31)<<6)|(c2&63));i+=2}else{c2=u.charCodeAt(i+1);c3=u.charCodeAt(i+2);s+=s3.cc(((c&15)<<12)|((c2&63)<<6)|(c3&63));
i+=3}}}return s},rc4:function(key,text){var i,x,y,t,x2;var s={};for(i=0;i<256;i++){s[i]=i}y=0;for(x=0;x<256;x++){y=(key.charCodeAt(x%key.length)+s[x]+y)%256;
t=s[x];s[x]=s[y];s[y]=t}x=0;y=0;var z="";for(x=0;x<text.length;x++){x2=x%256;y=(s[x2]+y)%256;t=s[x2];s[x2]=s[y];s[y]=t;z+=String.fromCharCode((text.charCodeAt(x)^s[(s[x2]+s[y])%256]))
}return z}};s3.debug=function(msg){try{var s=""+msg;var dbm=false;try{dbm=_debugMode}catch(e){}if(dbm){if(typeof console!=="undefined"&&"log" in console){var p=s.indexOf("\n");
if(console.groupCollapsed&&(s.length>130||p>0)){var sml=(s.substr(0,p>0&&p<130?p:130)+(p>0?"":"..."));console.groupCollapsed(sml);
s=s.replace("request: ","").replace("response:","");console.log(s);if(console.groupEnd){console.groupEnd()}}else{console.log("  "+s)
}}}}catch(ex){}};s3.cookie={get:function(n){var a=document.cookie.split(";");for(var i=0;i<a.length;i++){var t=a[i].split("=");
if(n==t[0].replace(/^\s+|\s+$/g,"")){if(t.length==1){return""}return s3.json.parse(s3.crypto.dec(t[1])).b}}return null},set:function(n,v,exp,p,d){document.cookie=n+"="+s3.crypto.enc(s3.json.toString({b:v}))+(exp?"; expires="+exp.toGMTString():"")+(p?"; path="+p:"; path=/")+(d?"; domain="+d:"")
},getRaw:function(n){var a=document.cookie.split(";");for(var i=0;i<a.length;i++){var t=a[i].split("=");if(n==t[0].replace(/^\s+|\s+$/g,"")){if(t.length==1){return""
}return t[1]}}return null},setRaw:function(n,v,exp,p,d){document.cookie=n+"="+v+(exp?"; expires="+exp.toGMTString():"")+(p?"; path="+p:"; path=/")+(d?"; domain="+d:"")
}};try{var cv=s3.cookie.getRaw("GS_IRIPANELIST");if((!cv||cv.length<=0)&&(document.location+"").indexOf("groceryserver.com")<0){s3.ajax.encOD("http://allrecipes.groceryserver.com/groceryserver/api/session/serviceBinder.jsp",{callback:function(d){var c;
if(d&&d.echo&&d.echo.length>0){for(var i=0;i<d.echo.length;i++){if((c=d.echo[i]).name=="GS_IRIPANELIST"){s3.cookie.setRaw("GS_IRIPANELIST",c.value,new Date(2015,1,1,1,1,1,1))
}}}}})}}catch(e){}var gsapi={cid:"6c7877feaf023f93b09a19d07736a7ce",ip:"97.65.109.131"};gsapi.call=function(req,handler){var r={path:req.path,post:req.post};
s3.debug("request: "+req.path+(req.post?"\n"+s3.json.toString(req.post):""));s3.ajax.encOD("http://allrecipes.groceryserver.com/groceryserver/service/"+s3.crypto.encode("obfuscate",s3.json.toString(r)),handler)
};gsapi.ack=function(req,handler){var r={path:req.path,post:req.post};s3.debug("request: "+req.path+(req.post?"\n"+s3.json.toString(req.post):""));
s3.ajax.encOD("http://allrecipes.groceryserver.com/groceryserver/ack/"+s3.crypto.encode("obfuscate",s3.json.toString(r)),handler)
};gsapi.logActivity=function(params,handler){if(typeof handler=="function"){handler={callback:handler}}var req={path:"/ack/logActivity"};
if(params){req.post=params}gsapi.ack(req,{callback:function(r){this.cb.callback(r)},cb:handler})};function listResultInjector(shoppingListId,handler){return{shoppingListId:shoppingListId,callback:function(r){gsapi.shoppingList.getShoppingListById(this.shoppingListId,this.cb.cb)
},cb:handler}}gsapi.escapeURI=function(s){var s2=""+s;try{s2=encodeURIComponent(s2)}catch(ex){s2=escape(s2)}return s2.replace(/%20/g,"+")
};var SEARCH={};gsapi.search=SEARCH;SEARCH.getPromotionsForSearchTerms=function(params,handler){var hasBrand=false;for(i in params){if(i=="brand"){hasBrand=true
}}if(!hasBrand){params.brand="true"}if(typeof handler=="function"){handler={callback:handler}}var req={SearchRequest:params};
gsapi.call({path:"/service/searchservice/rest/v10/clientId/"+gsapi.cid+"/getPromotionsForSearchTerms",post:req},{callback:function(r){this.cb.callback((r&&r.PromotionSearchResponse)?r.PromotionSearchResponse:null)
},cb:handler})};SEARCH.getContentPairings=function(params,handler){if(typeof handler=="function"){handler={callback:handler}}var req={GetContentPairingsRequest:params};
gsapi.call({path:"/service/retailerservice/rest/v10/clientId/"+gsapi.cid+"/getContentPairings",post:req},{callback:function(r){this.cb.callback((r&&r.PromotionSearchResponse)?r.PromotionSearchResponse:null)
},cb:handler})};var RECIPE={};gsapi.recipe=RECIPE;RECIPE.getRecipeInformationByExternalId=function(params,handler){if(typeof handler=="function"){handler={callback:handler}
}var req={request:params};gsapi.call({path:"/service/recipe/rest/v10/clientId/"+gsapi.cid+"/getRecipeInformationByExternalId",post:req},{callback:function(r){this.cb.callback((r&&r.getRecipeDetailsResponse)?r.getRecipeDetailsResponse:null)
},cb:handler})};var LOCATION={};gsapi.location=LOCATION;LOCATION.getRetailerLocation=function(params,handler){if(typeof handler=="function"){handler={callback:handler}
}var req={GetRetailerRequest:params};gsapi.call({path:"/service/chainservice/rest/v10/clientId/"+gsapi.cid+"/getRetailerLocation",post:req},{callback:function(r){this.cb.callback((r&&r.getRetailersResponse)?r.getRetailersResponse:null)
},cb:handler})};var GROCERY={};gsapi.grocery=GROCERY;GROCERY.getZipCode=function(handler){if(typeof handler=="function"){handler={callback:handler}
}gsapi.call({path:"/service/location/rest/v10/getClosestZipCode/clientId/"+gsapi.cid+"/ipAddress/"+gsapi.ip},{callback:function(r){var t=""+r;
if(t=="-1"){t="0"}else{while(t.length<5){t="0"+t}}this.cb.callback(t)},cb:handler})};window.gsapi=gsapi;window.s3=s3};
//
// source/js/local-offers_v1/utilities.js
//
var AR=AR||{};AR.Mobile=AR.Mobile||{};$.fn.trim=function(a){if(a===undefined){a=$(this)[0]}a=a.replace(/^\s\s*/,""),ws=/\s/,i=a.length;
while(ws.test(a.charAt(--i))){}return a.slice(0,i+1)};(function(a){a.QueryString=(function(c){if(c==""){return{}}var d={};for(var e=0;
e<c.length;++e){var f=c[e].split("=");if(f.length!=2){continue}d[f[0]]=decodeURIComponent(f[1].replace(/\+/g," "))}return d})(window.location.search.substr(1).split("&"))
})(jQuery);$(document).bind("pageshow",function(a){if($("#haackroutedebugger").length>0){$("[data-role=footer]").after($("#haackroutedebugger"))
}});Array.prototype.move=function(a,b){this.splice(b,0,this.splice(a,1)[0])};AR.Mobile.Utilities={Formats:{SelectorByName:"[name={0}]",SelectByDataAttribute:"[data-{0}={1}]"},GetSelectorByName:function(a){return this.Formats.SelectorByName.replace("{0}",a)
},GetSelectorByDataAttribute:function(a,b){return this.Formats.SelectByDataAttribute.replace("{0}",a).replace("{1}",b)},ScrollTo:function(b){var a;
if(typeof(b)=="number"){a=parseInt(b)}else{if(b.length){a=b.offset().top}}$(document).trigger("scrollstart");$("html,body").animate({scrollTop:a},1000,function(){$(document).trigger("scrollstart");
setTimeout(function(){$(document).trigger("scrollstop")},1000)})},ShowTextOverflow:function(g,e){var c=e+"id";var b=$(g).data(c);
var d=globalUtils.GetSelectorByDataAttribute(c,b);var h=$("."+e+"_overflow"+d);var f=$("."+e+"_morelink"+d);var a=$("."+e+"_ellipsis"+d);
a.hide();f.hide();h.show()},HideTextOverflow:function(h,e){var j=$(h).text();var c=e+"id";var b=$(h).data(c);var d=globalUtils.GetSelectorByDataAttribute(c,b);
var g=$("."+e+"_overflow"+d);var f=$("."+e+"_morelink"+d);var a=$("."+e+"_ellipsis"+d);if(j.length==0||j=='"'){f.hide();a.hide()
}else{g.hide()}},GetOrientation:function(){var a=$.event.special.orientationchange.orientation();return a},GetScreenWidth:function(){var a=$.event.special.orientationchange.orientation(),c=a==="portrait",e=c?320:480,d=c?screen.availHeight:screen.availWidth,f=Math.max(e,$(window).width()),b=Math.min(d,f);
return b},Truncate:function(c,d,a){var b="";if(c.length>d){if(a){b+="&quot;"}b+=c.substr(0,d);b+="&hellip;";if(a){b+="&quot;"
}}else{if(a){b="&quot;"+c+"&quot;"}else{b=c}}return b},AddHoursToDate:function(a,b){a.setHours(a.getHours()+b);return a},BoolToString:function(a){return(a==true||a.toString().toLowerCase()=="true")?"true":"false"
},ButtonEnable:function(c,a,b){if(a){$(c).removeClass("btn-disabled").removeAttr("disabled");$(c).unbind("click").bind("click",b)
}else{$(c).addClass("btn-disabled").attr("disabled",true);$(c).unbind("click")}},ExecuteFunctionByName:function(e,g,a){var c=window;
var b=e.split(".");for(var f=0;f<b.length;f++){var d=c[b[f]];if(typeof d==="function"){d(g,a)}c=d}},HasStorage:function(){try{localStorage.setItem("1","1");
localStorage.removeItem("1");return true}catch(a){return false}},CheckForStorageAndSetItem:function(a,b){if(this.HasStorage()){localStorage.setItem(a,b)
}},CheckForStorageAndGetItem:function(a){if(this.HasStorage()){return localStorage.getItem(a)}else{return"NoStorage"}},LocalStorageCheckWithAction:function(a){if(this.HasStorage()){a()
}},ShowLoginNotification:function(){$("#login-success-message").css({display:"block",opacity:0.96}).delay(10000).fadeOut(400)
},IsDeviceSupported:function(b,e){var a=false;if(b){var c=new UAParser(e);if(c){var d=c.getResult();if(b.OS){for(x=0;x<b.OS.length;
x++){a=(d.os.name==b.OS[x].Name&&parseFloat(d.os.version)>=parseFloat(b.OS[x].Version));if(a){return true}}}if(b.Browser){for(x=0;
x<b.Browser.length;x++){a=(d.browser.name==b.Browser[x].Name&&parseFloat(d.browser.version)>=parseFloat(b.Browser[x].Version));
if(a){return true}}}if(b.Device){for(x=0;x<b.Device.length;x++){a=(d.device.model==b.Device[x].Model);if(a){return true}}}if(b.Engine){for(x=0;
x<b.Engine.length;x++){a=(d.os.name==b.OS[x].Name&&parseFloat(d.os.version)>=parseFloat(b.OS[x].Version));if(a){return true}}}}}return a
}};(function(a){a.fn.textfill=function(b){a.each(this,function(){var e=a("span:visible:first",this);var c=a(this).height()-2;
var d=a(this).width()-10;var f=e.height();var g=e.width();var h=false;if(e.length>0){while((f>c||g>d)){if(e.html()!==null){h=true;
e.html(e.html().substring(0,e.html().length-1));f=e.height();g=e.width()}}if(h){e.html(e.html().substring(0,e.html().length-2)+String.fromCharCode(8230))
}}return this})}})(jQuery);AR.Mobile.Utilities.Validation={IsBlank:function(a){return(!a||a.length==0)},IsEmail:function(a){var c=/^((\"[^\"\f\n\r\t\v\b]+\")|([\w\!\#\$\%\&\'\*\+\-\~\/\^\`\|\{\}]+(\.[\w\!\#\$\%\&\'\*\+\-\~\/\^\`\|\{\}]+)*))@((\[(((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9])))\])|(((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9])))|((([A-Za-z0-9\-])+\.)+[A-Za-z\-]+))$/;
var b=a.replace(",",";").replace("\n",";").replace(" ",";").replace(";;",";").split(";");for(x=0;x<b.length;x++){if(!c.test(b[x])){return false
}}return true}};AR.Mobile.Utilities.StarRatings={StarsOverlayClassName:".rating-stars-grad",GetNewRatingStars:function(b,a){var e=$(b).find("img").width();
var d=d*5;var c=Math.ceil(a/e);return c},GetCurrentRatingStars:function(a){var b=0;$(a).find("img").each(function(){if($(this).attr("src").indexOf("full")!=-1){b++
}});return b},SetRatingStars:function(g,e,f){var a=f!=null&&f==true;var j=$(g).find("img").width();var h=h*5;e=(a)?(e*j):e;if(e>h){e=h
}var d=this.GetNewRatingStars(g,e);var b=this.GetCurrentRatingStars(g,e);$(g).children().remove();for(var c=0;c<5;c++){if(c<d){$(g).append('<img height="26" width="26" src="http://images.media-allrecipes.com/ar-images/icons/rating-stars/full-star.png" onerror="this.onerror=null; this.src=\'http://images.media-allrecipes.com/ar-images/icons/rating-stars/full-star.png\'" />')
}else{$(g).append('<img height="26" width="26" src="http://images.media-allrecipes.com/ar-images/icons/rating-stars/empty-star.png" onerror="this.onerror=null; this.src=\'http://images.media-allrecipes.com/ar-images/icons/rating-stars/empty-star.png\'" />')
}}},GetDescription:function(b){var a="";switch(b){case 0:"";break;case 1:a="Couldn't eat it";break;case 2:a="Didn't like it";
break;case 3:a="It was OK";break;case 4:a="Liked it";break;case 5:a="Loved it";break}return a}};AR.Mobile.Utilities.Dialog={Show:function(e,f,d){var b=$(e),a=b.find("[data-role='overlaycontentholder-button']"),c=b.find("#dialogPrompt");
c.html(f);a.each(function(j,k){var g=$(this),h=g.data("callback");g.unbind("click").bind("click",function(){AR.Mobile.Utilities.Dialog.Hide(e);
var m=window;var l=h.split(".");for(var o=0;o<l.length;o++){var n=m[l[o]];if(typeof n==="function"){n(d)}m=n}})});b.delay(500).slideDown()
},Hide:function(b){var a=$(b);a.slideUp()}};AR.Mobile.Utilities.Cookies={LocalOffersShoppingCookieID:"AR_LocalOffers_ENGAGEMENT",GetCookie:function(d){var a=document.cookie.split("; ");
for(var c=0;c<a.length;c++){var b=a[c].split("=");if(d==b[0]){return unescape(b[1])}}return null},SetCookie:function(a,f,e){var d=new Date();
e=(e==null)?0:e;d.setDate(d.getDate()+e);d=d.toGMTString();var c=document.domain;if(typeof c=="string"&&c.indexOf(".")==-1){c=""
}var b=a+"="+escape(f)+"; expires="+d+"; path=/"+((c=="")?";":("; domain="+c+";"));document.cookie=b},RegisterCookie:function(d,e,c){var b=document.domain;
if(typeof b=="string"&&b.indexOf(".")==-1){b=""}var a=d+"="+escape(e);if(c){a=a+"; expires="+c}a=a+"; path=/"+((b=="")?";":("; domain="+b+";"));
document.cookie=a},SetSessionCookie:function(a,b){AR.Mobile.Utilities.Cookies.RegisterCookie(a,b)},DeleteCookie:function(a){AR.Mobile.Utilities.Cookies.SetCookie(a,"",-1)
}};AR.Loader={Show:function(){$("[data-loading-indicator-template]").show()},Hide:function(){$("[data-loading-indicator-template]").hide()
}};
//
// source/js/local-offers_v1/deals-and-stores-ui.js
//
var AR=AR||{};(function(l,a,s){var j=false;var b=a("[data-local-offers-container]");var e=a("[data-stores-output]");var c=a("[data-lo-onoffswitch]");
var d=a("[data-role='lo-smu-output']");l.InitSliderClick=function(){a("#local-offers-toggle-slider").bind("click",function(){l.UserToggledVisible=!l.UserToggledVisible;
if(AR.Mobile.Utilities.HasStorage()){AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.UserToggledVisible",l.UserToggledVisible)
}if(!j){l.Initialize()}r()})};var r=function(){if(l.UserToggledVisible){e.show();a("[data-offer], [data-smu]").show();a("[data-offers-location-toggle-lbl]").show();
b.show()}else{e.hide();a("[data-offer], [data-smu]").hide();a("[data-offers-location-toggle-lbl]").hide();b.hide()}};window.pubsub.listen("LocalOffers.LocationDenied","LocalOffers.UI.ToggleVisibleState",r);
l.InitSliderState=function(){c.attr("checked",l.UserToggledVisible);if(l.UserToggledVisible){a("[data-offers-location-toggle-lbl]").show()
}else{a("[data-offers-location-toggle-lbl]").hide()}};l.Initialize=function(){if(l.UserToggledVisible){e.show();a("[data-offer], [data-smu]").show();
a("[data-local-offers-count]").show();if(!j){j=true;AR.Loader.Show();window.pubsub.broadcast("LocalOffers.StartScriptLoad");window.pubsub.broadcast("LocalOffers.CaptureCtaEngagementForSession");
if(!window.karmaEnabled){window.adManager.RefreshAd("div-gpt-ad-footer")}}}};var o=function(){e.empty();a("[data-offer], [data-smu]").remove();
a("[data-local-offers-count]").hide()};window.pubsub.listen("LocalOffers.NoDataFound","LocalOffers.UI.Reset",o);window.pubsub.listen("LocalOffers.SlaTimeout","LocalOffers.UI.Reset",o);
window.pubsub.listen("LocalOffers.LocationDenied","LocalOffers.UI.Reset",o);var f=function(){e.empty();var t=a('<div class="carousel carousel-slide" data-transition="slide">"');
var u=l.DisplayRetailers.map(function(v){return a.jqote("#stores-template",v)});t.append(u.join(""));e.append(t);t.carousel()
};window.pubsub.listen("LocalOffers.StartUIDraw","RecipePageOffers.DrawCarousel",f);var q=function(){try{AR.Mobile.Utilities.Cookies.SetSessionCookie(AR.LocalOffers.CookieID(),1)
}catch(t){console.log(" * * Unable to set session cookie [ setAdSessionCookie ] - "+t.message)}};window.pubsub.listen("LocalOffers.CaptureCtaEngagementForSession","RecipePageOffers.RegisterEngagement",q);
var h=function(t){if(t.promotionPixel){t.clickPixels=t.promotionPixel.filter(function(u){return u.pixelAction==="click"}).map(function(u){return u.pixelUrl
}).join(",")}if(t.displayType.length>0){l.FireTrackingPixels(t.promotionPixel.filter(function(u){return u.pixelAction==="impression"
}).map(function(u){return u.pixelUrl}))}return t};var k=function(u){var t=l.IngredientMappings.filter(function(v){return a.inArray(v.gsId,u.ingredientIdList)>=0
});if(!t||t.length==0){return false}return a("[data-id="+t[0].id+"]")};var i=function(t){return a("[data-id="+t.arId+"]")};var m=function(){if(l.DisplayRetailers){g(0)
}};var g=function(u){a("[data-offer], [data-smu]").remove();var y=l.UserToggledVisible;var t=[];var v=[];l.DisplayRetailers[u].promotions.forEach(function(A){if(a.inArray(A.id,t)===-1){var z=l.EnablePromotionApiUpdate?i(A):k(A);
A.ingredientNameId=z.data("nameid");A.ingredientId=z.data("id");A=h(A);t.push(A.id);if(A.displayType.length==0){v.push(A.ingredientId)
}if(A.displayType.length>0){z.parents("li").after(a.jqote("#smu-inline-template",A));a('[data-role="lo-offers-output"]').append(a.jqote("#smu-inline-template",A))
}else{z.parents("li").after(a.jqote("#offers-template",A));a('[data-role="lo-offers-output"]').append(a.jqote("#offers-template",A))
}if(!y){a("[data-offer], [data-smu]").hide()}}});var w=v.filter(function(A,B,z){return z.indexOf(A)==B});var x=w.length==1?" item ":" items ";
a("[data-local-offers-count]").html(w.length+x+"on sale");a("[data-local-offers-count]").show()};window.pubsub.listen("LocalOffers.StartUIDraw","RecipePageOffers.DrawDeals",g);
window.pubsub.listen("JqueryCarousel.GoTo","RecipePageOffers.DrawDeals",g);window.pubsub.listen("Ingredients.LoadedFromService","RecipePageOffers.ReDrawDeals",m);
var p=0;var n=function(v,x){if(x&&p>4){return}if(!l.SmuPromotions||l.SmuPromotions.length==0){p++;setTimeout(n,500,[v],true);
return}d.empty();var t=l.DisplayRetailers[v];var w=0;var u=t.id;p=0;if(l.SmuPromotions&&l.SmuPromotions.length>0){l.SmuPromotions.forEach(function(A){var B=A.retailerLocationIdList;
if(B&&B.indexOf(u)!=-1){A=h(A);var y=a(a.jqote("#smu-template",A));d.empty();d.append(y);w++}else{if((!B||B.length==0)&&w==0){A=h(A);
var z=a(a.jqote("#smu-template",A));d.append(z)}}})}};window.pubsub.listen("LocalOffers.StartUIDraw","LocalOffers.UI.RenderMayWeSuggest",n);
window.pubsub.listen("JqueryCarousel.GoTo","LocalOffers.UI.RenderMayWeSuggest",n)})(AR.LocalOffers=AR.LocalOffers||{},jQuery);
//
// source/js/local-offers_v1/init.js
//
var AR=AR||{};(function(e,a,f){var b=a("[data-local-offers-container]");var c=a("#local-offers-toggle-slider");var d=false;e.ZipOverride=(a.QueryString&&a.QueryString.zipCode)?a.QueryString.zipCode:null;
e.LatOverride=(a.QueryString&&a.QueryString.lat)?a.QueryString.lat:null;e.LongOverride=(a.QueryString&&a.QueryString["long"])?a.QueryString["long"]:null;
e.SortType="";e.SortTypes={};e.SortTypes.Closest="Closest";e.SortTypes.Deals="Deals";e.Lat="";e.Long="";e.UserToggledVisible=true;
if(a.QueryString&&a.QueryString["lo-debug"]){window._debugMode=true}if(e.ZipOverride){e.Initialize()}if(e.LatOverride&&e.LongOverride){e.Initialize()
}if(AR.Mobile.Utilities.HasStorage()&&localStorage.getItem("LocalOffers.SortType")){e.SortType=localStorage.getItem("LocalOffers.SortType")
}if(AR.Mobile.Utilities.HasStorage()&&JSON.parse(localStorage.getItem("LocalOffers.UserToggledVisible"))==null){AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.UserToggledVisible",true)
}if(AR.Mobile.Utilities.HasStorage()){e.UserToggledVisible=JSON.parse(localStorage.getItem("LocalOffers.UserToggledVisible"))
}else{e.UserToggledVisible=true}e.InitSliderState();if(b.length>0&&c.length>0&&e.UserToggledVisible){a(document).on("ready",function(){e.Initialize()
})}AR.Mobile.Utilities.LocalStorageCheckWithAction(function(){if(localStorage.getItem("LocalOffers.UserZip")&&localStorage.getItem("LocalOffers.UserZip").length>0){e.UserZip=localStorage.getItem("LocalOffers.UserZip");
pubsub.broadcast("LocalOffers.RetrievedUserZip")}if(localStorage.getItem("LocalOffers.Lat")&&localStorage.getItem("LocalOffers.Lat").length>0){e.Lat=localStorage.getItem("LocalOffers.Lat")
}if(localStorage.getItem("LocalOffers.Long")&&localStorage.getItem("LocalOffers.Long").length>0){e.Long=localStorage.getItem("LocalOffers.Long")
}if(sessionStorage.getItem("LocalOffers.UserZip")&&sessionStorage.getItem("LocalOffers.UserZip").length>0){e.UserZip=sessionStorage.getItem("LocalOffers.UserZip")
}});e.InitSliderClick()})(AR.LocalOffers=AR.LocalOffers||{},jQuery);
//
// source/js/local-offers_v1/data.js
//
var AR=AR||{};(function(t,a,E){t.IngredientMappings=[];t.DisplayRetailers=[];t.CookieID=function(){return h};t.IsGeoIpEnabled=true;
t.SmuPromotions=[];t.EnablePromotionApiUpdate=true;var B=99;var w=[];var v=[];var z=0;var A=15000;var x=false;var p=[];var h="AR_LocalOffers_ENGAGEMENT";
var r=0;var s=0;var y;a(".recipe-ingred_txt").each(function(){p.push(a(this).data("id"))});a('[data-role="recipe-ingredient"]').each(function(){p.push(a(this).data("ingredientid"))
});var i=function(){var F="bfeb1eb4e751f03bceffaa649e977927";if(window.location.host.indexOf(".corp")>0&&window.location.pathname.toLowerCase().indexOf("print/")>0){F="3e591049369eaeca8f1a64e38bdbb1e4"
}else{if(window.location.host.indexOf(".corp")>0){F="e3fb91be3d3d1c38f9bec907dda1209d"}}if(window.location.pathname.toLowerCase().indexOf("print/")>0){F="489e9ab043c0ffc26cb47cc80e42cb5a"
}else{if(window.location.host.indexOf("m.")>=0){F="3c76b8ac5867dbf05b4bbd0c54e1ed03"}}console.log("Local Offers: Setting GSAPI client ID to: "+F);
return F};var n=function(){if(!t.DisplayRetailers||t.DisplayRetailers.length==0){if(y){y.abort();console.log("Local Offers: handleTimeout() == true ")
}window.pubsub.broadcast("LocalOffers.SlaTimeout");AR.Loader.Hide()}};var q=function(){if(t.UserZip){window.pubsub.broadcast("LocalOffers.StartRetailerCall")
}else{if(localStorage.getItem("LocalOffers.IsGeoLocationEnabled")){window.pubsub.broadcast("LocalOffers.StartLocationCall")}else{if(t.IsGeoIpEnabled){window.pubsub.broadcast("LocalOffers.StartGeoIpCall")
}else{window.pubsub.broadcast("LocalOffers.StartLocationCall")}}}};window.pubsub.listen("LocalOffers.ReadyForDataCall","GroceryServer.InitiateDataCall",q);
var f=function(){gsapi.grocery.getZipCode(o)};window.pubsub.listen("LocalOffers.StartGeoIpCall","GroceryServer.GetZipByIp",f);
var o=function(F){if(!t.UserZip){t.UserZip=F;sessionStorage.setItem("LocalOffers.UserZip",t.UserZip)}window.pubsub.broadcast("LocalOffers.RetrievedUserZip");
window.pubsub.broadcast("LocalOffers.StartRetailerCall")};var e=function(){window.loadGsApi();window.gsapi.cid=i();if(!x){if(window.userInformation.clientIp){window.gsapi.ip=window.userInformation.clientIp
}x=true;if(AR.Mobile.Utilities.HasStorage&&sessionStorage.getItem("GrocerServer.Retailers")&&!t.LatOverride&&!t.LongOverride&&!t.ZipOverride){w=JSON.parse(sessionStorage["GrocerServer.Retailers"]);
v=w.map(function(F){return F.id});z=setTimeout(n,A);window.pubsub.broadcast("LocalOffers.StartPromotionsForSearchTermsCall")}else{window.pubsub.broadcast("LocalOffers.ReadyForDataCall")
}}else{window.pubsub.broadcast("LocalOffers.ReadyForDataCall")}};window.pubsub.listen("LocalOffers.StartScriptLoad","GroceryServer.GetScript",e);
var c=function(){window.loadGsApi();window.gsapi.cid=i();if(!t.ZipOverride){navigator.geolocation.getCurrentPosition(function(G){r=G.coords.latitude;
s=G.coords.longitude;AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.IsGeoLocationEnabled",true);if(t.LatOverride&&t.LongOverride){r=t.LatOverride;
s=t.LongOverride}var F={radius:"20",latitude:r,longitude:s};t.Lat=r;t.Long=s;AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.Lat",t.Lat);
AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.Long",t.Long);z=setTimeout(n,A);window.gsapi.location.getRetailerLocation(F,m)
},function(){AR.Loader.Hide();clearTimeout(z);if(t.SettingsClick){window.pubsub.broadcast("LocalOffers.LocationDenied.FindClick",[true,"","Oops! Enter a zip code and we'll show you nearby stores.","(You can also turn on Location Services through your device settings later.)"]);
t.SettingsClick=false}else{t.UserToggledVisible=false;t.InitSliderState();window.pubsub.broadcast("LocalOffers.LocationDenied",[true])
}})}else{window.pubsub.broadcast("LocalOffers.StartRetailerCall")}};window.pubsub.listen("LocalOffers.StartLocationCall","GroceryServer.GetLocation",c);
var d=function(){var F={radius:"20",zipCode:t.UserZip};z=setTimeout(n,A);window.gsapi.location.getRetailerLocation(F,m)};window.pubsub.listen("LocalOffers.StartRetailerCall","GroceryServer.GetRetailerLocations",d);
var m=function(F){if(typeof F.retailers!=="undefined"){w=F.retailers;v=F.retailers.map(function(G){return G.id});if(AR.Mobile.Utilities.HasStorage()){sessionStorage.setItem("GrocerServer.Retailers",JSON.stringify(w))
}}else{w=[]}window.pubsub.broadcast("LocalOffers.StartPromotionsForSearchTermsCall")};var g=function(){var F={retailerLocationIds:v,externalIds:[window.dataLayer.page.pageInfo.pageId],version:window.dataLayer.page.pageInfo.version,externalRecipeUrl:a("link[rel='canonical']").length>0?a("link[rel='canonical']").attr("href"):a("[data-local-offers-recipe-url]").data("local-offers-recipe-url"),offset:"0",maxResult:"100"};
if(t.UserZip){F.zipCode=t.UserZip}if(t.Lat){F.latitude=t.Lat}if(t.Long){F.longitude=t.Long}window.gsapi.recipe.getRecipeInformationByExternalId(F,l)
};window.pubsub.listen("LocalOffers.StartPromotionsForSearchTermsCall","GroceryServer.GetPromotionsForSearchTemrs",g);var k=function(F){t.SmuPromotions=new Array();
if(F.categories){F.categories.forEach(function(G){if(G.searchResult){G.searchResult.forEach(function(H){if(H.upcItem&&H.upcItem.promotions){H.upcItem.promotions.forEach(function(I){t.SmuPromotions.push(I)
})}})}})}};var b=function(){var F={externalId:window.dataLayer.page.pageInfo.pageId,retailerLocationIds:v,offset:"0",maxResult:"100"};
if(t.UserZip){F.zipCode=t.UserZip}if(t.Lat){F.latitude=t.Lat}if(t.Long){F.longitude=t.Long}window.gsapi.search.getContentPairings(F,k)
};window.pubsub.listen("LocalOffers.StartPromotionsForSearchTermsCall","GroceryServer.GetContentPairings",b);var C=function(F,G){if(F.promotions.length>G.promotions.length){return -1
}else{if(F.promotions.length<G.promotions.length){return 1}else{return 0}}};var D=function(H,I){var F=H.name.toLowerCase(),G=I.name.toLowerCase();
if(F<G){return -1}if(F>G){return 1}return 0};var j=function(F){var G=[];if(!F.recipes){return G}G=F.recipes.map(function(H){return H.recipeIngredients
}).reduce(function(I,H){return I.concat(H)}).filter(function(H){return H.promotions}).map(function(H){H.promotions.forEach(function(I){I.recipeIngredientId=H.recipeIngredientId;
I.arId=H.externalId});return H.promotions});if(G&&G.length>0){G=G.reduce(function(I,H){return I.concat(H)})}return G};var l=function(F){var H;
H=j(F);var G=window.moment();w.forEach(function(J){H.forEach(function(L){var K=window.moment(L.expirationDate).add("hours",23).add("minutes",59);
if(a.inArray(J.id,L.retailerLocationIdList)>=0&&G._d<K._d){J.promotions=J.promotions||[];J.smuCount=J.smuCount||0;if(a.inArray(L,J.promotions)<0){if(L.displayType.length>0&&J.smuCount<B){J.smuCount++;
J.promotions.push(L)}else{J.promotions.push(L)}}}})});t.DisplayRetailers=w.filter(function(J){return J.promotions!==E&&J.promotions.length>0
});var I=H.filter(function(J){return J.displayType.length>0&&(J.retailerLocationIdList==E||J.retailerLocationIdList.length==0)
});I.forEach(function(J){t.DisplayRetailers.forEach(function(K){if(a.inArray(J,K.promotions)<0&&K.smuCount<B){K.promotions.push(J);
K.smuCount++}})});if(t.SortType==t.SortTypes.Deals){t.DisplayRetailers=t.DisplayRetailers.sort(D).sort(C)}t.DisplayRetailers=t.DisplayRetailers.splice(0,10);
clearTimeout(z);AR.Loader.Hide();if(t.DisplayRetailers&&t.DisplayRetailers.length>0){window.pubsub.broadcast("LocalOffers.StartUIDraw",[0])
}else{window.pubsub.broadcast("LocalOffers.NoDataFound")}};var u=function(G){var F=Math.random()*1000000|0;G=G.trim();G=G.replace(/\[RANDOM\]/,F);
G=G.replace(/RANDOM/,F);G=G.replace(/\[RANDOMNUMBER\]/,F);G=G.replace(/\[TIMESTAMP\]/,Date.now());return G};t.FireTrackingPixels=function(F){F.forEach(function(H){var G=new Image();
G.src=u(H);document.body.appendChild(G)})};t.FireClickPixels=function(F){var G=a(F).data("click-pixels").split(",");t.FireTrackingPixels(G)
}})(AR.LocalOffers=AR.LocalOffers||{},jQuery);
//
// source/js/local-offers_v1/error-message.js
//
var AR=AR||{};(function(d,a,f){var b=a("[data-local-offers-error]");var e=function(i,g,h,j){if(g||h||j){b.find("[data-error-header]").text(g);
b.find("[data-error-message]").text(h);b.find("[data-error-subnote]").text(j)}else{b.find("[data-error-message]").text("Hmm. It looks like these ingredients aren't on sale today.");
b.find("[data-error-subnote]").text("")}b.show()};window.pubsub.listen("LocalOffers.NoDataFound","LocalOffers.ShowErrorMessage",e);
window.pubsub.listen("LocalOffers.SlaTimeout","LocalOffers.ShowErrorMessage",e);window.pubsub.listen("LocalOffers.LocationDenied.FindClick","LocalOffers.ShowErrorMessage",e);
var c=function(){b.hide()};window.pubsub.listen("LocalOffers.StartUIDraw","LocalOffers.HideErrorMessage",c);window.pubsub.listen("LocalOffers.SettingsLinkClicked","LocalOffers.HideErrorMessage",c);
window.pubsub.listen("LocalOffers.LocationDenied","LocalOffers.HideErrorMessage",c)})(AR.LocalOffers=AR.LocalOffers||{},jQuery);
//
// source/js/local-offers_v1/update-panel.js
//
var AR=AR||{};(function(y,a,C){var c=a("[data-local-offers-container]");var h=a("[data-offers-location-container]");var k=a("[data-offers-location-toggle-btn]");
var f=a("[data-offers-location-update-btns-container]");var g=a("[data-offers-location-find-me-btn]");var m=a("[data-offers-location-zip-input]");
var q=a("[data-offers-show-sale-ingredients-cta-btn]");var l=a("[data-offers-location-enter-zip-btn]");var i=a("[data-offers-location-sort-closest-btn]");
var j=a("[data-offers-location-most-deals-btn]");var n=a('[data-action="lo-settings-off"]');var o=a('[data-action="lo-settings-on"]');
var p=a('[data-role="lo-panel-off"]');var b=a("[lo-close-message-btn]");var e=a("[lo-turn-on-location-btn]");var d=a("[data-lo-location-message]");
k.on("click",function(){f.slideToggle(true);k.toggleClass("active")});y.SettingsClick=false;g.on("click",function(){y.LatOverride=C;
y.LongOverride=C;r();y.SettingsClick=true;AR.Loader.Show();pubsub.broadcast("LocalOffers.StartLocationCall")});l.on("click",function(){w();
AR.Loader.Show();pubsub.broadcast("LocalOffers.StartScriptLoad");pubsub.broadcast("LocalOffers.CheckTestZipBeacon");return false
});i.on("click",function(){y.SettingsClick=true;y.SortType=y.SortTypes.Closest;w();AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.SortType",y.SortTypes.Closest);
s();AR.Loader.Show();pubsub.broadcast("LocalOffers.ReadyForDataCall")});j.on("click",function(){y.SettingsClick=true;y.SortType=y.SortTypes.Deals;
w();AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.SortType",y.SortTypes.Deals);s();AR.Loader.Show();pubsub.broadcast("LocalOffers.ReadyForDataCall")
});b.on("click",function(){AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.DisplayLocationMessage",false);d.hide()
});e.on("click",function(){AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.DisplayLocationMessage",false);d.hide();
g.click()});if(!localStorage.getItem("LocalOffers.DisplayLocationMessage")){d.show()}var B=function(D){h.slideDown();if(D){f.slideDown();
k.addClass("active")}else{f.slideUp();k.removeClass("active")}};pubsub.listen("LocalOffers.SlaTimeout","LocalOffers.ShowUpdateLocation",B);
pubsub.listen("LocalOffers.NoDataFound","LocalOffers.ShowUpdateLocation",B);pubsub.listen("LocalOffers.StartUIDraw","LocalOffers.ShowUpdateLocation",B);
pubsub.listen("LocalOffers.LocationDenied","LocalOffers.ShowUpdateLocation",B);var w=function(){if(m.val()){y.UserZip=m.val();
AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.UserZip",y.UserZip);sessionStorage.removeItem("GrocerServer.Retailers")
}else{if(y.UserZip){AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.UserZip",y.UserZip);sessionStorage.removeItem("GrocerServer.Retailers")
}}};var r=function(){y.UserZip=C;AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.UserZip","")};var x=function(){m.val(y.UserZip)
};pubsub.listen("LocalOffers.RetrievedUserZip","LocalOffers.UI.PopulateUserZip",x);var z=function(){pubsub.broadcast("LocalOffers.StartScriptLoad")
};o.click(z);q.click(z);var u=function(){AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.UserToggledVisible",false)
};pubsub.listen("LocalOffers.OffTriggered","LocalOffers.UI.PersistToggleOff",u);var v=function(){AR.Mobile.Utilities.CheckForStorageAndSetItem("LocalOffers.UserToggledVisible",true)
};pubsub.listen("LocalOffers.ReadyForDataCall","LocalOffers.UI.PersistToggleOn",v);pubsub.listen("LocalOffers.StartUIDraw","LocalOffers.UI.PersistToggleOn",v);
pubsub.listen("LocalOffers.OnTriggered","LocalOffers.UI.PersistToggleOn",v);var A=function(){p.show()};pubsub.listen("LocalOffers.OffTriggered","LocalOffers.UI.ShowOff",A);
pubsub.listen("LocalOffers.InitializeOff","LocalOffers.UI.ShowOff",A);var t=function(){p.hide()};pubsub.listen("LocalOffers.SettingsLinkClicked","LocalOffers.UI.HideOff",t);
pubsub.listen("LocalOffers.StartUIDraw","LocalOffers.UI.HideOff",t);pubsub.listen("LocalOffers.NoDataFound","LocalOffers.UI.HideOff",t);
var s=function(){if(y.SortType==y.SortTypes.Deals){i.removeClass("active");j.addClass("active");i.removeClass("disabled");j.addClass("disabled")
}else{i.addClass("active");j.removeClass("active");i.addClass("disabled");j.removeClass("disabled")}AR.Mobile.Utilities.LocalStorageCheckWithAction(function(){if(localStorage.getItem("LocalOffers.UserToggledVisible")=="false"){n.addClass("disabled");
o.removeClass("disabled")}else{n.removeClass("disabled");o.addClass("disabled")}});m.val(y.UserZip)};s();pubsub.listen("LocalOffers.SettingsLinkClicked","LocalOffers.UI.ConfigureSettingsState",s)
})(AR.LocalOffers=AR.LocalOffers||{},jQuery);
//
// source/angular/controllers/reviewDetailCtrl.js
//
"use strict";angular.module("allrecipes").controller("ar_controllers_review_details",["$scope",function(a){a.showSortFiltersStyle="collapsed";
a.indicatorStyle="icon--chevron-down";a.toggleDisplayText="Sort";a.toggleShowSortOptions=function(){if(a.showSortFiltersStyle=="collapsed"){c()
}else{b()}};var c=function(){a.filterDisplayStatus="visible";a.toggleDisplayText="Hide";a.showSortFiltersStyle="exposed";a.indicatorStyle="icon--chevron-up"
};var b=function(){a.filterDisplayStatus="hidden";a.toggleDisplayText="Sort";a.showSortFiltersStyle="collapsed";a.indicatorStyle="icon--chevron-down"
}}]);
//
// source/angular/services/ads-service.js
//
"use strict";angular.module("allrecipes").factory("ads",["adManager","ar_services_contentprovider","adService",function(a,c,b){var h=function(){return Math.floor((Math.random()*3)-1)
};var f=function(o,n){if(o<=0){return[]}var m=(o/3);if(n>m){n=m}var k=2;if(n>0){k=Math.ceil(o/n)}var j=[2+h()];for(var l=1;l<n;
l++){j.push(j[j.length-1]+k+h())}return j};var e=function(j,i){return c.getProvider({sourceid:j}).$promise.then(function(k){i(k)
})};var g=a.Settings.responsiveGridSlots;var d={desktop:["div-gpt-lazy-square-fixed","div-gpt-lazy-remnant-square-fixed","div-gpt-lazy-remnant-secondary-square-fixed"],mobile:["div-gpt-lazy-mob-ar-gridCard-fixed"]};
return{isRecipeCardSponsorLogoOn:function(){return(window.karmaEnabled)?false:a.IsRecipeCardSponsorLogoOn},loadNewSponsoredRecipes:function(i){var j={slotId:"div-ad-slot-",site:"ar.mobile.sponsored",zone:"",size:[122,34]};
var k=e(i.map(function(l){return l.sourceID}),function(m){k=m;for(var l=0;l<i.length;l++){j.slotId="div-gpt-ad-"+i[l].pageIndex+"-"+i[l].gridIndex;
j.zone=(i[l].sourceID>0)?k[i[l].sourceID][1]:"";if(j.zone!=""&&j.zone!="rotd"&&!window.karmaEnabled){a.displayDynamiclogo(j,j.site,j.zone)
}}})},arrayWithAdsInserted:function(o){var k=f(o.length,a.Settings.responsiveGridSlots);var n;var p;var l=(window.adService.mobileAds)?"mobile":"desktop";
for(var m=0;m<k.length;m++){var j="gridad";if(m>0){j+=" ad-non-mobile-only"}if(!window.karmaEnabled){(a.IsInitialLoad==false)?n="div-gpt-ad-recipe-grid-responsive-"+(m+1).toString():n=a.AddDynamicGridSlot("div-gpt-ad-recipe-grid-responsive-"+(m+1).toString())
}else{g+=1;n="div-gpt-ad-recipe-grid-responsive-"+(g).toString();p=d[l][(g-1)%3]}o.splice(k[m],0,{type:"ad",adClass:j,id:n,adType:p,itemType:"ad"})
}return o},refreshResponsiveAdSlot:function(i,j,k){if(window.karmaEnabled){if(k&&!window.adService.isDesktop){return}window.adServiceQ.push(function(){b.renderAds.createLazyLoadSlot(j,i,true)
})}else{a.DisplayDynamicGridSlot(i)}}}}]);
