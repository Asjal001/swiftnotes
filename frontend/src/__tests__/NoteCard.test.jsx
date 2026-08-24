import {render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import NoteCard from '../components/dashboard/NoteCard';
import api from '../api/axios';
jest.mock('../api/axios');
describe('NoteCard Component',()=>{
  const mockDelete=jest.fn();
  const defaultNote={id:'note-1',title:'Grocery List',content:'<p>Buy <b>milk</b> and eggs</p>',createdAt:'2026-08-23T12:00:00Z'};
  beforeEach(()=>{jest.clearAllMocks();});
  const renderCard=(note=defaultNote)=>{
    render(
      <MemoryRouter>
        <NoteCard note={note} index={0} onDelete={mockDelete}/>
      </MemoryRouter>
    );
  };
  it('renders note title, date, and content preview',()=>{
    renderCard();
    expect(screen.getByText('Grocery List')).toBeInTheDocument();
    expect(screen.getByText(/Aug 23, 2026/i)).toBeInTheDocument();
  });
  it('strips HTML tags from content for preview display',()=>{
    renderCard();
    expect(screen.getByText('Buy milk and eggs')).toBeInTheDocument();
    expect(screen.queryByText('<p>')).not.toBeInTheDocument();
  });
  it('shows "No content" when note content is empty',()=>{
    renderCard({...defaultNote,content:''});
    expect(screen.getByText('No content')).toBeInTheDocument();
  });
  it('clicking the delete icon shows the DeleteNoteModal',async()=>{
    const user=userEvent.setup();
    renderCard();
    const deleteIcon=screen.getByRole('button',{name:'Delete note'});
    await user.click(deleteIcon);
    expect(screen.getByText('Delete note?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });
  it('clicking Cancel in the modal closes it without calling API',async()=>{
    const user=userEvent.setup();
    renderCard();
    await user.click(screen.getByRole('button',{name:'Delete note'}));
    await user.click(screen.getByRole('button',{name:'Cancel'}));
    await waitFor(()=>{
      expect(screen.queryByText('Delete note?')).not.toBeInTheDocument();
    });
    expect(api.delete).not.toHaveBeenCalled();
  });
  it('successful delete calls onDelete with the note id',async()=>{
    const user=userEvent.setup();
    api.delete.mockResolvedValueOnce({});
    renderCard();
    await user.click(screen.getByRole('button',{name:'Delete note'}));
    await user.click(screen.getByRole('button',{name:'Delete'}));
    expect(api.delete).toHaveBeenCalledWith('/notes/note-1');
    expect(mockDelete).toHaveBeenCalledWith('note-1');
  });
  it('failed delete shows error message in the modal',async()=>{
    const user=userEvent.setup();
    api.delete.mockRejectedValueOnce(new Error('Network error'));
    renderCard();
    await user.click(screen.getByRole('button',{name:'Delete note'}));
    await user.click(screen.getByRole('button',{name:'Delete'}));
    expect(await screen.findByText('Failed to delete. Try again.')).toBeInTheDocument();
    expect(mockDelete).not.toHaveBeenCalled();
  });
  it('"Deleting..." state shown while API call is in progress',async()=>{
    const user=userEvent.setup();
    let resolveApi;
    api.delete.mockImplementationOnce(()=>new Promise((resolve)=>{resolveApi=resolve;}));
    renderCard();
    await user.click(screen.getByRole('button',{name:'Delete note'}));
    await user.click(screen.getByRole('button',{name:'Delete'}));
    const deletingBtn=await screen.findByRole('button',{name:'Deleting...'});
    expect(deletingBtn).toBeInTheDocument();
    expect(deletingBtn).toBeDisabled();
    resolveApi();
  });
});