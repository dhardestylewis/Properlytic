import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import * as ss from 'simple-statistics';

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: "Address is required." }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: propertyHistory, error } = await supabase
    .from('properties')
    .select('sale_year, sale_price')
    .eq('address', address.toUpperCase())
    .order('sale_year');

  if (error || !propertyHistory) {
    return NextResponse.json({ error: "Error fetching property history." }, { status: 500 });
  }

  if (propertyHistory.length < 2) {
    return NextResponse.json({ error: "Not enough historical data to create a forecast. At least 2 sales are needed." }, { status: 400 });
  }

  const historicalData = propertyHistory.map(p => ({ year: p.sale_year, price: p.sale_price }));
  const regressionData = historicalData.map(p => [p.year, p.price]);
  
  const linearRegression = ss.linearRegression(regressionData);
  const line = ss.linearRegressionLine(linearRegression);

  const lastYear = historicalData[historicalData.length - 1].year;
  const forecastYears = Array.from({ length: 5 }, (_, i) => lastYear + i + 1);
  
  const forecastData = forecastYears.map(year => ({
    year,
    price: line(year)
  }));

  return NextResponse.json({
    status: "Chart data created successfully.",
    historicalData,
    forecastData,
  });
}
