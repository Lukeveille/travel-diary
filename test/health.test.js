import assert from 'assert';
import { expect } from 'chai';
import request from 'supertest';
import app from '../app';

describe('Unit testing the /health', () => {
  it('should return OK status', () => {
    return request(app)
      .get('/api/v1/health')
      .then(res => {
        assert.equal(res.status, 200)
      })
  });
});