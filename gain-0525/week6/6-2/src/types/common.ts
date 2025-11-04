import { PAGINATION_ORDER } from '../enums/common'

export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message:string;
    data: T;
}

export type CursorBasedResponse<T>={
    status:boolean;
    statusCode: number;
    message:string;
    data: T;
    nextCursor:number;
    hasNext: boolean;
}

export type PaginationDto = {
    cursor?:number;
    limit?: number;
    search?: string;
    order?: PAGINATION_ORDER;
}

export type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  lpId: number;
  author?: {
    name: string;
  };
};

// 댓글 목록의 'data' 페이로드 타입
export type CommentListData = {
  data: Comment[]; // 댓글 배열
};

export type ResponseCommentListDto = CursorBasedResponse<CommentListData>;