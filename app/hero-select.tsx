'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export type SelectOption = string[] | [string, string] | { value: string; label: string };

interface HeroSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
}

export default function HeroSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Chọn một tùy chọn',
  className = '',
  ariaLabel,
  fullWidth = true,
}: HeroSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Normalize options to { value, label }
  const normalizedOptions = options.map((opt) =>
    Array.isArray(opt) ? { value: opt[0], label: opt[1] ?? opt[0] } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Click outside listener
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      if (!open) {
        e.preventDefault();
        setOpen(true);
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className={`hero-select-root ${open ? 'is-open' : ''} ${fullWidth ? 'full-width' : ''} ${className}`}
      onKeyDown={handleKeyDown}
    >
      {label && <label className="hero-select-label">{label}</label>}

      <button
        ref={triggerRef}
        type="button"
        className={`hero-select-trigger ${open ? 'focused' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel || label || displayText}
        onClick={() => setOpen(!open)}
      >
        <span className={`hero-select-value ${!selectedOption && value === '' ? 'is-placeholder' : ''}`}>
          {displayText}
        </span>
        <span className={`hero-select-indicator ${open ? 'rotated' : ''}`}>
          <ChevronDown size={15} />
        </span>
      </button>

      {open && (
        <div className="hero-select-popover" role="listbox">
          <div className="hero-select-list">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`hero-select-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
