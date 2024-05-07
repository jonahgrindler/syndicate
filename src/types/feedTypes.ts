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
  published: string;
  title: string;
}

export interface FeedContent {
  parsed: FeedContent;
  title?: string;
  items: FeedItem[];
  image?: {
    url: string;
  };
}

// Now your FeedProps type definition using the FeedContent type.
export interface FeedProps {
  feedContent: FeedContent;
  feedItem?: FeedItem;
}
