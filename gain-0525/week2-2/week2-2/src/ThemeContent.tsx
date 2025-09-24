import type { ReactElement } from "react";
import { useTheme, THEME } from "./context/ThemeProvider";
import clsx from "clsx";

export default function ThemeContent() : ReactElement  {
    const { theme, toggleTheme } = useTheme();
        
        const isLightMode = theme === THEME.LIGHT
    return (
        <div className={clsx(
            'p-4 h-dvh w-full',
            isLightMode ? 'bg-white' : 'bg-gray-800'
            )}>
            <h1 className={clsx(
                'text-wxl font-bold',
                isLightMode ? 'text-black' : 'text-white'
            )}
            > Theme Content </h1>
            <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Dolorem dolore labore inventore architecto ipsam id, 
                aliquam velit necessitatibus quaerat, ex iusto repellendus asperiores fugiat, 
                quasi alias non vitae? Id, velit. </p>
        </div>     
    );
}