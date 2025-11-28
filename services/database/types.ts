export interface Activity {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  isManual: boolean;
  tagId: number | null;
  createdAt?: string;
}

export interface Tag {
  id?: number;
  name: string;
  color?: string | null;
  createdAt?: string;
}
