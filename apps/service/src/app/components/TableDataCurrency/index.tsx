import {
  formatCurrency,
  formatCurrencyWithTax,
} from "@/app/helper/format-tool";

type Props = {
  num: number;
};

export default function TableDataCurrency({ num }: Props): JSX.Element {
  return (
    <p className="text-lg font-bold">
      {formatCurrency(num)}
      <br />
      <span className="text-sm font-normal">
        (税込{formatCurrencyWithTax(num)})
      </span>
    </p>
  );
}
