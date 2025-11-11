import type { PaginationDto, ResponseCommentListDto,  } from "../types/common";
import { axiosInstance } from "./axios";
import type { ResponseLpListDto } from "../types/lp";
import type { ResponseLpDto } from "../types/lp";
import { PAGINATION_ORDER } from "../enums/common";
export const getLpList = async (


    paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.get('/v1/lps', {
        params:paginationDto,
    })

    return data;
};

export const getLpDetail = async (lpid: number): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data;
};

interface GetLpCommentsParams {
  lpId: number;
  cursor?: number;
  limit?: number;
  order?: PAGINATION_ORDER;
}

export const getLpComments = async ({
  lpId,
  cursor,
  limit,
  order,
}: GetLpCommentsParams): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get<ResponseCommentListDto>(
    `/v1/lps/${lpId}/comments`, // API 명세에 나온 엔드포인트
    {
      params: { // 쿼리 파라미터
        cursor,
        limit,
        order,
      },
    }
  );
  return data; // (axiosInstance 설정에 따라 data.data일 수 있습니다)
};

export interface LikeResponse {
  id: number;
  userId: number;
  lpId: number;
}

// 좋아요 생성
export const postLike = async (lpId: number): Promise<LikeResponse> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data.data;
};

// 좋아요 삭제
export const deleteLike = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
};


export const postComment = async (lpId: number, content: string) => {
  const res = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return res.data; // Axios는 res.data에 실제 데이터 있음
};

// 댓글 수정
export const updateComment = async (
  lpId: number,
  commentId: number,
  content: string
) => {
  const response = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, {
    content,
  });
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (lpId: number, commentId: number) => {
  const response = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return response.data;
};