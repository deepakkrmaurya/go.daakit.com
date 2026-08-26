import daakitIcon from "../assets/daakit-icon.png";

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0446DB]">
      <img
        src={daakitIcon}
        alt="Daakit Icon"
        className="w-32 h-32 animate-spin"
      />
    </div>
  );
}

export default Loader;
