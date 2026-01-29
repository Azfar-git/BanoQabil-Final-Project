import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  InsertLink,
  InsertPhoto,
  AttachFile,
  Code,
  FormatQuote,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Undo,
  Redo,
} from '@mui/icons-material';

const RichTextEditor = ({ value, onChange, placeholder = 'Write something...' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [fontSize, setFontSize] = useState('16px');

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'script',
    'list', 'indent', 'direction',
    'align', 'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  const customToolbar = () => (
    <Box className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap items-center gap-1">
      {/* Font Size */}
      <FormControl size="small" sx={{ minWidth: 80, mr: 1 }}>
        <InputLabel>Size</InputLabel>
        <Select
          value={fontSize}
          label="Size"
          onChange={(e) => setFontSize(e.target.value)}
        >
          {['12px', '14px', '16px', '18px', '24px', '32px'].map((size) => (
            <MenuItem key={size} value={size}>{size}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Formatting */}
      <Tooltip title="Bold">
        <IconButton size="small">
          <FormatBold />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton size="small">
          <FormatItalic />
        </IconButton>
      </Tooltip>
      <Tooltip title="Underline">
        <IconButton size="small">
          <FormatUnderlined />
        </IconButton>
      </Tooltip>

      <Box className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <Tooltip title="Bullet List">
        <IconButton size="small">
          <FormatListBulleted />
        </IconButton>
      </Tooltip>
      <Tooltip title="Numbered List">
        <IconButton size="small">
          <FormatListNumbered />
        </IconButton>
      </Tooltip>

      {/* Alignment */}
      <Tooltip title="Align Left">
        <IconButton size="small">
          <FormatAlignLeft />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Center">
        <IconButton size="small">
          <FormatAlignCenter />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Right">
        <IconButton size="small">
          <FormatAlignRight />
        </IconButton>
      </Tooltip>

      <Box className="w-px h-6 bg-gray-300 mx-1" />

      {/* Insert */}
      <Tooltip title="Insert Link">
        <IconButton size="small">
          <InsertLink />
        </IconButton>
      </Tooltip>
      <Tooltip title="Insert Image">
        <IconButton size="small">
          <InsertPhoto />
        </IconButton>
      </Tooltip>
      <Tooltip title="Attach File">
        <IconButton size="small">
          <AttachFile />
        </IconButton>
      </Tooltip>

      {/* Code & Quotes */}
      <Tooltip title="Code Block">
        <IconButton size="small">
          <Code />
        </IconButton>
      </Tooltip>
      <Tooltip title="Blockquote">
        <IconButton size="small">
          <FormatQuote />
        </IconButton>
      </Tooltip>

      <Box className="w-px h-6 bg-gray-300 mx-1" />

      {/* Undo/Redo */}
      <Tooltip title="Undo">
        <IconButton size="small">
          <Undo />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton size="small">
          <Redo />
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Box className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
      {customToolbar()}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[200px]"
        style={{
          border: 'none',
          fontFamily: '"Lato", Arial, sans-serif',
        }}
      />
      <Box className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
        Supports Markdown, HTML, and rich text formatting
      </Box>
    </Box>
  );
};

export default RichTextEditor;
