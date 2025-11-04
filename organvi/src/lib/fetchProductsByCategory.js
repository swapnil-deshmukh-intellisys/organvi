import groq from 'groq'
import {sanityClient} from './sanityClient'
import {urlFor} from './imageUrl'

const queryByKey = groq`*[_type == "simpleProduct" && category->key == $key]|order(title asc){
  _id,
  title,
  description,
  basePrice,
  discountPercent,
  inStock,
  images
}`

export async function fetchProductsByCategoryKey(categoryKey) {
  const data = await sanityClient.fetch(queryByKey, {key: categoryKey})
  return (data || []).map((p) => {
    const base = typeof p.basePrice === 'number' ? p.basePrice : 0
    const disc = typeof p.discountPercent === 'number' ? p.discountPercent : 0
    const price = Math.max(0, Math.round(base * (1 - disc / 100)))
    return {
    id: p._id,
    name: p.title,
    description: p.description,
    price,
    originalPrice: base,
    discount: disc,
    image: p.images?.[0] ? urlFor(p.images[0]).width(800).height(800).fit('crop').url() : '',
    inStock: Boolean(p.inStock),
    organic: true,
  }
  )
}
}


