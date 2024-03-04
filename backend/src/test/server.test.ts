import request from 'supertest';
import app from '../server'

describe('GET /api', () => {
    it('responds with "Hello World!"', async () => {
        const response = await request(app).get('/api');
        expect(response.text).toBe('Hello World!');
        expect(response.status).toBe(200);
    });
});
