// useDeleteLike.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";

export const useDeleteLike = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteLike(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    },
  });
};
