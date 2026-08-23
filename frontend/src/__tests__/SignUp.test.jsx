import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import SignUp from '../pages/SignUp';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
jest.mock('../api/axios');
jest.mock('../hooks/useAuth');
describe('SignUp Component',()=>{
  const mockLogin=jest.fn();
  beforeEach(()=>{
    jest.clearAllMocks();
    useAuth.mockReturnValue({login:mockLogin});
  });
  const renderSignUp=()=>{
    return render(
      <MemoryRouter>
        <SignUp/>
      </MemoryRouter>
    );
  };
  it('renders the signup form with email, password, confirm password fields and a submit button',()=>{
    renderSignUp();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    const passwordInputs=screen.getAllByPlaceholderText('••••••••');
    expect(passwordInputs).toHaveLength(2); 
    expect(screen.getByRole('button',{name:'Sign up'})).toBeInTheDocument();
  });
  it('shows error "Password must be at least 8 characters" when password is short',async()=>{
    const user=userEvent.setup();
    renderSignUp();
    const emailInput=screen.getByPlaceholderText('name@example.com');
    const passwordInputs=screen.getAllByPlaceholderText('••••••••');
    const passwordInput=passwordInputs[0];
    const confirmInput=passwordInputs[1];
    await user.type(emailInput,'test@test.com');
    await user.type(passwordInput,'short');
    await user.type(confirmInput,'short');
    await user.click(screen.getByRole('button',{name:'Sign up'}));
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled(); 
  });
  it('shows error "Passwords don\'t match" when passwords do not match',async()=>{
    const user=userEvent.setup();
    renderSignUp();
    const emailInput=screen.getByPlaceholderText('name@example.com');
    const passwordInputs=screen.getAllByPlaceholderText('••••••••');
    await user.type(emailInput,'test@test.com');
    await user.type(passwordInputs[0],'password123');
    await user.type(passwordInputs[1],'password456');
    await user.click(screen.getByRole('button',{name:'Sign up'}));
    expect(await screen.findByText("Passwords don't match")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });
  it('shows "Creating account..." on the submit button while API call is in progress',async()=>{
    const user=userEvent.setup();
    renderSignUp();
    let resolveApi;
    api.post.mockImplementationOnce(()=>new Promise((resolve)=>{resolveApi=resolve;}));
    const passwordInputs=screen.getAllByPlaceholderText('••••••••');
    await user.type(screen.getByPlaceholderText('name@example.com'),'test@test.com');
    await user.type(passwordInputs[0],'password123');
    await user.type(passwordInputs[1],'password123');
    user.click(screen.getByRole('button',{name:'Sign up'}));
    expect(await screen.findByRole('button',{name:'Creating account...'})).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Creating account...'})).toBeDisabled();
    resolveApi({data:{data:{user:{},token:'token'}}});
  });
  it('shows API error message when signup request fails',async()=>{
    const user=userEvent.setup();
    renderSignUp();
    api.post.mockRejectedValueOnce({response:{data:{error:'Email already exists'}}});
    const passwordInputs=screen.getAllByPlaceholderText('••••••••');
    await user.type(screen.getByPlaceholderText('name@example.com'),'test@test.com');
    await user.type(passwordInputs[0],'password123');
    await user.type(passwordInputs[1],'password123');
    await user.click(screen.getByRole('button',{name:'Sign up'}));
    expect(await screen.findByText('Email already exists')).toBeInTheDocument();
  });
  it('clears the error message when user starts typing in email field',async()=>{
    const user=userEvent.setup();
    renderSignUp();
    const emailInput=screen.getByPlaceholderText('name@example.com');
    const passwordInputs=screen.getAllByPlaceholderText('••••••••');
    await user.type(emailInput,'test@test.com');
    await user.type(passwordInputs[0],'short');
    await user.type(passwordInputs[1],'short');
    await user.click(screen.getByRole('button',{name:'Sign up'}));
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    await user.type(emailInput,'a');
    expect(screen.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument();
  });
});