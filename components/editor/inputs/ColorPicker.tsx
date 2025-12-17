'use client';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
        {label}
      </label>
      
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={handleCustomColorChange}
          className="w-16 h-10 rounded-lg border border-gray-200 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#3b82f6"
          className="flex-1 bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-2 transition-all backdrop-blur-sm placeholder:text-gray-400 text-sm font-mono"
        />
      </div>
    </div>
  );
}

