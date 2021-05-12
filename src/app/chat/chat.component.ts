import { Component, OnInit, OnDestroy } from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { ChatMessageDto } from '../models/chatMessageDto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  message : ChatMessageDto = new ChatMessageDto("", "");
  subject  = webSocket('ws://localhost:8080/');
  chatArray : Array<string> =[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  ngOnInit(): void {
    this.subject.pipe(takeUntil(this.destroy$)).subscribe((x:ChatMessageDto) => {
      this.chatArray.push(`${x.user}:   ${x.message}`);
    });

  }

  sendToServer(){
    this.subject.next(this.message);
  }

  ngOnDestroy():void{
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
