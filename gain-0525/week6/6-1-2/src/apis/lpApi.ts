// src/apis/lpApi.ts
const API_URL = import.meta.env.VITE_SERVER_API_URL;

// 🏷️ 태그 타입
interface Tag {
  id: number;
  name: string;
}

// ❤️ 좋아요 타입
interface Like {
  id: number;
  userId: number;
  lpId: number;
}

// 💿 LP 타입
export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  likes: Like[];
}

// 📦 API 전체 응답 타입 (참고용)
interface LpResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Lp[];
    nextCursor: number;
    hasNext: boolean;
  };
}

// ✅ LP 목록 불러오기
export const fetchLpList = async (): Promise<Lp[]> => {
  const res = await fetch(`${API_URL}/v1/lps`);
  if (!res.ok) throw new Error("Failed to fetch LP list");

  const result: LpResponse = await res.json();
  console.log("📦 API 응답:", result); // 디버깅용

  // ✅ 실제 LP 배열만 리턴
  return result.data.data;
};
