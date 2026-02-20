export const calculateValue = (balance: number | undefined | null, price: number): number => {
  if (!balance || !price) return 0;
  return balance * price;
};

export const formatBalance = (
  value: number | undefined | null,
  decimals: number = 9
): string => {
  if (value === undefined || value === null || isNaN(value)) return '0.00';

  const factor = Math.pow(10, decimals);
  const truncatedValue = Math.floor(value * factor) / factor;

  return truncatedValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};