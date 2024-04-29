export interface FeedItem {
  id: string;
  title: string;
  link?: string;
  content?: string;
  published?: string;
}

export interface FeedContent {
  title?: string;
  items: FeedItem[];
  image?: {
    url: string;
  };
}
