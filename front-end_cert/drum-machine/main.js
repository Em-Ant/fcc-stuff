$(document).ready(function () {
  const soundBank = [{
    keyTrigger: 'Q',
    id: 'Heater-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
  }, {
    keyTrigger: 'W',
    id: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  }, {
    keyTrigger: 'E',
    id: 'Heater-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  }, {
    keyTrigger: 'A',
    id: 'Heater-4',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  }, {
    keyTrigger: 'S',
    id: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  }, {
    keyTrigger: 'D',
    id: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  }, {
    keyTrigger: 'Z',
    id: "Kick-n'-Hat",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  }, {
    keyTrigger: 'X',
    id: 'Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  }, {
    keyTrigger: 'C',
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  }];

  const applyPlayVisuals = function() {
    let displayTimeout;
    return $el => {
      const txt = $el.attr('id');
      $el.toggleClass('active');
      $('#display').text(txt);
      setTimeout(() => {
        $el.toggleClass('active');
      }, 200);
      clearTimeout(displayTimeout);
      displayTimeout = setTimeout(() => {
        $("#display").text('');
      }, 500);
    }
  }();
  const play = k => {
    const el = $(`#${k.toUpperCase()}`);
    const audio = el[0];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.5;
      audio.play();
      const pad = el.parent();
      applyPlayVisuals(pad);
    }
  };

  const keyHandler = e => {
    play(e.key);
  }
  const clickBinder = k => () => {
    play(k);
  }

  const pads = soundBank.map(e => {
    const p = $(`<div id="${e.id}" class="drum-pad">${e.keyTrigger}<audio id="${e.keyTrigger}" class="clip" src="${e.url}"/></div>`);
    p.click(clickBinder(e.keyTrigger));
    return p;
  });
  $('#drum-machine').append(pads, '<p id="display"></p>');
  $(document).keypress(keyHandler);
})