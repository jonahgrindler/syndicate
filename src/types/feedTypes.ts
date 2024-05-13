// Define the types for authors, categories, enclosures, itunes details, and links based on your needs and available data.
interface Author {
  name: string;
}

interface Category {
  name: string;
}

export interface Enclosure {
  // Define properties based on your feed data if available.
}

export interface Itunes {
  authors: Author[];
  block?: boolean;
  duration?: string;
  explicit?: boolean;
  image?: string;
  isClosedCaptioned?: boolean;
  order?: number;
  subtitle?: string;
  summary?: string;
}

interface Link {
  rel: string;
  url: string;
}

// Define the main type for a Feed Item based on your logged output.
export interface FeedItem {
  authors?: Author[];
  categories?: Category[];
  content?: string;
  description: string;
  enclosures: Enclosure[];
  id: string;
  imageUrl?: string;
  itunes: Itunes;
  links: Link[];
  link: string;
  published: string;
  title: string;
}

// Now your FeedProps type definition using the FeedContent type.
export interface FeedProps {
  feedContent: FeedContent;
  feedItem?: FeedItem;
}

export interface Feed {
  id: string;
  title: string;
  channel_url: string;
  image?: string;
  posts?: Post[];
}

export interface Post {
  id: string;
  title: string;
  link: string;
  description?: string;
  published?: string;
}

export interface FeedContent {
  id: string;
  parsed: FeedContent;
  posts: Post[];
  title?: string;
  items: FeedItem[];
  image?: string;
}

export interface FeedContextType {
  feeds: Feed[];
  feedData: Feed[];
  visibleFeeds: {[key: string]: boolean};
  toggleFeedVisibility: (id: string) => void;
  refreshFeeds: () => Promise<void>;
}
