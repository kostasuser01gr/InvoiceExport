export function cn(...inputs: Array<string | undefined | null | false>) {
  return inputs.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number | string, currency = 'EUR'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency,
  }).format(numAmount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('el-GR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('el-GR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function calculateVAT(net: number, vatRate: number): number {
  return (net * vatRate) / 100
}

export function calculateTotal(net: number, vatRate: number): number {
  return net + calculateVAT(net, vatRate)
}

export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
