'use client';

import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type SearchBarProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const SearchBar = ({ value, onChange, placeholder = 'Search courses...' }: SearchBarProps) => {
  return (
    <TextField
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
      height: '2.8rem',
      backgroundColor: '#1c1c1e', // Dark charcoal background
      color: 'white',
      borderRadius: '0.5rem',
      '& fieldset': {
        borderColor: '#333', // Subtle dark border
      },
      '&:hover fieldset': {
        borderColor: '#555', // Slightly lighter on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#8b6b31', // Accent color on focus (matches your theme)
      },
    },
    '& .MuiInputAdornment-root': {
      color: 'white', // Icon color
    },
    input: {
      color: 'white', // Input text color
    },
  }}
      variant="outlined"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
