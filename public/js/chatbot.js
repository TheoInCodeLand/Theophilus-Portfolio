document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('chat-widget');
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    // Toggle Chat Visibility
    toggleBtn.addEventListener('click', () => {
        chatWidget.style.display = 'flex';
        toggleBtn.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        chatWidget.style.display = 'none';
        toggleBtn.style.display = 'block';
    });

    // Handle Message Submit
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // 1. Add User Message to UI
        appendMessage(message, 'user-message');
        chatInput.value = '';

        // 2. Show Loading Indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot-message';
        loadingDiv.textContent = 'Typing...';
        chatBody.appendChild(loadingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            // 3. Send to Backend
            const res = await fetch('/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await res.json();

            // 4. Remove Loading & Add Bot Response
            chatBody.removeChild(loadingDiv);
            appendMessage(data.reply, 'bot-message');

        } catch (err) {
            chatBody.removeChild(loadingDiv);
            appendMessage("Error: Could not reach the server.", 'bot-message');
        }
    });

    function appendMessage(text, className) {
        const div = document.createElement('div');
        div.className = `message ${className}`;
        div.textContent = text;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});