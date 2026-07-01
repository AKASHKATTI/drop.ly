import { Firecrawl } from "firecrawl";

const app = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  let productError;
  let jsonError;

  try {
    const result = await app.scrape(url, {
      formats: ["product"],
    });

    console.dir(result, { depth: null });

    const product = result.product;

    if (product) {
      const variant = product.variants?.[0];

      return {
        productName: product.title,
        currentPrice:
          variant?.price?.amount ?? product.price?.amount,
        currencyCode:
          variant?.price?.currency ?? product.price?.currency,
        productImageUrl:
          variant?.images?.[0]?.url ??
          product.images?.[0]?.url ??
          result.metadata?.ogImage,
      };
    }
  } catch (e) {
    productError = e;
  }

  try {
    const result = await app.scrape(url, {
      formats: [{
        type: "json",
        prompt: `
Extract:
- productName
- currentPrice
- currencyCode
- productImageUrl
Return only valid JSON.
`,
        schema: {
          type: "object",
          properties: {
            productName: { type: "string" },
            currentPrice: { type: "number" },
            currencyCode: { type: "string" },
            productImageUrl: { type: "string" },
          },
        },
      }],
    });

    console.dir(result, { depth: null });

    if (result.json?.productName && result.json?.currentPrice) {
      return result.json;
    }
  } catch (e) {
    jsonError = e;
  }

  throw new Error(
    `Failed to scrape product.\nProduct extractor: ${productError?.message}\nJSON extractor: ${jsonError?.message}`
  );
}