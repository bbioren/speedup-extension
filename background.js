chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;

    chrome.storage.local.get('speed', ({ speed }) => {
      let current = speed || 1;

      if (command === 'speed-up') {
        current = Math.min(current + 0.25, 16);
      } else if (command === 'speed-down') {
        current = Math.max(current - 0.25, 0.25);
      } else if (command === 'speed-reset') {
        current = 1;
      }

      chrome.tabs.sendMessage(tabs[0].id, { action: 'setSpeed', speed: current });
    });
  });
});
