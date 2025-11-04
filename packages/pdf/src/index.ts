import puppeteer from "puppeteer";

export async function renderInvoicePDF(url: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.emulateMediaType("screen");
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    const pdf = await page.pdf({
      printBackground: true,
      format: "A4",
      margin: {
        top: "12mm",
        right: "12mm",
        bottom: "12mm",
        left: "12mm",
      },
    });

    return pdf;
  } finally {
    await browser.close();
  }
}
