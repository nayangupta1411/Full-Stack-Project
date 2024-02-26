import React from 'react';
import { render, act, screen, fireEvent, waitFor, getByText } from '@testing-library/react';
import axios from 'axios';
import Items from '../Items';
import {BrowserRouter} from 'react-router-dom';
import {configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { navigate } from '@reach/router';
import MockAdapter from 'axios-mock-adapter';
import { getFdata } from '../Items';


jest.mock('@reach/router');
jest.mock('axios');

jest.spyOn(localStorage, 'clear');
global.alert=jest.fn();


configure({ adapter: new Adapter() });



describe('Items Component ( User side token authentication )', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('fetches token on mount', async () => {
      axios.get.mockResolvedValue({ data: { userid: '123', token: 'fakeToken' } });
      act(() => {
        render(
          <BrowserRouter>
            <Items />
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
            <Items />
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
            <Items />
          </BrowserRouter>
        );
      });
      
      await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Bad Request !!');
    })
      // Add assertions for the expected behavior after failed token validation
    });

  });



console.log = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  navigate: jest.fn(),
}));

  
describe('To make a order from user profile', () => {
  test('renders the component with async operation', async () => {
    let component;
  
    // Mock your asynchronous operation (axiosPromise in this case)
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: 'mockedData' }),
    });
  
    await act(async () => {
      // Render your component
      component = render(<BrowserRouter>
        <Items />
      </BrowserRouter>);
    });
  
    // Your assertions here
    // For example, check if the component renders correctly based on the data
  
    // Clean up the mock
    global.fetch.mockRestore();
  });

  it('handles form submission correctly', async () => {

    axios.get.mockResolvedValue({ data: { userid: '123', token: 'fakeToken' } });

    const token = 'fakeToken';
    const userid = '123';
   

    const mockLocalStorage = {
      getItem: jest.fn((key) => {
        if (key === 'token') {
          return 'fakeToken';
        }
        // Handle other keys as needed
      }),
      clear: jest.fn(),
    };
    global.localStorage = mockLocalStorage;

    localStorage.setItem('token', 'fakeToken');
    localStorage.setItem('userid', '123');

    // Render the component with a valid token
    const { getByText }=render(
      <BrowserRouter>
        <Items />
      </BrowserRouter>
    );
    

  await waitFor(() => {
    
    fireEvent.change(screen.getByTestId('cuisine-input'), { target: { key : 'Select' } });
    console.log(" container select data -->", screen.getByTestId('cuisine-input') )
    fireEvent.change(screen.getByPlaceholderText('i.e 3,4,5'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('comments...'), { target: { value: 'Extra cheese' } });
    })
    
    
    // Simulate form submission
    fireEvent.click(getByText('Submit'));
    // fireEvent.submit(getByTestId('your-form'));

    // Wait for the Axios request to be handled
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Verify that the correct URL, data, and headers are used in the Axios request
    expect(axios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:5000/items',
      {
        cuisine: 'Pizza',
        quantity: '2',
        instructions: 'Extra cheese',
        userid: '123',
      },
      { headers:
         { 
          Authorization: 'Bearer fakeToken ', 
          'Content-Type': 'application/json' 
        }, 
          responseType: 'json' 
        }
      
    );

    // Mock the Axios response
    axios.post.mockResolvedValue({ data: 'mocked response' });
 
    // Wait for the component to handle the Axios response
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('userid ->', '123');
      expect(global.alert).toHaveBeenCalledWith('Order Completed !!');
    });

    // Ensure that the navigate function is called
    await waitFor(() => {
      expect(global.window.location.pathname).toEqual('/usersignin');
    });
    ;

    // Ensure that localStorage.clear() is called
    expect(localStorage.clear()).toBe();

  
  });


  it('handles data input correctly',async () => {

    // const token = 'mockedToken';
    // const userid = 'mockedUserId';
    // // const navigate = jest.fn();

    localStorage.setItem('token', 'fakeToken');
    localStorage.setItem('userid', '123');

    render(<BrowserRouter>
      <Items   />
      </BrowserRouter>
    );

   
    await waitFor(() => {
    
      fireEvent.change(screen.getByTestId('cuisine-input'), { target: { key : 'Select' } });
      console.log(" container select data -->", screen.getByTestId('cuisine-input') )
      fireEvent.change(screen.getByPlaceholderText('i.e 3,4,5'), { target: { value: 2 } });
      fireEvent.change(screen.getByPlaceholderText('comments...'), { target: { value: 'Extra cheese' } });
      })


      expect(screen.getByTestId('cuisine-input')).toHaveValue('Pizza');
      expect(screen.getByTestId('quantity-input')).toHaveValue(2);
      expect(screen.getByTestId('instructions-input')).toHaveValue('Extra cheese');
    // You can check the state or other aspects of the component after handling data input
    // For example, you can expect the state to be updated accordingly
    // expect(screen.getByTestId('your-form')).toContain('Updated State: {"cuisine":"Pizza","quantity":"2","instructions":"Extra cheese"}');
  });

  it('localStorage clear', async() => {

    localStorage.setItem('token', '');
    localStorage.setItem('userid', '123');

    render(<BrowserRouter>
      <Items   />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Token is expire so firstly login in')).toBeInTheDocument();
    });

  })

  test('handles form submission successfully', async () => {
    // Arrange
    localStorage.setItem('token', 'mockedToken');
    

    const { getByLabelText, getByRole } =  render(<BrowserRouter>
      <Items   />
      </BrowserRouter>
    );

    // Mock the axios post method to resolve with a response
    axios.post.mockResolvedValue({
      data: { cuisine: "pizza",
      quantity: "2",
      instructions: "extra cheez",
      userid: '123' },
    });

    // Act
    userEvent.click(screen.getByRole("button", { name: "Submit" })); // Adjust this label based on your actual code

    // Assert
    await waitFor(() => {
      // Verify that the axios post method was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:5000/items',
        {
          cuisine: '',
          quantity: '',
          instructions: '',
          userid: '123', // Adjust with a mocked user ID
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mockedToken ', // Adjust with a mocked token
          },
          responseType: 'json',
        }
      );

      // Verify that console.log was called with the expected result
      expect(console.log).toHaveBeenCalledWith('result: -', {
         "cuisine": "pizza",
         "instructions": "extra cheez",
         "quantity": "2",
         "userid": "123",
         });

      // Verify that the "Bad Request" alert was not called
      expect(alert).not.toHaveBeenCalledWith('Bad Request !!');

      // Verify that localStorage.clear() was not called
      expect(localStorage.clear).not.toBe();

      // Verify that navigate('/usersignin') was not called
      expect(navigate).not.toHaveBeenCalledWith('/usersignin');

      // Verify that "Order Completed" alert was called
      expect(alert).toHaveBeenCalledWith('Order Completed !!');

      // Verify that setTimeout was called to reload the page
      // expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 10);
    });
  });


});

const mock = new MockAdapter(axios);
describe('To delete a order from user profile', () => {

  // it('ok', async() => {

  //   axios.get.mockResolvedValueOnce({ data: { _id: 1, cuisine: 'pizza', quantity: 2, instructions: 'Some instructions', userid: '123' } });

  //   // Use the fetchData function
  //   const response = await getFdata('http://127.0.0.1:5000/itemalluser', { _id: 1, cuisine: 'pizza', quantity: 2 });

  //   // Assertions based on your test case
  //   expect(response).toEqual({
  //     data: { _id: 1, cuisine: 'pizza', quantity: 2, instructions: 'Some instructions', userid: '123' },
  //   });
  //   // fetchData('http://127.0.0.1:5000/itemalluser',{_id: 1, cuisine: 'pizza', quantity: 2}).then( response => {
  //   //   expect(response).toEqual({
  //   //    data:  { _id: 1, cuisine: 'pizza', quantity: 2, instructions: 'Some instructions', userid:"123" }
  //   // })
  //   // });
     
  //   // expect(mockAxios.request).toHaveBeenCalledWith({
  //   //   method: 'get',
  //   //   url: 'http://127.0.0.1:5000/itemalluser'
  //   // })

  //   // expect(mockAxios.request).toHaveBeenCalledTimes(1);
  // })

  // it('fetches data and renders it correctly', async () => {
    
  //   localStorage.setItem('token', 'faketoken');
  //   localStorage.setItem('userid', '123');

  //   const testData = [{ _id: 1, cuisine: 'pizza', quantity: 2, instructions: 'Some instructions', userid:"123" }];

  //   mock.onGet('http://127.0.0.1:5000/itemalluser').reply(testData);

  //   axios.get.mockResolvedValueOnce({ data: testData });

  //   let getByTestId;

  //   await act(async () => {
  //     const renderResult = render(<BrowserRouter><Items /></BrowserRouter>);
  //     getByTestId = renderResult.getByTestId;
  // });
  //   console.log("testData-->",testData)
    
  //   // Wait for the data to be loaded
  //   await waitFor(() => {
  //     // expect(screen.getByText(/Order List/i)).toBeInTheDocument();
  //     testData.forEach((user) => {
  //       // Use a more specific query based on your component's structure
  //       const tableCell = getByTestId(`cuisine-cell-${user._id}`, { target: { value: "pizza" } }); // replace with your actual data-testid
  //       console.log("tablecell --->",tableCell.textContent);
  //       debugger;
  //       console.log("user--",user)
  //       expect(tableCell).toHaveTextContent(user.cuisine);
        
  //       // console.log("->-.>",screen.getByText(user.cuisine))
  //       // Add more assertions based on your component's rendering logic
  //     });

  //     // testData.forEach((user) => {
  //     //   const tableCell = screen.getByTestId(`cuisine-cell-1`);
  //     //   const actualContent = screen.getByTestId(`cuisine-cell-1`);
  //     //   const expectedContent =testData.cuisine;
  //     //   console.log("Actual Content:", actualContent);
  //     //   console.log("Expected Content:", expectedContent);
  //     //   expect(actualContent).toBe(expectedContent);
  //     // });
  //     // Add more assertions based on your component's rendering logic
  //   });
  // });


//  2nd case 



//   test ('handles form submission correctly',async () => {
//     localStorage.setItem('token', 'fakeToken');

//     // render(<BrowserRouter><Items /></BrowserRouter>)

//     // userEvent.click(screen.getByRole("button", { name: "Delete" }));


//     const mockData = [
//       // Mock data for testing
//       { _id: '1', cuisine: 'Pizza', quantity: 3, instructions: 'Test instructions' },
//     ];


//     mock.onGet('http://127.0.0.1:5000/itemalluser').reply(200, mockData);
//     // Mock axios.get to resolve with mockData
//     axios.get.mockResolvedValueOnce({ data: mockData });


//     render(<BrowserRouter><Items /></BrowserRouter>)

//     await waitFor(() => expect(screen.getByText('Order List')).toBeInTheDocument());

//     const deleteButton = screen.getByRole('button', { name: "Delete" }); // Using a case-insensitive matcher
//     fireEvent.click(deleteButton);

//     // Mock axios.post for delete action
//     axios.post.mockResolvedValueOnce({ data: { message: 'Order deleted successfully' } });

//     // Render the component
    

//     // Wait for the data to be fetched and the component to update
    

//     // Trigger delete action
    

//     // Wait for the component to update after delete action
//     await waitFor(() => expect(screen.queryByText('Pizza')).not.toBeInTheDocument());
//     expect(screen.queryByText('Order deleted successfully')).toBeInTheDocument();

//     // fireEvent.submit(getByTestId('your-form'));

//     // Wait for the Axios request to be handled
//     await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

//     // Verify that the correct URL, data, and headers are used in the Axios request
//     expect(axios.post).toHaveBeenCalledWith(
//       'http://127.0.0.1:5000/itemdel',
//       {
//         _id:"1234"
//       },
//       { headers:
//          { 
//           Authorization: 'Bearer fakeToken ', 
//           'Content-Type': 'application/json' 
//         }, 
//           responseType: 'json' 
//         }
      
//     );

//     // Mock the Axios response
//     axios.post.mockResolvedValue({ data: 'mocked response' });
 
//     // Wait for the component to handle the Axios response
//     await waitFor(() => {
//       expect(console.log).toHaveBeenCalledWith('userid ->', '123');
//       expect(global.alert).toHaveBeenCalledWith('Order Deleted !!');
//     });


//   })

})