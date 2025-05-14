global.$ = $;
global.isFull = false
const  remote  = require('@electron/remote');
const { Menu, BrowserWindow, MenuItem, shell } = remote;
const fs = require("fs");



$(document).ready(function () {

    var webview = document.getElementById('browserView');
// 设置webview的偏好
webview.setAttribute('webpreferences', 'nativeWindowOpen=false');
    // 禁用新窗口打开
    webview.setWindowOpenHandler && webview.setWindowOpenHandler(({ url }) => {
        loadPage(url);
        return { action: 'deny' };
    });
    webview.addEventListener('dom-ready', function () {
        webview.insertCSS('*::-webkit-scrollbar { width: 0 !important }')
        // 注入阻止新窗口打开的脚本
        webview.executeJavaScript(`
            window.open = function(url) {
                window.location.href = url;
                return null;
            };
        `);
    });

    // Load a website
    webview.addEventListener('will-navigate', function(e) {
        e.preventDefault();
        loadPage(e.url);
    });
    // Address bar form
    $("#addressBar").submit(function(e) {
        e.preventDefault();
        loadURL();
    });

    // Opacity Slider
    $("#transparencyRange").change(function(){
        var opacityValue = $(this).val();
        changeOpacity(opacityValue);
    });

    // Select all text when changing URL
    $("input[type='text']").click(function () {
       $(this).select();
    });
});


// Change window Opacity
// Change window Opacity
// Change window Opacity
function changeOpacity(opacity){
    $("body").css('opacity', opacity);
}


// App Controls
// App Controls
// App Controls
function loadURL(){
    var url = $("#urlField").val();

    if(url.indexOf("http") >= 0){
        loadPage(url);

    }else{
        url = "http://" + url;
        loadPage(url);
    }
}

function loadPage(url){
    console.log("Loading " + url);
    if (url.toLowerCase().indexOf("youtube.com/watch") >= 0){
        var youtubeID = url.substring(url.indexOf("v=") + 2);
        youtubeID = youtubeID.split('&')[0];
        var youtubeURL = "https://www.youtube.com/embed/" + youtubeID;

        $("#urlField").val(youtubeURL);
        var webview = document.getElementById('browserView');
        webview.loadURL(youtubeURL);
    }else{
        var webview = document.getElementById('browserView');
        webview.loadURL(url);
    }
}




// Go back
function browserBack(){
    var webview = document.getElementById('browserView');
    webview.back;

}


function enableClickThrough(){
    console.log("Clickthrough enabled.")
    var window = remote.getCurrentWindow();
    window.setIgnoreMouseEvents(true);

    $("#browserView").addClass("full-size");
    $(".app-controls").slideUp(200, function(){
        $(".window-chrome").slideUp(200);
    });

}

function enableFullSize(){

    $("#browserView").addClass("full-size");
    $(".app-controls").slideUp(200, function(){
        $(".window-chrome").slideUp(200);
    });

}

remote.globalShortcut.register('Alt+]', () => {
    global.isFull = !global.isFull
    if (global.isFull) {
        $("#browserView").addClass("full-size");
        $(".app-controls").slideUp(200, function(){
            $(".window-chrome").slideUp(200);
        });
    } else {
        $("#browserView").removeClass("full-size");
        $(".window-chrome").slideDown(200, function(){
            $(".app-controls").slideDown(200);
        });
    }
})

remote.globalShortcut.register('Alt+=', () => {
    var opacityValue = +$('#transparencyRange').val();
    if(opacityValue>=0.95)return
    changeOpacity(opacityValue + 0.05);
    $('#transparencyRange').val(opacityValue + 0.05)
})

remote.globalShortcut.register('Alt+-', () => {
    var opacityValue = $('#transparencyRange').val();
    if(opacityValue<=0.05)return
    changeOpacity(opacityValue - 0.05);
    $('#transparencyRange').val(opacityValue - 0.05)
})

var isOpenDev = false
remote.globalShortcut.register('Alt+F12', () => {
    isOpenDev = !isOpenDev
    if (isOpenDev) {
        remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
    } else {
        remote.BrowserWindow.getFocusedWindow().webContents.closeDevTools()
    }
})

remote.app.on('web-contents-created', (event, contents) => {
    if (contents.getType() === 'webview') {
        contents.on('new-window', (event,url) => {
            event.preventDefault()
            loadPage(url)
        })
        // 添加导航事件处理
        contents.on('will-navigate', (event,url) => {
            event.preventDefault();
            loadPage(url);
        });
        // 设置window.open处理
        contents.setWindowOpenHandler(({ url }) => {
            contents.loadURL(url);
            return { action: 'deny' };
        });
    }
  })
// Window Controls
// Window Controls
// Window Controls

function openWebsite(){
    // shell.openExternal("http://mitch.works/apps/glass");
    let url = 'http://localhost/demo/bookshelf/index.html#/'
    $("#urlField").val(url);
    loadPage(url)
}
function refresh(){
    let url = $("#urlField").val();
    loadPage(url)
}
remote.globalShortcut.register('Alt+F5', () => {
    refresh()
})
function minimizeWindow(){
    var window = remote.getCurrentWindow();
    window.minimize();
}
var windowIsMaximized = false;
function maximizeWindow(){
    var window = remote.getCurrentWindow();
    const { width, height } = remote.screen.getPrimaryDisplay().workAreaSize;
    if(windowIsMaximized){
        windowIsMaximized = false;
        window.setSize(800, 600);
    }else{
        window.setSize(Math.ceil(width * .95), Math.ceil(height * .95));
        window.setPosition(Math.ceil(width * .025), Math.ceil(height * .025))
        windowIsMaximized = true;
    }
}
function closeWindow(){
    var window = remote.getCurrentWindow();
    window.close();
}
