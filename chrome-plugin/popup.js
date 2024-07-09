document.getElementById('confirm').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractData
    }, async (results) => {
      if (results && results[0] && results[0].result) {
        const data = results[0].result;
        data.game_id = generateUUID();
        data.create_time = new Date().toISOString();
        const clipboardText = await navigator.clipboard.readText();
        data.game_code_content = clipboardText;
        data.code_type = detectCodeType(clipboardText);
        data.game_status = 'unknown'; // 默认值为 unknown，之后可以根据需要进行修改
        await sendDataToServer(data);  // 发送数据到服务器
      } else {
        showError('无法提取数据内容');
      }
    });
  } catch (error) {
    showError(`错误: ${error.message}`);
  }
});

document.getElementById('cancel').addEventListener('click', () => {
  window.close();
});

function extractData() {
  const userIdElement = document.querySelector('div.min-w-0.flex-1.truncate.text-sm');
  const gameTitleElement = document.querySelector('h3.text-text-100.font-tiempos.truncate.text-sm');
  const copyButton = document.querySelector('button[data-state="closed"]');

  if (copyButton) {
    copyButton.click();
  }

  return {
    user_id: userIdElement ? userIdElement.textContent : null,
    game_title: gameTitleElement ? gameTitleElement.textContent : null,
  };
}

async function sendDataToServer(data) {
  try {
    const response = await fetch('http://localhost:5000/store', {  // 指定 Flask 服务器的 URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      const result = await response.json();
      showStatus('数据成功上传到服务器');
    } else {
      showError('数据上传失败');
    }
  } catch (error) {
    showError(`错误: ${error.message}`);
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function detectCodeType(codeContent) {
  if (codeContent.includes('<html')) {
    return 'html';
  } else if (codeContent.includes('import React')) {
    return 'tsx';
  } else {
    return 'unknown';
  }
}

function showStatus(message) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.classList.remove('hidden');
}

function showError(message) {
  const errorElement = document.getElementById('error');
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}
