import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Bell as BellIcon, Settings as SettingsIcon, Menu as MenuIcon } from '@mui/icons-material';

const Header = ({ onMenuOpen, user = {} }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md">
      <Toolbar className="flex justify-between">
        {/* Left side */}
        <Box className="flex items-center gap-4">
          <IconButton onClick={onMenuOpen} className="lg:hidden">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="font-bold">
            Google Classroom
          </Typography>
        </Box>

        {/* Right side */}
        <Box className="flex items-center gap-4">
          <IconButton>
            <BellIcon />
          </IconButton>
          <IconButton>
            <SettingsIcon />
          </IconButton>
          <IconButton onClick={handleMenuOpen}>
            <Avatar src={user.avatar || 'https://i.pravatar.cc/40'} alt={user.name || 'User'} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
