import request from 'supertest';
import app from '../server';
import {WEB_DOMAIN} from "../utils/config";

describe('GET /api', () => {
    it('responds with "Hello World!"', async () => {
        const url =  `${WEB_DOMAIN}/api`;
        const response = await request(url).get("/");
        expect(response.text).toBe('Hello World!');
        expect(response.status).toBe(200);
    });
});
