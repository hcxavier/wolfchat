import Dexie, { type Table } from 'dexie';
import type { ChatSession } from '../types/chat';

export interface Setting {
  key: string;
  value: any;
}

export interface DynamicPrompt {
  id?: number;
  name: string;
  command: string;  
  content: string;
  createdAt: Date;
}

export class WolfChatDatabase extends Dexie {
  settings!: Table<Setting, string>;
  chats!: Table<ChatSession, string>;
  dynamicPrompts!: Table<DynamicPrompt, number>;

  constructor() {
    super('WolfChatDB');
    this.version(1).stores({
      settings: 'key',
      chats: 'id, title, createdAt'
    });
    
    this.version(2).stores({
      dynamicPrompts: '++id, command, name'
    });
  }
}

export const db = new WolfChatDatabase();
