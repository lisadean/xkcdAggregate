const PROXY = 'https://my-little-cors-proxy.herokuapp.com/';
const URL = 'http://xkcd.com/';
const REQ = 'info.0.json';
const NUM_OF_COMICS = 10;

var latestComicURL = PROXY + URL + REQ;

// xkcd API instructions: https://xkcd.com/json.html
//
// If you want to fetch comics and metadata automatically,
// you can use the JSON interface. The URLs look like this:
// http://xkcd.com/info.0.json (current comic)
// or:
// http://xkcd.com/614/info.0.json (comic #614)
// Those files contain, in a plaintext and easily-parsed format: comic titles, 
// URLs, post dates, transcripts (when available), and other metadata.

function displayError(err) {
  console.log('ERROR');
  console.log(err);
}

function getComicNum(comicData) {
  return comicData.num;
}  

function getRequestStrings(comicNum) {
  var URLArray = [];
  for (var i=comicNum; i >= comicNum - NUM_OF_COMICS; i--) {
    URLArray.push(PROXY + URL + i + '/' + REQ);
  }  
  return URLArray;
}  

function addComic(data) {
  var $wrapperDiv = $('[data-wrapper]');
  var $comicDiv = $('<div>');
  var $image = $('<img>');
  var $imageCaptionDiv = $('<div>');
  var $titleDiv = $('<div>');
  var $issueDiv = $('<div>');
  var $publishDateDiv = $('<div>');
  
  $comicDiv.addClass('comic');
  $image.addClass('comic-image');
  $imageCaptionDiv.addClass('caption');
  $titleDiv.addClass('title');
  $issueDiv.addClass('issue');
  $publishDateDiv.addClass('publish-date');
  
  $image.attr('src', data.img);
  $image.attr('title', data.alt);
  $titleDiv.text(data.title);
  $issueDiv.text(`#${data.num}`);
  $publishDateDiv.text(`${data.month}/${data.day}/${data.year}`);
  
  $imageCaptionDiv.append($titleDiv);
  $imageCaptionDiv.append($issueDiv);
  $imageCaptionDiv.append($publishDateDiv);
  $comicDiv.append($image);
  $comicDiv.append($imageCaptionDiv);
  $wrapperDiv.append($comicDiv);
}  

function getComics(URLArray) {
  var promises = [];
  URLArray.forEach(URL => {
    var $comic = $.get(URL);
    promises.push($comic);
  });  
  Promise.all(promises)
    .then(resultsArray => {
      resultsArray.forEach(result => {
        addComic(result);
      })  
    })  
    .catch(displayError)
    ;
}    

function main() {
  $('.header').text(`Last ${NUM_OF_COMICS} xkcd Comics`);
  
  var $getLatestComic = $.get(latestComicURL);
  $getLatestComic
  .then(getComicNum)
  .then(getRequestStrings)
  .then(getComics)
  .catch(displayError)
  ;
}

main();