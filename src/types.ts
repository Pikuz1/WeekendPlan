// src/types.ts
import type { Timestamp } from "firebase/firestore";


export interface MemberData {
  uid: string;
  name: string;
  dish: string[];       // array of dishes
  note: string;
  isAttending: boolean;
}

export interface EventData {
  id?: string;          // optional, since omitted when creating event
  date: string;         // ISO date string, e.g. "2025-05-26"
  createdBy: string;    // userUid of the event creator
  eventName: string;
  members: {
    [uid: string]: MemberData;
  };
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
}
