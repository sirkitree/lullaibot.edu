import React, { useState, useEffect, useRef } from 'react';
import '../styles/search.css';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  suggestions: string[];
  placeholder?: string;
  loading?: boolean;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  value,
  onChange,
  onSearch,
  suggestions,
  placeholder = 'Search...',
  loading = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input value
  useEffect(() => {
    if (!value.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );

    // Limit to 5 suggestions for better UX
    setFilteredSuggestions(filtered.slice(0, 5));
  }, [value, suggestions]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } 
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } 
    // Enter
    else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        handleSuggestionClick(filteredSuggestions[highlightedIndex]);
      } else {
        onSearch();
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-autocomplete-container">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
        />
        {loading && <div className="search-spinner"></div>}
        <button 
          onClick={onSearch} 
          className="button-primary search-button"
          disabled={loading}
        >
          Search
        </button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="suggestions-container" 
          id="search-suggestions"
          role="listbox"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete; 