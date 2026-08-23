import esmock from 'esmock';
import sinon from 'sinon';
import {expect} from 'chai';

describe('authController',()=>{
  let authController;
  let authServiceStub;
  let jwtStub;
  let res;
  let next;

  beforeEach(async()=>{
    authServiceStub={newUserRegisteration:sinon.stub(),login:sinon.stub()};
    jwtStub={sign:sinon.stub().returns('fake-token')};
    authController=await esmock('../../controllers/authController.js',{
      '../../services/authService.js':authServiceStub,
      jsonwebtoken:{default:jwtStub}
    });
    res={status:sinon.stub().returnsThis(),json:sinon.stub(),send:sinon.stub()};
    next=sinon.stub();
  });

  afterEach(()=>{
    sinon.restore();
  });

  describe('signup',()=>{
    it('Returns 400 if email is missing',async()=>{
      const req={body:{pass:'password123'}};
      await authController.signup(req,res,next);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('Returns 400 if password is missing',async()=>{
      const req={body:{email:'test@example.com'}};
      await authController.signup(req,res,next);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('Returns 201 with user and token on success',async()=>{
      const req={body:{email:'test@example.com',pass:'password123'}};
      const createdUser={id:'1',email:'test@example.com'};
      authServiceStub.newUserRegisteration.resolves(createdUser);
      await authController.signup(req,res,next);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({data:{user:createdUser,token:'fake-token'}})).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={body:{email:'test@example.com',pass:'password123'}};
      const error=new Error('Database connection failed');
      authServiceStub.newUserRegisteration.rejects(error);
      await authController.signup(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('login',()=>{
    it('Returns 400 if email is missing',async()=>{
      const req={body:{pass:'password123'}};
      await authController.login(req,res,next);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('Returns 400 if password is missing',async()=>{
      const req={body:{email:'test@example.com'}};
      await authController.login(req,res,next);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('Returns 200 with user data on success',async()=>{
      const req={body:{email:'test@example.com',pass:'password123'}};
      const mockResult={user:{id:'1',email:'test@example.com'},token:'fake-jwt-token'};
      authServiceStub.login.resolves(mockResult);
      await authController.login(req,res,next);
      expect(res.json.calledWith({data:mockResult})).to.be.true;
    });

    it('Calls next(err) when service throws',async()=>{
      const req={body:{email:'test@example.com',pass:'password123'}};
      const error=new Error('Invalid credentials');
      authServiceStub.login.rejects(error);
      await authController.login(req,res,next);
      expect(next.calledWith(error)).to.be.true;
    });
  });
});