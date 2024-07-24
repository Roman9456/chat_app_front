import ChatAPI from '../api/ChatAPI';

export default class Chat {
    constructor(container, chatAPI, username) {
      this.container = container;
      this.api = chatAPI;
      this.websocket = null;
      this.messages = [];
      this.currentUser = { name: username };
    }
  
    init() {
      this.bindToDOM();
      this.registerEvents();
      this.subscribeOnEvents();
      this.api.joinChat(this.currentUser);
    }

  bindToDOM() {
    console.log('Binding to DOM');
    if (this.container) {
      console.log('Container element found:', this.container);
      this.container.innerHTML = `
        <div class="chat-container">
          <div class="chat-header">
            <h2>Chat</h2>
          </div>
          <div class="chat-messages"></div>
          <div class="chat-input">
            <input type="text" placeholder="Type your message..." class="chat-input-field">
            <button class="chat-send-button">Send</button>
          </div>
        </div>
      `;
      this.chatMessagesContainer = this.container.querySelector(".chat-messages");
      this.chatInputField = this.container.querySelector(".chat-input-field");
      this.chatSendButton = this.container.querySelector(".chat-send-button");
    } else {
      console.error('Container element not found');
    }
  }

  registerEvents() {
    this.chatSendButton.addEventListener("click", this.sendMessage.bind(this));
    this.chatInputField.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.sendMessage();
      }
    });
  }

  subscribeOnEvents() {
    this.api.onUserJoined((user) => {
      this.renderMessage({
        type: "join",
        user: user,
      });
    });

    this.api.onUserLeft((user) => {
      this.renderMessage({
        type: "leave",
        user: user,
      });
    });

    this.api.onMessageReceived((message) => {
      this.renderMessage(message);
    });
  }

  onEnterChatHandler(username) {
    this.currentUser = { name: username };
    this.api.joinChat(this.currentUser);
  }

  sendMessage() {
    const message = this.chatInputField.value.trim();
    if (message) {
      this.api.sendMessage({
        author: this.currentUser,
        text: message,
      });
      this.chatInputField.value = "";
    }
  }

  renderMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message");

    if (message.type === "join") {
      messageElement.textContent = `${message.user.name} joined the chat.`;
    } else if (message.type === "leave") {
      messageElement.textContent = `${message.user.name} left the chat.`;
    } else {
      messageElement.innerHTML = `
        <span class="chat-message-author">${message.author.name}:</span>
        <span class="chat-message-text">${message.text}</span>
      `;
    }

    this.chatMessagesContainer.appendChild(messageElement);
    this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
  }
}
