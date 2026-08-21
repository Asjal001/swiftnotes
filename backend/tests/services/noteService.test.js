import sinon from 'sinon';
import {expect} from 'chai';
import esmock from 'esmock';

const prismaStub={
  note:{
    create:sinon.stub(),
    findMany:sinon.stub(),
    findFirst:sinon.stub(),
    update:sinon.stub(),
    deleteMany:sinon.stub()
  }
};
const noteService=await esmock('../../services/noteService.js',{
  '../../db.js':{default:prismaStub}
});
describe('Note Service',()=>{
  afterEach(()=>{
    sinon.restore();
    prismaStub.note.create.reset();
    prismaStub.note.findMany.reset();
    prismaStub.note.findFirst.reset();
    prismaStub.note.update.reset();
    prismaStub.note.deleteMany.reset();
  });
  const mockUserId ='f47ac10b-58cc-4372-a567-0e02b2c3d479';
  const mockNoteId ='550e8400-e29b-41d4-a716-446655440000';
  describe('getNote',()=>{
    it('should throw a 404 error if note belongs to someone else',async()=>{
      prismaStub.note.findFirst.resolves(null);
      try{
        await noteService.getNote(mockNoteId, mockUserId);
        expect.fail('Expected an error to be thrown');
      } catch(error){
        expect(error.status).to.equal(404);
        expect(error.message).to.equal('Note not found');
      }
    });
  });
  describe('deleteNote',()=>{
    it('should throw a 404 error if no rows were deleted (count === 0)',async()=>{
      prismaStub.note.deleteMany.resolves({ count: 0 });
      try{
        await noteService.deleteNote(mockNoteId, mockUserId);
        expect.fail('Expected an error to be thrown');
      } catch(error){
        expect(error.status).to.equal(404);
        expect(error.message).to.equal('Note not found');
      }
    });
    it('should resolve without error on the happy path',async()=>{
      prismaStub.note.deleteMany.resolves({count:1});
      await noteService.deleteNote(mockNoteId,mockUserId);
      expect(prismaStub.note.deleteMany.calledOnce).to.be.true;
      expect(prismaStub.note.deleteMany.calledWith({where:{id:mockNoteId,userId:mockUserId}})).to.be.true;
    });
  });
  describe('addNote',()=>{
    it('should return the created note on the happy path',async()=>{
      const mockCreatedNote={
        id:mockNoteId,
        userId:mockUserId,
        title:'My Test Note',
        content:'This is a test',
        createdAt:new Date()
      };
      prismaStub.note.create.resolves(mockCreatedNote);
      const result=await noteService.addNote(mockUserId,'My Test Note','This is a test');
      expect(result).to.have.property('id',mockNoteId);
      expect(result).to.have.property('title','My Test Note');
      expect(result).to.have.property('content','This is a test');
    });
  });
  describe('getNotes',()=>{
    it('should return an ordered list of notes for a specific userId',async()=>{
      const mockNotesList=[
        {id:'11111111-1111-1111-1111-111111111111',title:'Latest Note'},
        {id:'22222222-2222-2222-2222-222222222222',title:'Older Note'}
      ];
      prismaStub.note.findMany.resolves(mockNotesList);
      const result=await noteService.getNotes(mockUserId);
      expect(result).to.be.an('array').that.has.lengthOf(2);
      expect(result[0]).to.have.property('title','Latest Note');
      expect(result[1]).to.have.property('title','Older Note');
      expect(prismaStub.note.findMany.calledWith({
        where: { userId: mockUserId },
        orderBy: { createdAt: 'desc' }
      })).to.be.true;
    });
  });
  describe('updateNote',()=>{
    it('should throw a 404 error if note not found',async()=>{
      prismaStub.note.findFirst.resolves(null);
      try{
        await noteService.updateNote(mockNoteId, mockUserId,'Updated Title','Updated Content');
        expect.fail('Expected an error to be thrown');
      } catch(error){
        expect(error.status).to.equal(404);
        expect(error.message).to.equal('Note not found');
      }
    });
    it('should return the updated note on the happy path',async()=>{
      prismaStub.note.findFirst.resolves({ id: mockNoteId, userId: mockUserId });
      const mockUpdatedNote = {id:mockNoteId,title:'Updated Title',content:'Updated Content'};
      prismaStub.note.update.resolves(mockUpdatedNote);
      const result=await noteService.updateNote(mockNoteId,mockUserId,'Updated Title','Updated Content');
      expect(result).to.have.property('title','Updated Title');
      expect(result).to.have.property('content','Updated Content');
      expect(prismaStub.note.update.calledOnce).to.be.true;
      expect(prismaStub.note.update.calledWith({
        where:{id:mockNoteId},
        data:{ title:'Updated Title',content:'Updated Content'}
      })).to.be.true;
    });
  });
});