import sinon from 'sinon';
import {expect} from 'chai';
import esmock from 'esmock';
import bcrypt from 'bcrypt';

const prismaStub={
  user:{
    findUnique:sinon.stub(),
    update:sinon.stub(),
    delete:sinon.stub()
  }
};
const userService=await esmock('../../services/userService.js',{
  '../../db.js':{default:prismaStub}
});
describe('User Service',()=>{
  afterEach(()=>{
    sinon.restore();
    prismaStub.user.findUnique.reset();
    prismaStub.user.update.reset();
    prismaStub.user.delete.reset();
  });
  const mockUserId='f47ac10b-58cc-4372-a567-0e02b2c3d479';
  describe('getProfile',()=>{
    it('should throw a 404 error with non-existent userId',async()=>{
      prismaStub.user.findUnique.resolves(null);
      try{
        await userService.getProfile(mockUserId);
        expect.fail('Expected an error to be thrown');
      } catch(error){
        expect(error.status).to.equal(404);
        expect(error.message).to.equal('User not found');
      }
    });
    it('should return user profile and explicitly exclude passwordHash via Prisma select',async()=>{
      const mockProfile={
        id: mockUserId,
        email: 'test@example.com',
        name: 'Test User',
        bio: 'Test Bio',
        createdAt: new Date()
      };
      prismaStub.user.findUnique.resolves(mockProfile);
      const result = await userService.getProfile(mockUserId);
      expect(result).to.have.property('id', mockUserId);
      expect(result).to.have.property('email', 'test@example.com');
      expect(prismaStub.user.findUnique.calledWithMatch({
        where:{id:mockUserId},
        select: { id:true,email:true,name:true,bio:true,createdAt:true}
      })).to.be.true;
    });
  });
  describe('updateProfile',()=>{
    it('should successfully update and return the profile',async()=>{
      const mockUpdatedProfile={
        id:mockUserId,
        email:'test@example.com',
        name:'Updated Name',
        bio:'Updated Bio'
      };
      prismaStub.user.update.resolves(mockUpdatedProfile);
      const result = await userService.updateProfile(mockUserId, 'Updated Name', 'Updated Bio');
      expect(result).to.have.property('name','Updated Name');
      expect(result).to.have.property('bio','Updated Bio');
      expect(prismaStub.user.update.calledOnce).to.be.true;
      expect(prismaStub.user.update.calledWithMatch({
        where:{id:mockUserId},
        data:{name:'Updated Name',bio:'Updated Bio'},
        select: {id:true,email:true,name:true,bio:true}
      })).to.be.true;
    });
  });
  describe('changePassword',()=>{
    it('should throw a 400 error with wrong current password',async()=>{
      prismaStub.user.findUnique.resolves({id:mockUserId,passwordHash:'oldHash'});
      sinon.stub(bcrypt,'compare').resolves(false);
      try{
        await userService.changePassword(mockUserId,'wrongCurrent','newPass123!');
        expect.fail('Expected an error to be thrown');
      } catch(error){
        expect(error.status).to.equal(400);
        expect(error.message).to.equal('Current password is incorrect');
      }
    });
    it('should throw a 400 error with new password shorter than 8 chars',async()=>{
      prismaStub.user.findUnique.resolves({id:mockUserId,passwordHash:'oldHash'});
      sinon.stub(bcrypt,'compare').resolves(true);
      try{
        await userService.changePassword(mockUserId,'correctCurrent','short');
        expect.fail('Expected an error to be thrown');
      } catch(error){
        expect(error.status).to.equal(400);
        expect(error.message).to.equal('Password must be at least 8 characters');
      }
    });
    it('should successfully update password hash on happy path',async()=>{
      prismaStub.user.findUnique.resolves({id:mockUserId,passwordHash:'oldHash'});
      sinon.stub(bcrypt,'compare').resolves(true);
      sinon.stub(bcrypt,'hash').resolves('newHashedPassword');
      prismaStub.user.update.resolves();
      await userService.changePassword(mockUserId,'correctCurrent','newPass123!');
      expect(prismaStub.user.update.calledOnce).to.be.true;
      expect(prismaStub.user.update.firstCall.args[0].data.passwordHash).to.equal('newHashedPassword');
    });
  });
  describe('deleteAccount',()=>{
    it('should resolve without error and call prisma.user.delete',async()=>{
      prismaStub.user.delete.resolves();
      await userService.deleteAccount(mockUserId);
      expect(prismaStub.user.delete.calledOnce).to.be.true;
      expect(prismaStub.user.delete.calledWith({where:{id:mockUserId}})).to.be.true;
    });
  });
});