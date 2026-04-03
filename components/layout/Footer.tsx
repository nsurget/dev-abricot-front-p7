import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="h-[68px] bg-white border-t border-gray-100 flex items-center justify-between px-[100px] mt-auto">
      <Logo width={101} height={13} color="black" />
      <p className="text-black font-inter text-base">
        Abricot 2025
      </p>
    </footer>
  );
}
