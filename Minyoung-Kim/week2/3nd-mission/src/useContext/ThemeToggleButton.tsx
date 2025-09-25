import { useTheme } from "./context/ThemeProvider";
import clsx from "clsx";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const isLightMode = theme === "LIGHT";

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "px-4 py-2 mt-4 rounded-md transition-all",
        isLightMode ? "bg-white text-black" : "bg-black text-white"
      )}
    >
      {isLightMode ? "라이트 모드" : "다크 모드"}
    </button>
  );
}
