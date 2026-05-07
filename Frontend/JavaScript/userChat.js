

import chatStore from './chatStore.js';

// -----------------------------------------------------------------
// CONFIG
const advisors = ['Germany', 'France', 'Spain'];
let activeAdvisor = localStorage.getItem('activeAdvisor') || advisors[0];

// -----------------------------------------------------------------
// ELEMENT REFERENCES (populated after DOMContentLoaded)
let chatMessages, messageInput, sendButton;

// -----------------------------------------------------------------
// INITIALISATION
const userName = localStorage.getItem('authName');
console.log('Logged‑in user ➜', userName);

document.addEventListener('DOMContentLoaded', async () => {
  // Cache elements
  chatMessages = document.getElementById('chat-messages');
  messageInput  = document.getElementById('user-message');
  sendButton    = document.getElementById('send-button');

  // Build advisor selector UI
  buildAdvisorSelector();
  highlightActiveButton();

  // Load messages from indexedDB/localStorage via chatStore
  await chatStore.init();
  loadMessages();

  // Listeners
  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

  messageInput.focus();
});

// -----------------------------------------------------------------
// UI HELPERS
function buildAdvisorSelector() {
  let selector = document.querySelector('.advisor-selector');
  if (!selector) {
    selector = document.createElement('div');
    selector.className = 'advisor-selector';
    // Insert selector above chat header (or wherever suits)
    const container = document.querySelector('.chat-container');
    container.prepend(selector);
  }

  selector.innerHTML = '';
  advisors.forEach(advisor => {
    const btn = document.createElement('button');
    btn.dataset.advisor = advisor;
    btn.textContent = advisor;
    btn.addEventListener('click', () => {
      activeAdvisor = advisor;
      localStorage.setItem('activeAdvisor', advisor);
      highlightActiveButton();
      loadMessages();
    });
    selector.appendChild(btn);
  });
}

function highlightActiveButton() {
  document.querySelectorAll('.advisor-selector button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.advisor === activeAdvisor);
  });
  const deskTitle = document.querySelector('.chat-desk-title');
  if (deskTitle) {
    deskTitle.textContent = `${activeAdvisor} Desk`;
  }
}

// -----------------------------------------------------------------
// MESSAGE FLOW
async function loadMessages() {
  const all = await chatStore.getAllMessages();
  console.log('All messages:', all);
  const filtered = all.filter(m => m.advisorRegion === activeAdvisor);
  console.log('Filtered messages for', activeAdvisor, filtered);
  renderMessages(filtered);
}

function renderMessages(messages) {
  const atBottom = isScrolledToBottom();
  chatMessages.innerHTML = '';
  let lastDate = '';

  messages.forEach(msg => {
    const msgDate = getMessageDate(msg.timestamp);
    if (msgDate !== lastDate) {
      chatMessages.appendChild(createDateDivider(msgDate));
      lastDate = msgDate;
    }
    chatMessages.appendChild(createMessageElement(msg));
  });

  if (atBottom) scrollToBottom();
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const newMsg = await chatStore.addMessage({
   sender: 'user',
   text,
   userName: userName,        // ya bas userName,
   advisorRegion: activeAdvisor
 });
  messageInput.value = '';
  messageInput.focus();

  if (newMsg) {
    loadMessages();
    scrollToBottom();
    showTypingIndicator();
    setTimeout(() => simulateAdvisorResponse(), 3000);
  }
}

async function simulateAdvisorResponse() {
  hideTypingIndicator();
  const replies = [
    "Thank you! We'll reply soon.",
    "Aap ka sawal mil gaya hai. Jald jawab dengay.",
    "Merci de votre message – réponse sous peu!"
  ];
  const randomReply = replies[Math.floor(Math.random() * replies.length)];
  const advisorName = `${activeAdvisor} Counselor`;
  await chatStore.addMessage('advisor', randomReply, null, advisorName, activeAdvisor);
  loadMessages();
  scrollToBottom();
}

// -----------------------------------------------------------------
// DOM‑BUILD HELPERS (mostly same as before, small tweaks)
function createMessageElement(m) {
  const div = document.createElement('div');
  div.className = `message ${m.sender === 'user' ? 'sent' : 'received'}`;

  if (m.sender === 'advisor' && m.advisorName) {
    const name = document.createElement('div');
    name.className = 'message-advisor-name';
    name.textContent = m.advisorName;
    name.style.fontWeight = 'bold';
    name.style.color = '#5d1049';
    div.appendChild(name);
  }
  if (m.sender === 'user' && m.userName) {
    const uname = document.createElement('div');
    uname.className = 'message-username';
    uname.textContent = m.userName;
    uname.style.fontWeight = 'bold';
    uname.style.color = '#f4c542';
    div.appendChild(uname);
  }

  const text = document.createElement('div');
  text.className = 'message-text';
  text.textContent = m.text;

  const time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = m.timestamp;

  div.append(text, time);

  if (m.sender === 'user') {
    const status = document.createElement('div');
    status.className = 'message-status';
    status.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-9"/></svg>';
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

function showTypingIndicator() {
  let ind = document.querySelector('.typing-indicator');
  if (!ind) {
    ind = document.createElement('div');
    ind.className = 'typing-indicator';
    ind.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(ind);
  }
  setTimeout(() => ind.classList.add('visible'), 100);
  scrollToBottom();
}
function hideTypingIndicator() {
  const ind = document.querySelector('.typing-indicator');
  if (ind) {
    ind.classList.remove('visible');
    setTimeout(() => ind.remove(), 300);
  }
}

// Same utility helpers you already had -----------------------------
function getMessageDate(ts) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const [h, m] = ts.split(':').map(Number);
  const msgTime = new Date();
  msgTime.setHours(h); msgTime.setMinutes(m);
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

// -----------------------------------------------------------------
// BONUS: Scroll‑to‑bottom button (unchanged)
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

// -----------------------------------------------------------------
// END
