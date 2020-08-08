let expression ='';
let result = 0;
let currentNumber=0;
let clear = 0;
let fontSize = 50;
const actions = '+-*/'
$('.left').hide();
$('.number').click(function(){
  if (String(currentNumber).length < 15) {    
    fontSize = changeFontSize(fontSize);
    currentNumber = parseFloat(currentNumber + $(this).attr('value'), 10);//удаление впередистоящих нулей
  }     
});
//Бинарные ф-и
$('.action').click(function(){  
  if (expression.slice(-5) === '/100*'){//замена процентов
    expression = expression.slice(0, -5);
  }
  else if (expression != '' && actions.indexOf(expression[expression.length-1]) != -1 ){//замена бинарной ф-и
    expression = expression.slice(0, -1);
  }  
  else {
    expression += currentNumber;
  }
  expression += $(this).attr('value');
  currentNumber = 0;
});
//Небинарные ф-и
$('#square').click(function(){  
  expression += 'Math.pow('+ currentNumber +',2)';
  currentNumber = eval(expression); 
  logging();
  expression = '';
});
$('#sqrt').click(function(){
  expression += 'Math.sqrt('+ currentNumber +')';    
  currentNumber = eval(expression);  
  logging();
  expression = '';
});
$('#oneDivide').click(function(){
  expression += '1/'+ currentNumber;
  currentNumber = eval(expression);
  logging();
  expression = '';
});
$('#negate').click(function(){
  currentNumber = '-'+currentNumber;
  expression = '';
});
//Системные ф-и
$('#equals').click(function(){  
  expression += currentNumber;
  currentNumber = eval(expression);
  logging();
  expression = ''; 
  /*console.log(normalizer(currentNumber));*/
});
$('#clearAll').click(function(){
  expression = '';
  currentNumber = 0;
});
$('#clear').click(function(){
  currentNumber = 0;
});
$('#decimal').click(function(){
  currentNumber += '.';
});
$('#clearLast').click(function(){
  changeFontSize(fontSize);
  if (currentNumber.toString().length > 1) {
    currentNumber = parseInt(currentNumber.toString().slice(0, -1));
  } else {
    currentNumber = 0;
  }
});
/*const normalizer = (num) => {
  if (num > 999999999999999) {
    return num/100000000000000..toFixed(2) +'e+' + 14;
  }
}*/

const spaces = (str, rest) => { //разбивает символы по 3
  if (str.length <= 3){
    return str + rest;
  } else {
    rest = ' ' + str.slice(-3) + rest;
    return spaces(str.slice(0,-3), rest); 
  }
}
const changeFontSize = (fontSize) => { //Адаптивный размер шрифта
  $('.mainLine').css({'font-size': fontSize + 'px'});
  let quotient = ($('.mainLine>span').outerWidth()) / ($('.mainLine').outerWidth());  
  /*console.log(quotient.toFixed(2), fontSize);*/
  if (quotient.toFixed(2) < 0.9 && fontSize < 50){
    fontSize = fontSize + 1; 
    return changeFontSize(fontSize);
  }
  else if (quotient.toFixed(2) > 0.95){
    fontSize = fontSize - 1; 
    return changeFontSize(fontSize);
  } 
  else {
    return fontSize;
  }
}
const logging = () => {
  let elem = `<div><p>${expression} =</p><p>${currentNumber}</p></div>`;
  $('#logList').append(elem);
  $('#logButton').removeClass('disableButton');
}
let sideMenuClearFlag = 0;
//Сайд меню
$('.sideMenu').hide();
const sideMenuHeaderHideFun = () => {
  $('.sideMenuHeader').click(function(){
    if(sideMenuClearFlag){
      $('.sideMenuListMain').text('');
      sideMenuClearFlag = 0;
    }
    $('.keyboard').show();
    $(this).parent().hide();
  });
}
sideMenuHeaderHideFun();

//Журнал
$('#logButton').click(function(){
  /*$('.keyboard').hide();*/
  if (!$(this).hasClass('disableButton')){
    $('#log').show();
  }  
});
$('#logClearButton').click(function(){
  sideMenuClearFlag = 1;
  $('#logList').text('Журнала еще нет');
  $('#logButton').addClass('disableButton');
});
$('#logList').on('click', 'div', function(){
 /*expression = $(this).children().first().text().slice(0,-2);*/
  currentNumber = $(this).children().last().text();
  $('.mainLine>span').text(spaces(String(currentNumber), ''));
  $('.additionalLine>p').text($(this).children().first().text().slice(0,-2));
  $('.keyboard').show();
  $('#log').hide();
});
//Память
$('#memoryButton').click(function(){
  /*$('.keyboard').hide();*/
  if (!$(this).hasClass('disableButton')){
    $('#memory').show();
  }
});
$('.memoryClearButton').click(function(){
  /*console.log('asd');*/
  sideMenuClearFlag = 1;
  $('#memoryList').text('В памяти ничего не сохранено');
  $('#memoryButton').addClass('disableButton');
  $('#memoryReadButton').addClass('disableButton');
  $('.memoryClearButton').addClass('disableButton');
});
$('.memoryAddButton').click(function(){
  $('#memoryList').find('div:first p').text(+$('#memoryList').find('div:first p').text() + +currentNumber);
});
$('.memorySubButton').click(function(){
  $('#memoryList').find('div:first p').text(+$('#memoryList').find('div:first p').text() - +currentNumber);
});
//внутренние кнопки
$('.sideMenuListMain').on('click', '.memoryClearButton', function(){
  sideMenuClearFlag = 1;
  $(this).parent().remove();
  $('#memoryButton').addClass('disableButton');
  $('#memoryReadButton').addClass('disableButton');
  $('.memoryClearButton').addClass('disableButton');
})
$('.sideMenuListMain').on('click', '.memoryAddButton', function(){
  $(this).siblings('p').text(+$(this).siblings('p').text() + +currentNumber);
});
$('.sideMenuListMain').on('click', '.memorySubButton', function(){
  $(this).siblings('p').text(+$(this).siblings('p').text() - +currentNumber);
});
$('#memoryReadButton').click(function(){
  currentNumber = $('#memoryList').find('div:first p').text();
});
$('#memorySaveButton').click(function(){
  let $elem = $(`<div><p>${currentNumber}</p></div>`);
  let $mcb = $('.additionalButtons button:nth-child(1)').clone();
  let $mab = $('.additionalButtons button:nth-child(3)').clone();
  let $msb = $('.additionalButtons button:nth-child(4)').clone();
  $elem.append($mcb).append($mab).append($msb);
  $('#memoryList').prepend($elem);
  $('#memoryButton').removeClass('disableButton');
  $('#memoryReadButton').removeClass('disableButton');
  $('.memoryClearButton').removeClass('disableButton');
  /*$('#memoryAdditionalClearButton').clone().appendTo('#memoryList');*/
});
//Вывод на экран
$('.keyboardButton, .additionalButton').click(function(){  
  $('.mainLine>span').text(spaces(String(currentNumber), ''));
  $('.additionalLine>p').text(expression);
});
//Перемещение по окну
let mooveAllow = 0;
let deltaY = 0;
let deltaX = 0;
let $anchor = $('.anchor');
$anchor.mousedown(function(e){  
  mooveAllow = 1;
  deltaY = e.pageY - $anchor.offset().top;
  deltaX = e.pageX - $anchor.offset().left;  
});
/*$anchor.mouseup(function(){  
  mooveAllow = 0;
});*/
$(window).mouseup(function(){  
  mooveAllow = 0;
  console.log('window mouse up');
});
//Левое меню
$('#menu').click(function(){
  $('.left').show();
});
$('#menu2').click(function(){
  $('.left').hide();
});
/*Левое меню*/
$('#obichniy').click(function(){
  $('.nav h1').text('Обычный');
  $('.typesOfCalc').removeClass('activeCalc');
  $(this).addClass('activeCalc');
  $('.additionalButtons').show();
  $('.left').hide();
  $('#logButton').show();
  $('.select').hide();  
  /*$('.additionalLine').css({height:'', 'padding-bottom':''});*/
  $('.additionalLine').show();
  $('.secondLine').hide();
  $('.mainLine').css({height:'', 'padding-top':''});
  /*$('.additionalLine p').text('').css({'font-size': '', float: ''});*/
  $('.mainLine span').css({'font-size': '', float: ''});
  //keyboard
  $('.keyboard').css({'grid-template-columns':'repeat(4, minmax(75px, 1fr))',
                      'grid-template-rows':'repeat(6, minmax(45px, 1fr))',
                      'margin':'4px'});
  $('#percent').show();
  $('#sqrt').show();
  $('#square').show();
  $('#oneDivide').show();
  $('#clearAll').show();
  $('#divide').show();
  $('#multiply').show();
  $('#subtract').show();
  $('#add').show();
  $('#negate').show();
  $('#equals').show();
  $('#zero').css({'grid-column-start': ''});
  $('#clear').css({'grid-column-start': ''});
  //////
});
$('#dlina').click(function(){
  $('.nav h1').text('Длина');
  $('.typesOfCalc').removeClass('activeCalc');
  $(this).addClass('activeCalc');
  $('.additionalButtons').hide();
  $('.left').hide();
  $('#logButton').hide();
  $('.select').show();
  /*$('.additionalLine').css({height:'43px', 'padding-bottom':'10px'});*/
  $('.additionalLine').hide();
  $('.secondLine').show();
  $('.mainLine').css({height:'33px', 'padding-top':'14px'});
  /*$('.additionalLine p').text('0').css({'font-size': '32px', float: 'left'});*/
  $('.mainLine span').css({'font-size': '32px', float: 'left'});
  //keyboard
  $('.keyboard').css({'grid-template-columns':'repeat(3, minmax(75px, 1fr))',
                      'grid-template-rows':'repeat(5, minmax(45px, 1fr))',
                      'margin':'4px 25px 8px 25px'});
  $('#percent').hide();
  $('#sqrt').hide();
  $('#square').hide();
  $('#oneDivide').hide();
  $('#clearAll').hide();
  $('#divide').hide();
  $('#multiply').hide();
  $('#subtract').hide();
  $('#add').hide();
  $('#negate').hide();
  $('#equals').hide();
  $('#zero').css({'grid-column-start': '2'});
  $('#clear').css({'grid-column-start': '2'});
  ////////////////////////////////////////////////
  $('.keyboardButton').click(function(){
    return secondLine();
  });
    $('.selectDropButton').click(function(){
    return secondLine();
  });
});
/**/
//Ресайз
const resizeAllow = {};
const previousCursor = {};
const previousSize = {};
const currentSize = {};
const offset = {};
let anchorSizePush = 0;
$('.anchorSize').mousedown(function(e){
  previousCursor.x = e.pageX;
  previousCursor.y = e.pageY;
  previousSize.width = $('.calculator').css('width').slice(0,-2);
  previousSize.height = $('.calculator').css('height').slice(0,-2);
  if ($(this).hasClass('anchorTop')) resizeAllow.top = 1;
  if ($(this).hasClass('anchorBottom')) resizeAllow.bottom = 1;
  if ($(this).hasClass('anchorLeft')) resizeAllow.left = 1;
  if ($(this).hasClass('anchorRight')) resizeAllow.right = 1;
  if ($(this).hasClass('anchorTopLeft')) resizeAllow.topLeft = 1;
  if ($(this).hasClass('anchorTopRight')) resizeAllow.topRight = 1;
  if ($(this).hasClass('anchorBottomLeft')) resizeAllow.bottomLeft = 1;
  if ($(this).hasClass('anchorBottomRight')) resizeAllow.bottomRight = 1;
  anchorSizePush = 1;
});
$('.anchorSize').mouseup(function(){
  anchorSizePush = 0;
})
$(window).mouseup(function(){
  resizeAllow.top = 0;
  resizeAllow.bottom = 0;
  resizeAllow.left = 0;
  resizeAllow.right = 0;
  resizeAllow.topLeft = 0;
  resizeAllow.topRight = 0;
  resizeAllow.bottomLeft = 0;
  resizeAllow.bottomRight = 0;
});
$(window).mousemove(function(e){  
  if(resizeAllow.top){    
    currentSize.y = +previousSize.height + previousCursor.y - e.pageY;
    if(+$('.calculator').css('height').slice(0,-2) !== 500) offset.y = e.pageY;
  }
  if(resizeAllow.bottom){ 
    currentSize.y = e.pageY - previousCursor.y + +previousSize.height;
  }
  if(resizeAllow.left){ 
    currentSize.x = +previousSize.width + previousCursor.x - e.pageX;
    if(+$('.calculator').css('width').slice(0,-2) !== 320) offset.x = e.pageX;
  }
  if(resizeAllow.right){ 
    currentSize.x = e.pageX - previousCursor.x + +previousSize.width;
  }
  if(resizeAllow.topLeft){ 
    currentSize.x = +previousSize.width + previousCursor.x - e.pageX;
    currentSize.y = +previousSize.height + previousCursor.y - e.pageY;
    if(+$('.calculator').css('height').slice(0,-2) !== 500) offset.y = e.pageY;
    if(+$('.calculator').css('width').slice(0,-2) !== 320) offset.x = e.pageX;
  } 
  if(resizeAllow.topRight){ 
    currentSize.x = e.pageX - previousCursor.x + +previousSize.width;
    currentSize.y = +previousSize.height + previousCursor.y - e.pageY;
    if(+$('.calculator').css('height').slice(0,-2) !== 500) offset.y = e.pageY;
  } 
  if(resizeAllow.bottomLeft){ 
    currentSize.x = +previousSize.width + previousCursor.x - e.pageX;
    currentSize.y = e.pageY - previousCursor.y + +previousSize.height;
    if(+$('.calculator').css('width').slice(0,-2) !== 320) offset.x = e.pageX;
  } 
  if(resizeAllow.bottomRight){ 
    currentSize.x = e.pageX - previousCursor.x + +previousSize.width;
    currentSize.y = e.pageY - previousCursor.y + +previousSize.height;
  } 
  if(mooveAllow){
    offset.y = e.pageY - deltaY;
    offset.x = e.pageX - deltaX;
  }  
  $('.calculator').css({
    width: currentSize.x + 'px', height: currentSize.y + 'px', left: offset.x + 'px', top: offset.y + 'px'
  });    
  let $calcWidth = $('.calculator').css('width');
  let $calcHeight = $('.calculator').css('height');
  let $keyboardHeight = $('.keyboard').css('height');  
  let $newSideButtons = $(`<button>Журнал</button>`);
  $('.left').css({height:$('.calculator').css('height').slice(0,-2) - 31 + 'px', width: $calcWidth});
  $('.leftClosingArea').css({width: $calcWidth.slice(0,-2) - 256 + 'px'});
  if (anchorSizePush){
    changeFontSize(fontSize);
    if($calcWidth.slice(0 , -2) > 560){
      /*$('.side').css({width: '240px', height:$calcHeight.slice(0,-2) - 31 + 'px', top: '31px'});*/
      $('.sideMenu').css({width: '240px', height: $calcHeight.slice(0,-2) - 88 + 'px', top: '88px'}); 
      $('.sideMenuList').css({width: '240px', height: $calcHeight.slice(0,-2) - 88 + 'px'});
      $('.sideMenuHeader').hide();
      $('.nav').css({width: $calcWidth.slice(0,-2) - 240 + 'px'});
      $('.display').css({width: $calcWidth.slice(0,-2) - 240 + 'px'});
      $('.additionalButtons').css({width: $calcWidth.slice(0,-2) - 240 + 'px'});
      $('.keyboard').css({width: $calcWidth.slice(0,-2) - 240 + 'px'});
      $('.sideMenu').css({/*display: 'block',*/ right: 0});
      $('#logButton').hide();
      $('#memoryButton').hide();
      $('.side button').show();
      $('#log').show();
    }
    else if ($calcWidth.slice(0 , -2) < 560 && $calcWidth.slice(0 , -2) > 320){
      $('.sideMenu').css({width: $calcWidth, height: $calcHeight, top: 0});  
      $('.sideMenuList').css({width: $calcWidth, height: +$keyboardHeight.slice(0,-2) + 4 + 'px'});
      $('.sideMenuHeader').show();
      $('.nav').css({width:  ''});
      $('.display').css({width:  ''});
      $('.additionalButtons').css({width: ''});
      $('.keyboard').css({width: ''});
      $('.sideMenu').css({right: ''}).hide();
      $('#logButton').show();
      $('#memoryButton').show();
      $('.side>button').hide();
    }
  }
});
$('.sideMenu').css({width: $('.calculator').css('width'), height: $('.calculator').css('height')}); 
$('.sideMenuList').css({width: $('.calculator').css('width'), height: +$('.keyboard').css('height').slice(0,-2) + 4 + 'px'});
$('.sideMenuHeader').css({width: $('.calculator').css('width'), height: +$('.calculator').css('height').slice(0,-2) - +$('.sideMenuList').css('height').slice(0,-2) + 'px'});

///
$('#newButtonLog').click(function(){
  $('#log').show();
  $('#memory').hide();
  $('.side button').not(this).removeClass('activeNewButton');
  $(this).addClass('activeNewButton');  
});
$('#newButtonMemory').click(function(){
  $('#log').hide();
  $('#memory').show();
  $('.side button').not(this).removeClass('activeNewButton');
  $(this).addClass('activeNewButton');
});
//////////////////////////////////////////////////////////////////////////////////////////////////
const $selectDropButton = $('.selectDropButton'); 
const $selectButton = $('.selectButton');
const $selectDrop = $('.selectDrop');
const $selectedOption = $('.selectedOption');
const selectButtonText = () => {
  $selectButton.text(function(){
    $selectButton.attr('value', $(this).next().children('.selectedOption').attr('value'));
    return $(this).next().children('.selectedOption').text();
  });
  
}
selectButtonText();
$selectDropButton.click(function(){
  $(this).siblings().removeClass('selectedOption');
  $(this).addClass('selectedOption');
  $(this).parent().prev().text($(this).text()).attr('value', $(this).attr('value'));
  $(this).parent().hide().css({top: $(this).index() * (-17) + 'px'});
});
$selectButton.click(function(e){
  e.stopPropagation();
  $(this).next().toggle();
});
$(window).click(function(){
  $selectDrop.hide();  
});
//////////////////////////////////
/*$('.change').click(function(){
  if ($(this).attr('id') === 'a' ){
    $selectDropButton.each(function(){
      if($(this).attr('value')==='option1') $(this).text('a1');
      if($(this).attr('value')==='option2') $(this).text('a2');
      if($(this).attr('value')==='option3') $(this).text('a3');
      if($(this).attr('value')==='option4') $(this).text('a4');
      if($(this).attr('value')==='option5') $(this).text('a5');
    });
    $selectButton.text($('.selectedOption').text());
  }
  if ($(this).attr('id') === 'b' ){
    $selectDropButton.each(function(){
      if($(this).attr('value')==='option1') $(this).text('b1');
      if($(this).attr('value')==='option2') $(this).text('b2');
      if($(this).attr('value')==='option3') $(this).text('b3');
      if($(this).attr('value')==='option4') $(this).text('b4');
      if($(this).attr('value')==='option5') $(this).text('b5');
    });
    $selectButton.text($('.selectedOption').text());
  }
});*/
//////////////////////////////////////////////////////////////////////////////////////////////////
const secondLine = () => {
  $('.secondLine span').text(function(){
    const firstCoefficient = $(this).parent().prev().find('.selectButton').attr('value');
    const secondCoefficient = $(this).parent().next().find('.selectButton').attr('value');
    return spaces(String((firstCoefficient/secondCoefficient) * currentNumber), '');
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////
/*TODO*/
/*
  5.Другие виды калькулятора
  9.Тонкий слайдер
  10.Медленный скролл
  11.Визуальный эффект неактивных кнопок
  12.Визуальный эффект подсвечивания бордера при подведении
  13.Визуальный эффект света под курсором
  14.Визуальный эффект волны при нажатии на клавиши
  15.Визуальный эффект нажатия на журнал
  25.При выводе решения текст вылазит из строки, но если увеличить калькулятор до 560, а потом уменьшить, то changeFontSize начнет работать при движении мыши. =)
*/

