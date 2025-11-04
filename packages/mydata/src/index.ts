export type MyDataEnv = "SANDBOX" | "PRODUCTION";

const endpoints = {
  SANDBOX: {
    sendInvoices: "https://mydata-sandbox.aade.gr/SendInvoices",
    cancelInvoice: "https://mydata-sandbox.aade.gr/CancelInvoice",
  },
  PRODUCTION: {
    sendInvoices: "https://mydata.aade.gr/SendInvoices",
    cancelInvoice: "https://mydata.aade.gr/CancelInvoice",
  },
};

export function myDataEndpoint(
  name: keyof typeof endpoints.SANDBOX
): string {
  const env = (process.env.MYDATA_ENV as MyDataEnv) || "SANDBOX";
  return endpoints[env][name];
}

export async function sendInvoices(payload: any) {
  const url = myDataEndpoint("sendInvoices");
  const key = process.env.MYDATA_SUBSCRIPTION_KEY;
  
  if (!key) {
    console.warn("⚠️ MYDATA_SUBSCRIPTION_KEY not set, returning mock response");
    return { mock: true, mark: "MOCK-MARK-12345" };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`myDATA error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

export async function cancelInvoice(mark: string) {
  const url = myDataEndpoint("cancelInvoice");
  const key = process.env.MYDATA_SUBSCRIPTION_KEY;
  
  if (!key) {
    console.warn("⚠️ MYDATA_SUBSCRIPTION_KEY not set, returning mock response");
    return { mock: true, cancelled: true };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mark }),
  });

  if (!res.ok) {
    throw new Error(`myDATA error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}
