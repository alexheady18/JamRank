export default function Counter({ value }: { value: number | null }) {
  const text = value == null ? "--.-" : value.toFixed(1);
  return <div className="counter">{text}</div>;
}
