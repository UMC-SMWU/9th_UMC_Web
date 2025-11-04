import type { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";
import type { ResponseLpListDto } from "../types/lp";
import type { ResponseLpDto } from "../types/lp";
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