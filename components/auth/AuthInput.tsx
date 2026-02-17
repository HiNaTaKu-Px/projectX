type Props = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
};

export function AuthInput({ type, placeholder, value, onChange }: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 mb-4 border border-green-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  );
}
