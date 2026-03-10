let overlay = null;
let overlayTimeout = null;

function getAllMedia() {
  return [
    ...document.querySelectorAll('video'),
    ...document.querySelectorAll('audio')
  ];
}

function setSpeed(speed) {
  const media = getAllMedia();
  media.forEach(el => el.playbackRate = speed);
  showOverlay(speed);
  chrome.storage.local.set({ speed });
  return media.length;
}

function showOverlay(speed) {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'media-speed-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      padding: '10px 18px',
      borderRadius: '8px',
      fontSize: '18px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      fontWeight: '600',
      zIndex: '2147483647',
      pointerEvents: 'none',
      transition: 'opacity 0.3s ease',
      opacity: '0'
    });
    document.body.appendChild(overlay);
  }

  overlay.textContent = `${speed.toFixed(2)}x`;
  overlay.style.opacity = '1';

  clearTimeout(overlayTimeout);
  overlayTimeout = setTimeout(() => {
    overlay.style.opacity = '0';
  }, 1200);
}

const observer = new MutationObserver(() => {
  chrome.storage.local.get('speed', ({ speed }) => {
    if (speed && speed !== 1) {
      const media = getAllMedia();
      media.forEach(el => {
        if (el.playbackRate !== speed) {
          el.playbackRate = speed;
        }
      });
    }
  });
});
observer.observe(document, { childList: true, subtree: true });

chrome.storage.local.get('speed', ({ speed }) => {
  if (speed) {
    const media = getAllMedia();
    media.forEach(el => el.playbackRate = speed);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'setSpeed') {
    const count = setSpeed(msg.speed);
    sendResponse({ count, speed: msg.speed });
  } else if (msg.action === 'getSpeed') {
    const media = getAllMedia();
    const speed = media.length > 0 ? media[0].playbackRate : 1;
    sendResponse({ speed, count: media.length });
  }
  return true;
});
