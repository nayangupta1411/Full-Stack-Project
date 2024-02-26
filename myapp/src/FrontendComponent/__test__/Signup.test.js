import { render, screen, cleanup,act,waitFor, fireEvent,rerender } from '@testing-library/react';
import Signup, { reloadPage } from '../Signup';
import {BrowserRouter as Router} from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import React , { useState } from 'react';
import axios from 'axios';


afterEach(cleanup);

test('test' ,() => {

    render(
        <Router>
    <Signup />
    </Router>);
    const signup=screen.getByTestId('signup-1');
    expect(signup).toBeInTheDocument();  

})


describe("Signup component", () => {
    it("Filling details and clicking buttons in a signup gorm", async () => {
      render(
        <Router>
          <Signup />
        </Router>
      );
  
      userEvent.type(screen.getByLabelText("name"));
      userEvent.type(screen.getByLabelText("email"));
      userEvent.type(screen.getByLabelText("password"));
      userEvent.type(screen.getByLabelText("confirm_password"));
      userEvent.type(screen.getByRole("radio" ,{ checked : true }));
      userEvent.click(screen.getByRole("button", { name: "Submit" }));
    });
  });


jest.mock('axios');

global.alert = jest.fn();
const originalLocation = global.window.location;
global.window.location = { ...originalLocation, reload: jest.fn() };

// beforeAll(() => {
//   Object.defineProperty(window.location, 'reload', {
//     configurable: true,
//   });
//   window.location.reload = jest.fn();
// });

// afterAll(() => {
//   jest.restoreAllMocks();
// });

// delete window.location;
// window.location = { href: '' };

// beforeAll(() => {
//   Object.defineProperty(global.window, 'location', {
//     value: {
//       reload: jest.fn(),
//     },
//     writable: true,
//   });
// });

describe('Signup Component', () => {
  test('it renders and submits form correctly', async () => {
    const { rerender } = render(<Router><Signup /></Router>);

    // Mocking axios post
    axios.post.mockResolvedValue({ data: { status: false } });

    

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole("radio" ,{ checked : true }));

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the axios request to be resolved
    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    console.log('Current pathname:', global.window.location.pathname);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // await new Promise(resolve => setTimeout(resolve, 100));
    rerender(<Router><Signup /></Router>);

    // Assert that the component navigates to '/usersignin'
    expect(global.window.location.pathname).toEqual('/usersignin');
  });

  test('it shows an error message for mismatched passwords', () => {
    render(<MemoryRouter>
      <Signup />
    </MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password456' } });

    fireEvent.click(screen.getByText('Submit'));

    expect(global.alert).toHaveBeenCalledWith('confirm password not matched !!');
  });

  test("check response status", async () => {
    render(<MemoryRouter><Signup /></MemoryRouter>);

    axios.post.mockResolvedValue({ data: { status: true } });

    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      
      expect(global.alert).toHaveBeenCalledWith('email is already exists');
     
    });

    // await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Assertions for existing email scenario
    // expect(axios.post).toHaveBeenCalledWith(
    //   'http://127.0.0.1:5000/usersignup',
    //   {
    //     "confirm_password": "password123",
    //     "email": "john.doe@example.com",
    //     "name": "John Doe",
    //     "password": "password123",
    //     "roleBasedAccess": "user",
    //   },
    //   {"headers": {"Content-Type": "application/json"}, "responseType": "json"},
    // );

    // Ensure that window.location.reload() is called
    // expect(global.window.location.reload).toHaveBeenCalledTimes(1);
  

  });

});


