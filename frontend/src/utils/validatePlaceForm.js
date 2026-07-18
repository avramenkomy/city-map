import { isBlank, isValidLatitude, isValidLongitude } from './coordinates';

const CATEGORY_REQ = 'places.validation.categoryRequired';
const TITLE_REQ = 'places.validation.titleRequired';

const LATITUDE_REQ = 'places.validation.latitudeRequired';
const LATITUDE_INVALID = 'places.validation.latitudeInvalid';

const LONGITUDE_REQ = 'places.validation.longitudeRequired';
const LONGITUDE_INVALID = 'places.validation.longitudeInvalid';


export function validatePlaceForm(form) {
  const errors = {}

  if (isBlank(form.category_id)) {
    errors.category_id = CATEGORY_REQ;
  }

  if (isBlank(form.title)) {
    errors.title = TITLE_REQ;
  }

  if (isBlank(form.latitude)) {
    errors.latitude = LATITUDE_REQ;
  } else if (!isValidLatitude(form.latitude)) {
    errors.latitude = LATITUDE_INVALID;
  }

  if (isBlank(form.longitude)) {
    errors.longitude = LONGITUDE_REQ;
  } else if (!isValidLongitude(form.longitude)) {
    errors.longitude = LONGITUDE_INVALID;
  }

  return errors;
}


export function hasPlaceFormErrors(errors) {
  return Object.keys(errors).some(fieldName => Boolean(errors[fieldName]));
}
