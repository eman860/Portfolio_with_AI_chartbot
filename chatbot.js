(function () {
    // Configuration
    const config = {
        primaryColor: '#06b6d4',
        secondaryColor: '#0a0a0f',
        textColor: '#ffffff',
        fontFamily: "'Space Grotesk', sans-serif",
        botName: 'AI Assistant',
        welcomeMessage: "Hi! I'm Imman's AI assistant. Ask me about his projects, skills, or experience.",
    };

    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-chatbot-widget {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 9999;
            font-family: ${config.fontFamily};
        }
        
        /* Toggle Button */
        #chatbot-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${config.primaryColor}, #a855f7);
            border: none;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        #chatbot-toggle:hover {
            transform: scale(1.1);
        }
        
        #chatbot-toggle svg {
            width: 30px;
            height: 30px;
            fill: white;
        }

        /* Chat Window */
        #chatbot-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: rgba(20, 20, 35, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            transform-origin: bottom right;
            transform: scale(0);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
        }

        #chatbot-window.active {
            transform: scale(1);
            opacity: 1;
            pointer-events: all;
        }

        /* Header */
        .chat-header {
            padding: 1.5rem;
            background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.1));
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .bot-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${config.primaryColor}, #a855f7);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }

        .chat-header-info h4 {
            margin: 0;
            color: #fff;
            font-size: 1rem;
        }

        .status-badge {
            font-size: 0.75rem;
            color: #22c55e;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .status-dot {
            width: 6px;
            height: 6px;
            background: #22c55e;
            border-radius: 50%;
        }

        /* Messages */
        .chat-messages {
            flex: 1;
            padding: 1.5rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .message {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 12px;
            font-size: 0.9rem;
            line-height: 1.5;
            animation: fadeIn 0.3s ease;
        }

        .message.bot {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.9);
            align-self: flex-start;
            border-bottom-left-radius: 2px;
        }

        .message.user {
            background: linear-gradient(135deg, ${config.primaryColor}, #a855f7);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Input Area */
        .chat-input-area {
            padding: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(10, 10, 15, 0.8);
            display: flex;
            gap: 0.5rem;
        }

        #chat-input {
            flex: 1;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 0.75rem 1rem;
            color: white;
            font-family: inherit;
            outline: none;
            transition: border-color 0.3s;
        }

        #chat-input:focus {
            border-color: ${config.primaryColor};
        }

        #chat-send {
            background: none;
            border: none;
            color: ${config.primaryColor};
            cursor: pointer;
            padding: 0.5rem;
            transition: transform 0.2s;
        }

        #chat-send:hover {
            transform: scale(1.1);
        }

        /* Typing Indicator */
        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border-bottom-left-radius: 2px;
            align-self: flex-start;
            margin-bottom: 10px;
            display: none;
        }

        .typing-dot {
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Create Widget DOM
    const widget = document.createElement('div');
    widget.id = 'ai-chatbot-widget';
    widget.innerHTML = `
        <div id="chatbot-window">
            <div class="chat-header">
                <div class="bot-avatar">🤖</div>
                <div class="chat-header-info">
                    <h4>${config.botName}</h4>
                    <div class="status-badge"><div class="status-dot"></div>Online</div>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot">${config.welcomeMessage}</div>
                <div class="typing-indicator" id="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Type a message...">
                <button id="chat-send">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
        <button id="chatbot-toggle">
            <svg id="icon-open" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </button>
    `;
    document.body.appendChild(widget);

    // Logic
    const toggleBtn = document.getElementById('chatbot-toggle');
    const windowEl = document.getElementById('chatbot-window');
    const inputEl = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messagesEl = document.getElementById('chat-messages');
    const typingEl = document.getElementById('typing-indicator');

    let isOpen = false;

    // Toggle Window
    toggleBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        windowEl.classList.toggle('active', isOpen);
        if (isOpen) inputEl.focus();
    });

    // Send Message
    function sendMessage() {
        const text = inputEl.value.trim();
        if (!text) return;

        // User Message
        appendMessage(text, 'user');
        inputEl.value = '';

        // Bot Response Simulation
        showTyping();

        // Simple Intent Matching (Mock AI)
        setTimeout(() => {
            const response = getMockResponse(text);
            hideTyping();
            appendMessage(response, 'bot');
        }, 1500);
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        messagesEl.insertBefore(msgDiv, typingEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        typingEl.style.display = 'flex';
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
        typingEl.style.display = 'none';
    }

    function getMockResponse(input) {
        const lower = input.toLowerCase();
        if (lower.includes('project') || lower.includes('work')) return "I've built several full-stack applications. You can view them in the 'Projects' section above!";
        if (lower.includes('skill') || lower.includes('stack')) return "I'm proficient in React, Node.js, Python, and cloud technologies. Check out the Skills section for a full breakdown.";
        if (lower.includes('contact') || lower.includes('email')) return "You can reach me via the contact form at the bottom of the page, or at imman@example.com.";
        if (lower.includes('hello') || lower.includes('hi')) return "Hello! How can I help you navigate the portfolio?";
        return "I'm just a demo bot, but I think Imman would be happy to discuss that with you directly!";
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

})(); // Self-executing
