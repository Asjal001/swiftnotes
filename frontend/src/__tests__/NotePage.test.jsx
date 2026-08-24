import {render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useParams,useNavigate} from 'react-router-dom';
import NotePage from '../pages/NotePage';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
jest.mock('../api/axios');
jest.mock('../hooks/useAuth');
jest.mock('react-router-dom',()=>({
  ...jest.requireActual('react-router-dom'),
  useParams:jest.fn(),
  useNavigate:jest.fn()
}));
jest.mock('../components/Navbar',()=>()=><div data-testid="mock-navbar"/>);
jest.mock('../components/notes/NoteEditor',()=>({content,onChange})=>(
  <textarea data-testid="mock-editor" value={content} onChange={(e)=>onChange(e.target.value)}/>
));
describe('NotePage Component',()=>{
  const mockNavigate=jest.fn();
  const mockLogout=jest.fn();
  beforeEach(()=>{
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({logout:mockLogout});
  });
  it('shows loading spinner while note is being fetched',()=>{
    useParams.mockReturnValue({id:'1'});
    api.get.mockImplementationOnce(()=>new Promise(()=>{}));
    render(<NotePage/>);
    expect(screen.getByText('Loading your note...')).toBeInTheDocument();
  });
  it('shows error state when note fetch fails',async()=>{
    useParams.mockReturnValue({id:'1'});
    api.get.mockRejectedValueOnce(new Error());
    render(<NotePage/>);
    expect(await screen.findByText('Note Unavailable')).toBeInTheDocument();
  });
  it('shows "Title is required" error when saving with empty title',async()=>{
    useParams.mockReturnValue({id:'new'});
    const user=userEvent.setup();
    render(<NotePage/>);
    await user.click(screen.getByRole('button',{name:'Save Note'}));
    expect(await screen.findByText('Title is required to save the note.')).toBeInTheDocument();
  });
  it('save button shows "Saving..." while API call is in progress',async()=>{
    useParams.mockReturnValue({id:'new'});
    const user=userEvent.setup();
    let resolveApi;
    api.post.mockImplementationOnce(()=>new Promise(resolve=>{resolveApi=resolve;}));
    render(<NotePage/>);
    await user.type(screen.getByPlaceholderText('Note title'),'New Title');
    await user.click(screen.getByRole('button',{name:'Save Note'}));
    expect(await screen.findByRole('button',{name:'Saving...'})).toBeInTheDocument();
    resolveApi();
    await waitFor(()=>{
      expect(screen.getByRole('button',{name:'Save Note'})).toBeInTheDocument();
    });
  });
  it('clicking Cancel navigates to dashboard when no changes made',async()=>{
    useParams.mockReturnValue({id:'new'});
    const user=userEvent.setup();
    render(<NotePage/>);
    await user.click(screen.getByRole('button',{name:'Cancel'}));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
  it('shows discard modal when Cancel clicked with unsaved changes',async()=>{
    useParams.mockReturnValue({id:'new'});
    const user=userEvent.setup();
    render(<NotePage/>);
    await user.type(screen.getByPlaceholderText('Note title'),'Draft Title');
    await user.click(screen.getByRole('button',{name:'Cancel'}));
    expect(screen.getByText('Discard changes?')).toBeInTheDocument();
  });
  it('clicking "Keep editing" in modal closes it without navigating',async()=>{
    useParams.mockReturnValue({id:'new'});
    const user=userEvent.setup();
    render(<NotePage/>);
    await user.type(screen.getByPlaceholderText('Note title'),'Draft Title');
    await user.click(screen.getByRole('button',{name:'Cancel'}));
    await user.click(screen.getByRole('button',{name:'Keep editing'}));
    await waitFor(()=>{
      expect(screen.queryByText('Discard changes?')).not.toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  it('clicking "Discard" in modal navigates to dashboard',async()=>{
    useParams.mockReturnValue({id:'new'});
    const user=userEvent.setup();
    render(<NotePage/>);
    await user.type(screen.getByPlaceholderText('Note title'),'Draft Title');
    await user.click(screen.getByRole('button',{name:'Cancel'}));
    await user.click(screen.getByRole('button',{name:'Discard'}));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});