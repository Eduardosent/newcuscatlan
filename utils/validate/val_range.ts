export const valRange = (amount: number,min:number,max:number): 'min' | 'max' | null => {
  if (amount < min) return 'min'
  if (amount > max) return 'max'
  return null
}