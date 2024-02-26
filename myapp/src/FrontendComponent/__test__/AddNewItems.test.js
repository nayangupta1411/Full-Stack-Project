import React from 'react';
import { render, act, fireEvent, waitFor, getByTestId,screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import AddNewItems from '../AddNewItems';
import {BrowserRouter} from 'react-router-dom'; 



// Mock axios to simulate API calls
jest.mock('axios');
global.alert = jest.fn();


describe('AddNewItems Component ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches token on mount', async () => {
    axios.get.mockResolvedValue({ data: { userid: '123', token: 'fakeToken' } });
    act(() => {
      render(
        <BrowserRouter>
          <AddNewItems />
        </BrowserRouter>
      );
    });
    await waitFor(() =>
     expect(axios.get)
     .toHaveBeenCalledWith('http://127.0.0.1:5000/userValidateTokenController',
     {"headers": {"Content-Type": "application/json"}, "responseType": "json"}

     ));
  });

  test('handles successful token validation', async () => {
    axios.get.mockResolvedValue({ data: { userid: '123', token: 'fakeToken' } });
    act(() => {
      render(
        <BrowserRouter>
          <AddNewItems />
        </BrowserRouter>
      );
    });
   
    // Add assertions for the expected behavior after token validation
  });

  test('handles failed token validation', async () => {
    axios.get.mockRejectedValue({ response: { status: 401 } });
    act(() => {
      render(
        <BrowserRouter>
          <AddNewItems />
        </BrowserRouter>
      );
    });
    
    await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith('Bad Request !!');
  })
    // Add assertions for the expected behavior after failed token validation
  });

});
describe('AddNewItems Component', () => {
  it('renders without crashing', () => {
    render(<BrowserRouter><AddNewItems /></BrowserRouter>);
  });

  it('submits the form and shows an alert', async () => {
    localStorage.setItem('token', 'fakeToken');
    localStorage.setItem('userid', '123');

    const { getByLabelText, getByText } = render(<BrowserRouter><AddNewItems /></BrowserRouter>);

    // Mock the axios.post function to simulate a successful API call
    axios.post.mockResolvedValueOnce({ data: {} });

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('cuisine'), { target: { value: 'Test Cuisine' } });
    fireEvent.click(getByText('Submit'));

    // Wait for the API call to resolve
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Assert that the alert is displayed
    expect(global.alert).toHaveBeenCalledWith('Order Completed !!');
  });

  // Add more tests as needed
});
