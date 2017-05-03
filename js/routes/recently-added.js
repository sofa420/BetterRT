var page = require('page')
var createButton = require('../libs/util').createButton;
var generateChannelString = require('../libs/util').generateChannelString;
var loadingImg = require('../libs/util').loadingImg;
var querystring = require('querystring');


module.exports = function() {
  page('/episode/recently-added', function(ctx){
    $('.content-title.recently-added-header').append("<a id='refreshVideos'><i class='fa fa-refresh'></i></a>")
    $('#refreshVideos').click(function(){
      $('#channelFilter').change();
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
    console.log(e)
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
    updateRecentlyAdded(channelString);
}
