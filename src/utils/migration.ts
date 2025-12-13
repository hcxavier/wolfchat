import { db } from '../db/dexie';
import type { ChatSession } from '../types/chat';

export const migrateFromLocalStorage = async () => {
  try {
    const migrated = localStorage.getItem('wolfchat_migrated');
    if (migrated) return;

    const settingsKeys = [
      'openRouterApiKey',
      'groqApiKey',
      'geminiApiKey',
      'selectedModel',
      'selectedLanguage',
      'userName',
      'isImmersive'
    ];

    for (const key of settingsKeys) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        await db.settings.put({ key, value });
      }
    }

    const chatHistoryJson = localStorage.getItem('chatHistory');
    if (chatHistoryJson) {
      try {
        const chatHistory: ChatSession[] = JSON.parse(chatHistoryJson);
        const fixedHistory = chatHistory.map(session => ({
          ...session,
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        
        await db.chats.bulkPut(fixedHistory);
      } catch (e) {
        console.error('Failed to migrate chat history', e);
      }
    }

    localStorage.setItem('wolfchat_migrated', 'true');
    console.log('Migration to IndexedDB completed');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
