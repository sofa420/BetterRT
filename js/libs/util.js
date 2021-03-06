/****************************/
/*      Loading image       */
/****************************/
var loadingImg = new Image();
$(loadingImg).attr('src', '/images/loading2.gif').css({'margin': '0 auto', 'display': 'block'});
exports.loadingImg = loadingImg;

/****************************/
/*   generateChannelString  */
/****************************/
function generateChannelString(page){
  var channel = $('#channelFilter').val();
  var channelString = '?';
  if (channel && channel.length !== 0) {
    channelString = '?channel=' + channel + '&';
  }
  channelString = channelString + 'page=' + page +'&';
  return channelString;
}

exports.generateChannelString = generateChannelString;

/****************************/
/*       createButton       */
/****************************/
function createButton(id, iconClass, title){
  title = title || '';
  var button = $("<button>");
  button.attr('id', id);
  button.addClass("betterRT");
  button.css({paddingTop:"5px"});
  button.attr('Title', title)

  var icon = $("<i>");
  icon.addClass("icon");
  icon.addClass(iconClass);
  icon.css({fontSize: "18px"});
  button.append(icon);
  return button;
};

exports.createButton = createButton;

/*****************************/
/*    updateRecentlyAdded    */
/*****************************/
function updateRecentlyAdded(query, next) {
  $.get('/api/internal/episodes/recent' + query + 'limit=24', function(data) {
    RT.episodeGrid(data.data, 'recently-added-grid');

    // create pagination
    $.each(data.links, function(key, value) { data.links[key] = getParameterByName('page', value) });
    RT.paginator(data.links, 'paginator', onSubmitHandler);
    next()
  })
}
exports.updateRecentlyAdded = updateRecentlyAdded
