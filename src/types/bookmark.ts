export interface Bookmark {
  id: string;
  title: string;
  url: string;
  dateAdded: number | string;
  icon?: string;
  tags: string[];
  category: string;
}
