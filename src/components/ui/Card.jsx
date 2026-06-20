export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-50 ${className}`}>
      {children}
    </div>
  );
}