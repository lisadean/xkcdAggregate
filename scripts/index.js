const PROXY = 'https://my-little-cors-proxy.herokuapp.com/';
const URL = 'http://xkcd.com/';
const REQ = 'info.0.json';
const NUM_OF_COMICS = 10;

// xkcd API instructions: https://xkcd.com/json.html
//
// If you want to fetch comics and metadata automatically,
// you can use the JSON interface. The URLs look like this:
// http://xkcd.com/info.0.json (current comic)
// or:
// http://xkcd.com/614/info.0.json (comic #614)
// Those files contain, in a plaintext and easily-parsed format: comic titles, 
// URLs, post dates, transcripts (when available), and other metadata.

var latestComic = PROXY + URL + REQ;

function getRequestStrings(num, latestNum) {
  var results = [];
  for (var i=latestNum; i >= latestNum - 10; i--) {
    results.push(PROXY + URL + i + '/' + REQ);
  }
  return results;
}

function addComic(data) {
  
  var $image = $('<img>');
  $image.attr('src', data.img);
  $image.attr('title', data.alt);
  $image.addClass('comic-image');

  var $titleDiv = $('<div>');
  $titleDiv.text(data.title);
  $titleDiv.addClass('title');

  // var $detailsDiv = $('<div>');
  // $detailsDiv.text(`#${data.num}\n${data.month}/${data.day}/${data.year}`);
  // $detailsDiv.addClass('details');

  var $issueDiv = $('<div>');
  $issueDiv.text(`#${data.num}`);
  $issueDiv.addClass('issue');

  var $publishDateDiv = $('<div>');
  $publishDateDiv.text(`${data.month}/${data.day}/${data.year}`);
  $publishDateDiv.addClass('publish-date');

  var $imageCaptionDiv = $('<div>');
  $imageCaptionDiv.addClass('caption');
  $imageCaptionDiv.append($titleDiv);
  $imageCaptionDiv.append($issueDiv);
  $imageCaptionDiv.append($publishDateDiv);
  // $imageCaptionDiv.append($detailsDiv);
  

  var $comicDiv = $('<div>');
  $comicDiv.addClass('comic');
  $comicDiv.append($image);
  $comicDiv.append($imageCaptionDiv);

  $('[data-wrapper]').append($comicDiv);
}

function doEeeeetAll() {
  $.get(latestComic, latestComicData => {
    var requestStrings = getRequestStrings(NUM_OF_COMICS, latestComicData.num);
    requestStrings.forEach(string => {
      $.get(string, singleComicData => {
        addComic(singleComicData);
      });
    });
  });
}

function main() {
  $('.header').text(`Last ${NUM_OF_COMICS} xkcd Comics`);
  doEeeeetAll();
}

main();