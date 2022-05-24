import React from 'react';
import { render, screen, fireEvent, act} from '@testing-library/react';
import HomePage from './index';
import { useNavigate } from "react-router-dom";
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => jest.fn(),
  };
  jest.mock("react-router-dom", () => ({
    ...(jest.requireActual("react-router-dom") as any),
    useNavigate: () => mockedUsedNavigate,
  }));
});

describe('Home page', () => {

  beforeEach(() => {
    jest.useFakeTimers();
  })

  test('Testing ui elements', async () => {
    render(<HomePage />);
    const formWrapper = await screen.findByRole('wrapper');
    const form = await screen.findByRole('form');
    const email = await screen.findByRole('emailInput');
    const phone = await screen.findByRole('phoneInput');
    const submit = await screen.findByRole('submitButton');

    expect(!!formWrapper).toBeTruthy();
    expect(!!form).toBeTruthy();
    expect(!!email).toBeTruthy();
    expect(!!phone).toBeTruthy();
    expect(!!submit).toBeTruthy();
  });

  test('Email input will return error when email is invalid', async () => {
    render(<HomePage />);
    const email = await screen.findByRole('emailInput');
    const wrongValue = 'test1234';

    fireEvent.change(email, {
      target: {
        value: wrongValue,
      },
    });

    await act(async () => {
      jest.runAllTimers();
    })

    // @ts-ignore
    expect(email.value).toBe(wrongValue);

    const errors = await screen.findAllByRole('error');
    expect(errors[0].textContent).toBe('Invalid user email')
  });

  test('Phone input will return error when phone number is invalid', async () => {
    render(<HomePage />);
    const phone = await screen.findByRole('phoneInput');
    const wrongValue = 'test1234';

    fireEvent.change(phone, {
      target: {
        value: wrongValue,
      },
    });

    await act(async () => {
      jest.runAllTimers();
    })

    // @ts-ignore
    expect(phone.value).toBe(wrongValue);

    const errors = await screen.findAllByRole('error');
    expect(errors[1].textContent).toBe('Invalid phone number')
  });

  test('Onsubmit will return global error', async () => {
    render(<HomePage />);
    const form = await screen.findByRole('form');

    fireEvent.submit(form);

    await act(async () => {
      jest.runAllTimers();
    })


    const errors = await screen.findAllByRole('error');
    expect(errors[2].textContent).toBe('Please fix all issues around the fields');
  });

  ///////   HW

  test('Email input will not return error when email is valid', async () => {
    render(<HomePage />);
    const emailInput = await screen.findByRole('emailInput');
    const validEmail = 'ss@dd.s'
    const validPhone = '1111111111';
    const phoneInput = await screen.findByRole('phoneInput')
    const form = await screen.findByRole('form');

    fireEvent.change(phoneInput, {
      target: {
        value: validPhone,
      },
    });
    fireEvent.change(emailInput, {
      target: {
        value: validEmail,
      },
    });

    fireEvent.submit(form)

    await act(async () => {
      jest.runAllTimers();
    })


    const errors = (await screen.findAllByRole('error')).map(error => error.textContent).filter(a => a);
    expect(errors.length).toBe(0)
  })
  test("form submits", async () => {
    const navigate = useNavigate();
    const route = "/registration";
    navigate(route);
    render(<HomePage />);

    const form = await screen.findByRole("form");

    fireEvent.submit(form);

    await act(async () => {
      jest.runAllTimers();
    });

    const errors = await screen.findAllByRole("error");

    expect(errors[2].textContent?.length === 0).toBe(false);
  });
});




// test('renders learn react link', () => {
  //render(<HomePage />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
// });
