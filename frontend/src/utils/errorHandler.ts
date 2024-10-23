import { message } from 'antd';
import { errorMessages } from './errorMessages';

export const handleError = (error: any) => {
  console.error('An error occurred:', error);

  let errorMessage = errorMessages.default;

  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        errorMessage = errorMessages.unauthorized;
        break;
      case 404:
        errorMessage = errorMessages.notFound;
        break;
      case 500:
        errorMessage = errorMessages.serverError;
        break;
      default:
        errorMessage = error.response.data.message || errorMessages.default;
    }
  } else if (error.request) {
    errorMessage = errorMessages.network;
  } else if (error.message) {
    errorMessage = error.message;
  }

  message.error(errorMessage);
};

export const showSuccess = (msg: string) => {
  message.success(msg);
};
