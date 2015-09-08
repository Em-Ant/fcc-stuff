$(document).ready(function(){
  var users = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","comster404","brunofin","MedryBW","thomasballinger","noobs2ninjas","beohoff"];
  
  var users_data =[],temp = [];
  var selected_users;
  var url = "https://api.twitch.tv/kraken/"
  var st = "streams/";
  var us = "users/";
  var cb = '?callback=?';
  
  var filter_online = function(el){
      return el.stream ? true : false ;
  };
  
  var click_fn = function(){
    switch ($(this).text()){
      case 'ALL' :
        selected_users = users_data;
        break;
      case 'ONLINE' :
        selected_users = users_data.filter(filter_online);
        break;
      case 'OFFLINE' :
        selected_users = users_data.filter(function(el){return !filter_online(el);});
        break;
    }        
    displayElems(selected_users,$('.out'));
    $('.btn').removeClass('active');
    $(this).addClass('active');  
    $('#search').val('');
  };
  
  
  var collectData = function(){
    var promises = users.map(function(el){
      return $.getJSON(url+st+el+cb,function(data){
        data.name = el;
        users_data.push(data);
      }).fail(function(x,t,r){console.log('fail '+t+' '+r)});
    });   
    // call $.when() with an array or promises
    return $.when.apply(null,promises);
  };

  var collectLogos = function(){
    var promises = users_data.map(function(el){
      return $.getJSON(url+us+el.name+cb,function(data){
        el.logo = data.logo;
        temp.push(el);
      }).fail(function(x,t,r){console.log('fail '+t+' '+r)});
    });   
    // call $.when() with an array or promises
    return $.when.apply(null,promises) ;
  };
  
    var displayElems = function(obj_array,$where){
      $where.empty();  
      var $ul = $('<ul class="list-unstyled"></ul>');
      obj_array.forEach(function(el){
        if(!el.error){
      var online = el.stream ? 'fa fa-check-square green' : 'fa fa-exclamation-circle yellow';
      var logo = el.logo ? el.logo : 'http://lorempixel.com/80/80/abstract"'
      var $li = $('<li class="users"><img class="logo" src="'+ logo +'"/></li>');
      var $div = $('<div class="data"></div>');
      $div.append('<h4 class="name"><a href="http://www.twitch.tv/' +el.name+ ' " target="_blank">'+el.name+'</a></h4><p class="online"><i class="' + online+'"></i></p>');
      if(el.stream)
        $div.append($('<p class="streaming" >'+ el.stream.game +'</p>'));
     $li.append($div); 
     $ul.append($li);
        }
    });
    $where.append($ul);
  };
  
  function displayErr(){
    $('.pre').hide();
    $('.preload').append('<h3>CONNECTION ERROR!</h3>');
  };
  
  function displayData(){
    //Initialize after data are ready
    displayElems(users_data,$('.out'));
    selected_users = users_data;
    var $ul = $('<ul class="list-inline"></ul>');
    $ul.append($('<li></li>').append($('<div class="btn btn-primary active">ALL</div>').click(click_fn)));
    $ul.append($('<li></li>').append($('<div class="btn btn-primary">ONLINE</div>').click(click_fn)));
    $ul.append($('<li></li>').append($('<div class="btn btn-primary">OFFLINE</div>').click(click_fn)));
    $('#search').keyup(function(ev){
      if($('#search').val().length >= 2){
        displayElems(selected_users
          .filter(function(el){
            var regex = new RegExp($('#search').val(),'i');
            return el.name.match(regex);
          }),$('.out'));
      }else
        displayElems(selected_users,$('.out'));
    });    
   $('.nav').prepend($ul);
   $('.preload').fadeOut();
   $('.active-wrap').fadeIn(500); 
  }; 
  
    /*****************************
    * INITIALIZATION STARTS HERE 
    *****************************/
  $('.active-wrap').hide();
  collectData().then(collectLogos,displayErr).then(displayData);
});
