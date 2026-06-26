export function Overlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed w-full h-full bg-background-950 opacity-70 z-40 ${isOpen ? "flex" : "hidden"}`}
      onClick={onClose}
    />
  );
}
