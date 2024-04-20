import Link from 'next/link'
import {ReactNode, MouseEventHandler} from 'react'
interface AnimatedButtonProps {
    href?: string;
    onClick?: MouseEventHandler;
    children: ReactNode;
    disabled?: boolean;
}

export default function AnimatedButton({ href, onClick, children, disabled }: AnimatedButtonProps) {
    const baseClasses = "rounded-md px-5 py-2.5 text-sm font-semibold";
    const enabledClasses = "bg-gradient-to-r from-lime-300 via-green-500 to-green-700 hover:from-lime-400 hover:via-green-600 hover:to-green-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-500 text-white hover:shadow-lg animate-gradient-bg";
    const disabledClasses = "bg-gray-300 text-white cursor-not-allowed";

    if (href && !disabled) {
        return (
            <Link
                href={href}
                className={`${baseClasses} ${enabledClasses}`}
            >
                {children}
            </Link>
        );
    } else if (href && disabled) {
        // If the button is meant to be a link but is disabled, render it as a span or div with disabled styling
        return (
            <span className={`${baseClasses} ${disabledClasses}`}>
                {children}
            </span>
        );
    }

    // For a button element, apply disabled styling conditionally
    return (
        <button
            onClick={!disabled ? onClick : undefined} // Prevent onClick if disabled
            disabled={disabled}
            className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
        >
            {children}
        </button>
    );
}