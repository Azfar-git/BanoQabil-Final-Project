import React, { useRef } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Grip as GripIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const DragDropList = ({ items, onReorder, renderItem }) => {
  const draggedItem = useRef(null);
  const draggedOverItem = useRef(null);

  const handleDragStart = (e, index) => {
    draggedItem.current = index;
  };

  const handleDragOver = (e, index) => {
    draggedOverItem.current = index;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedItem.current !== draggedOverItem.current && onReorder) {
      const newItems = [...items];
      const draggedItemContent = newItems[draggedItem.current];
      newItems.splice(draggedItem.current, 1);
      newItems.splice(draggedOverItem.current, 0, draggedItemContent);
      onReorder(newItems);
    }
  };

  return (
    <List className="space-y-2">
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="cursor-move"
        >
          <ListItem className="bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <ListItemIcon>
              <GripIcon className="text-gray-400" />
            </ListItemIcon>
            <ListItemText
              primary={renderItem ? renderItem(item) : item.name}
              secondary={item.description}
            />
          </ListItem>
        </motion.div>
      ))}
    </List>
  );
};

export default DragDropList;
