import { cn } from '@/lib/utils';
import * as React from 'react';

export interface DropdownProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { label: string; value: number | string }[];
}

const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
    ({ className, options, ...props }, ref) => {
        const [selectedValue, setSelectedValue] = React.useState('');

        const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedValue(e.target.value);
            if (props.onChange) props.onChange(e);
        };

        return (
            <select
                ref={ref}
                className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                value={selectedValue}
                onChange={handleChange}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    }
);

Dropdown.displayName = 'Dropdown';

export { Dropdown };
