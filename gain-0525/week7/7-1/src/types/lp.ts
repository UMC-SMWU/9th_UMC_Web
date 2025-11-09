import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
};

export type Likes = {
    id: number,
    userId: number,
    lpId: number,
}

export type Author = {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  pulblished: boolean;
  authorId: number;
  createdAt: Date;
  updateAt: Date;
  tags: Tag[];
  likes: Likes[];
  author: Author;
}

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;
export type ResponseLpDto = CommonResponse<Lp>;
