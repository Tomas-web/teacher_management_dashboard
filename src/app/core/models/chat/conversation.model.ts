import {ChatUserModel} from './chat-user.model';

export interface ConversationModel {
  id: string;
  user: ChatUserModel;
  callRoomDetails: {token: string, channelName: string, callerId: string};
  latestMessage: string;
  seen: boolean;
  sentAt: string;
}
