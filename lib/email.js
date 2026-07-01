import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.error("❌ RESEND_API_KEY missing");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendPriceDropAlert(
  userEmail,
  product,
  oldPrice,
  newPrice
) {
  try {
    if (!resend) {
      return { error: "Resend not configured" };
    }

    if (!userEmail) {
      return { error: "Missing user email" };
    }

    const priceDrop = oldPrice - newPrice;
    const percentageDrop = ((priceDrop / oldPrice) * 100).toFixed(1);

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: `🎉 Price Drop: ${product.name}`,
      html: `
        <div style="font-family:Arial;max-width:600px;margin:auto;padding:20px">

          <h2 style="color:#FA5D19;">🎉 Price Dropped!</h2>

          ${
            product.image_url
              ? `<img src="${product.image_url}" style="max-width:250px;border-radius:8px"/>`
              : ""
          }

          <h3>${product.name}</h3>

          <p><b>Drop:</b> ${percentageDrop}%</p>

          <p>
            <del>${product.currency} ${oldPrice}</del>
            <strong style="color:green;font-size:18px">
              → ${product.currency} ${newPrice}
            </strong>
          </p>

          <p><b>You saved:</b> ${product.currency} ${priceDrop.toFixed(
        2
      )}</p>

          <a href="${product.url}"
             style="display:inline-block;padding:10px 15px;background:#FA5D19;color:white;text-decoration:none;border-radius:5px">
            View Product
          </a>

        </div>
      `,
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error);
      return { error };
    }

    console.log("✅ EMAIL SENT:", data?.id);

    return { success: true, data };
  } catch (err) {
    console.error("❌ EMAIL FAILED:", err);
    return { error: err.message };
  }
}