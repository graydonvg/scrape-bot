type Props = {
  title: string;
  message: string;
};

export default function ExecutionStatusMessage({ title, message }: Props) {
  return (
    <div className="flex-center size-full flex-col gap-2">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-xl">{message}</p>
      </div>
    </div>
  );
}
