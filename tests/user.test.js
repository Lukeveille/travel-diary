import assert from 'assert';
import { expect } from 'chai';
import request from 'supertest';
import app from '../app';

const body = {
  email: 'test@test.com',
  password: 'test'
}
const route = '/api/v1'

describe('Unit testing signup path', () => {

  it('should return 201 created with message', () => {
    return request(app)
      .post(route + '/signup')
      .send(body)
      .then(res => {
        assert.equal(res.status, 201);
        expect(res.body.message).to.contain('New user created with e-mail address test@test.com');
      })
  });

  it('should return 400 bad request with error if email exists', () => {
    return request(app)
      .post(route + '/signup')
      .send(body)
      .then(res => {
        assert.equal(res.status, 400);
        expect(res.body.error).to.contain('User already exists!')
      })
  });
});

describe('Unit testing login path', () => {
  
  it('should return 401 unauthorized with error with incorrect password', () => {
    body.password = 'wrong'
    return request(app)
      .post(route + '/login')
      .send(body)
      .then(res => {
        assert.equal(res.status, 401);
        expect(res.body.error).to.contain('Auth failed');
      })
  })
  
  it('should return 202 accepted with token and message with correct password', () => {
    body.password = 'test';
    const tokenRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
    return request(app)
      .post(route + '/login')
      .send(body)
      .then(res => {
        assert.equal(res.status, 202);
        assert.equal(tokenRegex.test(res.body.token), true);
        expect(res.body.message).to.contain('Login successful');
      });
  });
});

describe('Unit testing delete path', () => {
  let token = null;
  before(done => {
    request(app)
    .post(route + '/login')
    .send(body)
    .end((err, res) => {
      token = res.body.token;
      done();
    })
  });
  const deleteRoute = route + '/delete/test@test.com';

  it("should return 401 unauthorized with error if not logged in", () => {
    return request(app)
      .del(deleteRoute)
      .send(body)
      .then(res => {
        assert.equal(res.status, 401);
        expect(JSON.parse(res.res.text).error).to.contain('Auth failed');
      });
  });

  it('should delete user and return 202 accepted if logged in', () => {
    return request(app)
      .del(deleteRoute)
      .set('Authorization', 'Bearer ' + token)
      .send(body)
      .then(res => {
        assert.equal(res.status, 202);
        expect(res.body.user).to.contain('User with e-mail address test@test.com deleted');
      });
  });
});