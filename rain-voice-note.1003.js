/*!
 * Rain Voice Note 1.0.0.3
 * (c) 2016 #NVJOB Nicholas Veselov https://nvjob.github.io
 * GNU General Public License v3.0
 *
 * https://github.com/nvjob/rain-voice-note
 */



/// Core Voice


var langs = [['English',	['en-US']], ['Pусский',	['ru-RU']]];

for (var i = 0; i < langs.length; i++) {
select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 0;
updateCountry();

select_dialect.selectedIndex = 0;
showInfo('info_start');


function updateCountry() {
for (var i = select_dialect.options.length - 1; i >= 0; i--) {
select_dialect.remove(i);
}
var list = langs[select_language.selectedIndex];
for (var i = 1; i < list.length; i++) {
select_dialect.options.add(new Option(list[i][1], list[i][0]));
}
select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
upgrade();
} else {
start_button.style.display = 'inline-block';
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onstart = function() {
recognizing = true;
showInfo('info_speak_now');
start_img.src = 'mic-a.gif';
};


recognition.onend = function() {
recognizing = false;
if (ignore_onend) {
return;
}
start_img.src = 'mic.png';
if (!final_transcript) {
showInfo('info_start');
return;
}
showInfo('');
if (window.getSelection) {
window.getSelection().removeAllRanges();
var range = document.createRange();
range.selectNode(document.getElementById('final_span'));
window.getSelection().addRange(range);
}

};
recognition.onresult = function(event) {
var interim_transcript = '';
for (var i = event.resultIndex; i < event.results.length; ++i) {
if (event.results[i].isFinal) {
final_transcript += event.results[i][0].transcript;
} else {
interim_transcript += event.results[i][0].transcript;
}
}
final_transcript = capitalize(final_transcript);
final_span.innerHTML = linebreak(final_transcript);
interim_span.innerHTML = linebreak(interim_transcript);
if (final_transcript || interim_transcript) {
showButtons('inline-block');
}
};
}


function upgrade() {
start_button.style.visibility = 'hidden';
showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;


function linebreak(s) {
return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}
var first_char = /\S/;


function capitalize(s) {
return s.replace(first_char, function(m) { return m.toUpperCase(); });
}


function startButton(event) {
if (recognizing) {
recognition.stop();
return;
}
final_transcript = '';
recognition.lang = select_dialect.value;
recognition.start();
ignore_onend = false;
final_span.innerHTML = '';
interim_span.innerHTML = '';
start_img.src = 'mic.png';
showInfo('info_allow');
showButtons('none');
start_timestamp = event.timeStamp;
}


function showInfo(s) {
if (s) {
for (var child = info.firstChild; child; child = child.nextSibling) {
if (child.style) {
child.style.display = child.id == s ? 'inline' : 'none';
}
}
info.style.visibility = 'visible';
} else {
info.style.visibility = 'hidden';
}
}


var current_style;
function showButtons(style) {
if (style == current_style) {
return;
}
current_style = style;
copy_button.style.display = style;
email_button.style.display = style;
copy_info.style.display = 'none';
email_info.style.display = 'none';
}


/// Custom context menu

(function() {
"use strict";
function clickInsideElement( e, className ) {
var el = e.srcElement || e.target;
if ( el.classList.contains(className) ) {
return el;
} else {
while ( el = el.parentNode ) {
if ( el.classList && el.classList.contains(className) ) {
return el;
}
}
}
return false;
}
function getPosition(e) {
var posx = 0;
var posy = 0;
if (!e) var e = window.event;
if (e.pageX || e.pageY) {
posx = e.pageX;
posy = e.pageY;
} else if (e.clientX || e.clientY) {
posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
}
return {
x: posx,
y: posy
}
}
var contextMenuClassName = "context-menu";
var contextMenuItemClassName = "context-menu_item";
var contextMenuLinkClassName = "context-menu_link";
var contextMenuActive = "context-menu-active";
var taskItemClassName = "task";
var taskItemInContext;
var clickCoords;
var clickCoordsX;
var clickCoordsY;
var menu = document.querySelector("#context-menu");
var menuItems = menu.querySelectorAll(".context-menu_item");
var menuState = 0;
var menuWidth;
var menuHeight;
var menuPosition;
var menuPositionX;
var menuPositionY;
var windowWidth;
var windowHeight;
function init() {
contextListener();
clickListener();
keyupListener();
resizeListener();
}
function contextListener() {
document.addEventListener( "contextmenu", function(e) {
taskItemInContext = clickInsideElement( e, taskItemClassName );
if ( taskItemInContext ) {
e.preventDefault();
toggleMenuOn();
positionMenu(e);
} else {
taskItemInContext = null;
toggleMenuOff();
}
});
}
function clickListener() {
document.addEventListener( "click", function(e) {
var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );
if ( clickeElIsLink ) {
e.preventDefault();
menuItemListener( clickeElIsLink );
} else {
var button = e.which || e.button;
if ( button === 1 ) {
toggleMenuOff();
}
}
});
}
function keyupListener() {
window.onkeyup = function(e) {
if ( e.keyCode === 27 ) {
toggleMenuOff();
}
}
}
function resizeListener() {
window.onresize = function(e) {
toggleMenuOff();
};
}
function toggleMenuOn() {
if ( menuState !== 1 ) {
menuState = 1;
menu.classList.add( contextMenuActive );
}
}
function toggleMenuOff() {
if ( menuState !== 0 ) {
menuState = 0;
menu.classList.remove( contextMenuActive );
}
}
function positionMenu(e) {
clickCoords = getPosition(e);
clickCoordsX = clickCoords.x;
clickCoordsY = clickCoords.y;
menuWidth = menu.offsetWidth + 4;
menuHeight = menu.offsetHeight + 4;
windowWidth = window.innerWidth;
windowHeight = window.innerHeight;
if ( (windowWidth - clickCoordsX) < menuWidth ) {
menu.style.left = windowWidth - menuWidth + "px";
} else {
menu.style.left = clickCoordsX + "px";
}
if ( (windowHeight - clickCoordsY) < menuHeight ) {
menu.style.top = windowHeight - menuHeight + "px";
} else {
menu.style.top = clickCoordsY + "px";
}
}

// Copy text, delete selection and menu

var copyZXCBtn = document.querySelector('#js-copybtnzx');
copyZXCBtn.addEventListener('click', function(event) {
var successful = document.execCommand('copy');
window.getSelection().removeAllRanges();
toggleMenuOff();
});

////////////////////

init();
})();

//// Lock the right button

function click1(e) {
if (document.layers) {
if (e.which == 1) {
return false;}
}
}
if (document.layers)
{document.captureEvents(Event.MOUSEDOWN);}
document.onmousedown=click1;
document.oncontextmenu=function(e){return false};

