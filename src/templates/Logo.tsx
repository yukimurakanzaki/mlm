import { AppConfig } from '@/utils/AppConfig';

export const Logo = (props: {
  isTextHidden?: boolean;
}) => (
  <div className="
    flex items-center text-lg font-semibold
    sm:text-xl
  "
  >
    <svg
      className="mr-1 size-8 stroke-current stroke-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="5.5" cy="18" r="2.5" />
      <circle cx="18.5" cy="18" r="2.5" />
      <path d="M12 8.5v3.5M12 12l-5 4M12 12l5 4" />
    </svg>
    {!props.isTextHidden && AppConfig.name}
  </div>
);
