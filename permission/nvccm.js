 /*!
  * Rain Voice Note 1.0.0.3 (NV Custom Context Menu) - https://nvjob.github.io/dlog/rain-voice-note.html
  * (c) 2016-2019 #NVJOB Nicholas Veselov - https://nvjob.github.io
  * GNU General Public License v3.0
  */
  
 (function() {
     "use strict";

     function clickInsideElement(e, className) {
         var el = e.srcElement || e.target;
         if (el.classList.contains(className)) {
             return el;
         } else {
             while (el = el.parentNode) {
                 if (el.classList && el.classList.contains(className)) {
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

     var contextMenuClassName = "nvccm";
     var contextMenuItemClassName = "nvccm_item";
     var contextMenuLinkClassName = "nvccm_link";
     var contextMenuActive = "nvccm-active";
     var taskItemClassName = "nvccm_task";
     var taskItemInContext;
     var clickCoords;
     var clickCoordsX;
     var clickCoordsY;
     var menu = document.querySelector("#nvccm");
     var menuItems = menu.querySelectorAll(".nvccm_item");
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
         document.addEventListener("contextmenu", function(e) {
             taskItemInContext = clickInsideElement(e, taskItemClassName);
             if (taskItemInContext) {
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
         document.addEventListener("click", function(e) {
             var clickeElIsLink = clickInsideElement(e, contextMenuLinkClassName);
             if (clickeElIsLink) {
                 e.preventDefault();
                 menuItemListener(clickeElIsLink);
             } else {
                 var button = e.which || e.button;
                 if (button === 1) {
                     toggleMenuOff();
                 }
             }
         });
     }

     function keyupListener() {
         window.onkeyup = function(e) {
             if (e.keyCode === 27) {
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
         if (menuState !== 1) {
             menuState = 1;
             menu.classList.add(contextMenuActive);
         }
     }

     function toggleMenuOff() {
         if (menuState !== 0) {
             menuState = 0;
             menu.classList.remove(contextMenuActive);
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
         if ((windowWidth - clickCoordsX) < menuWidth) {
             menu.style.left = windowWidth - menuWidth + "px";
         } else {
             menu.style.left = clickCoordsX + "px";
         }
         if ((windowHeight - clickCoordsY) < menuHeight) {
             menu.style.top = windowHeight - menuHeight + "px";
         } else {
             menu.style.top = clickCoordsY + "px";
         }
     }

     // Copy text, delete selection and menu

     var copyZXCBtn = document.querySelector('#nvccm-copy');
     copyZXCBtn.addEventListener('click', function(event) {
         var successful = document.execCommand('copy');
         window.getSelection().removeAllRanges();
         toggleMenuOff();
     });

     init();
 })();


 // Lock the right button

 function click1(e) {
     if (document.layers) {
         if (e.which == 1) {
             return false;
         }
     }
 }

 if (document.layers) {
     document.captureEvents(Event.MOUSEDOWN);
 }

 document.onmousedown = click1;
 document.oncontextmenu = function(e) {
     return false
 };