import {useState} from 'react';

export const useHandleInputs = initialValues => {
  const [inputs, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleInputs = event => {
    const {name, value, type, files} = event.target;

    setValues(prev => {
      // Handle file inputs
      if (type === 'file') {
        return {...prev, [name]: files.length > 1 ? [...files] : files[0]};
      }

      // Check if the name indicates an array structure (e.g., "arrayName[index][fieldName]")
      const arrayPattern = /\[(\d+)\]\[(\w+)\]/;
      if (arrayPattern.test(name)) {
        const [, index, field] = name.match(arrayPattern);
        const arrayIndex = parseInt(index, 10);
        const arrayName = name.split('[')[0];

        // Update the specific field in the array
        return {
          ...prev,
          [arrayName]: prev[arrayName].map((item, idx) =>
            idx === arrayIndex ? {...item, [field]: value} : item,
          ),
        };
      }

      // Handle other inputs
      return {...prev, [name]: value};
    });
  };

  // Function to programmatically set input values
  const setInputs = newValues => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
  };

  const handleError = (text, input) => {
    setErrors(prev => ({
      ...prev,
      [input]: text,
    }));
  };

  return [inputs, handleInputs, setInputs, errors, handleError];
};
