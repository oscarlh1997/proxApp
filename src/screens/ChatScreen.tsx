import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api, errorMessage } from '../api/client';
import { getSocket } from '../api/socket';
import { useAuth } from '../store';
import { C, T } from '../theme';
import { Message } from '../types';
import { ScreenProps } from '../navigation/types';
import { timeAgo } from '../utils/format';
import { ErrorBanner } from '../components/States';

type Ack = { ok: boolean; error?: string; message?: Message };

export default function ChatScreen({ route }: ScreenProps<'Chat'>) {
  const { conversationId } = route.params;
  const myId = useAuth((s) => s.userId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList<Message>>(null);

  const add = useCallback((m: Message) => {
    setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
  }, []);

  const loadHistory = useCallback(async () => {
    try { setMessages(await api.getMessages(conversationId)); } catch (e) { setError(errorMessage(e)); }
  }, [conversationId]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  // Tiempo real por WebSocket; si no hay conexión, se consulta cada 4 s
  useEffect(() => {
    const socket = getSocket();
    const join = () => socket?.emit('join', { conversationId }, (ack: Ack) => setLive(!!ack?.ok));
    const onMessage = (m: Message) => m.conversationId === conversationId && add(m);
    const onDisconnect = () => setLive(false);

    socket?.on('connect', join);
    socket?.on('disconnect', onDisconnect);
    socket?.on('newMessage', onMessage);
    if (socket?.connected) join();

    const poll = setInterval(() => { if (!getSocket()?.connected) loadHistory(); }, 4000);
    return () => {
      clearInterval(poll);
      socket?.emit('leave', { conversationId });
      socket?.off('connect', join);
      socket?.off('disconnect', onDisconnect);
      socket?.off('newMessage', onMessage);
    };
  }, [conversationId, add, loadHistory]);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setText('');
    setError(null);
    const socket = getSocket();
    if (socket?.connected) {
      socket.timeout(5000).emit('message', { conversationId, text: body }, (err: Error | null, ack: Ack) => {
        if (!err && ack?.ok && ack.message) return add(ack.message);
        sendHttp(body); // el socket no confirmó: se reintenta por HTTP
      });
    } else {
      sendHttp(body);
    }
  };

  const sendHttp = async (body: string) => {
    try { add(await api.sendMessage(conversationId, body)); } catch (e) { setError(errorMessage(e)); setText(body); }
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: C.paper }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        {!live && (
          <Text style={[T.meta, { textAlign: 'center', paddingVertical: 4, backgroundColor: C.signalSoft }]}>
            Sin tiempo real: los mensajes nuevos pueden tardar unos segundos
          </Text>
        )}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, gap: 4 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListHeaderComponent={<ErrorBanner message={error} />}
          renderItem={({ item, index }) => {
            const mine = item.senderId === myId;
            const prev = messages[index - 1];
            const showTime = !prev || item.createdAt - prev.createdAt > 10 * 60 * 1000;
            return (
              <View>
                {showTime && <Text style={[T.meta, { textAlign: 'center', marginVertical: 8, fontSize: 12 }]}>{timeAgo(item.createdAt)}</Text>}
                <View style={{
                  alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '80%',
                  backgroundColor: mine ? C.signal : C.surface, paddingHorizontal: 14, paddingVertical: 9,
                  borderRadius: 20, borderBottomRightRadius: mine ? 6 : 20, borderBottomLeftRadius: mine ? 20 : 6,
                }}>
                  <Text style={{ color: mine ? '#fff' : C.ink, fontSize: 16, lineHeight: 21 }}>{item.text}</Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={[T.meta, { textAlign: 'center', marginTop: 40 }]}>Empieza la conversación.</Text>}
        />
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Mensaje"
            placeholderTextColor={C.haze}
            multiline
            maxLength={2000}
            accessibilityLabel="Mensaje"
            style={{ flex: 1, backgroundColor: C.paper, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, color: C.ink, maxHeight: 120 }}
          />
          <Pressable onPress={send} disabled={!text.trim()} accessibilityRole="button" accessibilityLabel="Enviar"
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: text.trim() ? C.signal : C.line, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
