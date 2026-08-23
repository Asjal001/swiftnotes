import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import Login from '../pages/Login';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
jest.mock('../api/axios');
jest.mock('../hooks/useAuth');
describe('Login Component',()=>{
  const mockLogin=jest.fn();
  beforeEach(()=>{
    jest.clearAllMocks();
    useAuth.mockReturnValue({login:mockLogin});
  });
  const renderLogin=()=>{
    return render(
      <MemoryRouter>
        <Login/>
      </MemoryRouter>
    );
  };
  it('renders the login form with email, password fields and submit button',()=>{
    renderLogin();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Sign in'})).toBeInTheDocument();
  });
  it('shows "Signing in..." on the submit button while API call is in progress',async()=>{
    const user=userEvent.setup();
    renderLogin();
    let resolveApi;
    api.post.mockImplementationOnce(()=>new Promise((resolve)=>{resolveApi=resolve;}));
    await user.type(screen.getByPlaceholderText('name@example.com'),'test@test.com');
    await user.type(screen.getByPlaceholderText('••••••••'),'password123');
    user.click(screen.getByRole('button',{name:'Sign in'}));
    expect(await screen.findByRole('button',{name:'Signing in...'})).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Signing in...'})).toBeDisabled();
    resolveApi({data:{data:{user:{},token:'token123'}}});
  });
  it('shows API error message when login request fails',async()=>{
    const user=userEvent.setup();
    renderLogin();
    api.post.mockRejectedValueOnce({response:{data:{error:'Invalid email or password'}}});
    await user.type(screen.getByPlaceholderText('name@example.com'),'wrong@test.com');
    await user.type(screen.getByPlaceholderText('••••••••'),'wrongpass');
    await user.click(screen.getByRole('button',{name:'Sign in'}));
    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  });
  it('clears error when user types in email or password fields',async()=>{
    const user=userEvent.setup();
    renderLogin();
    api.post.mockRejectedValueOnce({response:{data:{error:'Invalid email or password'}}});
    const emailInput=screen.getByPlaceholderText('name@example.com');
    const passwordInput=screen.getByPlaceholderText('••••••••');
    await user.type(emailInput,'wrong@test.com');
    await user.type(passwordInput,'wrongpass');
    await user.click(screen.getByRole('button',{name:'Sign in'}));
    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
    await user.type(emailInput,'m');
    expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
    api.post.mockRejectedValueOnce({response:{data:{error:'Invalid email or password'}}});
    await user.click(screen.getByRole('button',{name:'Sign in'}));
    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
    await user.type(passwordInput,'2');
    expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
  });
});