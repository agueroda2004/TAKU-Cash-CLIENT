type Props = {
  title: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
};

export default function PageHeader({ title, description, buttonText, onClick }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-800">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>
      {buttonText && onClick && (
        <button
          onClick={onClick}
          className="h-11 rounded-xl bg-duo-green px-5 text-sm font-bold text-white transition hover:bg-duo-green-hover"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
