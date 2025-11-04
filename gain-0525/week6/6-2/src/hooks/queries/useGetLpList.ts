import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lp';
// [수정] 우리가 lp.ts에 정의한 'ResponseLpListDto' 타입을 가져옵니다.
import type { ResponseLpListDto } from '../../types/lp'; 
import { QUERY_KEY } from '../../constants/key';
import { PAGINATION_ORDER } from '../../enums/common';

// API에 요청할 때 필요한 props입니다.
interface UseGetLpListProps {
  order: PAGINATION_ORDER;
  search?: string;
  limit?: number;
}

function useGetLpList({ order, search, limit = 10 }: UseGetLpListProps) {
  return useInfiniteQuery({
    // 1. 쿼리 키: 이 쿼리를 식별하는 이름표입니다.
    queryKey: [QUERY_KEY.lps, order, search, limit],
    
    /**
     * 2. 쿼리 함수 (queryFn):
     * 'getLpList' 함수가 API를 호출하고, 그 결과로 'ResponseLpListDto' 타입을 반환합니다.
     * ResponseLpListDto = { status: ..., data: { data: [...] }, nextCursor: ... }
     */
    queryFn: ({ pageParam }) =>
      getLpList({
        cursor: pageParam, // 'pageParam'이 'cursor'가 되어 API로 전달됩니다.
        search,
        order,
        limit,
      }),

    // 3. 첫 페이지 커서: 첫 페이지는 커서가 없으므로 'undefined'입니다.
    initialPageParam: undefined,

    /**
     * 4. 다음 페이지 커서 (getNextPageParam): [핵심!]
     * 'lastPage' = API가 반환한 'ResponseLpListDto' 전체 객체입니다.
     * 우리는 common.ts에 'nextCursor'가 바깥에 있다고 정의했으므로,
     * 'lastPage.nextCursor'에서 값을 읽어옵니다.
     */
    getNextPageParam: (lastPage: ResponseLpListDto) => {
      // lastPage.nextCursor가 있으면 그 값을 쓰고, 없으면(null, 0, undefined) undefined를 반환
      return lastPage.nextCursor || undefined;
    },

    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10,  // 10분

    /**
     * 5. 데이터 선택 (select):
     * React Query가 가져온 데이터(data.pages)는 [ResponseLpListDto, ResponseLpListDto, ...] 형태입니다.
     * 컴포넌트에서 쓰기 편하게 실제 LP 배열만 뽑아서 하나의 긴 배열로 합칩니다.
     * * page = ResponseLpListDto
     * page.data = { data: [...] }
     * page.data.data = [...] (우리가 원하는 실제 LP 배열)
     */
    select: (data) => data.pages.flatMap(page => page.data.data),
  });
}

export default useGetLpList;