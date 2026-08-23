import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';
jest.mock('../hooks/useAuth');
describe('Navbar Component',()=>{
  const mockLogout=jest.fn();
  beforeEach(()=>{
    jest.clearAllMocks();
    useAuth.mockReturnValue({logout:mockLogout});
  });
  it('renders Dashboard and Profile links',()=>{
    render(<MemoryRouter><Navbar/></MemoryRouter>);
    expect(screen.getByRole('link',{name:'Dashboard'})).toBeInTheDocument();
    expect(screen.getByRole('link',{name:'Profile'})).toBeInTheDocument();
  });
  it('renders logout button',()=>{
    render(<MemoryRouter><Navbar/></MemoryRouter>);
    expect(screen.getByRole('button',{name:/logout/i})).toBeInTheDocument();
  });
  it('Dashboard link is active when on /dashboard',()=>{
    render(<MemoryRouter initialEntries={['/dashboard']}><Navbar/></MemoryRouter>);
    const dashboardLink=screen.getByRole('link',{name:'Dashboard'});
    expect(dashboardLink).toHaveClass('border-indigo-600');
    expect(dashboardLink).toHaveClass('text-indigo-600');
  });
  it('Profile link is active when on /profile',()=>{
    render(<MemoryRouter initialEntries={['/profile']}><Navbar/></MemoryRouter>);
    const profileLink=screen.getByRole('link',{name:'Profile'});
    expect(profileLink).toHaveClass('border-indigo-600');
    expect(profileLink).toHaveClass('text-indigo-600');
  });
  it('clicking logout calls logout from useAuth when no onActionAttempt prop',async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><Navbar/></MemoryRouter>);
    await user.click(screen.getByRole('button',{name:/logout/i}));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
  it('calls onActionAttempt with logout action when prop is provided instead of calling logout directly',async()=>{
    const user=userEvent.setup();
    const mockActionAttempt=jest.fn();
    render(<MemoryRouter><Navbar onActionAttempt={mockActionAttempt}/></MemoryRouter>);
    await user.click(screen.getByRole('button',{name:/logout/i}));
    expect(mockActionAttempt).toHaveBeenCalledWith({type:'logout'});
    expect(mockLogout).not.toHaveBeenCalled();
  });
});