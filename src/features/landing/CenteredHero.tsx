export const CenteredHero = (props: {
  banner: React.ReactNode;
  title: React.ReactNode;
  description: string;
  buttons: React.ReactNode;
}) => (
  <>
    <div className="text-center">{props.banner}</div>

    <h1 className="
      mx-auto mt-3 max-w-4xl text-center font-serif text-4xl/[1.1]
      tracking-tight
      md:text-6xl/[1.1]
    "
    >
      {props.title}
    </h1>

    <div className="
      mx-auto mt-5 max-w-3xl text-center text-xl text-muted-foreground
    "
    >
      {props.description}
    </div>

    <div className="
      mt-8 flex justify-center gap-x-5 gap-y-3
      max-sm:flex-col
    "
    >
      {props.buttons}
    </div>
  </>
);
