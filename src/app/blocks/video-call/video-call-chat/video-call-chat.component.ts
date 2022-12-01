import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProfileService} from '../../../core/http/profile.service';
import {environment} from '../../../../environments/environment';
import {ChatMessageModel, ChatMessagesWithPagesModel} from '../../../core/models/chat/chat-messages.model';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ChatService} from '../../../core/http/chat.service';
import {ConversationModel} from '../../../core/models/chat/conversation.model';
import {DateWorkerService} from '../../../core/services/date-worker.service';

@Component({
  selector: 'app-video-call-chat',
  templateUrl: './video-call-chat.component.html',
  styleUrls: ['./video-call-chat.component.scss']
})
export class VideoCallChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') chatMessagesContainer: ElementRef;

  @Input() userId: string;

  @Output() closeChat: EventEmitter<any> = new EventEmitter<any>();

  currMessagesPage = 1;
  conversationMessagesResponse: ChatMessagesWithPagesModel;
  message: string;

  private shouldScrollToBottom: boolean;
  private shouldScrollToMessage: boolean;
  private lastMessageElement: any;
  private conversation: ConversationModel;
  private stompClient = null;
  constructor(public profileService: ProfileService,
              public dateWorker: DateWorkerService,
              private chatService: ChatService) { }

  ngOnInit(): void {
    this.profileService.getProfileData().subscribe(() => {
      this.chatService.findConversationForUser(this.userId).subscribe((res) => {
        this.conversation = res;
        this.getConversationMessages(this.conversation.id);
        this.connectToSocket();
      });
    });
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

  onCloseChat(): void {
    this.closeChat.emit();
  }

  onMessagesScrolled(event: any): void {
    if (event.target.scrollTop !== 0 ||
      !this.conversationMessagesResponse ||
      this.conversationMessagesResponse?.totalPages <= this.currMessagesPage) {
      return;
    }

    this.loadNextMessagesPage(this.conversation.id);
  }

  onSend(): void {
    if (!this.conversation || !this.message || this.message.length === 0) {
      return;
    }

    this.sendMessage(this.message);
    this.message = '';
  }

  sendMessage(message: string): void {
    const currDate = new Date();
    const newMessage = {
      senderId: this.profileService.profile.id,
      receiverId: this.conversation.user.id,
      message,
      date: currDate.toISOString()
    };
    this.stompClient.send(
      '/api/private-message',
      {},
      JSON.stringify(newMessage)
    );

    this.conversation.latestMessage = message;
    this.conversation.sentAt = currDate.toISOString();
    this.shouldScrollToBottom = true;
  }

  private loadNextMessagesPage(conversationId: string): void {
    this.currMessagesPage++;
    this.getConversationMessages(conversationId);
  }

  private connectToSocket(): void {
    const socket = new SockJS(`${environment.base_api_url}/api/ws`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe(`/user/${this.profileService.profile.id}/private`, (payload) => {
        const receivedMessage = JSON.parse(payload.body) as ChatMessageModel;

        if (receivedMessage.conversationId !== this.conversation.id) {
          return;
        }

        this.conversationMessagesResponse.messages.push(receivedMessage);
        this.shouldScrollToBottom = true;
        // this.markConversationSeen(conversation);
      });
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

  private scrollToMessage(element: any): void {
    const container = this.chatMessagesContainer.nativeElement;
    container.scrollTop = element.offsetTop;
  }

  private scrollChatToBottom(firstTime?: boolean): void {
    const element = this.chatMessagesContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}
