import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connect = (userId, onNotification) => {
  if (stompClient?.connected) return;

  stompClient = new Client({
    brokerURL: 'ws://localhost:8080/socket',
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient.subscribe(`/topic/user/${userId}`, (message) => {
        onNotification(JSON.parse(message.body));
      });
    },
    onStompError: (error) => {
      console.error('STOMP error:', error);
    }
  });

  stompClient.activate();
};

export const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};