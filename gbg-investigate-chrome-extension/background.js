let token = null;
let urlFragment = null;

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    const locationHeader = details.responseHeaders.find(h => h.name.toLowerCase() === "location");
    if (locationHeader && locationHeader.value.includes("#access_token=")) {
      urlFragment = locationHeader.value.split("#")[1];
      token = new URLSearchParams(urlFragment).get("access_token");
      console.log("Token:", token);
    }
  },
  { urls: ["https://test-mfa.auth.gbgplc.com/*"] },
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.requestToken) {
    sendResponse({ token, urlFragment });
  }
});
