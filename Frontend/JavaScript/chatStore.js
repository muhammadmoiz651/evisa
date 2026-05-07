

export class ChatStore {
  constructor () {
    this.apiUrl  = 'http://localhost:3000/chat';
    this.messages = [];
  }

  // --------------------------------------------------
  // INITIALISE
  async init () {
    try {
      const res  = await fetch(this.apiUrl);
      const data = await res.json();

      const initialMessages = [{
        id:        'init1',
        sender:    'advisor',
        text:      'If you have any concerns or questions about admissions or scholarships for universities in Germany, France, or Spain, feel free to ask here.',
        timestamp: this.getTimestamp(),
        advisorName:   'System',
        advisorRegion: 'General'
      }];

      this.messages = (data && data.length) ? data : initialMessages;
    } catch (err) {
      console.error('Error fetching messages:', err);
      this.messages = [{
        id: 'fallback1',
        sender: 'advisor',
        text:   'If you have any concerns or questions about admissions or scholarships for universities in Germany, France, or Spain, feel free to ask here.',
        timestamp: this.getTimestamp(),
        advisorName:   'System',
        advisorRegion: 'General'
      }];
    }
  }

  // --------------------------------------------------
  // ACCESSOR
  getAllMessages () {
    return this.messages;
  }

  // --------------------------------------------------
  // ADD MESSAGE (works for both user & advisor)
async addMessage({ sender, text, userName = null, advisorName = null, advisorRegion = 'General' }) {
  const newMsg = {
    id: this.generateId(),
    sender,
    text,
    timestamp: this.getTimestamp(),
    userName: sender === 'user' ? userName : null,
    advisorName: sender === 'advisor' ? advisorName : null,
    advisorRegion: advisorRegion
  };

  try {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMsg)
    });

    if (res.ok) {
      this.messages.push(newMsg);
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}


  // --------------------------------------------------
  // UTILS
  generateId () {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  getTimestamp (t = Date.now()) {
    const d = new Date(t);
    return d.toTimeString().slice(0, 5); // HH:MM
  }
}

export default new ChatStore();
