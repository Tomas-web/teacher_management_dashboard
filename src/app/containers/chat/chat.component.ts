import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ProfileService} from '../../core/http/profile.service';
import {ConversationModel} from '../../core/models/chat/conversation.model';
import {ChatService} from '../../core/http/chat.service';
import {UserModel} from '../../core/models/user.model';
import {ChatMessageModel, ChatMessagesWithPagesModel} from '../../core/models/chat/chat-messages.model';
import {Subscription} from 'rxjs';
import {DateWorkerService} from '../../core/services/date-worker.service';
import {CallsService} from '../../core/http/calls.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatMessages') chatMessagesContainer: ElementRef;

  currMessagesPage = 1;
  conversationMessagesResponse: ChatMessagesWithPagesModel;
  selectedConversation: ConversationModel;
  conversations: ConversationModel[];
  newTeachers: UserModel[];
  teacherSearchText = '';
  message: string;

  searchModeShown: boolean;

  private shouldScrollToMessage: boolean;
  private lastMessageElement: any;
  private shouldScrollToBottom: boolean;
  private teachersSearchSub: Subscription;
  private stompClient = null;
  constructor(
    public profileService: ProfileService,
    public dateWorker: DateWorkerService,
    private chatService: ChatService,
    private callsService: CallsService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.profileService.getProfileData().subscribe(() => {
      this.connect();
      this.getConversations();
      this.searchNewTeachers();
    });
  }

  ngOnDestroy(): void {
    this.unsubTeachersSearch();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.shouldScrollToBottom = false;
      this.scrollChatToBottom();
    } else if (this.shouldScrollToMessage) {
      this.shouldScrollToMessage = false;
      this.scrollToMessage(this.lastMessageElement);
      this.lastMessageElement = null;
    }
  }

  startVideoCall(targetId: string): void {
    this.callsService.createCallRoom(targetId).subscribe((res) => {
      this.router.navigate([`users/${targetId}/call`], {
        queryParams: {token: res.token, name: res.channelName, callerId: this.profileService.profile.id}
      });
    });
  }

  joinVideoCall(token: string, channelName: string, callerId: string): void {
    this.router.navigate([`users/${callerId}/call`], {queryParams: {token, name: channelName, callerId}});
  }

  connect(): void {
    const socket = new SockJS(`${environment.base_api_url}/api/ws`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe(`/user/${this.profileService.profile.id}/private`, (payload) => {
        const receivedMessage = JSON.parse(payload.body) as ChatMessageModel;
        const conversation = this.findConversationById(receivedMessage.conversationId);

        if (!!conversation) {
          conversation.seen = conversation.id === this.selectedConversation?.id;
          conversation.sentAt = receivedMessage.sentAt;
          conversation.latestMessage = receivedMessage.message;

          this.conversations.sort((a, b) => new Date(a.sentAt) > new Date(b.sentAt) ? -1 : 1);

          if (conversation.id === this.selectedConversation?.id) {
            this.conversationMessagesResponse.messages.push(receivedMessage);
            this.shouldScrollToBottom = true;
            this.markConversationSeen(conversation);
          }
        } else {
          this.chatService.getConversation(receivedMessage.conversationId).subscribe((convo) => {
            this.conversations = [convo, ...this.conversations];
            if (this.profileService.profile.id === receivedMessage.sender.id) {
              this.onConversationSelected(convo);
            }
          });
        }
      });
    });
  }

  onSend(): void {
    if (!this.selectedConversation || !this.message || this.message.length === 0) {
      return;
    }

    this.sendMessage(this.message);
    this.message = '';
  }

  sendMessage(message: string): void {
    const currDate = new Date();
    const newMessage = {
      senderId: this.profileService.profile.id,
      receiverId: this.selectedConversation.user.id,
      message,
      date: currDate.toISOString()
    };
    this.stompClient.send(
      '/api/private-message',
      {},
      JSON.stringify(newMessage)
    );

    if (this.selectedConversation.id !== '0') {
      this.selectedConversation.latestMessage = message;
      this.selectedConversation.sentAt = currDate.toISOString();
      this.shouldScrollToBottom = true;
    } else {
      this.newTeachers = this.newTeachers.filter(teacher => teacher.id !== this.selectedConversation.user.id);
    }
  }

  onMessagesScrolled(event: any): void {
    if (event.target.scrollTop !== 0 ||
      !this.conversationMessagesResponse ||
      this.conversationMessagesResponse?.totalPages <= this.currMessagesPage) {
      return;
    }

    this.loadNextMessagesPage(this.selectedConversation.id);
  }

  onNewTeacherClicked(teacher: UserModel): void {
    this.selectedConversation = {
      id: '0',
      user: {
        id: teacher.id,
        name: teacher.fullName,
        avatarUrl: teacher.picture
      },
      callRoomDetails: null,
      latestMessage: '',
      seen: true,
      sentAt: ''
    };
    this.searchModeShown = false;
    this.conversationMessagesResponse = null;
  }

  onConversationSelected(conversation: ConversationModel): void {
    this.currMessagesPage = 1;
    this.selectedConversation = conversation;
    if (!conversation.seen) {
      this.markConversationSeen(conversation);
    }

    this.conversationMessagesResponse = null;
    this.getConversationMessages(conversation.id);
  }

  loadNextMessagesPage(conversationId: string): void {
    this.currMessagesPage++;
    this.getConversationMessages(conversationId);
  }

  searchNewTeachers(): void {
    this.unsubTeachersSearch();
    this.newTeachers = null;
    this.teachersSearchSub = this.chatService.getChatTeachers(this.teacherSearchText).subscribe((users) => {
      this.newTeachers = users;
    });
  }

  private markConversationSeen(conversation: ConversationModel): void {
    this.chatService.markConversationSeen(conversation.id).subscribe(() => {
      conversation.seen = true;
    });
  }

  private getConversationMessages(conversationId: string): void {
    this.chatService.getConversationMessages(conversationId, this.currMessagesPage).subscribe((resp) => {
      resp.messages = resp.messages.slice().reverse();
      if (this.currMessagesPage === 1) {
        this.conversationMessagesResponse = resp;
        this.shouldScrollToBottom = true;
      } else {
        this.shouldScrollToMessage = true;
        this.lastMessageElement = this.chatMessagesContainer.nativeElement.firstChild;
        this.conversationMessagesResponse.messages = [...resp.messages, ...this.conversationMessagesResponse.messages];
      }
    });
  }

  private getConversations(): void {
    this.chatService.getConversations().subscribe((conversations) => {
      this.conversations = conversations.sort((a, b) => new Date(a.sentAt) > new Date(b.sentAt) ? -1 : 1);

      if (conversations.length > 0) {
        this.onConversationSelected(conversations[0]);
      }
    });
  }

  private unsubTeachersSearch(): void {
    if (this.teachersSearchSub) {
      this.teachersSearchSub.unsubscribe();
      this.teachersSearchSub = null;
    }
  }

  private scrollToMessage(element: any): void {
    const container = this.chatMessagesContainer.nativeElement;
    container.scrollTop = element.offsetTop;
  }

  private scrollChatToBottom(firstTime?: boolean): void {
    const element = this.chatMessagesContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  private findConversationById(id: string): ConversationModel {
    return this.conversations.find(conversation => conversation.id === id);
  }

  private findConversationByUserId(userId: string): ConversationModel {
    return this.conversations.find(conversation => conversation.user.id === userId);
  }
}
