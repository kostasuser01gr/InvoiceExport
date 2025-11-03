import QRCode from 'qrcode'

export async function generateQRCode(data: string): Promise<string> {
  try {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 2,
    })
    return qrDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function generateQRCodeBuffer(data: string): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 300,
      margin: 2,
    })
    return buffer
  } catch (error) {
    console.error('Error generating QR code buffer:', error)
    throw new Error('Failed to generate QR code buffer')
  }
}

export function getIntakeQRUrl(brand: 'europcar' | 'goldcar', baseUrl: string): string {
  return `${baseUrl}/intake?brand=${brand}`
}

export function getInvoiceVerificationUrl(invoiceId: string, baseUrl: string): string {
  return `${baseUrl}/invoice/${invoiceId}`
}
