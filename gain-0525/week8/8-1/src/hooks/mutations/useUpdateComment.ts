import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

export const useUpdateComment = (lpId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      const res = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, {
        content,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lp-comments", lpId] }); // ✅ 해당 LP 댓글 새로고침
    },
  });
};
