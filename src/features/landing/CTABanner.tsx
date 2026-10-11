export const CTABanner = (props: {
  title: string;
  description: string;
  buttons: React.ReactNode;
}) => (
  <div className="rounded-lg border bg-card px-6 py-12 text-center">
    <div className="
      font-serif text-3xl tracking-tight
      md:text-4xl
    "
    >
      {props.title}
    </div>

    <div className="mt-2 text-lg text-muted-foreground">
      {props.description}
    </div>

    <div className="mt-6">{props.buttons}</div>
  </div>
);
