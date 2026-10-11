import { KawungMark } from '@/components/KawungMark';
import { AppConfig } from '@/utils/AppConfig';

// The last word drops to its own line on phones (stacked lockup) so the navbar fits at 375px
const split = AppConfig.name.lastIndexOf(' ');

export const Logo = () => (
  <div className="flex items-center gap-2.5">
    <KawungMark className="size-7" />
    <span className="
      text-xs/tight font-semibold tracking-[0.13em] uppercase
      sm:text-[13px]
    "
    >
      {AppConfig.name.slice(0, split)}
      {' '}
      <span className="max-sm:block">{AppConfig.name.slice(split + 1)}</span>
    </span>
  </div>
);
