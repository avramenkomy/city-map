export default function FieldError({ id, name, getFieldError }) {
  const error = getFieldError(name);

  if (!error) return null;

  return (
    <p className="form-error" id={id} role="alert">
      {error}
    </p>
  )
}
