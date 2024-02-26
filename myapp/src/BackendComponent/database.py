from pymongo import MongoClient

DATABASE_URL= 'mongodb://localhost:27017/FoodItems'
print(DATABASE_URL)
client = MongoClient("mongodb://localhost:27017/FoodItems")
db = client.FoodItems






# jest.mock('react',() => ({
#   ...jest.requireActual('react'),
#   useState: jest.fn(),
# }));

# describe('yourComopnent', () => {
#   it('render correctly', () => {
#     useState.mockReturnValue([{name :"",
#     email:"",
#     password:"",
#     confirm_password:"",
#     roleBasedAccess : ""}])

#   const { getByTestId } =render(<Router>
#     <Signup />
#     </Router>)

#   expect(getByTestId('signup-1')).toBeInTheDocument();
#   });

#   it('handle state update correctly', () =>{

#     const setSignupData= jest.fn();
#     useState.mockReturnValue([{name :"",
#     email:"",
#     password:"",
#     confirm_password:"",
#     roleBasedAccess : ""}, setSignupData])

#     const { getByTestId } =render(<Router>
#       <Signup />
#       </Router>)

#     const signupData1 = {
#                 name: "nayan",
#                 email: "nayan@gma.com",
#                 password:"12345678",
#                 confirm_password: "12345678",
#                 roleBasedAccess: "admin"
      
#               }

#     act(() => {

#       fireEvent.click(screen.getByTestId('signup-1'))
#     });

#     expect(getByTestId('signup-1')).toBeInTheDocument(signupData1)

#   })

  
# })