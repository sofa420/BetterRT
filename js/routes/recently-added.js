var page = require('page')
var createButton = require('../libs/util').createButton;
var generateChannelString = require('../libs/util').generateChannelString;
var loadingImg = require('../libs/util').loadingImg;
var querystring = require('querystring');
var updateRecentlyAdded = require('../libs/util').updateRecentlyAdded


module.exports = function() {
  page('/episode/recently-added', function(ctx){
    $('.content-title.recently-added-header').append("<a id='refreshVideos'><i class='fa fa-refresh'></i></a>")
    $('.content-title.recently-added-header').after("<div><input type='checkbox' id='firstOnlyToggle'> Only show First Content</div>");
    $('#refreshVideos').click(function(){
      $('#channelFilter').change();
    });
    $('.col-lg-8').append('<div id="recently-added-grid-shadow"></div>')
    $("#firstOnlyToggle").change(function(){
      if($(this).is(':checked')){
        buildShadowElement();
        hideNonFirst();
      } else {
        $('#recently-added-grid .grid-blocks').html($('#recently-added-grid-shadow').html());
      }
    })

    $('#channelFilter').on('change', onChannelChange);

    var query =  querystring.parse(ctx.querystring)
    query.page = query.page || 1;
    var pageNum = new Number(query.page)
    $('.pagination .controls form').attr('lpformnum', pageNum).find('input').val(pageNum);
    if(pageNum == 1){
      $('.pagination .controls .arrow').first().addClass('unavailable')
    } else {
      $('.pagination .controls .arrow').first().removeClass('unavailable').html('<a href="#" data-page="'+(pageNum - 1)+'">&lt;&nbsp; Prev</a>')
    }
    $('.pagination .controls .arrow').last().find('a').attr('data-page', pageNum + 1)


    var query =  querystring.parse(ctx.querystring)
    if(isNaN(query.page)){
      history.replaceState({
        page: 1,
        channelString: generateChannelString(1)
      }, null, '/episode/recently-added?page=1'+'&channel='+$('#channelFilter').val())
    } else {
      loadPage(query.page);
    }

    betterPagination();
  })

function hideNonFirst(){
  $('.grid-blocks li').each(function(){
    if(!$(this).find('.ion-star').length){
      $(this).remove();
    }
  })
}

function buildShadowElement(){
  $('#recently-added-grid-shadow').html($('#recently-added-grid .grid-blocks').html())
}
/*
  page('/episode/recently-added/:page', function(ctx){
    $.get('http://roosterteeth.com/episode/recently-added', function(body){
      $('main.row').replaceWith($(body).find('main.row'));

      $('.content-title.recently-added-header').append("<a id='refreshVideos'><i class='fa fa-refresh'></i></a>")
      $('#refreshVideos').click(function(){
        $('#channelFilter').change();
      })
      betterPagination();
    })
  }) */
}

function betterPagination(){
  // handle change of pages
  $('#paginator').off('click', 'a');
  $('#paginator').on('click', 'a', paginatorOnClick)

  window.addEventListener('popstate', function(e){
    var page = e.state.page || null;
    if(page === null){

    } else {
      e.preventDefault();
      RT.scroller('recently-added-grid', 0);
      e.preventDefault();
      $('ul.grid-blocks').hide();
      $('section.pagination').hide();
      $('#recently-added-grid').append(loadingImg);

      updateRecentlyAdded(e.state.channelString);
    }
  })
  // use pushstate
}

function onChannelChange(){
    var url = '/episode/recently-added?page='+1+'&channel='+$('#channelFilter').val();
    history.pushState({
      page: 1,
      channelString: generateChannelString(1)
    }, null, url)
}

function loadPage(page){
    var url = '/episode/recently-added?page='+page+'&channel='+$('#channelFilter').val();
    history.pushState({
      page: 1,
      channelString: generateChannelString(1)
    }, null, url);

}

function paginatorOnClick(e){
    RT.scroller('recently-added-grid', 0);
    e.preventDefault();
    var page = $(this).attr('data-page');
    // hide this instead of replace so the react component can unmount it
    $('ul.grid-blocks').hide();
    $('section.pagination').hide();
    $('#recently-added-grid').append(loadingImg);
    var url = '/episode/recently-added?page='+page+'&channel='+$('#channelFilter').val();
    channelString = generateChannelString(page);
    history.pushState({
      page: page,
      channelString: channelString
    }, null, url)
    updateRecentlyAdded(channelString, function(){
      if($('#firstOnlyToggle').is(':checked')){
        $('#recently-added-grid-shadow').html($('#recently-added-grid .grid-blocks').html())
        $('.grid-blocks li').each(function(){
          if(!$(this).find('.ion-star').length){
            $(this).remove();
          }
        })
      }
    });


}
