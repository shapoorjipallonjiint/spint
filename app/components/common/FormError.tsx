export const FormError = ({ error }: { error?: string }) => {
  if (!error) return null;

  // data-form-error: lets the language tabs scroll to the first error after a failed submit
  return <p data-form-error className="text-red-500 text-sm mt-1">{error}</p>;
};
