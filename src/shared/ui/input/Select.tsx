import { useEffect, useMemo, useRef, useState } from "react";

export type Option<V> = {
    label: string;
    value: V;
    disabled?: boolean;
};

export type SelectProps<V> = {
    options: Option<V>[];
    value?: V;
    defaultValue?: V;
    placeholder?: string;
    onChange?: (v: V) => void;
    className?: string;
    itemClassName?: string;
    ariaLabel?: string;
};

/**
 * Select component with dropdown list.
 *
 * @param {Option<V>[]} options - An array of options to select from.
 * @param {V} [value] - The currently selected value.
 * @param {V} [defaultValue] - The default value if no value provided.
 * @param {string} [placeholder] - The placeholder when no value provided.
 * @param {(v: V) => void} [onChange] - The callback when the selected value changes.
 * @param {string} [className] - The className of the component.
 * @param {string} [itemClassName] - The className of each item in the dropdown list.
 * @param {string} [ariaLabel] - The aria label of the component.
 *
 * @returns A Select component with the given options and value.
 */
export function Select<V>({
    options,
    value,
    defaultValue,
    placeholder = "",
    onChange,
    className = "",
    itemClassName = "",
    ariaLabel,
}: SelectProps<V>) {
    const [open, setOpen] = useState(false);
    const [internal, setInternal] = useState<V | undefined>(defaultValue);
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
 
    const selected = value !== undefined ? value : internal;

    const selectedLabel = useMemo(() => {
        const found = options.find(o => Object.is(o.value, selected));
        return found?.label ?? "";
    }, [options, selected]);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        window.addEventListener("mousedown", h);
        return () => window.removeEventListener("mousedown", h);
    }, []);

    useEffect(() => {
        const btn = buttonRef.current;
        if (!btn) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setOpen(v => !v);
            } else if (e.key === "Escape") {
                setOpen(false);
            } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const enabled = options.filter(o => !o.disabled);
                const idx = enabled.findIndex(o => Object.is(o.value, selected));
                const delta = e.key === "ArrowDown" ? 1 : -1;
                const next = enabled[(idx + delta + enabled.length) % enabled.length];
                if (next) {
                    onChange ? onChange(next.value) : setInternal(next.value);
                }
            }
        };
        btn.addEventListener("keydown", onKey);
        return () => btn.removeEventListener("keydown", onKey);
    }, [options, selected, onChange]);

    useEffect(() => {
        if (open) buttonRef.current?.focus();
        else buttonRef.current?.blur();
    }, [open])

    const pick = (opt: Option<V>) => {
        if (opt.disabled) return;
        onChange && onChange(opt.value)
        setInternal(opt.value);
        setOpen(false);
    };
    // console.log(selected, selectedLabel)
    return (
        <div
            ref={rootRef}
            className={`relative w-full fz-16px ${className}`}
        >
            <button
                ref={buttonRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
                onClick={() => setOpen(v => !v)}
                className={
                    `w-full h-16 px-6 rounded-lg bg-white
                    flex items-center justify-between
                    border-0 outline-none box-border font-size-inherit
                    transition-all duration-100 cursor-pointer`
                }
                style={open ? {
                    outline: "1px solid #00A7B5"
                } : {}}
            >
                <span className={`truncate fw-400 font-size-inherit ${selected ? "text-black" : "text-gray-500"}`}>
                    {selected ? selectedLabel : placeholder}
                </span>
                <svg
                    className={`w-5 h-5 text-[#00A7B5] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            <div
                ref={listRef}
                className={`
                    absolute left-0 right-0 mt-2 z-50
                    origin-top rounded-lg bg-white shadow-lg
                    max-h-72 overflow-auto p-1 font-size-inherit
                    transition duration-150 ease-out
                    ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
                `}
                role="listbox"
            >
                {options.map((opt, i) => {
                    const isSel = selected !== undefined && Object.is(opt.value, selected);
                    return (
                        <button
                            key={i}
                            role="option"
                            aria-selected={isSel}
                            disabled={opt.disabled}
                            onClick={() => pick(opt)}
                            className={`
                                w-full text-left px-4 py-3 rounded-md cursor-pointer
                                transition-colors
                                outline-none
                                border-0
                                fz-inherit
                                ${opt.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray/10"}
                                ${isSel ? "bg-gray/10" : "bg-white"}
                                focus-visible:(outline outline-1 outline-[#00A7B5])
                                ${itemClassName}
                            `}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}


