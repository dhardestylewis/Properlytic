import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { kv } from "@vercel/kv";
import { NEIGHBORHOOD_TO_CD_MAP } from "@/lib/config";

export async function POST(req: NextRequest) {
  const {
    neighborhood,
    building_classes,
    min_price,
    max_price,
    sort_by = 'predicted_sale_price',
    sort_order = 'descending',
    limit = 5,
  } = await req.json();

  // supply the cookie store to match createClient's required parameter
  const supabase = createClient(req.headers);

  let query = supabase.from("properties").select(`
    address, cd, zipcode, bldgclass,
    latitude, longitude,
    predicted_sale_price, sale_price, yearbuilt, floorarea
  `);

  if (building_classes && building_classes.length > 0) {
    query = query.in('bldgclass', building_classes);
  }

  if (neighborhood) {
    const config = await kv.get<any>('realestate:config:v1');
    const cdMap = config?.neighborhoodToCdMap || NEIGHBORHOOD_TO_CD_MAP;
    const searchKey = neighborhood.toLowerCase();
    if (cdMap[searchKey]) {
      const cdList = cdMap[searchKey];
      query = query.in('cd', cdList);
    } else {
      return NextResponse.json({ error: `I don't have data for '${neighborhood}'.` }, { status: 400 });
    }
  }

  if (min_price) {
    query = query.gte('predicted_sale_price', min_price);
  }
  if (max_price) {
    query = query.lte('predicted_sale_price', max_price);
  }

  query = query.order(sort_by, { ascending: sort_order === 'ascending' });
  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("Supabase query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
