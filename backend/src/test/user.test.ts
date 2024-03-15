import request from 'supertest';
import userData from './sample_data/users';
import { BACKEND_DOMAIN } from '../utils/config';

const url = `${BACKEND_DOMAIN}/api`;
describe(`POST ${BACKEND_DOMAIN}/api/user/signup`, () => {
  var new_ids: any[] = [];
  it('Insert all user from userData', async () => {
    for (const user of userData) {
      const response = await request(url).post('/user/signup').send(user);
      expect(response.status).toBe(201);
      const responseBody = response.body; // Extract the response body
      // Assuming the ID is in the 'id' field of the response.body.user
      const newUserId = responseBody.user.id;
      new_ids.push(newUserId);
    }
  });
  it('User Records created should be deleted now', async () => {
    for (const userId of new_ids) {
      // console.log(userId);
      const response = await request(url).del(`/user/${userId}`).send({
        userId: 1, //only admin user can delete user records
      });
      expect(response.body.user.id).toBe(userId);
    }
  });
});

describe('POST /api/user/login', () => {
  const user = userData[0];
  var newUserId: number;
  it('Insert one user from userData', async () => {
    const response = await request(url).post('/user/signup').send(user);
    expect(response.status).toBe(201);
    const responseBody = response.body; // Extract the response body
    newUserId = responseBody.user.id;
  });

  it('Login using correct password', async () => {
    const response = await request(url).post('/user/login').send(user);
    expect(response.status).toBe(200);
  });

  it('User Record created should be deleted now', async () => {
    const response = await request(url).del(`/user/${newUserId}`).send({
      userId: 1,
    });
    expect(response.body.user.id).toBe(newUserId);
  });
});
