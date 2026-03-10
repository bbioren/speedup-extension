const slider = document.getElementById('slider');
const speedDisplay = document.getElementById('speedDisplay');
const status = document.getElementById('status');
const presetBtns = document.querySelectorAll('.preset-btn');

function updateUI(speed) {
  speedDisplay.textContent = `${speed.toFixed(2)}x`;
  slider.value = speed;
  presetBtns.forEach(btn => {
    btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
  });
}

function sendSpeed(speed) {
  speed = Math.round(speed * 100) / 100;
  updateUI(speed);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, { action: 'setSpeed', speed }, (resp) => {
      if (chrome.runtime.lastError) {
        status.textContent = 'No media found on this page';
        return;
      }
      if (resp && resp.count > 0) {
        status.textContent = `Applied to ${resp.count} media element${resp.count > 1 ? 's' : ''}`;
      } else {
        status.textContent = 'No media elements found';
      }
    });
  });
}

slider.addEventListener('input', () => {
  sendSpeed(parseFloat(slider.value));
});

presetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sendSpeed(parseFloat(btn.dataset.speed));
  });
});

document.getElementById('increaseBtn').addEventListener('click', () => {
  const current = parseFloat(slider.value);
  sendSpeed(Math.min(current + 0.25, 5));
});

document.getElementById('decreaseBtn').addEventListener('click', () => {
  const current = parseFloat(slider.value);
  sendSpeed(Math.max(current - 0.25, 0.25));
});

document.getElementById('resetBtn').addEventListener('click', () => {
  sendSpeed(1);
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs[0]) return;
  chrome.tabs.sendMessage(tabs[0].id, { action: 'getSpeed' }, (resp) => {
    if (chrome.runtime.lastError || !resp) {
      updateUI(1);
      status.textContent = 'No media found on this page';
      return;
    }
    updateUI(resp.speed);
    if (resp.count > 0) {
      status.textContent = `${resp.count} media element${resp.count > 1 ? 's' : ''} found`;
    } else {
      status.textContent = 'No media elements found';
    }
  });
});
