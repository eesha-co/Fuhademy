// Shared modal video call logic for all teacher pages
// Only one Jitsi instance is created and reused in modal or full mode

let jitsiApi = null;
let isModal = false;
const ROOM_NAME = "vpaas-magic-cookie-29d1aa3d1dd04579a28364a8dfdabc89/SampleAppSatisfiedFluidsQueueApproximately";

function createJitsi(parentNode, width = '100%', height = '100%') {
  if (jitsiApi) {
    // Move iframe to new parent
    parentNode.appendChild(jitsiApi.getIFrame());
    jitsiApi.getIFrame().style.width = width;
    jitsiApi.getIFrame().style.height = height;
    return;
  }
  jitsiApi = new JitsiMeetExternalAPI("8x8.vc", {
    roomName: ROOM_NAME,
    parentNode: parentNode,
    width: width,
    height: height
  });
}

function showVideoModal() {
  isModal = true;
  let modal = document.getElementById('video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.innerHTML = `
      <div id="video-modal-content">
        <button id="close-video-modal" title="Close">&times;</button>
        <div id="video-modal-jitsi"></div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('close-video-modal').onclick = hideVideoModal;
  }
  modal.style.display = 'flex';
  createJitsi(document.getElementById('video-modal-jitsi'), '400px', '300px');
}

function hideVideoModal() {
  isModal = false;
  let modal = document.getElementById('video-modal');
  if (modal) modal.style.display = 'none';
}

function showVideoFullScreen() {
  isModal = false;
  let main = document.getElementById('jaas-container');
  if (main) {
    createJitsi(main, '100%', '100vh');
  }
  hideVideoModal();
}

// If user navigates away from teacher-sessions.html, show modal
function handleNavigation() {
  if (window.location.pathname.includes('teacher-sessions.html')) {
    // Full screen mode
    setTimeout(showVideoFullScreen, 100); // Wait for #jaas-container
  } else {
    if (jitsiApi) showVideoModal();
  }
}

window.addEventListener('DOMContentLoaded', function() {
  // If already in a call, show modal or full
  handleNavigation();
});

window.addEventListener('popstate', handleNavigation);
window.addEventListener('hashchange', handleNavigation);

// Expose for sidebar links
window.showVideoModal = showVideoModal;
window.showVideoFullScreen = showVideoFullScreen;

