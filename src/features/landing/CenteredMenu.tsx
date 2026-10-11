'use client';

import { useTranslations } from 'next-intl';
import { MenuToggle } from '@/components/MenuToggle';
import { useMenu } from '@/hooks/UseMenu';
import { Link } from '@/libs/I18nNavigation';
import { cn } from '@/utils/Helpers';

export const CenteredMenu = (props: {
  logo: React.ReactNode;
  children: React.ReactNode;
  rightMenu: React.ReactNode;
}) => {
  const t = useTranslations('Navbar');
  const { isMenuOpen, toggleMenu, closeMenu } = useMenu();

  return (
    <div className="
      mx-auto flex h-16 max-w-7xl items-center gap-4 px-4
      lg:gap-8
    "
    >
      <Link href="/" className="min-w-0">{props.logo}</Link>

      <nav className="max-lg:hidden">
        <ul className="
          flex gap-x-7 text-sm text-muted-foreground
          [&_a]:transition-colors
          [&_a:hover]:text-foreground
        "
        >
          {props.children}
        </ul>
      </nav>

      <ul className="ml-auto flex shrink-0 items-center gap-x-1">
        {props.rightMenu}
        <li className="lg:hidden">
          <MenuToggle onClick={toggleMenu} label={t('menu_label')} expanded={isMenuOpen} />
        </li>
      </ul>

      <nav
        className={cn(
          `
            absolute inset-x-0 top-16 border-b bg-background px-4 py-3
            lg:hidden
          `,
          !isMenuOpen && 'hidden',
        )}
      >
        {/* Close after navigating so the panel does not cover the next page */}
        <ul
          className="
            flex flex-col text-base
            [&_a]:block [&_a]:py-2
          "
          onClick={closeMenu}
        >
          {props.children}
        </ul>
      </nav>
    </div>
  );
};
