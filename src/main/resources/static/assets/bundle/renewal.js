//gnb, bookmark event
/*
const body = document.querySelector("body");
const headerMenu = document.querySelector(".header__menu");
const gnbBtn = document.querySelector(".gnbBtn");
const gnbWrap = document.querySelector(".gnb__wrap");
const gnbList = document.querySelector(".gnb__list");
const gnbItem = document.querySelector(".gnb__item");
// const gnbItemAll = document.querySelectorAll(".gnb__item");
const gnb2depth = document.querySelector(".gnb__2depthWrap");
const gnbBg = document.querySelector(".gnb__bg");
const bookmarkBtn = document.querySelector(".bookmark__btn");
const bookmarkWrap = document.querySelector(".bookmark__wrap");

//임시조치 : properties of null 오류로 if문 추가 2022-12-02
if(gnbBtn){
	gnbBtn.addEventListener('click', (event) => {
    body.classList.toggle('gnb_on');
    headerMenu.classList.toggle('on');	
    if(headerMenu.classList.contains('on')){
      gnbWrap.classList.remove("bm_on");
    }
  });
}

//임시조치 : properties of null 오류로 if문 추가 2022-12-02
if(gnbList){
  [...gnbList.children].forEach((e) => {
    e.addEventListener('mouseenter', (event) => {
      gnbItemAll.forEach((element, index)=>{
        gnbItemAll[index].classList.remove('ov');
      });
      e.classList.add('ov');
      if(gnbWrap.classList.contains('bm_on')){
        gnbWrap.classList.remove('bm_on');
      }
    });
    e.addEventListener('mouseleave', (event) => {
      e.classList.remove('ov');
    });
  });
}
 
//임시조치 : properties of null 오류로 if문 추가 2022-12-02
if(bookmarkBtn){  
  bookmarkBtn.addEventListener('click', function(){
    gnbWrap.classList.toggle('bm_on');
    gnbItem.classList.remove("ov");
  });
}  
 
//임시조치 : properties of null 오류로 if문 추가 2022-12-02
if(bookmarkWrap){  
  [...bookmarkWrap.children].forEach((e) => {
    e.addEventListener('mouseenter', (event) => {
      e.classList.add('ov');
      
    });
    e.addEventListener('mouseleave', (event) => {
      e.classList.remove('ov');
    });
  //gnb, bookmark bg 클릭시 모두 닫힘
  gnbBg.addEventListener('click', function(){
    headerMenu.classList.remove('on');	
    // gnbItemAll.classList.remove('ov');
    gnbWrap.classList.remove('bm_on');
    gnbItem.classList.remove("ov");
    body.classList.remove("gnb_on");
  });
});
}
*/

function gnb() {
  if($('.gnb.is-new').length) {
    var gnb = $('.gnb.is-new');

    gnb.on('mouseenter', function() {
  		var nav = gnb.find('.gnb__sub');

      if(!nav.hasClass('is-active')) {
        nav.addClass('is-active');
        if($('.header__user').hasClass('active')) {
          $('.header__user').removeClass('active');
        }
      }
    }).on('mouseleave', function() {
	    var nav = gnb.find('.gnb__sub');
		  var oneDepth = gnb.find('.has-oneDepth .gnb__link');

      nav.removeClass('is-active');
      oneDepth.removeClass('is-active');
    });
  }
}

function userInform() {
  if($('.header__user').length) {
    var userInform = $('.header__user'),
        userTrigger = userInform.find('.header__userTrigger'),
        userTarget = userInform.find('.header__userLayer');

    userTrigger.on('click', function(event) {
      event.preventDefault();
      userInform.toggleClass('active');
    });
    userTarget.on('mouseleave', function() {
      if(userInform.hasClass('active')) {
        userInform.removeClass('active');
      }
    });
    /*
    $(document).mouseup(function (e) {
      if(userInform.has(e.target).length == 0 && userInform.hasClass('active')) {
        userInform.toggleClass('active');
      }
    });
    userInform.on('mouseleave', function() {
      if(userInform.hasClass('active')) {
        userInform.removeClass('active');
      }
    });
    */
  }
}

function fixedElements() {
  if($('.header').length) {
    var fixedScrollLeft = $('.header');
    
    fixedScrollLeft.css('left', $(document).scrollLeft() * -1);
  }
}

// DOMContentLoaded
window.addEventListener("DOMContentLoaded", function () {
  gnb();
  userInform();
});

// Scroll
window.addEventListener('scroll', function() {
  fixedElements();
});