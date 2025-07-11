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
    const localBtn = document.createElement("button");
    localBtn.textContent = "Redirect to dev localhost";
    localBtn.style.backgroundColor = "rgb(176, 1, 58)";
    localBtn.style.color = "#fff";
    localBtn.style.border = "none";
    localBtn.style.padding = "10px 20px";
    localBtn.style.borderRadius = "4px";
    localBtn.style.cursor = "pointer";
    localBtn.style.fontFamily = "Arial, sans-serif";
    localBtn.style.width = "340px";
    localBtn.onclick = () => {
      window.location.href = `http://localhost:9004/#${urlFragment}`;
    };

    agreeBtn.parentNode.insertBefore(localBtn, agreeBtn);
    localBtn.style.marginBottom = "10px";
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
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.token) {
    showStyledPopup(request.token);
    injectLocalLoginButton(request.token);
  }
});
