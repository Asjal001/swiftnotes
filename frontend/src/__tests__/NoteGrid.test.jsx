import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import NoteGrid from '../components/dashboard/NoteGrid';
jest.mock('../components/dashboard/NoteCard',()=>()=><div data-testid="mock-note-card"/>);
describe('NoteGrid Component',()=>{
  it('shows empty state ("No notes yet") when notes array is empty',()=>{
    render(
      <MemoryRouter>
        <NoteGrid notes={[]} onDelete={jest.fn()}/>
      </MemoryRouter>
    );
    expect(screen.getByText('No notes yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first note to get started.')).toBeInTheDocument();
    expect(screen.getByRole('link',{name:'Create a note'})).toHaveAttribute('href','/notes/new');
    expect(screen.queryByTestId('mock-note-card')).not.toBeInTheDocument();
  });
  it('renders correct number of NoteCard components when notes are provided',()=>{
    const mockNotes=[
      {id:'1',title:'Note 1'},
      {id:'2',title:'Note 2'},
      {id:'3',title:'Note 3'}
    ];
    render(
      <MemoryRouter>
        <NoteGrid notes={mockNotes} onDelete={jest.fn()}/>
      </MemoryRouter>
    );
    const noteCards=screen.getAllByTestId('mock-note-card');
    expect(noteCards).toHaveLength(3);
  });
});