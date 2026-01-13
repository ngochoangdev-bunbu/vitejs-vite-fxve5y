export const formatNumber = (num: number): string => {
  return num.toLocaleString("ja-JP");
};

export const formatCurrency = (num: number): string => {
  return num.toLocaleString("ja-JP", { style: "currency", currency: "JPY" });
};

export const formatCurrencyWithTax = (
  num: number,
  taxRate: number = Number(process.env.NEXT_PUBLIC_TAX_RATE || 10),
): string => {
  const temp = num * (1 + taxRate / 100);
  return temp.toLocaleString("ja-JP", { style: "currency", currency: "JPY" });
};
