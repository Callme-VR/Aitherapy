import { Inngest, EventPayload } from 'inngest';

declare module '../inngest' {
  export const inngest: Inngest;
  export const functions: any[];
  
  export interface InngestEvent extends EventPayload {
    name: string;
    data: {
      message: string;
      sessionId: string;
      userId: string;
      timestamp?: Date;
    };
  }
}
