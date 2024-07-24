import Entity from './Entity';
import createRequest from './createRequest';

export default class ChatAPI extends Entity {
  constructor() {
    super(createRequest);
    this.webSocket = null;
  }

  joinChat(user) {
    if (user.name) {
      return this.create(user)
        .catch((error) => {
          console.error('Error joining chat:', error);
          throw error;
        });
    } else {
      return Promise.reject(new Error('Username cannot be empty'));
    }
  }

  leaveChat(user) {
    return this.delete(user.id)
      .catch((error) => {
        console.error('Error leaving chat:', error);
        throw error;
      });
  }

  sendMessage(message) {
    return this.create(message)
      .catch((error) => {
        console.error('Error sending message:', error);
        throw error;
      });
  }

  onUserJoined(callback) {
    this.on('user:joined', callback);
  }

  onUserLeft(callback) {
    this.on('user:left', callback);
  }

  onMessageReceived(callback) {
    this.on('message:received', callback);
  }

  on(event, callback) {
    if (!this.webSocket) {
      this.webSocket = new WebSocket('wss://chat-app-n0ye.onrender.com/ws');
      this.webSocket.onopen = () => {
        console.log('WebSocket connection opened');
      };
      this.webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.event) {
          case 'user:joined':
            callback(data.user);
            break;
          case 'user:left':
            callback(data.user);
            break;
          case 'message:received':
            callback(data.message);
            break;
          default:
            console.warn(`Unhandled event: ${data.event}`);
        }
      };
      this.webSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      this.webSocket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    } else {
      console.warn('WebSocket connection already established');
    }
  }
}
