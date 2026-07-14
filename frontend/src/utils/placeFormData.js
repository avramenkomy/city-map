export function buildPlaceFormData(form) {
  const formData = new FormData();

  formData.append('category_id', form.category_id);
  formData.append('title', form.title);
  formData.append('description', form.description);
  formData.append('address', form.address);
  formData.append('latitude', form.latitude);
  formData.append('longitude', form.longitude);

  if (form.image) formData.append('image', form.image);

  return formData;
}
