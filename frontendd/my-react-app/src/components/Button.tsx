const Button = ({ name, className, onClick }) => {
  return (
    <button
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${className}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;