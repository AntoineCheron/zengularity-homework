export const thenGeneric = (response, callback, catchMethod) => {
  if (response.status === 200) {
    callback(response.data);
  } else {
    catchMethod(response);
  }
};

export const catchGeneric = (error, catchMethod) => catchMethod(error);
