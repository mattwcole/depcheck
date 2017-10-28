export default () => (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.log(err);

  const response = process.env.NODE_ENV === 'development'
    ? { message: err.message, stack: err.stack }
    : { message: 'Oh my, it looks like we broke something, sorry about that!' };

  return res.status(500).json(response);
};
