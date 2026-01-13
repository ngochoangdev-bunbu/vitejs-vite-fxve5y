/**
 * Stripeにカードを登録（フロント側で返り値のurlに移動）
 *
 * @param email - メールアドレス
 * @param name - 名前
 * @param successUrl - 成功した場合に移動するurl
 * @param cancelUrl - キャンセルした場合に移動するurl
 * @returns sessionUrl - Stripeのカード登録ページのurl
 */
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Stripeのシークレットキーを設定
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface Body {
  email: string;
  name: string;
  successUrl: string;
  cancelUrl: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, successUrl, cancelUrl }: Body = body;

    const customers = await stripe.customers.list({
      email: email,
    });
    let customer;
    if (customers.data.length > 0) {
      //既存の顧客
      customer = customers.data[0];
    } else {
      //新規顧客
      customer = await stripe.customers.create({
        email: email,
        name: name,
      });
    }
    //Checkoutセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "setup",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customer.id, //顧客ID
    });

    // 成功時のレスポンス
    return NextResponse.json({
      success: true,
      sessionUrl: session.url,
    });
  } catch (error) {
    // エラー時のレスポンス
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
