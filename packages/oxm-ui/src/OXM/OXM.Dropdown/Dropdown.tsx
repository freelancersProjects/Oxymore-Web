import React, { useState, useRef, useEffect } from "react";
import "./Dropdown.scss";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme?: "blue" | "purple";
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, placeholder, theme = "blue" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div
      className={`oxm-dropdown oxm-dropdown--${theme}${open ? " open" : ""}`}
      ref={ref}
      tabIndex={0}
      onBlur={() => setOpen(false)}
    >
      <button
        className="oxm-dropdown__toggle"
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="oxm-dropdown__selected">
          {selected ? selected.label : placeholder || "Select..."}
        </span>
        <span className="oxm-dropdown__icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </button>
      {open && (
        <ul className="oxm-dropdown__menu" role="listbox">
          {options.map(opt => (
            <li
              key={opt.value}
              className={`oxm-dropdown__option${opt.value === value ? " selected" : ""}`}
              role="option"
              aria-selected={opt.value === value}
              tabIndex={-1}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown; 