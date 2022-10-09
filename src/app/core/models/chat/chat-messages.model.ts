import {ChatUserModel} from './chat-user.model';

export interface ChatMessagesWithPagesModel {
  totalPages: number;
  messages: ChatMessageModel[];
}

export interface ChatMessageModel {
  conversationId: string;
  sender: ChatUserModel;
  message: string;
  sentAt: string;
}
