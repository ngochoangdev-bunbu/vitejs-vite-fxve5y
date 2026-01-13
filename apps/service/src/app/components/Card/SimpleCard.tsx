type Props = {
  children: React.ReactNode;
  header?: React.ReactNode;
};

export default function SimpleCard({ children, header }: Props): JSX.Element {
  return (
    <div className="mt-2 rounded-lg shadow-lg border border-gray-200 bg-white">
      {header}
      <div className="p-4 grid grid-cols-12 gap-2">{children}</div>
    </div>
  );
}
