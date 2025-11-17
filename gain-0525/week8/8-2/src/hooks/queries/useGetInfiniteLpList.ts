import { useInfiniteQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import type { ResponseLpListDto } from "../../types/lp";

export const useGetInfiniteLpList = (params: Omit<PaginationDto, "cursor">) => {
  const { limit, search, order, searchType } = params;

  return useInfiniteQuery<ResponseLpListDto, Error>({
    queryKey: ["lpList", {limit, search, order, searchType}],

    // 🔹 QueryFunctionContext 사용
    queryFn: async ({ pageParam }: QueryFunctionContext) => {
      const cursor = (pageParam as number) ?? 0;
      const res = await getLpList({
        limit,
        search,
        order,
        cursor,
        searchType
      });
      return res;
    },

    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    initialPageParam: 0,
  });
};
