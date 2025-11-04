import QRCode from "qrcode";

export async function qrDataURL(text: string): Promise<string> {
  return QRCode.toDataURL(text, { errorCorrectionLevel: "M" });
}

export async function qrBuffer(text: string): Promise<Buffer> {
  return QRCode.toBuffer(text, { errorCorrectionLevel: "M" });
}
