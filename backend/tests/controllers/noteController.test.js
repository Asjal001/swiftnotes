import esmock from 'esmock';
import sinon from 'sinon';
import {expect} from 'chai';

describe('noteController',()=>{
  let noteController;
  let noteServiceStub;
  let res;
  let next;

  beforeEach(async()=>{
    noteServiceStub={
      addNote:sinon.stub(),
      getNotes:sinon.stub(),
      getNote:sinon.stub(),
      updateNote:sinon.stub(),
      deleteNote:sinon.stub()
    };
    noteController=await esmock('../../controllers/noteController.js',{
      '../../services/noteService.js':noteServiceStub
    });
    res={status:sinon.stub().returnsThis(),json:sinon.stub(),send:sinon.stub()};
    next=sinon.stub();
  });

  afterEach(()=>{
    sinon.restore();
  });

  describe('addNote',()=>{
    it('Returns 400 if title is missing',async()=>{
      const req={user:{userId:'user-1'},body:{content:'Some content'}};
      await noteController.addNote(req,res,next);
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].status).to.equal(400);
    });

    it('Returns 400 if title is empty/whitespace',async()=>{
      const req={user:{userId:'user-1'},body:{title:'   ',content:'Some content'}};
      await noteController.addNote(req,res,next);
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].status).to.equal(400);
    });

    it('Returns 201 with note on success',async()=>{
      const req={user:{userId:'user-1'},body:{title:'My Note',content:'Some content'}};
      const createdNote={id:'note-1',title:'My Note',content:'Some content',userId:'user-1'};
      noteServiceStub.addNote.resolves(createdNote);
      await noteController.addNote(req,res,next);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({data:createdNote})).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={user:{userId:'user-1'},body:{title:'My Note',content:'Some content'}};
      const error=new Error('Service failure');
      noteServiceStub.addNote.rejects(error);
      await noteController.addNote(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('getNotes',()=>{
    it('Returns 200 with notes array on success',async()=>{
      const req={user:{userId:'user-1'}};
      const notes=[{id:'note-1',title:'Note 1'},{id:'note-2',title:'Note 2'}];
      noteServiceStub.getNotes.resolves(notes);
      await noteController.getNotes(req,res,next);
      expect(res.json.calledWith({data:notes})).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={user:{userId:'user-1'}};
      const error=new Error('Database error');
      noteServiceStub.getNotes.rejects(error);
      await noteController.getNotes(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('getNote',()=>{
    it('Returns 200 with note on success',async()=>{
      const req={user:{userId:'user-1'},params:{id:'note-1'}};
      const note={id:'note-1',title:'Note 1'};
      noteServiceStub.getNote.resolves(note);
      await noteController.getNote(req,res,next);
      expect(res.json.calledWith({data:note})).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={user:{userId:'user-1'},params:{id:'note-1'}};
      const error=new Error('Note not found');
      noteServiceStub.getNote.rejects(error);
      await noteController.getNote(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('updateNote',()=>{
    it('Returns 400 if title is missing',async()=>{
      const req={user:{userId:'user-1'},params:{id:'note-1'},body:{content:'Only content'}};
      await noteController.updateNote(req,res,next);
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].status).to.equal(400);
    });

    it('Returns 200 with updated note on success',async()=>{
      const req={user:{userId:'user-1'},params:{id:'note-1'},body:{title:'Updated Title'}};
      const updatedNote={id:'note-1',title:'Updated Title'};
      noteServiceStub.updateNote.resolves(updatedNote);
      await noteController.updateNote(req,res,next);
      expect(res.json.calledWith({data:updatedNote})).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={user:{userId:'user-1'},params:{id:'note-1'},body:{title:'Updated Title'}};
      const error=new Error('Update failed');
      noteServiceStub.updateNote.rejects(error);
      await noteController.updateNote(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('deleteNote',()=>{
    it('Returns 204 on success',async()=>{
      const req={user:{userId:'user-1'},params:{id:'note-1'}};
      noteServiceStub.deleteNote.resolves();
      await noteController.deleteNote(req,res,next);
      expect(res.status.calledWith(204)).to.be.true;
      expect(res.send.calledOnce).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={user:{userId:'user-1'},params:{id:'note-1'}};
      const error=new Error('Delete failed');
      noteServiceStub.deleteNote.rejects(error);
      await noteController.deleteNote(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });
});