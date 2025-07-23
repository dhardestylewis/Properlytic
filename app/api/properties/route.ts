import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { searchParams } = new URL(request.url)
  
  let query = supabase.from('properties').select('id, title, price, address, beds, baths, sqft, lat, lng')

  const minPrice = searchParams.get('min_price')
  if (minPrice) {
    query = query.gte('price', minPrice)
  }

  const maxPrice = searchParams.get('max_price')
  if (maxPrice) {
    query = query.lte('price', maxPrice)
  }

  const minBeds = searchParams.get('min_beds')
  if (minBeds) {
    query = query.gte('beds', minBeds)
  }

  const minBaths = searchParams.get('min_baths')
  if (minBaths) {
    query = query.gte('baths', minBaths)
  }

  const { data: properties, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(properties)
}
