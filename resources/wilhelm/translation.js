/* this code runs in Chrome using LanguageApp
 * and uses the same account to do translation as Chrome does
 * when it translates web pages and emails for you in the course of the day.
 * or you can construct the url illustrated at var url = and just curl the
 * result.
 */
/* Written by Amit Agarwal */
/* web: ctrlq.org          */

function doGet(e) {

  var sourceText = ''
  if (e.parameter.q){
    sourceText = e.parameter.q;
  }
  
  var sourceLang = 'auto';
  if (e.parameter.source){
    sourceLang = e.parameter.source;
  }

  var targetLang = 'ja';
  if (e.parameter.target){
    targetLang = e.parameter.target;
  }
  
  /* Option 1 */
  
  var translatedText = LanguageApp.translate(sourceText, sourceLang, targetLang)
  
  /* Option 2 */  
  
  var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
            + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
  
  var result = JSON.parse(UrlFetchApp.fetch(url).getContentText());
  
  translatedText = result[0][0][0];
  
  var json = {
    'sourceText' : sourceText,
    'translatedText' : translatedText
  };
  
  // set JSONP callback
  var callback = 'callback';
  if(e.parameter.callback){
    callback = e.parameter.callback
  }
  
  // return JSONP
  return ContentService
           .createTextOutput(callback + '(' + JSON.stringify(json) + ')')
           .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
