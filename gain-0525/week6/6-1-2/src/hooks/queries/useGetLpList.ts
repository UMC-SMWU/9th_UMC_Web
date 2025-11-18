// src/hooks/queries/useGetLpList.ts
import { useQuery } from "@tanstack/react-query";
import { fetchLpList } from "../../apis/lpApi";

export const useGetLpList = () => {
  return useQuery({
    queryKey: ["lpList"],
    queryFn: fetchLpList,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐싱 유지
    gcTime: 1000 * 60 * 10,   // 10분 후 GC
  });
};
