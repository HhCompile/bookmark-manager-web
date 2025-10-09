// Debug utilities for development
export const debug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', ...args);
  }
};

export const debugComponent = (componentName, props) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[COMPONENT] ${componentName}`, props);
  }
};

export const debugApiCall = async (apiCall, ...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[API CALL]', apiCall.name || 'Anonymous', ...args);
    const startTime = performance.now();
    try {
      const result = await apiCall(...args);
      const endTime = performance.now();
      console.log('[API RESPONSE]', apiCall.name || 'Anonymous', {
        duration: `${(endTime - startTime).toFixed(2)}ms`,
        result
      });
      return result;
    } catch (error) {
      const endTime = performance.now();
      console.error('[API ERROR]', apiCall.name || 'Anonymous', {
        duration: `${(endTime - startTime).toFixed(2)}ms`,
        error
      });
      throw error;
    }
  } else {
    return await apiCall(...args);
  }
};