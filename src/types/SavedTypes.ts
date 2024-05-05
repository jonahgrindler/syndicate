export interface SavedItem {
  title?: string;
  url?: string;
  image?: {
    url: string;
  };
}

export interface SavedItems {
  items?: SavedItem[];
}

export interface SavedProps {
  savedItems: SavedItems;
  savedItem: SavedItem;
}
