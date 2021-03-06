var page = require('page');
var createButton = require('../libs/util').createButton;

module.exports = function(){
  page('/episode/:title', function(ctx){
    console.log(ctx.params.title)
    if(ctx.params.title != 'recently-added'){
      setupVideoPlayer();
      liveCommentEdit();
      refreshCommentsIcon();
    }
  })
}

function setupVideoPlayer(){
  var videoPlayer = videojs.getPlayers()[Object.keys(videojs.getPlayers())[1]];
  var path = window.location.pathname;
  var lastPosition = localStorage.getItem(path);
  var currentPosition = 0;
  initVideoUI(videoPlayer);

  videoPlayer.on('play', function(){
    if(lastPosition && lastPosition > currentPosition){
        videoPlayer.currentTime(lastPosition);
    }
    setInterval(function(){
        var duration = videoPlayer.duration();
        currentPosition = videoPlayer.currentTime();
        if(currentPosition + 20 > duration){
            currentPosition = 0;
        }
        localStorage.setItem(path, currentPosition);
    },3000);
  });
}

function initVideoUI(videoPlayer){
  var rewind = createButton("rewind", "ion-ios-rewind", "Skip Backward");
  var fastforward = createButton("fastforward", "ion-ios-fastforward", "Skip Forward");
  var fullWindow = createButton("fullwindow", "ion-arrow-expand", "Full Window");

  rewind.on("click", function(){
    videoPlayer.currentTime(videoPlayer.currentTime() - 10);
  });

  fastforward.on("click", function(){
    videoPlayer.currentTime(videoPlayer.currentTime() + 30);
  });
  fullWindow.on("click", function(){
    videoEl = $("#video .video-js");
    buttonIcon = $(this).find('.icon');
    if(videoEl.hasClass("fullwindow-video")){
      buttonIcon.removeClass('ion-arrow-shrink').addClass('ion-arrow-expand');
      $('body').removeClass('no-overflow');
      videoEl.removeClass("fullwindow-video");
    } else {
      buttonIcon.removeClass('ion-arrow-expand').addClass('ion-arrow-shrink');
      $('body').addClass('no-overflow');
      videoEl.addClass("fullwindow-video");
    };
  });

  var customBar = $("<span>");
  customBar.append(rewind);
  customBar.append(fastforward);
  $('.vjs-control-bar .vjs-play-control').after(customBar);
  $('.vjs-control-bar .vjs-fullscreen-control').after(fullWindow);
}

function liveCommentEdit(){
  $('#comments').on('click', 'a.edit-button', function(e){
    e.preventDefault();
    editButton = this
    url = $(this).attr('href');
    $.get(url, function(body){
       editHTML = $(body).find('.media-content form').parent().html();
       $(editButton).parent().parent().html(editHTML).addClass('live-comment-editor');
       editor = $('.live-comment-editor');

       editor.find('.redactor').redactor();

       var form = $('.live-comment-editor form');
       form.submit(function(e) {

           var url = form.attr('action');


           $.ajax({
                  type: "POST",
                  url: url,
                  data: form.serialize()
                }).done(function(){
                  refreshComments();
                });

           e.preventDefault(); // avoid to execute the actual submit of the form.
       });

    });
  });
}

function refreshCommentsIcon(){
  $('#comments').find('.content-title').append('<a id="refresh-comments">&nbsp;<i class="ion-ios-refresh"></i></a>');
  $("#refresh-comments").on('click', function(){
     refreshComments();
  });
}

function refreshComments(){
  $.get(window.location.href, function(body){
      $("#comments").html($(body).find("#comments").html());
      $('#comments').find('.content-title').append('<a id="refresh-comments">&nbsp;<i class="ion-ios-refresh"></i></a>');
      $('.comment-input .redactor').redactor();
      liveCommentEdit();
  });
}
