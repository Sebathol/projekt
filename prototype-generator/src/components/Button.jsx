/**
 * Button Component - Reusable button with variants
 */
export default function Button({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center font-semibold
    rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white
      hover:shadow-lg hover:-translate-y-0.5
      focus:ring-[#667eea]
    `,
    secondary: `
      bg-gray-200 text-gray-900
      hover:bg-gray-300
      focus:ring-gray-400
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700
      focus:ring-red-500
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
