import request from 'supertest';
import {Request, Response} from "express";
import app from '../server'
import userData from './sample_data/users';



describe('POST /api/user/signup', () => {
    var new_ids: any[] = [];
    it('Insert all user from userData', async () => {
        for (const user of userData) {
            const response = await request(app)
                .post('/api/user/signup')
                .send(user);
            expect(response.status).toBe(200);
            const responseBody = response.body; // Extract the response body
            const newUserId = responseBody.id; // Assuming the ID is in the 'id' field of the response body
            new_ids.push(newUserId);
        }
    });

    it('User Records created should be deleted now',async () => {
        for(const userId of new_ids) {
            const response = await request(app)
                                .del(`/api/user/${userId}`)
            expect(response.body.id).toBe(userId);
        }
    })
});