var shuffle, NPCarray, NPCcount;
var showTO = {};
var hideTO = {};
var totalScore = 0;
var dbHighScores = null;
var gameModes = ['Timed', 'Ammo', 'Survival'];
var currentGameMode = "Timed";
var currentLevel = null;
var gameStatus = 'stopped';
var totalShots = 0;
var totalHits = 0;
var finalScore = 0;
var TOindex = 0;
//var clickBonus = 1;

$(document).ready(function(){
    
    var location = getLocation();
    
    if(location == '' || location == 'mainMenu'){
        addTrees(4, 15, 20, [2, 35], '#mm-background'); 
        addTrees(5, 5, 20, [2, 35], '#mm-background'); 
    }else if(location == 'lvl1'){
        addTrees(2, 10, 70, 20, '#lvl1');
        currentLevel = location;
        setSessions();
        init();
        getReady(3);
    }
    
    $('#main-menu').on('click', '#new-game', function(){        
        window.location = '?page=lvl1.php';
    });

    $('#main-menu').on('click', '#high-scores', function(){        
        
        var menu = $("#main-menu");
        menu.fadeOut();
        addScoreToDb(null);
        
        $("body").on("click", "#scoreTable", function(){
            setTimeout(function(){menu.fadeIn();}, 200);
        });
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
        currentGameMode = gameModes[index];
        modeBtn.text(currentGameMode);
    });
});

function init(){
    NPCarray = $('.npc-container');
    NPCcount = NPCarray.length;
}

function startGame(){
    //console.log('startGame called');
    //clickBonus = 1;
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
    totalShots++;
    //console.log("body click");
}

function hitNPC(){
    var badGuy = $(this);
    badGuy.stop().slideUp(150);
    updateScore(badGuy);
    totalHits++;
    //console.log("Hit NPC");
}

function gameOver(){
    $('body').off('click', countClicks);
    $('table').off('click', 'td div', hitNPC);
    
    gameStatus = 'stopped';
    clearTOs();
    updateSideMenu();
    checkHighScores();
    
    hideTO = {};
    showTO = {};
    TOindex = 0;
    
    $('#side-menu').animate({right: '0%'}, 500);
    $('#main-area').animate({opacity: '.3'}, 400);
    
    $('#side-menu').on('click', '#play-again', function(){
        location.reload();
        //$('#side-menu').animate({right: '-30%'}, 500);
        //$("<div id='gr-container'><div class='get-ready' id='count-down'></div></div>").appendTo("#lvl1");
        //getReady(3);
    });
    
    $('#side-menu').on('click', '#quit', function(){
        window.location = '?page=mainMenu.php';
    });
}

function checkHighScores(){
    var length = dbHighScores.length;
    var highScore = false;
    //var rank = 0;

    while(length && !highScore){
        length--;
        if(finalScore > dbHighScores[length]){
            highScore = true;
        } 
    }
    //console.log("high score", highScore);
    //console.log(dbHighScores);
    
    if(highScore){
        getUserName();
    }else{
        addScoreToDb(null);
    }    
}

function getUserName(){
    var nameContainer = $("<div id='name-container'></div>").html("<h1>You Acheived a High Score!</h1>");
    var input = $("<input type='text' id='name' name='name' placeholder='Enter Your Name'>");
    var button = $("<div class='btn' id='submit-name'><div class='menu-text'>OK</div></div>");
    var userName = '';

    input.appendTo(nameContainer);
    button.appendTo(nameContainer);

    $("body").append(nameContainer);

    button.click(function(){
        userName = input.val();
        nameContainer.remove();
        console.log("Name entered", userName);
        addScoreToDb(userName);
    });
}

function addScoreToDb(name){
    sendData = {score: finalScore, name: name};

    $.ajax({
        url: 'actions/addHighScore.php',
        method: 'POST',
        data: sendData,
        dataType: 'json', 
        cache: false,
        success: function(data){
            console.log("addScoreToDb returned data", data);
            makeScoreTable(data['scoreData']['html']);
        }
    });
}

function makeScoreTable(tableRows){
    
    var table = $("<table id='scoreTable'></table>");
    var tbody = $("<tbody></tbody>");
    var tableData = "<tr><th>Rank</th><th>Name</th><th>Score</th><th>Level</th><th>Game Mode</th></tr>";
    var length = 10; //tableRows.length;

    for(var i=0; i<length; i++){
        tableData += tableRows[i];
    }

    tbody.html(tableData).appendTo(table);
    
    var body = $("body");
    table.appendTo(body).hide().fadeIn();
    body.on("click", table, function(){
        table.fadeOut();
        setTimeout(function(){table.remove();}, 400);
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
    //console.log("populate called with:", ready);
    if(!ready){
        clearTOs();
        //console.log("Board Shuffled");
        setTimeout(function(){populate(true);}, 400);
        return;
    }
    
    for(var i=0; i<NPCcount; i++){
        var ran = Math.floor((Math.random() * 99) + 1);
        var npc = $(npcContainer[i]);

        if(npc.hasClass('woman')){
            npc.removeClass('woman');
        }else if(npc.hasClass('man')){
            npc.removeClass('man');
        }else if(npc.hasClass('super-ninja')){
            npc.removeClass('super-ninja');
        }else if(npc.hasClass('ninja')){
            npc.removeClass('ninja');
        }

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
    //console.log("randomPopUp called")
    var hideTime = 500;
    var ranIndex = Math.floor(Math.random() * (NPCcount-1));
    var person = $(NPCarray[ranIndex]);
    //console.log("Random Index: ", ranIndex);
    person.show();
    person.animate({top: '12%'}, 300);
    
    if(person.hasClass('super-ninja')){
        hideTime = 250;
        //console.log("Super Ninja!");
    }else{
        hideTime = Math.floor((Math.random() * 400) + 800);
    }
    var tempIndex = TOindex;
    hideTO[TOindex] = setTimeout(function(){clearTimeout(hideTO[tempIndex]); delete hideTO[tempIndex]; person.animate({top: '100%'});}, hideTime);
    
    var showTime = Math.floor((Math.random() * 600) + 200);
    showTO[TOindex] = setTimeout(function(){clearTimeout(showTO[tempIndex]); delete showTO[tempIndex]; randomPopUp(); }, showTime);
    //console.log("Hide array:", hideTO, "Show array:", showTO);
    TOindex++;
}

function clearTOs(extra){
    //console.log("Clear TOs called");
    for(var keys in showTO){
        clearTimeout(showTO[keys]);
        delete showTO[keys];
    }
    for(var keys in hideTO){
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
    
    var parent = person.parent();

    setTimeout(function(){parent.css({"backgroundColor": "#3399ff"});}, 250);
    setTimeout(function(){person.css({"display": "inline-block", "top": "100%"});}, 600);

    if(person.hasClass('ninja')){
        //console.log("You clicked a ninja");
        totalScore += 2;
        parent.css({"backgroundColor": "green"});
    }else if(person.hasClass('super-ninja')){
        //console.log("You clicked a super ninja");
        totalScore += 4;
        person.css({"backgroundColor": "lightgreen"});
    }else{
        //console.log("You clicked a person");
        person.css({"backgroundColor": "red"});
        if(totalScore >= 2){
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
    }else if(typeof verticle == "object"){
        var vert = verticle
        verticle = Math.floor((Math.random() * (vert[1] - vert[0])) + vert[0]);
        //console.log("Random Verticle", verticle);
    }

    var vertPercent = verticle + '%';

    if(vert !== undefined){
        verticle = vert;
    }
    
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

function setSessions(){
    var sendData = {level: currentLevel, gMode: currentGameMode};
    console.log("Session Data", sendData);

    $.ajax({
        url: 'actions/gameStart.php',
        method: 'POST',
        data: sendData,
        dataType: 'json', 
        cache: false,
        success: function(data){
            //console.log("setSessions returned data", data);
            dbHighScores = data.highScores;
            //console.log(dbHighScores);
        }
    });
}