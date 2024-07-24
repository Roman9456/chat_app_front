import './css/style.css';

import ChatAPI from './api/ChatAPI.js';
import Chat from './js/Chat';

document.addEventListener('DOMContentLoaded', () => {
  const loginInput = document.querySelector('.login');
  const sendButton = document.querySelector('.send');

  sendButton.addEventListener('click', () => {
    const username = loginInput.value.trim();
    if (username) {
      const root = document.querySelector('.container');
      const chatAPI = new ChatAPI();
      const chat = new Chat(root, chatAPI, username);
      chat.init();
    }
  });
});
