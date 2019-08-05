

const getBrowser = () => {
  if (typeof browser !== "undefined") {
    return "firefox";
  } else {
    return "chrome";
  }
}

const opt_extraInfoSpec = ['requestHeaders', 'blocking']

if (getBrowser() === 'chrome' && chrome.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty('EXTRA_HEADERS')) {
  opt_extraInfoSpec.push('extraHeaders')
}

chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
  var newCookie = '_options={%22pref_quarantine_optin%22:true};'
  var gotCookie = false;
  for(var n in details.requestHeaders){
    if (details.requestHeaders[n].name.toLowerCase()==="cookie") {
      details.requestHeaders[n].value = details.requestHeaders[n].value.replace(/ ?reddit_session[^;]*;/,'')
      if (! details.requestHeaders[n].value.match(/pref_quarantine_optin/)) {
        details.requestHeaders[n].value = details.requestHeaders[n].value + `; ${newCookie}`
      }
      gotCookie = true
      break
    }
  }
  if(!gotCookie){
    details.requestHeaders.push({name:"Cookie",value:newCookie});
  }
  return {requestHeaders:details.requestHeaders};
},{
  urls:["https://oauth.reddit.com/*.json*", "https://oauth.reddit.com/api/info*"]
}, opt_extraInfoSpec);
