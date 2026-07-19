import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import FieldError from '../FieldError';

describe('FieldError', () => {
  it ('render nothing if no errors', () => {
    const getFieldError = vi.fn(() => null);

    const { container } = render(
      <FieldError
        id="username-error"
        name="username"
        getFieldError={getFieldError}
      />
    );

    expect(container).toBeEmptyDOMElement();
    expect(getFieldError).toHaveBeenCalledWith('username');
  });


  it('renders error text when error exists', () => {
    const getFieldError = vi.fn(() => 'Введите имя пользователя.');

    render (
      <FieldError
        id="username-error"
        name="username"
        getFieldError={getFieldError}
      />
    )

    const error = screen.getByRole('alert');

    expect(error).toBeInTheDocument();
    expect(error).toHaveClass('form-error');
    expect(error).toHaveAttribute('id', 'username-error')
    expect(error).toHaveTextContent('Введите имя пользователя.');
    expect(getFieldError).toHaveBeenCalledWith('username');
  });


  it ('renders backend error text the same way as client error text', () => {
    const getFieldError = vi.fn(() => 'User with this username already exists.');

    render(
      <FieldError
        id="register-username-error"
        name="username"
        getFieldError={getFieldError}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'User with this username already exists.',
    );
  });
});
