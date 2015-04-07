var showTO, hideTO, shuffle;
var totalScore = 0;
var gameModes = ['Timed', 'Ammo', 'Survival'];
var gameStatus = 'stopped';

$(document).ready(function(){
    populate(true);
    clearTOs();
    getReady(true);
    
    addTrees(2, 10, 70, 20, '#lvl1');
    addTrees(4, 15, 20, 20, '#mm-background'); 
    addTrees(5, 5, 20, 10, '#mm-background');
    
    $('table').on('click', 'td div', function(){
        var badGuy = $(this);
        badGuy.stop().slideUp(150);
        updateScore(badGuy);
    });
    
    $('body').on('click', '.cloud1', function(){
        populate(true);
    });
    
    $('body').on('click', '#top', function(){
        clearTOs();
    });
    
    $('body').on('click', '#trunk', function(){
        $('td div').animate({top: '12%'}, 300);
    });
    
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

function startGame(){
    gameStatus = 'running';
    populate(true);
    $('.gTimer').attr('id', 'timer');
    timer('start', 15);
    setTimeout(gameOver, 15000);
}

function gameOver(){
    gameStatus = 'stopped';
    clearTOs();
    var temp = $('<div>Game Over</div>');
    
    temp.css({zIndex: 5, fontSize: '4em'});
    temp.appendTo('body');
}

function populate(ready){
    var windows = $('#tower table td');
    
    if(!ready){
        clearTOs(hideTO);
        var people = $('td div');
        console.log("Board Shuffled");
        people.animate({top: '100%'}, 300);
        setTimeout(function(){populate(true);}, 400);
        return;
    }
    
    windows.html('');
    var length = windows.length;

    for(var i=0; i<length; i++){
        var ran = Math.floor((Math.random() * 99) + 1);
        var inWindow = $('<div>');

        if(ran > 20 && ran < 30){
            inWindow.addClass('woman');
        }else if(ran > 30 && ran < 40){
            inWindow.addClass('man');
        }else if(ran > 84 && ran < 91){
            inWindow.addClass('super-ninja');
        }else{
            inWindow.addClass('ninja');
        }
        inWindow.appendTo(windows[i]);
    }
    randomPopUp();
    var shuffleTime = Math.floor((Math.random() * 5000) + 5000);
    shuffle = setTimeout(function(){populate(false)}, shuffleTime);
}

function randomPopUp(){
    var hideTime = 500;
    var people = $('td div');
    var peopleCount = people.length;
    var ranIndex = Math.floor(Math.random() * (peopleCount-1));
    var person = $(people[ranIndex]);
    
    person.removeClass('fall');
    person.animate({top: '12%'}, 300);
    
    if(person.hasClass('super-ninja')){
        hideTime = 150;
        console.log("Super Ninja!");
    }else{
        hideTime = Math.floor((Math.random() * 400) + 800);
    }
    
    hideTO = setTimeout(function(){person.animate({top: '100%'}, 300);}, hideTime);
    
    var showTime = Math.floor((Math.random() * 1000) + 500);
    showTO = setTimeout(function(){randomPopUp();}, showTime);
}

function clearTOs(extra){
    clearTimeout(showTO);
    clearTimeout(shuffle);
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
    
    $('#timer').text(howLong-elapsed);
} 

function getReady(init){
    if(init){
        timer('start', 5);
    }
    var counter = $('.get-ready');
    counter.addClass('number-animate');
    
    if(counter.text() > 0){
        setTimeout(function(){getReady(false);}, 1000);
    }else{
        counter.text('GO!');
        setTimeout(function(){$('#gr-container').remove(); startGame();}, 1000);
    }
}