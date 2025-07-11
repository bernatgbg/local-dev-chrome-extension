chrome.runtime.sendMessage({ requestToken: true }, response => {
  if (response && response.token && response.urlFragment) {
    showStyledPopup(response.urlFragment);
    injectLocalLoginButton(response.urlFragment);
  }
});

function waitForElement(selector, callback) {
  const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector(selector);
    if (element) {
      obs.disconnect();
      callback(element);
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

function injectLocalLoginButton(urlFragment) {
  waitForElement('.btn.primary.js-i-agree.ont-btn-login.ont-consent-btn', (agreeBtn) => {
    const localLink = document.createElement("a");
    localLink.textContent = "Redirect to dev localhost";
    localLink.href = `http://localhost:9004/#${urlFragment}`;
    localLink.style.display = "inline-block";
    localLink.style.backgroundColor = "rgb(176, 1, 58)";
    localLink.style.color = "#fff";
    localLink.style.border = "none";
    localLink.style.padding = "10px";
    localLink.style.borderRadius = "4px";
    localLink.style.cursor = "pointer";
    localLink.style.fontFamily = "Arial, sans-serif";
    localLink.style.width = "320px";
    localLink.style.textDecoration = "none";
    localLink.style.textAlign = "center";
    localLink.style.marginBottom = "10px";

    agreeBtn.parentNode.insertBefore(localLink, agreeBtn);
  });
}

function showStyledPopup(urlFragment) {
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50px";
  popup.style.right = "50px";
  popup.style.backgroundColor = "#fff";
  popup.style.color = "#fff";
  popup.style.padding = "14px 20px";
  popup.style.borderRadius = "6px";
  popup.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
  popup.style.fontFamily = "Arial, sans-serif";
  popup.style.fontSize = "14px";
  popup.style.zIndex = "9999";
  popup.style.maxWidth = "300px";

  popup.innerHTML = `
    🔐 <strong>Token found</strong><br/>
    <a href="http://localhost:9004/#${urlFragment}" style="
      display: inline-block;
      margin-top: 10px;
      background-color: #fff;
      color: rgb(176, 1, 58);
      padding: 8px 12px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
    ">➡️ Dev localhost</a>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 10000); // Remove after 10 seconds
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.token) {
    showStyledPopup(request.token);
    injectLocalLoginButton(request.token);
  }
});
