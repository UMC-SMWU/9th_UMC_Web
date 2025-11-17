import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";

export const usePostComment = (lpId: number, order: PAGINATION_ORDER, limit = 8) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => postComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lpComments", lpId, order, limit],
      });
    },
  });
};
