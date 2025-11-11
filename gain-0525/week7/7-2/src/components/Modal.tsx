import React, { useState, useRef, type KeyboardEvent } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    content: string;
    tags: string[];
    file: File | null;
  }) => void;
  title: string;
}

const Modal = ({ isOpen, onClose, onConfirm, title }: ModalProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (removeTag: string) => {
    setTags(tags.filter((t) => t !== removeTag));
  };

  const handleConfirm = () => {
    onConfirm({ name, content, tags, file });
    setName("");
    setContent("");
    setTags([]);
    setTagInput("");
    setFile(null);
  };

  const handleClose = () => {
    setName("");
    setContent("");
    setTags([]);
    setTagInput("");
    setFile(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-[360px] shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <div className="flex flex-col gap-3 mb-4">
          {/* 이미지 미리보기 */}
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="mt-2 w-full h-40 object-cover rounded"
            />
          )}

          {/* 커스텀 파일 선택 버튼 */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border rounded px-3 py-2 bg-gray-100 hover:bg-gray-200"
          >
            이미지 선택
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border rounded px-3 py-2 resize-none"
          />

          {/* 태그 입력 */}
          <input
            type="text"
            placeholder="Tag 입력 후 Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="border rounded px-3 py-2"
          />

            <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                    <span
                        key={t}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
                    >
                #{t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="text-gray-500 hover:text-gray-800 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
