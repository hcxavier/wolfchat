import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/dexie';
import type { ChatSession, Message } from '../types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const chatHistory = useLiveQuery(
    () => db.chats.orderBy('createdAt').reverse().toArray()
  ) || [];

  const createNewChat = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
  }, []);

  const selectChat = useCallback((chat: ChatSession) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
  }, []);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
    };

    setMessages((previousState) => [...previousState, newMessage]);
    
    return newMessage;
  }, []);

  const updateChatHistory = useCallback(async (updatedMessages: Message[], title?: string) => {
    let activeChatId = currentChatId;
    
    if (!activeChatId) {
      activeChatId = uuidv4();
      setCurrentChatId(activeChatId);
      const newSession: ChatSession = {
        id: activeChatId,
        title: title || 'New Chat',
        messages: updatedMessages,
        createdAt: Date.now()
      };
      await db.chats.put(newSession);
      return activeChatId;
    } 
    
    const currentSession = await db.chats.get(activeChatId);
    if (currentSession) {
        await db.chats.put({ 
            ...currentSession, 
            messages: updatedMessages,
            title: title || currentSession.title 
        });
    }
    
    return activeChatId;
  }, [currentChatId]);

  const updateChatMessages = useCallback(async (chatId: string, updatedMessages: Message[]) => {
      const session = await db.chats.get(chatId);
      if (session) {
          await db.chats.put({ ...session, messages: updatedMessages });
      }
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    db.chats.delete(chatId);
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  }, [currentChatId]);

  const renameChat = useCallback((chatId: string, newTitle: string) => {
    db.chats.update(chatId, { title: newTitle });
  }, []);

  const clearAllChats = useCallback(() => {
    db.chats.clear();
    setCurrentChatId(null);
    setMessages([]);
  }, []);

  return {
    messages,
    setMessages,
    chatHistory,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    selectChat,
    addMessage,
    updateChatHistory,
    updateChatMessages,
    deleteChat,
    renameChat,
    clearAllChats
  };
};
