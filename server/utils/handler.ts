// handle error
export const handleError = (error: any, res: any, next: any) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.message ?? "Something went wrong";
  console.error(error);
  res.status(statusCode).json({ message });
  next();
};

// handle success
export const handleSuccess = (data: any, res: any) => {
  res.status(200).json(data);
};

// handle creation
export const handleCreation = (data: any, res: any) => {
  res.status(201).json(data);
};

// handle not found
export const handleNotFound = (res: any, message: string, next: any) => {
  res.status(404).json({ message });
  next();
};
