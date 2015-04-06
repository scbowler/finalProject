var showTO, hideTO, shuffle;
var totalScore = 100;

$(document).ready(function(){
    populate(true);
    clearTOs();
    //var windows = $('#tower table td'); 
    //var inWindow = $('<div>');
    
    //inWindow.addClass('ninja');
    
    //inWindow.appendTo(windows);
    
    $('table').on('click', 'td div', function(){
        var badGuy = $(this)
        console.log('got me!', badGuy);
        badGuy.slideUp(200);
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
});

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
    //return people;
    //console.log("hide time: ", hideTime, "show time: ", showTime);
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
        console.log("You clicked a ninja");
        totalScore += 2;
    }else if(person.hasClass('super-ninja')){
        console.log("You clicked a super ninja");
        totalScore += 4;
    }else{
        console.log("You clicked a person");
        if(totalScore > 2){
            totalScore -= 2;
        }
    }
    $('#total-score').text(totalScore);
}

function addTrees(amount, loc, seperation){
    if(amount < 1){
        return;
    }
    var percent = loc + '%';
    var id = 'tree' + loc;
    
    //console.log('percent: ', percent, 'id: ', id);
    buildTree(id).css("left", percent).appendTo('body');
    
    
    
    addTrees(amount-1, loc+seperation, seperation);
}

function buildTree(id){
    var mainCSS = {bottom: '20%', height: '30%', left: '0%', position: 'absolute', width: '10%', zIndex: '3'};
    
    var topHeight = Math.floor((Math.random() * 20) + 40) + "%";
    var topWidth = Math.floor((Math.random() * 20) + 40);
    var topLeft = ((100 - topWidth)/2) + "%";
    topWidth += "%";
    
    console.log("height:", topHeight, "width:", topWidth, "left:", topLeft);
    
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
    
    var container = $("<div id=" + id + "></div>").css(mainCSS);
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