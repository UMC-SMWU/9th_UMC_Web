import { useInfiniteQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import type { ResponseLpListDto } from "../../types/lp";

export const useGetInfiniteLpList = (params: Omit<PaginationDto, "cursor">) => {
  return useInfiniteQuery<ResponseLpListDto, Error>({
    queryKey: ["lpList", params],

    // 🔹 QueryFunctionContext 사용
    queryFn: async ({ pageParam }: QueryFunctionContext) => {
      const cursor = (pageParam as number) ?? 0;
      const res = await getLpList({
        ...params,
        cursor,
      });
      return res;
    },

    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    initialPageParam: 0,
  });
};

