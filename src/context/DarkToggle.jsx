import { useTheme } from "../context/ThemeContext";

const DarkToggle = () => {
  const { dark, setDark } = useTheme();

  return (
    <button
      onClick={() => setDark(!dark)}
      
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
};

export default DarkToggle;
