$(document).ready(function(){
  
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  var frequencies = [329.63,261.63,220,164.81];
  var errOsc = audioCtx.createOscillator();
  errOsc.type = 'square';
  errOsc.frequency.value = 55;
  errOsc.start();

  var gameStatus = {};

  gameStatus.init = function(){
    this.strict = false;
    this.count = 0;
    this.lastPush = $('#0');
    //this.sequence = [];
    this.index = 0;
  };

  // create Oscillators 
  var oscillators = frequencies.map(function(frq){
    var osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frq;
    osc.start();
    return osc;
  });

  var gainNode = audioCtx.createGain();
  
  function playGoodTone(num){
    gameStatus.currOsc = oscillators[num];
    gameStatus.currOsc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gameStatus.currPush = $('#'+num);
    gameStatus.currPush.addClass('light');
  };
  
  function stopGoodTones(){
    if(gameStatus.currPush)
      gameStatus.currPush.removeClass('light');
    if(gameStatus.currOsc)
      gameStatus.currOsc.disconnect(gainNode);
    gainNode.disconnect(audioCtx.destination);
    gameStatus.currPush = undefined;
    gameStatus.currOsc = undefined;
  };
  
  function playErrTone(){
    errOsc.connect(gainNode);
    errOsc.connect(audioCtx.destination);
  };
  
  function stopErrTone(){
    errOsc.disconnect(gainNode);
    gainNode.disconnect(audioCtx.destination);
  };
 
  function notifyError(pushObj){
    playErrTone();
    if(pushObj)
      pushObj.addClass('light');
    $('.clickable').removeClass('clickable').addClass('unclickable');
    gameStatus.toHndl = setTimeout(function(){
      $('.unclickable').removeClass('unclickable').addClass('clickable');
      stopErrTone();
      if(pushObj)
        pushObj.removeClass('light');
    },1000);
    flashMessage('!!',2);
  };
  
  function notifyWin(){
    $('.clickable').removeClass('clickable').addClass('unclickable');
    var cnt = 0;
    var last = gameStatus.lastPush.attr('id');
    gameStatus.seqHndl = setInterval(function(){
      playGoodTone(last);
      gameStatus.toHndl = setTimeout(stopGoodTones,80);
      cnt++;
      if(cnt === 8){
        console.log('eeeeed');
        clearInterval(gameStatus.seqHndl);
        $('.unclickable').removeClass('unclickable').addClass('clickable');
      }
    },160);
    flashMessage('**',2);
  }
  
  function flashMessage(msg,times){
    $('.count').text(msg);
    var lf = function(){
      $('.count').addClass('led-off');
      gameStatus.toHndlFl = setTimeout(function(){
        $('.count').removeClass('led-off');
      },250);
    };
    var cnt = 0;
    lf();
    gameStatus.flHndl = setInterval(function(){
      lf();
      cnt++;
      if(cnt === times)
        clearInterval(gameStatus.flHndl);
    },500)
  };
  
  function playSequence(){
    $('.push').removeClass('clickable').addClass('unclickable');
    var i = 0;
    gameStatus.seqHndl = setInterval(function(){
      playGoodTone(gameStatus.sequence[i]);
      gameStatus.toHndl = setTimeout(stopGoodTones,gameStatus.timeStep/2 - 10);
      i++;
      if(i === gameStatus.sequence.length){
        clearInterval(gameStatus.seqHndl);
        $('.push').removeClass('unclickable').addClass('clickable');
        gameStatus.toHndl = setTimeout(notifyError,5*gameStatus.timeStep);
      }
    },gameStatus.timeStep);
  };
  
  function resetTimers(){
    clearInterval(gameStatus.seqHndl);
    clearInterval(gameStatus.flHndl);
    clearTimeout(gameStatus.toHndl);
    clearTimeout(gameStatus.toHndlFl);
  };
  
 
  
  function pushColor(pushObj){
    clearTimeout(gameStatus.toHndl);
    var pushNr = pushObj.attr('id');
    if( pushNr == gameStatus.sequence[gameStatus.index] && gameStatus.index < gameStatus.sequence.length){
      playGoodTone(pushNr);
      gameStatus.lastPush = pushObj;
      gameStatus.index++;
      if(gameStatus.index < gameStatus.sequence.length){
        gameStatus.toHndl = setTimeout(notifyError,5*gameStatus.timeStep);
      }else{
        gameStatus.toHndl = setTimeout(notifyWin,gameStatus.timeStep);
      }
    }else{
      notifyError(pushObj);
    }
  }
  
  /**
  * TEST MODE
  */
  
  
  
  gameStatus.sequence = [0,3,1,2];
  gameStatus.timeStep = 1000;
  
  // COLORS || AUDIO TEST
  $('.push').mousedown(function(){
    pushColor($(this));
  });
  
  $('*').mouseup(function(e){
    e.stopPropagation();
    stopGoodTones();
  });
  
  
  function toggleStrict(){
    $('#mode-led').toggleClass('led-on');
    gameStatus.strict = !gameStatus.strict;
    
    // AUDIO TEST
    notifyWin();
  }
  
  $('.sw-slot').click(function(){
    $('#pwr-sw').toggleClass('sw-on');
    if($('#pwr-sw').hasClass('sw-on')==false){
      gameStatus.init();
      $('.count').text('--');
      $('.count').addClass('led-off');
      $('#mode-led').removeClass('led-on');
      $('.push').removeClass('clickable').addClass('unclickable');
      $('#start').off('click'); 
      $('#mode').off('click');
      resetTimers();
      stopGoodTones();
      stopErrTone();
    }else{    
      $('.count').removeClass('led-off');
      $('.push').removeClass('unclickable').addClass('clickable');
      $('#start').click(playSequence);  // Seq testing
      $('#mode').click(toggleStrict); // Error testing
    }     
  });
  
  gameStatus.init();
  
});
