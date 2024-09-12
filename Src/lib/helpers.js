import {showMessage} from 'react-native-flash-message';

export const getErrorMessageFromResponse = err => {
  const defaultMessage = 'Error occurred, please try again later'; // A default message in case neither messages nor message is available
  const message = err?.response?.data?.messages
    ? Object.values(err.response.data.messages)[0][0]
    : err?.response?.data?.message || defaultMessage;

  showMessage({
    message: message,
    type: 'danger',
  });
};

export const showAlert = (msg, icon = 'success') => {
  showMessage({
    message: msg,
    type: icon,
  });
};

export function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
