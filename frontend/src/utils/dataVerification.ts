export const verifyData = (frontendData: any, backendData: any) => {
  const frontendKeys = Object.keys(frontendData);
  const backendKeys = Object.keys(backendData);

  if (frontendKeys.length !== backendKeys.length) {
    console.warn('Data mismatch: Different number of properties');
    return false;
  }

  for (let key of frontendKeys) {
    if (frontendData[key] !== backendData[key]) {
      console.warn(`Data mismatch for key: ${key}`);
      return false;
    }
  }

  return true;
};
