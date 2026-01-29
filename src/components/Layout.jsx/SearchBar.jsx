import React, { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ placeholder = 'Search...', onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const mockData = [
    { id: 1, type: 'class', name: 'Introduction to Web Development', category: 'Classes' },
    { id: 2, type: 'assignment', name: 'Web Development Project', category: 'Assignments' },
    { id: 3, type: 'student', name: 'John Doe', category: 'People' },
    { id: 4, type: 'material', name: 'HTML Basics', category: 'Materials' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = mockData.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setShowResults(true);
      onSearch?.(query, filtered);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <Box className="relative">
      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => searchQuery && setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            <List className="p-0">
              {results.map((result, index) => (
                <ListItem
                  key={result.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0"
                >
                  <ListItemText
                    primary={result.name}
                    secondary={result.category}
                  />
                </ListItem>
              ))}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default SearchBar;
