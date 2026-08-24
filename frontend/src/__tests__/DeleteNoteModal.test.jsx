import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteNoteModal from '../components/dashboard/DeleteNoteModal';
describe('DeleteNoteModal Component',()=>{
  it('renders the modal with "Delete note?" heading and both Cancel and Delete buttons',()=>{
    render(<DeleteNoteModal onCancel={jest.fn()} onConfirm={jest.fn()}/>);
    expect(screen.getByText('Delete note?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Cancel'})).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Delete'})).toBeInTheDocument();
  });
  it('calls onCancel when Cancel button is clicked',async()=>{
    const user=userEvent.setup();
    const mockCancel=jest.fn();
    render(<DeleteNoteModal onCancel={mockCancel} onConfirm={jest.fn()}/>);
    await user.click(screen.getByRole('button',{name:'Cancel'}));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
  it('calls onConfirm when Delete button is clicked',async()=>{
    const user=userEvent.setup();
    const mockConfirm=jest.fn();
    render(<DeleteNoteModal onCancel={jest.fn()} onConfirm={mockConfirm}/>);
    await user.click(screen.getByRole('button',{name:'Delete'}));
    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });
  it('shows "Deleting..." and disables the Delete button when loading is true',()=>{
    render(<DeleteNoteModal onCancel={jest.fn()} onConfirm={jest.fn()} loading={true}/>);
    const deleteButton=screen.getByRole('button',{name:'Deleting...'});
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeDisabled();
    expect(screen.queryByRole('button',{name:'Delete'})).not.toBeInTheDocument();
  });
  it('shows error message when error prop is provided',()=>{
    const errorMessage='Failed to delete note. Please try again.';
    render(<DeleteNoteModal onCancel={jest.fn()} onConfirm={jest.fn()} error={errorMessage}/>);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});