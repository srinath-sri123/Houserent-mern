import React, { createContext, useContext, useState, useEffect } from 'react';

const PropertyContext = createContext();

const initialFilters = {
  keyword: '',
  city: 'All',
  propertyType: 'All',
  minPrice: '',
  maxPrice: '',
  bedrooms: 'All',
  bathrooms: 'All',
  furnishedStatus: 'All',
  amenities: [],
  sort: 'newest',
};

export const PropertyProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('househunt_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    localStorage.setItem('househunt_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (property) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p._id === property._id);
      if (exists) {
        return prev.filter((p) => p._id !== property._id);
      } else {
        return [...prev, property];
      }
    });
  };

  const isFavorite = (propertyId) => {
    return favorites.some((p) => p._id === propertyId);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PropertyContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => useContext(PropertyContext);
