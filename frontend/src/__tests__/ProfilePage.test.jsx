import {render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useNavigate} from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
jest.mock('../api/axios');
jest.mock('../hooks/useAuth');
jest.mock('react-router-dom',()=>({
  ...jest.requireActual('react-router-dom'),
  useNavigate:jest.fn()
}));
jest.mock('../components/Navbar',()=>({onActionAttempt})=>(
  <button data-testid="mock-nav" onClick={()=>onActionAttempt({type:'navigate',path:'/dashboard'})}>Nav</button>
));
describe('ProfilePage Component',()=>{
  const mockNavigate=jest.fn();
  const mockLogout=jest.fn();
  const mockProfileData={data:{data:{name:'Test User',bio:'Hello',email:'test@test.com'}}};
  beforeEach(()=>{
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({logout:mockLogout});
  });
  it('shows loading spinner while profile is being fetched',()=>{
    api.get.mockImplementationOnce(()=>new Promise(()=>{}));
    render(<ProfilePage/>);
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });
  it('shows error when profile fetch fails',async()=>{
    api.get.mockRejectedValueOnce(new Error());
    render(<ProfilePage/>);
    expect(await screen.findByText('Failed to load profile')).toBeInTheDocument();
  });
  it('shows "No changes to save" error when saving with no changes',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button',{name:'Save Changes'}));
    expect(await screen.findByText('No changes to save')).toBeInTheDocument();
  });
  it('shows error when new passwords don\'t match',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button',{name:'Change Password'}));
    const inputs=screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0],'oldpass123');
    await user.type(inputs[1],'newpass123');
    await user.type(inputs[2],'different456');
    await user.click(screen.getByRole('button',{name:'Update Password'}));
    expect(await screen.findByText("New passwords don't match")).toBeInTheDocument();
  });
  it('shows error when new password is shorter than 8 characters',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button',{name:'Change Password'}));
    const inputs=screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0],'oldpass123');
    await user.type(inputs[1],'short');
    await user.type(inputs[2],'short');
    await user.click(screen.getByRole('button',{name:'Update Password'}));
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
  });
  it('shows delete confirmation modal when Delete Account clicked',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button',{name:'Delete Account'}));
    expect(screen.getByText('Delete account?')).toBeInTheDocument();
  });
  it('clicking Cancel in delete modal closes it',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button',{name:'Delete Account'}));
    await user.click(screen.getByRole('button',{name:'Cancel'}));
    await waitFor(()=>{
      expect(screen.queryByText('Delete account?')).not.toBeInTheDocument();
    });
  });
  it('shows unsaved changes modal when navigating away with unsaved changes',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.type(screen.getByPlaceholderText('Your full name'),' Updated');
    await user.click(screen.getByTestId('mock-nav'));
    expect(screen.getByText('Discard changes?')).toBeInTheDocument();
  });
  it('updates profile successfully when changes are made',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    api.patch.mockResolvedValueOnce({data:{data:{name:'Updated Name',bio:'Updated Bio'}}});
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.type(screen.getByPlaceholderText('Your full name'),' New');
    await user.click(screen.getByRole('button',{name:'Save Changes'}));
    expect(await screen.findByText('Profile updated successfully')).toBeInTheDocument();
  });
  it('shows error message when updating profile fails',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    api.patch.mockRejectedValueOnce({response:{data:{error:'Failed to update profile'}}});
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.type(screen.getByPlaceholderText('Your full name'),' New');
    await user.click(screen.getByRole('button',{name:'Save Changes'}));
    expect(await screen.findByText('Failed to update profile')).toBeInTheDocument();
  });
 it('updates password successfully',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    api.patch.mockResolvedValueOnce({data:{message:'Password changed'}});
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button',{name:'Change Password'}));
    const inputs=screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0],'oldpass123');
    await user.type(inputs[1],'newpassword123');
    await user.type(inputs[2],'newpassword123');
    await user.click(screen.getByRole('button',{name:'Update Password'}));
    await waitFor(()=>{
      expect(api.patch).toHaveBeenCalledWith('/user/password',{
        currentPassword:'oldpass123',
        newPassword:'newpassword123',
      });
    });
  });
  it('shows error when password update fails on server',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    api.patch.mockRejectedValueOnce({response:{data:{error:'Invalid current password'}}});
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button',{name:'Change Password'}));
    const inputs=screen.getAllByPlaceholderText('••••••••');
    await user.type(inputs[0],'wrongpass123');
    await user.type(inputs[1],'newpassword123');
    await user.type(inputs[2],'newpassword123');
    await user.click(screen.getByRole('button',{name:'Update Password'}));
    expect(await screen.findByText('Invalid current password')).toBeInTheDocument();
  });
  it('deletes account successfully and redirects',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    api.delete.mockResolvedValueOnce({});
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button',{name:'Delete Account'}));
    await user.click(screen.getByRole('button',{name:'Delete'}));
    await waitFor(()=>{
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
  it('shows error when account deletion fails',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    api.delete.mockRejectedValueOnce(new Error());
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button',{name:'Delete Account'}));
    await user.click(screen.getByRole('button',{name:'Delete'}));
    expect(await screen.findByText('Failed to delete account. Try again.')).toBeInTheDocument();
  });
  it('navigates directly if there are no unsaved changes',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.click(screen.getByTestId('mock-nav'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
  it('handles "Keep editing" and "Discard" in unsaved changes modal',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.type(screen.getByPlaceholderText('Your full name'),' Updated');
    await user.click(screen.getByTestId('mock-nav'));
    expect(screen.getByText('Discard changes?')).toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:'Keep editing'}));
    expect(screen.queryByText('Discard changes?')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('mock-nav'));
    expect(screen.getByText('Discard changes?')).toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:'Discard'}));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
  it('prevents unload when there are unsaved changes',async()=>{
    api.get.mockResolvedValueOnce(mockProfileData);
    const user=userEvent.setup();
    render(<ProfilePage/>);
    await waitFor(()=>expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument());
    await user.type(screen.getByPlaceholderText('Your full name'),' Changed');
    const event=new Event('beforeunload',{cancelable:true});
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});