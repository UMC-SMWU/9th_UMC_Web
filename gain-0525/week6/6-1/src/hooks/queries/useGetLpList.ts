import { useQuery } from '@tanstack/react-query';
import {getLpList} from '../../apis/lp';
import type {PaginationDto} from "../../types/common";
import { QUERY_KEY } from '../../constants/key';
import type { ResponseLpListDto } from '../../types/lp';

const initialLpListData: ResponseLpListDto = {
    status: true,
    statusCode: 200,
    message:"",
    data: {
        data:[]
    },
    nextCursor:0,
    hasNext: false,
}

function useGetLpList({cursor, search, order, limit}:PaginationDto) {
    return useQuery({
        queryKey:[QUERY_KEY.lps, search, order],
            queryFn:() => 
                getLpList({
                    cursor,
                    search,
                    order,
                    limit,
                }),
                //데이터가 신선하다고 간주하는 시간,
                //이 시간 동안은 캐시한 데이터를 그대로 사용함. 컴포넌트가 마운트 되거나 창에 포커스 들어오는 경우도 재요청x
                //5분 동안 기존 데이터를 그대로 활용해서 네트워크 요청을 줄임
                staleTime: 1000 * 60 * 5, //5분

                //사용되지 않는 안 쿼리 데이터가 캐시에 남아있는 시간
                //staleTIime이 지나고 데이터가 신선하지 않더라도, 일정 시간 동안 메모리 보호
                // 10분동안 사용되지 않으면 캐시데이터가 삭제되며 다시 요청 시 새 데이터를 찾게됨. 
                gcTime: 100*60*10, //10분
                //enabled: Boolean(search),
                //refetchInterval: 100 * 60,

                //retry: 쿼리 요청이 실패했을 때 자동으로 재시도할 횟수를 지정
                //기본값은 3회 정도, 네트워크 오류 동임시적인 문제를 보완할 수 있습니다.

                //initialDate: 쿼리 실행 전 미리 제공할 초기 데이터
                //컴포넌트가 렌더링 할 때 빈 데이터 구조를 미리 제공해서, 로딩 전에도 안전하게 UI를 구성할 수 있게 해줌.
                //initialData:initialLpListData,

                keepPreviousData: true,
    });
}

export default useGetLpList;