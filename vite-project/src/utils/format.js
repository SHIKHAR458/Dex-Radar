export function formatCompactNumber(number) {
  if (number == null) return "-";
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(number);
}


export function formatPrice(price){
    if(price == null){
        return "$0.00"
    }
    return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function formatVolume(volume) {
  if (volume == null) return "$0.00";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short'
  }).format(volume);
}

export function formatLiquidity(liquidity) {
  if (liquidity == null) return "$0.00";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short'
  }).format(liquidity);
}