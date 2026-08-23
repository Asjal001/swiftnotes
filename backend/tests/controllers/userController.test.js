import esmock from 'esmock';
import sinon from 'sinon';
import {expect} from 'chai';

describe('userController',()=>{
  let userController;
  let userServiceStub;
  let res;
  let next;

  beforeEach(async()=>{
    userServiceStub={
      getProfile:sinon.stub(),
      updateProfile:sinon.stub(),
      changePassword:sinon.stub(),
      deleteAccount:sinon.stub()
    };
    userController=await esmock('../../controllers/userController.js',{
      '../../services/userService.js':userServiceStub
    });
    res={status:sinon.stub().returnsThis(),json:sinon.stub(),send:sinon.stub()};
    next=sinon.stub();
  });

  afterEach(()=>{
    sinon.restore();
  });

  describe('getProfile',()=>{
    it('Returns 200 with user data on success',async()=>{
      const req={user:{userId:'user-1'}};
      const profileData={name:'Test User',email:'test@example.com'};
      userServiceStub.getProfile.resolves(profileData);
      await userController.getProfile(req,res,next);
      expect(res.json.calledWith({data:profileData})).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={user:{userId:'user-1'}};
      const error=new Error('User not found');
      userServiceStub.getProfile.rejects(error);
      await userController.getProfile(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('updateProfile',()=>{
    it('Returns 200 with updated user on success',async()=>{
      const req={user:{userId:'user-1'},body:{name:'Updated User'}};
      const updatedProfile={name:'Updated User',email:'test@example.com'};
      userServiceStub.updateProfile.resolves(updatedProfile);
      await userController.updateProfile(req,res,next);
      expect(res.json.calledWith({data:updatedProfile})).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={user:{userId:'user-1'},body:{name:'Updated User'}};
      const error=new Error('Update failed');
      userServiceStub.updateProfile.rejects(error);
      await userController.updateProfile(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('changePassword',()=>{
    it('Returns 400 if currentPassword is missing',async()=>{
      const req={user:{userId:'user-1'},body:{newPassword:'newpass123'}};
      await userController.changePassword(req,res,next);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('Returns 400 if newPassword is missing',async()=>{
      const req={user:{userId:'user-1'},body:{currentPassword:'oldpass123'}};
      await userController.changePassword(req,res,next);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('Returns 200 with success message on success',async()=>{
      const req={user:{userId:'user-1'},body:{currentPassword:'oldpass123',newPassword:'newpass123'}};
      userServiceStub.changePassword.resolves();
      await userController.changePassword(req,res,next);
      expect(res.json.calledWith({data:{message:'Password updated successfully'}})).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={user:{userId:'user-1'},body:{currentPassword:'oldpass123',newPassword:'newpass123'}};
      const error=new Error('Incorrect password');
      userServiceStub.changePassword.rejects(error);
      await userController.changePassword(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('deleteAccount',()=>{
    it('Returns 204 on success',async()=>{
      const req={user:{userId:'user-1'}};
      userServiceStub.deleteAccount.resolves();
      await userController.deleteAccount(req,res,next);
      expect(res.status.calledWith(204)).to.be.true;
      expect(res.send.calledOnce).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={user:{userId:'user-1'}};
      const error=new Error('Deletion failed');
      userServiceStub.deleteAccount.rejects(error);
      await userController.deleteAccount(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });
});