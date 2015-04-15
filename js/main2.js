var shuffle, NPCarray, NPCcount;
var NPC_array = {};
var NPC_list = [];
var showTO = {};
var hideTO = {};
var totalScore = 0;
var gameModes = ['Timed', 'Ammo', 'Survival'];
var gameStatus = 'stopped';
var totalShots = 0;
var totalHits = 0;
var finalScore = 0;
var TOindex = 0;
var total_npcs_up = 0;
var base_popup_chance_per_second = .2;
var maximum_npcs_up = 10;
var popup_scale_min_npc_num = 5;
var popup_chance_delta_per_npc = base_popup_chance_per_second/(maximum_npcs_up-popup_scale_min_npc_num);
var npcContainer=null;
var min_heartbeat = 1;
var max_heartbeat = 5;
var max_heartbeat_adjusted = (max_heartbeat + 1) - min_heartbeat;

var quickpop_time = 1;
var elapsed = null;


function npc(target_element, npc_index) {
    this.heartbeat = null;
    this.index = npc_index;
    this.hide_timeout = null;
    this.hideTime = 1500; 
    this.showTime = 750;
    this.dead_hideTime= 100;
    this.log=[];
    this.keep_log = false;
    this.display_log = false;
    this.change_after_popdown = true;
    this.randomize_timer = true;
    this.superninja_hidetime = 1000;
    this.actor = null; //the image class, ie woman, ninja, man, etc
    this.element = target_element; //the element that will display this npc
    this.init = function(){
        this.select_random_actor();
        this.set_image();
    }
    this.set_image = function(){
        this.element.addClass(this.actor);
    }
    this.get_element = function(){
        console.log("this element: ",this.element);
    }
    this.calculate_heartbeat = function(){
        if(elapsed < quickpop_time)
        { 
            return 100;
        }
        else
        {
            var x = (Math.random() * max_heartbeat_adjusted + min_heartbeat)*1000;
            return x;
        }
    }
    this.start_game = function(){
        this.change_heartbeat();
    }
    this.change_heartbeat = function(){
        this.stop_heartbeat();
        var _this=this;
        this.heartbeat = setInterval(function(){
            _this.popup_check();
        },this.calculate_heartbeat());
    }
    this.stop_game = function(){
        this.die();
        this.stop_heartbeat();
    }
    this.stop_heartbeat = function(){
        if(this.heartbeat!=null){
            clearInterval(this.heartbeat);
            this.heartbeat = null;
        }  
    }
    this.toggle_log = function(){
        this.display_log = !this.display_log;
    }
    this.log_action = function(message){
        if(this.display_log){
            console.log(message);
        }
        if(this.keep_log){
            this.log.push(message);
        }
    }
    this.show_log = function(){
        console.log(this.index+' message log for ',this.log); 
    }
    this.clear_log = function(){
        this.message = [];
    }
    this.popup_check = function(){
        if(this.randomize_timer){
            this.change_heartbeat();
        }
        if(total_npcs_up<popup_scale_min_npc_num){
            
            var percent_popup = (maximum_npcs_up - popup_scale_min_npc_num) * popup_chance_delta_per_npc;
            this.log_action(this.index+': percent_popup: '+percent_popup);
            var rand = Math.random();
            this.log_action(this.index+': rand: '+rand);
            if(Math.random()<=percent_popup){
                this.log_action(this.index+': initiating popup');
                this.popup();
            }
        }
    }
    this.popup = function(){
        this.enable_hits();
        this.log_action(this.index+': starting popup');
        this.log_action("element: ",this.element);
        total_npcs_up++;
        this.element.animate({top: '0%'}, this.showTime);
        if(this.avatar=='super-ninja'){
            var hide_ms = this.superninja_hidetime;
        }
        else {
            var hide_ms = this.hideTime;
        }
        this.log_action(this.index+': hiding in '+hide_ms+'ms');
        var _this = this;
        this.hide_timeout = setTimeout(function(){
            _this.popdown();
        },hide_ms);
        this.log_action(this.index+': ending popup');
    }
    this.popdown = function(dying){
        if(typeof dying == 'undefined' || !dying){
            var hideTime = this.hideTime;
        }
        else{
            var hideTime = this.dead_hideTime;
        }
        this.log_action(this.index+': popping down');
        
        total_npcs_up--;
        var _this = this;
        this.element.stop().animate({top: '100%'}, hideTime, function(){
            _this.change_check();
        });
    }
    this.die = function(){
        this.disable_hits();
        this.popdown(true);
    }
    this.change_check = function(){
        if(this.change_after_popdown){
            this.select_random_actor();
            this.set_image();
        }
    }
    this.was_hit = function(){
        //function hitNPC()
        this.log_action(this.index+': was hit');
        this.die();
        updateScore(this.element);
        totalHits++;
    }
    this.enable_hits = function(){
        var _this = this;
        $(this.element).on('click', function(){
            _this.was_hit();
        });
    }
    this.disable_hits = function(){
        $(this.element).off('click', this.was_hit);
    }
    this.select_random_actor = function(){
        var ran = Math.floor((Math.random() * 99) + 1);
        if(ran > 20 && ran < 30){
            this.actor='woman';
        }else if(ran > 30 && ran < 40){
            this.actor='man';
        }else if(ran > 84 && ran < 91){
            this.actor='super-ninja';
        }else{
            this.actor='ninja';
        }  
    }
    this.init();
}
npc.prototype.keep_log = false;
npc.prototype.display_log = false;

function custom_timer(seconds){
    this.duration = seconds;
    this.duration_ms = seconds*1000;
    this.timer_delagates = {};
    this.timer = null;
    this.last_whole_second = null;
    this.timer_delegates = {};
    this.start = function(){
        console.log('starting');
        this.init();
    }
    this.stop = function(){
        this.clear_timer();
    }
    this.init = function(){
        console.log('init');
        this.started_at = this.now();
        this.end_at = this.started_at + this.duration;
        this.clear_timer();
        var _this = this;
        this.timer = setInterval(function(){
            _this.timer_check();
        },1000);
    }
    this.now = function(){
        return((new Date().getTime()) / 1000);
    }
    this.clear_timer = function(){
        console.log('clear timer');
        if(this.timer != null){
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    this.set_timeout = function(new_time){
        this.duration = new_time;
        this.duration_ms = new_time*1000;
    }
    this.timer_check = function(){
        console.log('timer check');
        var now = this.now();
       console.log('now: '+now+' end at: '+this.end_at);
        if(now>this.end_at){
            this.end_timer();
        }
        var whole_now = Math.floor(now);
        
        if(this.last_whole_second != whole_now){
            this.last_whole_second = whole_now;
            var elapsed = Math.floor(now - this.started_at);
            console.log(elapsed + "seconds elapsed");
        }
    }
    this.end_timer = function(){
        this.clear_timer();
        for(index in this.timer_delegates){
            console.log('calling '+this.timer_delegates[index]['name']);
            window[this.timer_delegates[index]['name']].apply();
        }
    }
    this.register_handler = function(function_name){
        this.timer_delegates[function_name]={name:function_name, set: true};
    }
    this.remove_handler = function(function_name){
        delete this.timer_delegates[function_name];
    }
                                
    
}
    function this_test(){
        console.log('test called');
    }
$(document).ready(function(){

    moo = new custom_timer(2);
    moo.register_handler('this_test');
    moo.init();
    npcContainer = $('.npc-container');
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
    
    var index=0;
    NPCarray = $('.npc-container');
    NPCarray.each(function(){
        NPC_list.push(new npc($(NPCarray[index]),index));
        index++;
    });
    console.log('starting test');

    NPCcount = NPC_list.length;
}

function startGame(){
    console.log('startGame called');
    totalScore = 0;
    totalShots = 0;
    totalHits = 0;
    finalScore = 0;
    gameStatus = 'running';
    $('#total-score').text(totalScore);
    for(i=0; i<NPCcount; i++)
    {
        NPC_list[i].start_game();
    }
    //populate(true);
    timer('start', 15);
    
    $('body').on('click', countClicks);
    //$('table').on('click', 'td div', hitNPC);
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
    //$('table').off('click', 'td div', hitNPC);
    
    gameStatus = 'stopped';
    //clearTOs();
    updateSideMenu();
    for(i=0; i<NPCcount; i++)
    {
        NPC_list[i].stop_game();
    }    
    //hideTO = {};
    //showTO = {};
    //TOindex = 0;
    
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
    return;
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
    elapsed = now - start;
    
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