// content.js
document.addEventListener('click', (event) => {
    const copyButton = event.target.closest('button[data-state="closed"]');
    if (copyButton) {
      chrome.runtime.sendMessage({ action: 'showPopup' });
    }
  });
  