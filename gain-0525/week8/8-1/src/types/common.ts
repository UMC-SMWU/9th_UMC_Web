import { PAGINATION_ORDER } from '../enums/common'

export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message:string;
    data: T;
}

export type CursorBasedResponse<T> = CommonResponse<{
  data: T,
  nextCursor: number | null;
  hasNext: boolean;
}>;

export type PaginationDto = {
    cursor?:number;
    limit?: number;
    search?: string;
    order?: PAGINATION_ORDER;
    searchType?: "title" | "tag";
}

export type Comment = {
  id: number;
  content: string;
  createdAt: string; // <- string으로
  updatedAt: string; // <- string으로
  authorId: number;
  lpId: number;
  author?: {
    id: number;
    name: string;
    email: string;
    bio?: string | null;
    avatar?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};


// 댓글 목록의 'data' 페이로드 타입
export type CommentListData = {
  data: Comment[]; // 댓글 배열
};

export type ResponseCommentListDto = CursorBasedResponse<CommentListData>;