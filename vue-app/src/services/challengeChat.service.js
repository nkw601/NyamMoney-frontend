import { Client } from '@stomp/stompjs'
import Cookies from 'js-cookie'
import api from '@/api/axios'

let stompClient = null

export function connectChallengeChat(challengeId, onMessage) {
  const token = Cookies.get('accessToken')

  stompClient = new Client({
    webSocketFactory: () =>
      new WebSocket('ws://localhost:8080/ws-challenge-chat'),

    connectHeaders: {
      Authorization: `Bearer ${token}`
    },

    reconnectDelay: 5000,

    onConnect: () => {
      console.log('[WS] connected')

      stompClient.subscribe(
        `/topic/challenges/${challengeId}`,
        (frame) => {
          onMessage(JSON.parse(frame.body))
        }
      )
    }
  })

  stompClient.activate()
}

export function sendChallengeMessage(message) {
  if (!stompClient || !stompClient.connected) {
    console.warn('[WS] not connected')
    return
  }

  stompClient.publish({
    destination: '/app/challenges/chat',
    body: JSON.stringify(message)
  })
}


export function disconnectChallengeChat() {
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
    console.log('[WS] disconnected')
  }
}

// 이전 채팅 내역 조회 (REST)
export function fetchChallengeChats(challengeId) {
  return api.get(`/v1/challenges/${challengeId}/chats`)
}