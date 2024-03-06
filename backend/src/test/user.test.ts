import request from 'supertest';
import userData from './sample_data/users';
import {WEB_DOMAIN} from "../utils/config";

const url =  `${WEB_DOMAIN}/api`;
describe(`POST ${WEB_DOMAIN}/api/user/signup`, () => {
    var new_ids: any[] = [];
    it('Insert all user from userData', async () => {
        for (const user of userData) {
            const response = await request(url)
                                    .post('/user/signup')
                                    .send(user);
            expect(response.status).toBe(200);
            const responseBody = response.body; // Extract the response body
            const newUserId = responseBody.id; // Assuming the ID is in the 'id' field of the response body
            new_ids.push(newUserId);
        }
    });

    it('User Records created should be deleted now',async () => {
        for(const userId of new_ids) {
            const response = await request(url)
                                        .del(`/user/${userId}`);
            expect(response.body.id).toBe(userId);
        }
    })
});


describe('POST /api/user/login', () => {
    const user = userData[0]
    var newUserId: number;
    it('Insert one user from userData', async () => {
        const response = await request(url)
            .post('/user/signup')
            .send(user);
        expect(response.status).toBe(200);
        const responseBody = response.body; // Extract the response body
        newUserId = responseBody.id;
    }
    )

    it('Login using correct password', async () => {
        const response = await request(url)
            .post('/user/login')
            .send(user);
        expect(response.status).toBe(200);
    });

    it('User Record created should be deleted now',async () => {
        const response = await request(url)
                            .del(`/user/${newUserId}`)
        expect(response.body.id).toBe(newUserId);
    })

});
