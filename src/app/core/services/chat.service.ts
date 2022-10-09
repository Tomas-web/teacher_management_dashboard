import {Injectable} from '@angular/core';
import {HttpClientWrapperService} from '../http/http-client-wrapper.service';
import {Observable} from 'rxjs';
import {ConversationModel} from '../models/chat/conversation.model';
import {UserModel} from '../models/user.model';
import {ChatMessagesWithPagesModel} from '../models/chat/chat-messages.model';

@Injectable({providedIn: 'root'})
export class ChatService {

  constructor(private http: HttpClientWrapperService) {
  }

  public getConversations(): Observable<ConversationModel[]> {
    return this.http.get(`/chat/conversations`);
  }

  public getConversation(conversationId: string): Observable<ConversationModel> {
    return this.http.get(`/chat/conversations/${conversationId}`);
  }

  public getChatTeachers(q: string): Observable<UserModel[]> {
    return this.http.get(`/chat/teachers/search?q=${q}`);
  }

  public getConversationMessages(conversationId: string, pageNum: number): Observable<ChatMessagesWithPagesModel> {
    return this.http.get(`/chat/conversations/${conversationId}/messages?page=${pageNum}`);
  }

  public markConversationSeen(conversationId: string): Observable<any> {
    return this.http.post(`/chat/conversations/${conversationId}/mark-seen`, {});
  }
}
