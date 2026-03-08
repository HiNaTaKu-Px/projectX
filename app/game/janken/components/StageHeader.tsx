type Props = {
  label: string;
};

export function StageHeader({ label }: Props) {
  return <p className="text-3xl mb-2">🤛　{label}　🤜</p>;
}
