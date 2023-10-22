
//item1 progressbar
$(".progressBar span").each(function () {
  $(this).animate(
    {
    width: $(this).attr("data-progress") + "%",
    },1000
  );
  $(this).parent().next().text($(this).attr("data-progress") + "건");
  });

//item2 , item3 slick

//window.addEventListener("load", () => {
/*
$('documnent').ready(function() {
  $('.single-item').slick({
    slidesToShow: 1,
    arrows: true,
    infinite: false
  });

  $('.menu-item').slick({
    slidesToShow: 3,
    rows: 2,
    arrows: false,
    infinite: false,
    dots:true
  });
});
*/

//item3 Accordion
var menu = document.querySelectorAll(".menu");
var submenu = document.querySelectorAll(".submenu");
menu.forEach((element, index)=>{
  menu[index].addEventListener("click", function() {
    menu.forEach((element, index)=>{
      menu[index].classList.remove('active');
    });
    this.classList.add("active");
  });
});

//item1 main 사용가능 카드번호 select box
/*
$(function(){
	var select = new CustomSelectBox('.select_box');
});
function CustomSelectBox(selector){
    this.$selectBox = null,
    this.$select = null,
    this.$list = null,
    this.$listLi = null;
    CustomSelectBox.prototype.init = function(selector){
        this.$selectBox = $(selector);
        this.$select = this.$selectBox.find('.box .select');
        this.$list = this.$selectBox.find('.box .list');
        this.$listLi = this.$list.children('li');
    }
    CustomSelectBox.prototype.initEvent = function(e){
        var that = this;
        this.$select.on('click', function(e){
            that.listOn();
        });
        this.$listLi.on('click', function(e){
            that.listSelect($(this));
        });
        $(document).on('click', function(e){
            that.listOff($(e.target));
        });
    }
    CustomSelectBox.prototype.listOn = function(){
        this.$selectBox.toggleClass('on');
        if(this.$selectBox.hasClass('on')){
            this.$list.css('display', 'block');
        }else{
            this.$list.css('display', 'none');
        };
    }
    CustomSelectBox.prototype.listSelect = function($target){
        $target.addClass('selected').siblings('li').removeClass('selected');
        this.$selectBox.removeClass('on');
        this.$select.html($target.html());
        this.$list.css('display', 'none');
    }
    CustomSelectBox.prototype.listOff = function($target){
        if(!$target.is(this.$select) && this.$selectBox.hasClass('on')){
            this.$selectBox.removeClass('on');
            this.$list.css('display', 'none');
        };
    }
    this.init(selector);
    this.initEvent();
}
*/