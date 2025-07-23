import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: "Address is required." }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('properties')
    .select('address, predicted_sale_price, sale_year')
    .ilike('address', `%${address}%`)
    .order('sale_year', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: `Address containing '${address}' not found.` }, { status: 404 });
  }

  return NextResponse.json({
    address: data.address,
    predicted_sale_price: data.predicted_sale_price,
    year: data.sale_year,
  });
}
