export default function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className="mt-2 text-sm font-semibold text-red-700" role="alert">{message}</p>;
}
