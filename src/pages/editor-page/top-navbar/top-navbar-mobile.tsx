import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import ChartDBLogo from '@/assets/logo-2.png';
import { DiagramName } from './diagram-name';
import { LanguageNav } from './language-nav/language-nav';
import { Menu } from './menu/menu';
import { Button } from '@/components/button/button';
import { useSidebar } from '@/components/sidebar/use-sidebar';
import { MenuIcon } from 'lucide-react';

export interface TopNavbarMobileProps {}

export const TopNavbarMobile: React.FC<TopNavbarMobileProps> = () => {
    const renderStars = useCallback(() => {
        return (
            <iframe
                src="https://ghbtns.com/github-btn.html?user=agafonovim&repo=schema-viewer&type=star&size=small&text=false"
                width="25"
                height="20"
                title="GitHub"
            ></iframe>
        );
    }, []);

    const { toggleSidebar } = useSidebar();

    return (
        <nav className="flex flex-col justify-between border-b px-3 md:h-12 md:flex-row md:items-center md:px-4">
            <div className="flex flex-1 flex-col justify-between gap-x-1 md:flex-row md:justify-normal">
                <div className="flex items-center justify-between pt-[8px] font-primary md:py-[10px]">
                    <div className="flex items-center gap-2">
                        <Button
                            size={'icon'}
                            variant="ghost"
                            onClick={toggleSidebar}
                        >
                            <MenuIcon className="size-5" />
                        </Button>
                        <Link to="/" className="cursor-pointer">
                            <img
                                src={ChartDBLogo}
                                alt="chartDB"
                                className="h-4 max-w-fit"
                            />
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="https://payload.market"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            payload.market
                        </a>
                        {renderStars()}
                        <LanguageNav />
                    </div>
                </div>
                <Menu />
            </div>

            <div className="flex flex-1 justify-center pb-2 pt-1">
                <DiagramName />
            </div>
        </nav>
    );
};
