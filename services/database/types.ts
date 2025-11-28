export interface Activity {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  isManual: boolean;
  tagId: number;
  createdAt: string;
  tagName?: string;
  tagColor?: string;
}

export interface CreateActivityPayload {
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  isManual: boolean;
  tagId: number;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  createdAt: string;
}

export interface CreateTagPayload {
  name: string;
  color: string;
}