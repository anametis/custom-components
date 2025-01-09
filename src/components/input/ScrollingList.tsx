'use client'
import { useState, useRef, useEffect } from "react";

interface Item {
  id: number;
  name: string;
}

const ScrollingList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Type the items array
  const items: Item[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Book ${i + 1}`,
  }));

  const handleSelect = (item: Item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && selectedItem && listRef.current) {
      const list = listRef.current;
      const selectedElement = list.querySelector(
        `[data-id="${selectedItem.id}"]`
      ) as HTMLElement;

      if (selectedElement) {
        // Calculate the scroll position to center the item
        const listRect = list.getBoundingClientRect();
        const elementRect = selectedElement.getBoundingClientRect();
        const scrollTop =
          selectedElement.offsetTop -
          listRect.height / 2 +
          elementRect.height / 2;

        list.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }
  }, [isOpen, selectedItem]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Selected item display / Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-white border rounded-lg shadow-sm hover:bg-gray-50"
      >
        <span>{selectedItem ? selectedItem.name : "Select a book..."}</span>
        {isOpen ? <span>👆</span> : <span>👇</span>}
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <div className="relative mt-2">
          <div
            ref={listRef}
            className="absolute w-full max-h-64 overflow-y-auto border rounded-lg bg-white shadow-lg z-10"
          >
            {items.map((item) => (
              <button
                key={item.id}
                data-id={item.id}
                onClick={() => handleSelect(item)}
                className={`w-full p-3 text-left hover:bg-gray-50 ${
                  selectedItem?.id === item.id ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollingList;
