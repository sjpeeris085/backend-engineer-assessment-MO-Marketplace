export class Notification {
  title: string;
  body: string;
}

export class CreateMessageDto {
  notification: Notification;
  tokens: string[];
}
