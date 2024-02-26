import React from 'react';
import { render, act,screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import UpdateItem from '../UpdateItem';
import {BrowserRouter} from 'react-router-dom';


jest.mock('axios');
global.alert=jest.fn();

console.log = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  navigate: jest.fn(),
}));



describe('UpdateItem Component ( token authentication )', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('fetches token on mount', async () => {
      axios.get.mockResolvedValue({ data: { userid: '123', token: 'fakeToken' } });
      act(() => {
        render(
          <BrowserRouter>
            <UpdateItem />
          </BrowserRouter>
        );
      });

      const token = 'your_mock_token';
      const localStorageSpy = jest.spyOn(Storage.prototype, 'getItem');
      localStorageSpy.mockReturnValue(token);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          'http://127.0.0.1:5000/userValidateTokenController',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer null`, // Use the mock token here
            },
            responseType: 'json',
          }
        );
      });
    //   await waitFor(() =>
    //    expect(axios.get)
    //    .toHaveBeenCalledWith('http://127.0.0.1:5000/userValidateTokenController',
    //    {"headers": {"Content-Type": "application/json"}, "responseType": "json"}

    //    ));
    });
  
    test('handles successful token validation', async () => {
      axios.get.mockResolvedValue({ data: { userid: '123', token: 'fakeToken' } });
      act(() => {
        render(
          <BrowserRouter>
            <UpdateItem />
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
            <UpdateItem />
          </BrowserRouter>
        );
      });
      
      await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Bad Request !!');
    })
      // Add assertions for the expected behavior after failed token validation
    });

  });


describe('UpdateItem', () => {
  test('renders component', () => {
    render(<BrowserRouter><UpdateItem /></BrowserRouter>);
    // You can add more specific assertions based on your component's structure
    expect(screen.getByText(/Token is expire so firstly login in/i)).toBeInTheDocument();
  });

  test('fetchToken function is called', async () => {
    render(<BrowserRouter><UpdateItem /></BrowserRouter>);
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(
      'http://127.0.0.1:5000/userValidateTokenController',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': expect.stringContaining('Bearer'),
        }),
      }),
    ));
  });

  // Add more test cases for other functions and interactions as needed

  // For example, test handleSubmit2 function
//   test('handles form submission', async () => {

//     axios.get.mockResolvedValue({ data: { userid: '123', token: 'fakeToken' } });

//     const mockLocalStorage = {
//         getItem: jest.fn((key) => {
//           if (key === 'token') {
//             return 'fakeToken';
//           }
//           // Handle other keys as needed
//         }),
//         clear: jest.fn(),
//       };
//       global.localStorage = mockLocalStorage;

//     localStorage.setItem('token', 'fakeToken');
//     localStorage.setItem('userid', '123');

//     const { getByText }=render(
//         <BrowserRouter>
//           <UpdateItem />
//         </BrowserRouter>
//       );
      
//     axios.post.mockResolvedValueOnce({ data: 'success' });

//     await waitFor(() => {
    
//         fireEvent.change(screen.getByTestId('cuisine-input'), { target: { key : 'Select' } });
//         console.log(" container select data -->", screen.getByTestId('cuisine-input') )
//         fireEvent.change(screen.getByPlaceholderText('i.e 3,4,5'), { target: { value: '2' } });
//         fireEvent.change(screen.getByPlaceholderText('comments...'), { target: { value: 'Extra cheese' } });
//         })

//         fireEvent.click(getByText('Submit'));


//         await waitFor(() => {
//             expect(axios.get).toHaveBeenCalledTimes(3);
//           });

//         expect(axios.post).toHaveBeenCalledWith(
//             'http://127.0.0.1:5000/itemUpdateOne',
//             {
//               cuisine: 'Pizza',
//               quantity: '2',
//               instructions: 'Extra cheese',
//               userid: '123',
//             },
//             { headers:
//                { 
//                 Authorization: 'Bearer fakeToken ', 
//                 'Content-Type': 'application/json' 
//               }, 
//                 responseType: 'json' 
//               }
            
//           );

    
  

//     // await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
//     //   'http://127.0.0.1:5000/itemUpdateOne',
//     //   expect.objectContaining({
//     //     headers: expect.objectContaining({
//     //       'Content-Type': 'application/json',
//     //       'Authorization': expect.stringContaining('Bearer'),
//     //     }),
//     //   }),
//     // ));


//     await waitFor(() => {
//         expect(console.log).toHaveBeenCalledWith('userid ->', '123');
//         expect(global.alert).toHaveBeenCalledWith('Order Completed !!');
//       });

//     // You can add more assertions based on your component's behavior
//     // expect(screen.getByText(/Order Update !!/i)).toBeInTheDocument();
//   });
});
