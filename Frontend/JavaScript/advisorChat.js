

import chatStore from './chatStore.js';

// ----------------------------------------------------
// Resolve advisor identity from login email
const savedEmail = localStorage.getItem('authEmail');
console.log('Advisor email ➜', savedEmail);

const advisorInfoByEmail = {
  'germany@gmail.com': { name: 'Advisor Germany', region: 'Germany' },
  'france@gmail.com':          { name: 'Advisor France',  region: 'France'  },
  'spain@gmail.com':           { name: 'Advisor Spain',   region: 'Spain'   }
};

const currentAdvisor = advisorInfoByEmail[savedEmail] || { name: 'Advisor', region: 'Unknown' };
let currentUser = null;

// Optional user fetch (if needed for UI)
fetch('/api/users')
  .then(r => r.json())
  .then(users => { if (users.length) currentUser = users[0]; })
  .catch(err => console.error('Error fetching user', err));

// ----------------------------------------------------
// DOMContentLoaded
let chatMessages, messageInput, sendButton;

document.addEventListener('DOMContentLoaded', async () => {
  chatMessages  = document.getElementById('chat-messages');
  messageInput  = document.getElementById('advisor-message');
  sendButton    = document.getElementById('send-button');

  // Advisor header info
  const infoEl = document.getElementById('advisor-info');
  if (infoEl) infoEl.textContent = `${currentAdvisor.name} – ${currentAdvisor.region} Desk`;

  // Init store & load region‑specific thread
  await chatStore.init();
  loadMessages();

  // Listeners
  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
  messageInput.focus();

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const menu      = document.getElementById('menu');
  const navBtns   = document.getElementById('navButtons');
  hamburger?.addEventListener('click', () => {
    menu?.classList.toggle('active');
    navBtns?.classList.toggle('active');
    hamburger.textContent = menu?.classList.contains('active') ? '✕' : '☰';
  });
});

// ----------------------------------------------------
// THREAD HANDLING
function loadMessages() {
  const all = chatStore.getAllMessages();
  console.log('All messages:', all);
  const relevant = all.filter(m => (m.advisorRegion || 'Unknown') === currentAdvisor.region);
  console.log('Relevant messages:', relevant);
  renderMessages(relevant);
}


function renderMessages(msgs) {
   console.log('Rendering messages:', msgs);
  const atBottom = isScrolledToBottom();
  chatMessages.innerHTML = '';
  let lastDate = '';

  msgs.forEach(m => {
    const msgDate = getMessageDate(m.timestamp);
    if (msgDate !== lastDate) {
      chatMessages.appendChild(createDateDivider(msgDate));
      lastDate = msgDate;
    }
    chatMessages.appendChild(createMessageElement(m));
  });
  if (atBottom) scrollToBottom();
}

// ----------------------------------------------------
// SEND FLOW
async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const ok = await chatStore.addMessage({
    sender: 'advisor',
    text: text,
    advisorName: currentAdvisor.name,
    advisorRegion: currentAdvisor.region
  });

  if (!ok) {
    alert('Message send error!');
    return;
  }

  messageInput.value = '';
  messageInput.focus();
  loadMessages();
  scrollToBottom();
}


// ----------------------------------------------------
// ELEMENT BUILDERS
function createMessageElement(m) {
  const div = document.createElement('div');
  div.className = `message ${m.sender === 'advisor' ? 'sent' : 'received'}`;

  if (m.sender === 'user') {
    const uname = document.createElement('div');
    uname.className = 'message-username';
    uname.textContent = m.userName || (currentUser?.name ?? 'User');
    uname.style.fontWeight = 'bold';
    uname.style.color = '#5d1049';
    uname.style.marginBottom = '2px';
    div.appendChild(uname);
  }

  if (m.sender === 'advisor') {
    const aname = document.createElement('div');
    aname.className = 'message-advisor-name';
    aname.textContent = `${m.advisorName ?? 'Advisor'} (${m.advisorRegion})`;
    aname.style.fontWeight = 'bold';
    aname.style.color = '#f4c542';
    aname.style.marginBottom = '2px';
    div.appendChild(aname);
  }

  const text = document.createElement('div');
  text.className = 'message-text';
  text.textContent = m.text;

  const time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = m.timestamp;

  div.append(text, time);

  if (m.sender === 'advisor') {
    const status = document.createElement('div');
    status.className = 'message-status';
    status.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12l5 5 9-9"/>
      </svg>`;
    div.appendChild(status);
  }

  return div;
}


function createDateDivider(txt) {
  const d = document.createElement('div');
  d.className = 'date-divider';
  d.innerHTML = `<span>${txt}</span>`;
  return d;
}

// ----------------------------------------------------
// UTILS (same as original)
function getMessageDate(ts) {
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const [h, m] = ts.split(':').map(Number);
  const msgTime = new Date(); msgTime.setHours(h); msgTime.setMinutes(m);
  const msgDateStr = msgTime.toDateString();
  if (msgDateStr === today.toDateString()) return 'Today';
  if (msgDateStr === yesterday.toDateString()) return 'Yesterday';
  return msgTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function isScrolledToBottom() {
  const tol = 50;
  return (chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight) < tol;
}
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ----------------------------------------------------
// Scroll‑to‑bottom button (unchanged)
const scrollBtn = document.createElement('div');
scrollBtn.className = 'scroll-to-bottom';
scrollBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.chat-container').appendChild(scrollBtn);
  chatMessages.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', !isScrolledToBottom());
  });
  scrollBtn.addEventListener('click', scrollToBottom);
});

// ----------------------------------------------------
// END
