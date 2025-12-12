import Dexie, { type Table } from 'dexie';
import type { ChatSession } from '../types/chat';

export interface Setting {
  key: string;
  value: any;
}

export class WolfChatDatabase extends Dexie {
  settings!: Table<Setting, string>;
  chats!: Table<ChatSession, string>;

  constructor() {
    super('WolfChatDB');
    this.version(1).stores({
      settings: 'key',
      chats: 'id, title, createdAt'
    });
  }
}

export const db = new WolfChatDatabase();
