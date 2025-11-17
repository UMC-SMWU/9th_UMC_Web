// usePostLike.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";

export const usePostLike = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postLike(lpId), // ✅ 반드시 객체 형태로 전달
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] }); // ✅ 객체 형태
    },
  });
};
