import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";
import type { Comment, ResponseCommentListDto } from "../../types/common";

interface UseGetLpCommentsProps {
  lpId: number;
  order: PAGINATION_ORDER;
  limit?: number;
}

export function useGetLpComments({ lpId, order, limit = 8 }: UseGetLpCommentsProps) {
  return useInfiniteQuery<
    ResponseCommentListDto, // queryFn 반환 타입
    Error,                  // 에러 타입
    Comment[],              // select 적용 후 컴포넌트에서 쓰는 타입
    [string, number, PAGINATION_ORDER, number] // queryKey 타입
  >({
    queryKey: ["lpComments", lpId, order, limit],
    queryFn: async ({ pageParam }) => {
      const cursor = typeof pageParam === "number" ? pageParam : undefined;
      return await getLpComments({
        lpId,
        cursor,
        order,
        limit,
      });
    },
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    select: (data) =>
      data.pages.flatMap((page) => page.data.data), // Comment[] 평탄화
  });
}
