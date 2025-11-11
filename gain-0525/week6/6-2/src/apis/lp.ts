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