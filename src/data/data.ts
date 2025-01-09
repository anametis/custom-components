export interface Item {
  id: number
  name: string
  category: string
  price: number
  stock: number
  rating: number
  releaseDate: string
  manufacturer: string
  weight: number
  dimensions: string
}

export async function fetchItems(): Promise<Item[]> {
  // In a real application, this would fetch data from an API or database
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Books', 'Food'][Math.floor(Math.random() * 4)],
    price: Math.floor(Math.random() * 1000) + 1,
    stock: Math.floor(Math.random() * 100),
    rating: Number((Math.random() * 5).toFixed(1)),
    releaseDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)).toISOString().split('T')[0],
    manufacturer: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell'][Math.floor(Math.random() * 5)],
    weight: Number((Math.random() * 10).toFixed(2)),
    dimensions: `${Math.floor(Math.random() * 50)}x${Math.floor(Math.random() * 50)}x${Math.floor(Math.random() * 50)}`
  }))
}

