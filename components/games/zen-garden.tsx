"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { id: "rock", icon: "🪨" },
  { id: "flower", icon: "🌸" },
  { id: "tree", icon: "🌲" },
  { id: "bamboo", icon: "🎋" },
];

interface PlacedItem {
  id: string;
  icon: string;
  x: number;
  y: number;
}

export default function ZenGarden() {
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const gardenRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gardenRef.current) return;
    const rect = gardenRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPlacedItems([
      ...placedItems,
      { ...selectedItem, id: `${selectedItem.id}-${Date.now()}`, x, y },
    ]);
  };

  const handleClear = () => {
    setPlacedItems([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {items.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedItem(item)}
              className={`p-3 rounded-lg transition-colors ${
                selectedItem.id === item.id
                  ? "bg-primary/20 ring-2 ring-primary"
                  : "bg-primary/5"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
            </motion.button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={handleClear} className="gap-2">
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>
      <div
        ref={gardenRef}
        onClick={handleCanvasClick}
        className="relative w-full h-[400px] bg-primary/5 rounded-lg cursor-pointer overflow-hidden border-2 border-dashed border-primary/20"
      >
        {placedItems.map((item) => (
          <motion.div
            key={item.id}
            drag
            dragConstraints={gardenRef}
            dragElastic={0.2}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: "absolute",
              left: item.x - 16, // Center the item
              top: item.y - 16,
            }}
            className="text-3xl cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()} // Prevent placing a new item when dragging
          >
            {item.icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
