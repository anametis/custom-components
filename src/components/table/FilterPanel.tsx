import { useState, useEffect } from 'react'

interface FilterPanelProps {
  filters: {
    priceRange: [number, number]
    ratingMin: number
    manufacturers: string[]
    weightRange: [number, number]
    releaseDate: string
    stockMin: number
  }
  setFilters: React.Dispatch<React.SetStateAction<FilterPanelProps['filters']>>
  category: string
}

export default function FilterPanel({ filters, setFilters, category }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleApply = () => {
    setFilters(localFilters)
  }

  const renderCategorySpecificFilters = () => {
    switch (category) {
      case 'Electronics':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Release Date (After)</label>
              <input
                type="date"
                value={localFilters.releaseDate}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, releaseDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manufacturers</label>
              {['Apple', 'Samsung', 'Sony', 'LG', 'Dell'].map((manufacturer) => (
                <div key={manufacturer} className="flex items-center">
                  <input
                    type="checkbox"
                    id={manufacturer}
                    checked={localFilters.manufacturers.includes(manufacturer)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setLocalFilters(prev => ({ ...prev, manufacturers: [...prev.manufacturers, manufacturer] }))
                      } else {
                        setLocalFilters(prev => ({ ...prev, manufacturers: prev.manufacturers.filter(m => m !== manufacturer) }))
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <label htmlFor={manufacturer} className="ml-2 text-sm text-gray-700 dark:text-gray-300">{manufacturer}</label>
                </div>
              ))}
            </div>
          </div>
        )
      case 'Clothing':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <div key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    id={size}
                    checked={localFilters.manufacturers.includes(size)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setLocalFilters(prev => ({ ...prev, manufacturers: [...prev.manufacturers, size] }))
                      } else {
                        setLocalFilters(prev => ({ ...prev, manufacturers: prev.manufacturers.filter(s => s !== size) }))
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <label htmlFor={size} className="ml-2 text-sm text-gray-700 dark:text-gray-300">{size}</label>
                </div>
              ))}
            </div>
          </div>
        )
      case 'Books':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Publication Date (After)</label>
              <input
                type="date"
                value={localFilters.releaseDate}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, releaseDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        )
      case 'Food':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiration Date (Before)</label>
              <input
                type="date"
                value={localFilters.releaseDate}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, releaseDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-lg dark:bg-gray-700 space-y-6">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={localFilters.priceRange[0]}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, priceRange: [Number(e.target.value), prev.priceRange[1]] }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <span className="dark:text-white">to</span>
              <input
                type="number"
                value={localFilters.priceRange[1]}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Rating</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={localFilters.ratingMin}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, ratingMin: Number(e.target.value) }))}
              className="mt-1 block w-full"
            />
            <span className="dark:text-white">{localFilters.ratingMin.toFixed(1)}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight Range (kg)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={localFilters.weightRange[0]}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, weightRange: [Number(e.target.value), prev.weightRange[1]] }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <span className="dark:text-white">to</span>
              <input
                type="number"
                value={localFilters.weightRange[1]}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, weightRange: [prev.weightRange[0], Number(e.target.value)] }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Stock</label>
            <input
              type="number"
              value={localFilters.stockMin}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, stockMin: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>
      {renderCategorySpecificFilters()}
      <button
        onClick={handleApply}
        className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Apply Filters
      </button>
    </div>
  )
}

