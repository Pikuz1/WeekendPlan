export interface Member {
    uid: string;
    name: string;
    dish: string;
  }
  
  export interface EventData {
    id?: string; // Firestore doc id
    date: string; // ISO date string (e.g., '2025-06-10')
    createdBy: string; // uid of creator
    members: Record<string, Member>; // key = member uid
  }
  