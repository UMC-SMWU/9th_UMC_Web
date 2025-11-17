import { useMutation, useQueryClient } from "@tanstack/react-query";
import  { axiosInstance } from "../../apis/axios";

export const useDeleteComment = (lpId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      const res = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lp-comments", lpId] }); // ✅ LP 댓글 목록 갱신
    },
  });
};
