import {ChatUserModel} from './chat-user.model';

export interface ConversationModel {
  id: string;
  user: ChatUserModel;
  latestMessage: string;
  seen: boolean;
  sentAt: string;
}
