import * as request from 'supertest';
import {app} from './constants';

describe('ROOT', () => {

  it('it should ping', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});