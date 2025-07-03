import clsx from "clsx";

export function CustomDot({
    onClick,
    active,
    index,
}: {
    onClick?: () => void;
    active?: boolean;
    index?: number;
}) {
    return (
        <li
            className="inline-block mx-1 cursor-pointer"
            onClick={onClick}
            role="button"
            aria-label={`Ir al slide ${index}`}
        >
            <span
                className={clsx(
                    "block h-1 w-6 sm:w-8 md:w-10 rounded-full transition-all duration-300 my-2",
                    active
                        ? "bg-gray-800 shadow-lg scale-x-110"
                        : "bg-gray-800/30 hover:bg-gray-800/60"
                )}
            />
        </li>
    );
}
