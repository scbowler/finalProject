var shuffle, NPCarray, NPCcount;
var showTO = {};
var hideTO = {};
var totalScore = 0;
var gameModes = ['Timed', 'Ammo', 'Survival'];
var gameStatus = 'stopped';
var totalShots = 0;
var totalHits = 0;
var finalScore = 0;
var TOindex = 0;

$(document).ready(function(){
    
    var location = getLocation();
    
    if(location == '' || location == 'mainMenu'){
        addTrees(4, 15, 20, 20, '#mm-background'); 
        addTrees(5, 5, 20, 10, '#mm-background'); 
    }else if(location == 'lvl1'){
        addTrees(2, 10, 70, 20, '#lvl1');
        init();
        getReady(3);
    }
    
    $('#main-menu').on('click', '#new-game', function(){        
        window.location = '?page=lvl1.php';
    });
    
    $('#main-menu').on('click', '#game-mode', function(){
        var modeBtn = $('#gMode');
        var mode = modeBtn.text();
        var index = 0;
        
        switch(mode){
                case 'Timed':
                    index = 1;
                    break;
                case 'Ammo':
                    index = 2;
                    break;
                case 'Survival':
                    index = 0;
                    break;
        }
        modeBtn.text(gameModes[index]);
    });
});

function init(){
    NPCarray = $('.npc-container');
    NPCcount = NPCarray.length;
}

function startGame(){
    console.log('startGame called');
    totalScore = 0;
    totalShots = 0;
    totalHits = 0;
    finalScore = 0;
    gameStatus = 'running';
    $('#total-score').text(totalScore);
    
    populate(true);
    timer('start', 15);
    
    $('body').on('click', countClicks);
    $('table').on('click', 'td div', hitNPC);
}

function countClicks(){
    totalShots++
}

function hitNPC(){
    var badGuy = $(this);
    badGuy.stop().slideUp(150);
    updateScore(badGuy);
    totalHits++;
}

function gameOver(){
    $('body').off('click', countClicks);
    $('table').off('click', 'td div', hitNPC);
    
    gameStatus = 'stopped';
    clearTOs();
    updateSideMenu();
    
    hideTO = {};
    showTO = {};
    TOindex = 0;
    
    $('#side-menu').animate({right: '0%'}, 500);
    
    $('#side-menu').on('click', '#play-again', function(){
        $('#side-menu').animate({right: '-30%'}, 500);
        $("<div id='gr-container'><div class='get-ready' id='count-down'></div></div>").appendTo("#lvl1");
        getReady(3);
    });
    
    $('#side-menu').on('click', '#quit', function(){
        window.location = '?page=mainMenu.php';
    });
}

function clacAccuracy(){
    if(totalShots === 0){
        return totalShots;
    }
    return Math.round((totalHits/totalShots) * 100) / 100;
}

function calcBonus(accuracy){
    return Math.floor((accuracy * 5) * 100) / 100;
}

function calcScore(bonus){
    return Math.round(bonus * totalScore);
}

function updateSideMenu(){
    var accuracy = clacAccuracy();
    var bonus = calcBonus(accuracy);
    finalScore = calcScore(bonus);
    
    $('#sm-score').text(totalScore);
    $('#bonus').text(bonus);
    $('#sm-totalScore').text(finalScore);
}

function populate(ready){
    var npcContainer = $('.npc-container');
    console.log("populate called with:", ready);
    if(!ready){
        clearTOs();
        console.log("Board Shuffled");
        setTimeout(function(){populate(true);}, 400);
        return;
    }
    else
        console.log('ready');
    
    for(var i=0; i<NPCcount; i++){
        var ran = Math.floor((Math.random() * 99) + 1);
        var npc = $(npcContainer[i]);

        if(ran > 20 && ran < 30){
            npc.addClass('woman');
        }else if(ran > 30 && ran < 40){
            npc.addClass('man');
        }else if(ran > 84 && ran < 91){
            npc.addClass('super-ninja');
        }else{
            npc.addClass('ninja');
        }        
    }
    
    //console.log("timeOut index in populate", TOindex);
    randomPopUp();
    var shuffleTime = Math.floor((Math.random() * 5000) + 5000);
    clearTimeout(shuffle);
    shuffle = setTimeout(function(){populate(false)}, shuffleTime);
}

function randomPopUp(){
    console.log("randomPopUp called")
    var hideTime = 500;
    var ranIndex = Math.floor(Math.random() * (NPCcount-1));
    var person = $(NPCarray[ranIndex]);
    console.log("Random Index: ", ranIndex);
    person.show();
    person.animate({top: '12%'}, 300);
    
    if(person.hasClass('super-ninja')){
        hideTime = 150;
        //console.log("Super Ninja!");
    }else{
        hideTime = Math.floor((Math.random() * 400) + 800);
    }
    var tempIndex = TOindex;
    hideTO[TOindex] = setTimeout(function(){clearTimeout(hideTO[tempIndex]); delete hideTO[tempIndex]; person.animate({top: '100%'});}, hideTime);
    
    var showTime = Math.floor((Math.random() * 800) + 400);
    showTO[TOindex] = setTimeout(function(){clearTimeout(showTO[tempIndex]); delete showTO[tempIndex]; randomPopUp(); }, showTime);
    //console.log("Hide array:", hideTO, "Show array:", showTO);
    TOindex++;
}

function clearTOs(extra){
    console.log("Clear TOs called");
    for(keys in showTO){
        clearTimeout(showTO[keys]);
        delete showTO[keys];
    }
    for(keys in hideTO){
        clearTimeout(hideTO[keys]);
        delete hideTO[keys];
    }
    
    clearTimeout(shuffle);
    $('td div').animate({top: '100%'}, 300);
    
    if(extra != undefined){
        clearTimeout(extra);
    }
}

function updateScore(person){
    if(person.hasClass('ninja')){
        //console.log("You clicked a ninja");
        totalScore += 2;
    }else if(person.hasClass('super-ninja')){
        //console.log("You clicked a super ninja");
        totalScore += 4;
    }else{
        //console.log("You clicked a person");
        if(totalScore > 2){
            totalScore -= 2;
        }
    }
    $('#total-score').text(totalScore);
}

function addTrees(amount, loc, seperation, verticle, append){
    if(amount < 1){
        return;
    }
    var locPercent = loc + '%';
    var id = 'tree' + loc;
    
    if(verticle === undefined){
        verticle = 20;
    }
    var vertPercent = verticle + '%';
    
    buildTree(id).css({left: locPercent, bottom: vertPercent}).appendTo(append);
    
    addTrees(amount-1, loc+seperation, seperation, verticle, append);
}

function buildTree(id){
    var mainCSS = {height: '30%', left: '0%', position: 'absolute', width: '10%', zIndex: '3'};
    var topHeight = Math.floor((Math.random() * 20) + 40) + "%";
    var topWidth = Math.floor((Math.random() * 20) + 40);
    var topLeft = ((100 - topWidth)/2) + "%";
    topWidth += "%";
    
    var topCSS = {backgroundColor: 'green', 
                  borderRadius: '50%', 
                  position: 'absolute', 
                  bottom: '42%', 
                  left: topLeft,
                  boxShadow: '0px 2px 5px black',
                  height: topHeight,
                  width: topWidth,
                  zIndex: '4'}
    
    var trunkCSS = {backgroundColor: 'brown',
                    width: '12%',
                    height: '45%',
                    position: 'absolute',
                    bottom: '0',
                    left: '44%',
                    boxShadow: '0px 0px 5px black'}
    
    var container = $("<div class='tree' id=" + id + "></div>").css(mainCSS);
    var top = $('<div>').css(topCSS);
    var trunk = $('<div>').css(trunkCSS);
    
    top.appendTo(container);
    trunk.appendTo(container);
    
    return container;
}

function timer(status, howLong, timeOut, start){
    if(status === 'start'){
        start = (new Date().getTime()) / 1000 | 0;
    }else if(status === 'stop'){
        if(timeOut != undefined){
            clearTimeout(timeOut);
        }
        gameOver();
        return;
    }
    var now = (new Date().getTime()) / 1000 | 0;
    var elapsed = now - start;
    
    if(howLong <= elapsed){
        status = 'stop';
    }else{
        status = 'running';
    }
    var t = setTimeout(function(){timer(status, howLong, t, start);}, 1000);
    var percent = Math.round((elapsed / howLong) * 100) + 3 + "%";
    
    $('#time-bar').animate({top: percent}, 990);
} 

function getReady(start){
    $('#count-down').text(start);
    
    var counter = $('.get-ready');
    counter.addClass('number-animate');
    
    if(start > 0){
        var grTO = setTimeout(function(){checkTimeout(grTO);getReady(start-1);  }, 1000);
    }else{
        counter.text('GO!');
        var startTO = setTimeout(function(){checkTimeout(startTO);$('#gr-container').remove(); startGame();  }, 1000);
    }
}

function getLocation(){
    var location = window.location.search;
    if(location == ''){
        return '';
    }
    
    location = location.split('=');
    location = location[1];
    location = location.split('.');
    location = location[0];
    
    return location;
}

function checkTimeout(to){
    if(to == undefined){
        return;
    }
    clearTimeout(to);
}