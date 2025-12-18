export const FormError = ({ error }: { error?: string }) => {
  if (!error) return null;

  return <p className="text-red-500 text-sm mt-1">{error}</p>;
};
