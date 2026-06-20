export default function Button({ children, variant = "primary", onClick, className = "" }) {
  const base = "px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2";

  const styles = {
    primary: "bg-mango text-white hover:bg-mango-dark shadow-md hover:shadow-lg",
    outline: "border-2 border-mango text-mango hover:bg-mango hover:text-white",
    ghost: "text-dark hover:bg-cream",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}