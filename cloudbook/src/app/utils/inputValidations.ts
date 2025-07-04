'use client';
import { useEffect } from 'react';
const useInputValidation = () => {
  useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'file') {
        return;
      }
      let value = target.value;
      if (target.classList.contains('only_number')) {
        value = value.replace(/[^\d]/g, '');
      }
      if (target.classList.contains('alphabet_only')) {
        value = value.replace(/[^a-zA-Z\s]/g, '');
      }
      if (target.classList.contains('number_with_decimal')) {
        value = value.replace(/[^0-9.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) {
          value = parts[0] + '.' + parts.slice(1).join('');
          const firstDecimalIndex = value.indexOf('.');
          if (firstDecimalIndex !== -1) {
            value = value.substring(0, firstDecimalIndex + 1) + value.substring(firstDecimalIndex + 1).replace(/\./g, '');
          }
        }
        const decimalPartIndex = value.indexOf('.');
        if (decimalPartIndex !== -1 && value.length > decimalPartIndex + 3) {
          value = value.substring(0, decimalPartIndex + 3);
        }
      }
      if (target.classList.contains('alphanumeric')) {
        value = value.replace(/[^a-zA-Z0-9\s]/g, '');
      }
      if (target.classList.contains('capitalize')) {
        value = value.replace(/\b\w/g, char => char.toUpperCase());
      }
      if (target.classList.contains('no_space')) {
        value = value.replace(/\s+/g, '');
      }
      if (target.classList.contains('all_uppercase')) {
        value = value.toUpperCase();
      }
         target.value = value;
    };
    document.addEventListener('input', handleInput);
    return () => {
      document.removeEventListener('input', handleInput);
    };
  }, []);  
};
export default useInputValidation;