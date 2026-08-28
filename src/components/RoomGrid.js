export default function RoomGrid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}
