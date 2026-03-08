type Props = {
  text: string;
};

export function ScrambleText({ text }: Props) {
  return (
    <p className="text-center text-xl h-8 flex items-center justify-center">
      {text.replace(/_.+$/, "")}
    </p>
  );
}
