const chatToggle = document.getElementById('chat-toggle');
const chatContainer = document.getElementById('chatbot-container');
const closeChat = document.getElementById('close-chat');

// Chat icon click → show chatbot
chatToggle.addEventListener('click', () => {
  chatContainer.classList.remove('hidden');
});

// Close button click → hide chatbot
closeChat.addEventListener('click', () => {
  chatContainer.classList.add('hidden');
});

    

class Chatbot {
  constructor() {
    this.apiKey = 'AQ.Ab8RN6J6OGDd8JxwUQiybiO1-lf2m6_U_4lganiLzOEPc-hD0A';
    this.model = 'gemini-2.5-flash';
    this.isWaitingForResponse = false;
    this.chatHistory = [];
    
    // Updated system prompt for better formatting
    this.systemPrompt = `
You are a helpful assistant focused on providing well-formatted information about university admissions, scholarships, accommodations, and visa guidance for France, Spain, and Germany.

CRITICAL FORMATTING RULES:
1. Give only the exact answer to the question asked – short, direct, and to the point, like a chatbot. No introductions
2. Use <h3> tags for ALL section headings
3. Make ALL headings bold using <strong> tags inside h3
4. Use bullet points for ALL lists
5. Format key information in bold using <strong> tags
6. Keep responses concise and well-structured
7. ALWAYS use bullet points with <ul> and <li> tags
8. NEVER use numbered lists
9. Add spacing between sections

SPECIAL INSTRUCTIONS:
1. For accommodation questions:
   - Provide country-specific details for France, Spain, and Germany
   - Include approximate costs and accommodation types
   - Mention any university housing options

2. For visa guidance:
   - Provide country-specific requirements
   - List key documents needed
   - Mention processing times and important deadlines

3. For academic eligibility:
   - When user shares IELTS/matric/FSc/Degree scores:
     a) First check eligibility for these 6 universities:
        - Hochschule Fresenius – Munich Campus
        - Macromedia University of Applied Sciences – Munich
        - Munich Business School (MBS)
        - Hochschule für Fernsehen und Film München
        - Academy of Fine Arts, Munich
        - Katholische Stiftungshochschule München KSH Munich
        - Munich University of Applied Sciences (HM)
        - Universidad Politécnica de Madrid
        - University of Mannheim (Universität Mannheim)
        - Université Paris Cité
        - University of Heidelberg
        - Humboldt University of Berlin
        - Polytechnic University of Catalonia (UPC)
        - Autonomous University of Madrid (UAM)
        - Université Grenoble Alpes
        - Paris-Saclay University
        - Pompeu Fabra University (UPF)
        - University of Barcelona (UB)
        - Ludwig Maximilian University of Munich (LMU)
        - Technical University of Munich (TUM)
        - Paris 1 Pantheon-Sorbonne University
        - École Normale Supérieure (ENS Paris)

     b) Provide short eligibility assessment for these
     c) Then mention other suitable options if available

Example format for accommodation:
<h3><strong>Accommodation in France</strong></h3>
<ul>
  <li><strong>Types:</strong> Student residences, private apartments, homestays</li>
  <li><strong>Average cost:</strong> €400-€800/month</li>
  <li><strong>University housing:</strong> Limited, apply early through CROUS</li>
</ul>

Example format for visa:
<h3><strong>Germany Student Visa</strong></h3>
<ul>
  <li><strong>Requirements:</strong> Admission letter, financial proof (€11,208/year), health insurance</li>
  <li><strong>Processing time:</strong> 4-8 weeks</li>
  <li><strong>Application:</strong> Through German embassy/consulate</li>
</ul>

Example format for eligibility:
<h3><strong>Eligibility Assessment</strong></h3>
<ul>
  <li><strong>Paris-Saclay University:</strong> Eligible (Meets 3.5+ CGPA requirement)</li>
  <li><strong>TUM:</strong> Not eligible (Needs IELTS 6.5, you have 6.0)</li>
  <li><strong>Other options:</strong> University of Strasbourg, Autonomous University of Madrid</li>
</ul>
`;
    
    this.initEventListeners();
  }
  
  initEventListeners() {
    const sendButton = document.getElementById('send-message');
    const userInput = document.getElementById('user-input');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const chatContainer = document.getElementById('chatbot-container');
    
    sendButton.addEventListener('click', () => this.handleUserMessage());
    
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleUserMessage();
      }
    });
    
    chatToggle.addEventListener('click', () => {
      chatContainer.classList.remove('hidden');
      document.body.classList.add('overlay-active');
      const chatMessages = document.getElementById('chat-messages');
      chatMessages.scrollTop = chatMessages.scrollHeight;
      userInput.focus();
    });
    
    closeChat.addEventListener('click', () => {
      chatContainer.classList.add('hidden');
      document.body.classList.remove('overlay-active');
    });
  }
  
  handleUserMessage() {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();
    
    if (userMessage === '' || this.isWaitingForResponse) return;
    
    this.addMessageToChat('user', userMessage);
    userInput.value = '';
    this.chatHistory.push({ role: 'user', content: userMessage });
    this.showTypingIndicator();
    this.sendToGeminiAPI(userMessage);
  }
  
  addMessageToChat(sender, content) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (sender === 'user') {
      messageContent.textContent = content;
    } else {
      messageContent.innerHTML = content;
    }
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      typingDiv.appendChild(dot);
    }
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    this.isWaitingForResponse = true;
  }
  
  removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
    this.isWaitingForResponse = false;
  }
  
  async sendToGeminiAPI(userMessage) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      let formattedHistory = [];
      
      if (this.chatHistory.length <= 1) {
        formattedHistory.push({
          role: 'user',
          parts: [{ text: this.systemPrompt + '\n\nUser query: ' + userMessage }]
        });
      } else {
        for (let i = 0; i < this.chatHistory.length; i++) {
          const msg = this.chatHistory[i];
          let role = msg.role;
          
          if (role === 'assistant') {
            role = 'model';
          }
          
          if (i === 0 && role === 'user') {
            formattedHistory.push({
              role: role,
              parts: [{ text: this.systemPrompt + '\n\nUser query: ' + msg.content }]
            });
          } else {
            formattedHistory.push({
              role: role,
              parts: [{ text: msg.content }]
            });
          }
        }
      }
      
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      
      const payload = {
        contents: formattedHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.removeTypingIndicator();
      
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        
        const botResponse = data.candidates[0].content.parts[0].text;
        this.addMessageToChat('bot', botResponse);
        this.chatHistory.push({ role: 'assistant', content: botResponse });
      } else {
        this.addMessageToChat('bot', '<p>I apologize, but I couldn\'t generate a response. Please try again.</p>');
      }
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      this.removeTypingIndicator();
      this.addMessageToChat('bot', '<p>I apologize, but there was an error processing your request. Please try again later.</p>');
    }
  }
}