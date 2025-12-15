export enum PostType {
  MAP = 'MAP',
  THOUGHT = 'THOUGHT'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  type: PostType;
  imageUrl: string;
  location?: Coordinates;
  locationName?: string;
}

export interface UserState {
  viewMode: 'home' | 'map' | 'thoughts';
  selectedPost: BlogPost | null;
}
