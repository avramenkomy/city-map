const CATEGORY_REQ = 'places.validation.categoryRequired';
const TITLE_REQ = 'places.validation.titleRequired';

const LATITUDE_REQ = 'places.validation.latitudeRequired';
const LATITUDE_INVALID = 'places.validation.latitudeInvalid';
const MIN_LATITUDE_VAL = -90;
const MAX_LATITUDE_VAL = 90;

const LONGITUDE_REQ = 'places.validation.longitudeRequired';
const LONGITUDE_INVALID = 'places.validation.longitudeInvalid';
const MIN_LONGITUDE_VAL = -180;
const MAX_LONGITUDE_VAL = 180;

function isBlank(value) {
  return String(value || '').trim() === '';
}

function isNumberInRange(value, min, max) {
  if (isBlank(value)) return false;

  const numberValue = Number(value);

  return !isNaN(numberValue) && numberValue >= min && numberValue <= max;
}


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
  } else if (!isNumberInRange(form.latitude, MIN_LATITUDE_VAL, MAX_LATITUDE_VAL)) {
    errors.latitude = LATITUDE_INVALID;
  }

  if (isBlank(form.longitude)) {
    errors.longitude = LONGITUDE_REQ;
  } else if (!isNumberInRange(form.longitude, MIN_LONGITUDE_VAL, MAX_LONGITUDE_VAL)) {
    errors.longitude = LONGITUDE_INVALID;
  }

  return errors;
}


export function hasPlaceFormErrors(errors) {
  return Object.keys(errors).some(fieldName => Boolean(errors[fieldName]));
}
