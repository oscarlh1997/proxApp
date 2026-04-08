import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Message } from '../types/models';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getSocket, joinConversation, leaveConversation, sendSocketMessage } from '../api/socket';
import { timeAgo } from '../utils/time';

type R = RouteProp<RootStackParamList, 'Chat'>;

export default function ChatScreen() {
  const route = useRoute<R>();
  const { conversationId } = route.params;
  const myId = useAuthStore((s) => s.userId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const flatRef = useRef<FlatList>(null);

  // Cargar historial inicial via HTTP
  const loadHistory = useCallback(async () => {
    try { setMessages(await api.getMessages(conversationId)); }
    catch {}
  }, [conversationId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // WebSocket: join room + escuchar mensajes nuevos
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      // Fallback a polling si no hay WebSocket
      const t = setInterval(loadHistory, 3000);
      return () => clearInterval(t);
    }

    setWsConnected(socket.connected);
    joinConversation(conversationId);

    const onNewMessage = (msg: any) => {
      if (msg.conversationId !== conversationId) return;
      setMessages((prev) => {
        // Evitar duplicados
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, {
          id: msg.id,
          senderId: msg.senderId,
          senderName: msg.senderName || '',
          senderAvatarSeed: msg.senderAvatarSeed || '',
          text: msg.text,
          createdAt: msg.createdAt,
        }];
      });
    };

    const onConnect = () => setWsConnected(true);
    const onDisconnect = () => setWsConnected(false);

    socket.on('newMessage', onNewMessage);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      leaveConversation(conversationId);
      socket.off('newMessage', onNewMessage);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [conversationId, loadHistory]);

  // Scroll al fondo cuando hay nuevos mensajes
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');

    const socket = getSocket();
    if (socket?.connected) {
      // Enviar por WebSocket (el gateway lo persiste y broadcastea)
      sendSocketMessage(conversationId, trimmed);
    } else {
      // Fallback HTTP
      try {
        await api.sendMessage(conversationId, trimmed);
        loadHistory();
      } catch {}
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Connection indicator */}
      {!wsConnected && (
        <View style={{ backgroundColor: '#FEF3C7', paddingVertical: 4, alignItems: 'center' }}>
          <Text style={{ color: '#92400E', fontSize: 11 }}>Conexión lenta — usando HTTP</Text>
        </View>
      )}

      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        renderItem={({ item, index }) => {
          const mine = item.senderId === myId;
          // Mostrar timestamp si hay >5 min entre mensajes
          const prev = index > 0 ? messages[index - 1] : null;
          const showTime = !prev || (item.createdAt - prev.createdAt > 5 * 60 * 1000);

          return (
            <View>
              {showTime && (
                <Text style={{ color: Colors.subtext, fontSize: 11, textAlign: 'center', marginVertical: 8 }}>
                  {timeAgo(item.createdAt)}
                </Text>
              )}
              <View style={{ alignItems: mine ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
                <View style={{
                  backgroundColor: mine ? Colors.primary : Colors.card,
                  borderRadius: 18,
                  borderBottomRightRadius: mine ? 4 : 18,
                  borderBottomLeftRadius: mine ? 18 : 4,
                  padding: 12,
                  maxWidth: '78%',
                  borderWidth: mine ? 0 : 1,
                  borderColor: Colors.border,
                }}>
                  <Text style={{ color: mine ? 'white' : Colors.text, fontSize: 15, lineHeight: 20 }}>
                    {item.text}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={{
        flexDirection: 'row', padding: 10, paddingBottom: Platform.OS === 'ios' ? 24 : 10,
        backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border,
      }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Escribe un mensaje…"
          placeholderTextColor={Colors.subtext}
          multiline
          style={{
            flex: 1, backgroundColor: Colors.bg, borderRadius: 20,
            paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100,
            color: Colors.text, borderWidth: 1, borderColor: Colors.border,
          }}
        />
        <Pressable
          onPress={send}
          disabled={!text.trim()}
          style={{
            marginLeft: 8, backgroundColor: text.trim() ? Colors.primary : Colors.border,
            borderRadius: 20, width: 44, height: 44, justifyContent: 'center', alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>↑</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
