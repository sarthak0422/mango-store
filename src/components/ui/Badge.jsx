export default function Badge({ children }) {
  return (
    <span className="text-xs px-2.5 py-0.5 bg-mango text-white rounded-full font-medium shadow-sm">
      {children}
    </span>
  );
}