export interface Language {
  code: string;
  name: string;
}

export interface Translation {
  id: string;
  artistName: string;
  songName: string;
  originalLanguage: string;
  targetLanguage: string;
  originalLyrics: string[];
  translatedLyrics: string[];
  author: {
    id: string,
    name: string,
    email: string,
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  translations: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTranslationData {
  artistName: string;
  songName: string;
  originalLanguage: string;
  targetLanguage: string;
  originalLyrics: string[];
  fillWithOriginal: boolean;
}

export interface UpdateTranslationData {
  translatedLyrics: string[];
}
