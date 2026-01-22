import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectGroup {
    label: string;
    options: SelectOption[];
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    value: string | number;
    onChange: (value: string) => void;
    options?: SelectOption[] | SelectGroup[];
    icon?: LucideIcon;
    containerClassName?: string;
    labelClassName?: string;
}

export const Select = ({
    label,
    value,
    onChange,
    options,
    icon: Icon,
    className = '',
    containerClassName = '',
    labelClassName = '',
    disabled,
    children,
    ...props
}: SelectProps) => {
    const isGroup = (item: any): item is SelectGroup => {
        return item && 'options' in item && Array.isArray(item.options);
    };

    return (
        <div className={`form-control w-full ${containerClassName}`}>
            {label && (
                <label className="label">
                    <span className={`label-text font-medium flex items-center gap-2 ${disabled ? 'opacity-40' : ''} ${labelClassName}`}>
                        {Icon && <Icon size={14} />}
                        {label}
                    </span>
                </label>
            )}

            <select
                className={`select select-bordered rounded-full focus:select-neutral h-10 min-h-0 text-sm w-full bg-base-100 ${className}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                {...props}
            >
                {children ? children : options?.map((item, index) => {
                    if (isGroup(item)) {
                        return (
                            <optgroup key={`${item.label}-${index}`} label={item.label}>
                                {item.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </optgroup>
                        );
                    } else {
                        return (
                            <option key={(item as SelectOption).value} value={(item as SelectOption).value}>
                                {(item as SelectOption).label}
                            </option>
                        );
                    }
                })}
            </select>
        </div>
    );
};