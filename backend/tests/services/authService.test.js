import sinon from 'sinon';
import {expect} from 'chai';
import esmock from 'esmock';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const prismaStub={
  user:{
    findUnique: sinon.stub(),
    create: sinon.stub()
  }
};
const authService = await esmock('../../services/authService.js',{
  '../../db.js': {default:prismaStub}
});
describe('Auth Service',()=>{
  afterEach(()=>{
    sinon.restore();
    prismaStub.user.findUnique.reset();
    prismaStub.user.create.reset();
  });
  describe('newUserRegisteration',()=>{
    it('should throw a 400 error if password is shorter than 8 characters',async()=>{
      try{
        await authService.newUserRegisteration('test@example.com','short');
        expect.fail('Expected an error to be thrown');
      } catch(error){
        expect(error.status).to.equal(400);
      }
    });
    it('should throw a 409 error if email already exists',async()=>{
      prismaStub.user.findUnique.resolves({ id:'f47ac10b-58cc-4372-a567-0e02b2c3d479',email:'test@example.com' });
      try {
        await authService.newUserRegisteration('test@example.com','ValidPassword123!');
        expect.fail('Expected an error to be thrown');
      } catch(error){
        expect(error.status).to.equal(409);
      }
    });
    it('should return user id and email on valid registration',async()=>{
      prismaStub.user.findUnique.resolves(null);
      prismaStub.user.create.resolves({
        id:'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        email:'newuser@example.com'
      });
      sinon.stub(bcrypt,'hash').resolves('hashed_password_mock');
      try {
        const result = await authService.newUserRegisteration('newuser@example.com','ValidPassword123!');
        expect(result).to.have.property('id','f47ac10b-58cc-4372-a567-0e02b2c3d479');
        expect(result).to.have.property('email','newuser@example.com');
        expect(bcrypt.hash.calledWith('ValidPassword123!',10)).to.be.true;
        expect(prismaStub.user.create.calledWith({
          data:{ email:'newuser@example.com',passwordHash:'hashed_password_mock' }
        })).to.be.true;
      } catch(error){
        throw error; 
      }
    });
  });
  describe('login',()=>{
    it('should throw a 401 error with a non-existent email',async()=>{
      prismaStub.user.findUnique.resolves(null);
      try {
        await authService.login('wrong@example.com','password123');
        expect.fail('Expected an error to be thrown');
      } catch(error){
        expect(error.status).to.equal(401);
      }
    });
    it('should throw a 401 error with the wrong password',async()=>{
      prismaStub.user.findUnique.resolves({ id:'f47ac10b-58cc-4372-a567-0e02b2c3d479',email:'test@test.com',passwordHash:'hash'});
      sinon.stub(bcrypt,'compare').resolves(false);
      try{
        await authService.login('test@test.com','wrongpass12');
        expect.fail('Expected an error to be thrown');
      } catch(error){
        expect(error.status).to.equal(401);
      }
    });
    it('should return user and token on valid login',async()=>{
      prismaStub.user.findUnique.resolves({id:'f47ac10b-58cc-4372-a567-0e02b2c3d479',email:'test@test.com',passwordHash:'hash'});
      sinon.stub(bcrypt,'compare').resolves(true);
      sinon.stub(jwt,'sign').returns('fake-jwt-token');
      try{
        const result=await authService.login('test@test.com','correctpass');
        expect(result.user.id).to.equal('f47ac10b-58cc-4372-a567-0e02b2c3d479');
        expect(result.user.email).to.equal('test@test.com');
        expect(result.token).to.equal('fake-jwt-token');
        expect(bcrypt.compare.calledWith('correctpass','hash')).to.be.true;
        expect(jwt.sign.calledWith(
          { userId:'f47ac10b-58cc-4372-a567-0e02b2c3d479' }, 
          process.env.JWT_SECRET, 
          { expiresIn:'1d'}
        )).to.be.true;
      } catch(error){
        throw error;
      }
    });
  });
});