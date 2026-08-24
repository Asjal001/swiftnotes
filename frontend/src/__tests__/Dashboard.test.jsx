import {render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../pages/Dashboard';
import api from '../api/axios';
jest.mock('../api/axios');
jest.mock('../hooks/useAuth',()=>()=>({user:{email:'test@test.com'}}));
jest.mock('../components/Navbar',()=>()=><div data-testid="mock-navbar"/>);
jest.mock('../components/dashboard/WelcomeBanner',()=>()=><div data-testid="mock-welcome-banner"/>);
jest.mock('../components/dashboard/AddNoteButton',()=>()=><button>Add Note</button>);
jest.mock('../components/dashboard/NoteGrid',()=>({notes})=>(
  <div data-testid="mock-note-grid">
    {notes.map(note=>(
      <div key={note.id} data-testid="note-item">{note.title}</div>
    ))}
  </div>
));
describe('Dashboard Component',()=>{
  const mockNotes=[
    {id:'1',title:'React Basics',content:'<p>Learn about state</p>'},
    {id:'2',title:'Jest Testing',content:'Testing React applications'},
    {id:'3',title:'Groceries',content:'<div>Buy apples and <b>milk</b></div>'}
  ];
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  it('shows loading spinner while notes are being fetched',()=>{
    api.get.mockImplementationOnce(()=>new Promise(()=>{}));
    render(<Dashboard/>);
    expect(screen.getByText('Loading notes')).toBeInTheDocument();
    expect(screen.getByText('Fetching your workspace...')).toBeInTheDocument();
  });
  it('shows error message when API call fails',async()=>{
    api.get.mockRejectedValueOnce(new Error('Network Error'));
    render(<Dashboard/>);
    expect(await screen.findByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByText(/Failed to load notes/i)).toBeInTheDocument();
  });
  it('renders notes after successful fetch',async()=>{
    api.get.mockResolvedValueOnce({data:{data:mockNotes}});
    render(<Dashboard/>);
    expect(await screen.findByTestId('mock-note-grid')).toBeInTheDocument();
    expect(screen.getByText('React Basics')).toBeInTheDocument();
    expect(screen.getByText('Jest Testing')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });
  it('filters notes by title (case-insensitive)',async()=>{
    const user=userEvent.setup();
    api.get.mockResolvedValueOnce({data:{data:mockNotes}});
    render(<Dashboard/>);
    await screen.findByTestId('mock-note-grid');
    const searchInput=screen.getByPlaceholderText('Search notes...');
    await user.type(searchInput,'basics');
    expect(screen.getByText('React Basics')).toBeInTheDocument();
    await waitFor(()=>{
      expect(screen.queryByText('Jest Testing')).not.toBeInTheDocument();
      expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    });
  });
  it('filters notes by content and strips HTML tags',async()=>{
    const user=userEvent.setup();
    api.get.mockResolvedValueOnce({data:{data:mockNotes}});
    render(<Dashboard/>);
    await screen.findByTestId('mock-note-grid');
    const searchInput=screen.getByPlaceholderText('Search notes...');
    await user.type(searchInput,'milk');
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    await waitFor(()=>{
      expect(screen.queryByText('React Basics')).not.toBeInTheDocument();
    });
  });
  it('shows "No results found" when search query matches nothing',async()=>{
    const user=userEvent.setup();
    api.get.mockResolvedValueOnce({data:{data:mockNotes}});
    render(<Dashboard/>);
    await screen.findByTestId('mock-note-grid');
    const searchInput=screen.getByPlaceholderText('Search notes...');
    await user.type(searchInput,'xyz123nonsense');
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText((content)=>content.includes('xyz123nonsense'))).toBeInTheDocument(); 
    expect(screen.queryByTestId('mock-note-grid')).not.toBeInTheDocument();
  });
});