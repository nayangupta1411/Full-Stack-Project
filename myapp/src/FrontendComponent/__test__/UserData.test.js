import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import UserData from '../UserData';
import {BrowserRouter} from 'react-router-dom';

jest.mock('axios');

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });


describe('UserData Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders UserData component with valid token', async () => {
    localStorage.setItem('token', 'validToken');
    axios.get.mockResolvedValue({ data: { userid: '123', token: 'validToken', roleBasedAccess : "admin" } });

    render(<BrowserRouter><UserData /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText(/User's Data/i)).toBeInTheDocument();
    });
  });

  test('renders UserData component with invalid token', async () => {
    localStorage.setItem('token', 'invalidToken');
    axios.get.mockResolvedValue({ data: { userid: '123', token: 'validToken' } });

    render(<BrowserRouter><UserData /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Token is expire so firstly login in/i)).toBeInTheDocument();
    });
  });

  test('renders UserData component with invalid userid', async () => {
    localStorage.setItem('token', 'validToken');
    localStorage.setItem('userid', '123456');
    axios.get.mockResolvedValue({ data: { userid: '123', token: 'validToken' } });

    render(<BrowserRouter><UserData /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Token is expire so firstly login in/i)).toBeInTheDocument();
    });
  });


  test('renders UserData component with invalid role', async () => {
    localStorage.setItem('token', 'validToken');
    localStorage.setItem('userid', '123');
    localStorage.setItem('roleBasedAccess', 'admin');
    axios.get.mockResolvedValue({ data: { userid: '123', token: 'validToken', roleBasedAccess: "user" } });

    render(<BrowserRouter><UserData /></BrowserRouter>);

    // await waitFor(() => {
    //   expect(screen.getByText(/Token is expire so firstly login in/i)).toBe();
    // });
  });
  test('handles error and clears local storage', async () => {
    localStorage.setItem('token', 'validToken');
    axios.get.mockRejectedValue(new Error('Fake error'));

    const showAlertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<BrowserRouter><UserData /></BrowserRouter>);

    await waitFor(() => {
      // Ensure that the error message is logged
      expect(console.error).toHaveBeenCalledWith(expect.any(Error));

      // Ensure that local storage is cleared
      expect(localStorage.getItem('token')).toBeNull();

      expect(showAlertSpy).toHaveBeenCalledWith('Bad Request !!');

      // Ensure that navigation to '/usersignin' is triggered
      // (You might need to adjust this based on how your navigation works)
      // expect(navigate).toHaveBeenCalledWith('/usersignin');
    });
  });

  test('logs out on button click', () => {
    localStorage.setItem('token', 'validToken');
    axios.get.mockResolvedValue({ data: { userid: '123', token: 'validToken' } });

    render(<BrowserRouter><UserData /></BrowserRouter>);
    
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('token')).toBeNull();
  });
});
