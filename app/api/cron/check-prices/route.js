import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeProduct } from "@/lib/fireCrawl";
import { sendPriceDropAlert } from "@/lib/email";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: products, error } = await supabase
      .from("products")
      .select("*");

    if (error) throw error;

    console.log(`Found ${products.length} products to check`);

    const results = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertsSent: 0,
    };

    for (const product of products) {
      try {
        // 1. Fetch user details to ensure user exists
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(
          product.user_id
        );
        
        if (userError || !user) {
          console.log(`No user found for product ${product.id}, skipping.`);
          results.failed++;
          continue;
        }

        // 2. Scrape live web data
        const productData = await scrapeProduct(product.url);

        if (!productData || !productData.currentPrice) {
          console.log(`Could not find live price for product ${product.id}`);
          results.failed++;
          continue;
        }

        const newPrice = Number(productData.currentPrice);
        const oldPrice = Number(product.current_price);

        if (isNaN(newPrice) || isNaN(oldPrice)) {
          console.log(`Invalid price values for product ${product.id}`);
          results.failed++;
          continue;
        }

        console.log(`Product ${product.id}: old=${oldPrice}, new=${newPrice}`);

        // 3. Update products table
        const { error: updateError } = await supabase
          .from("products")
          .update({
            current_price: newPrice,
            currency: productData.currencyCode || product.currency,
            name: productData.productName || product.name,
            image_url: productData.productImageUrl || product.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (updateError) {
          console.error(`Supabase 'products' table update failed for ${product.id}:`, updateError);
          results.failed++;
          continue; 
        }

        // 4. Handle history tracking & alerting if the price shifted
        if (Math.abs(oldPrice - newPrice) > 0.01) {
          
          // Fixed: Matches your exact schema (removed non-existent 'currency' column)
          const { error: historyError } = await supabase
            .from("price_history")
            .insert({
              product_id: product.id,
              price: newPrice,
            });

          if (historyError) {
            console.error(`Supabase 'price_history' insert failed for ${product.id}:`, historyError);
          }

          results.priceChanges++;

          // 5. Send an email alert if it is a price drop
          if (newPrice < oldPrice) {
            console.log(`Price drop detected for ${product.id}! Sending alert.`);
            if (user?.email) {
              const emailResult = await sendPriceDropAlert(
                user.email,
                product,
                oldPrice,
                newPrice
              );
              if (emailResult?.success) {
                results.alertsSent++;
              }
            }
          } else {
            console.log(`Price changed for ${product.id}, but it was a price increase/neutral change.`);
          }
        }

        results.updated++;
      } catch (loopError) {
        console.error(`Error processing individual product loop loop for ${product.id}:`, loopError);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Price check completed",
      results,
    });
  } catch (error) {
    console.error("Cron job root error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const result = await sendPriceDropAlert(
    "kattiakash35@gmail.com", 
    {
      name: "TEST PRODUCT",
      currency: "INR",
      image_url: "https://via.placeholder.com/300",
      url: "https://example.com",
    },
    1000,
    799
  );

  return NextResponse.json(result);
}


// h