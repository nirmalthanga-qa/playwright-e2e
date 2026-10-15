import { test, expect } from '@playwright/test';
import fs from 'fs';

/*

File Upload and Download using API Chaining
API Reference:
https://fakeapi.platzi.com/en/rest/files

*/

test.describe.serial('File Upload and Download', () => {

    let uploadedTextFile = "";

    test('validate the file upload function', async ({ request }) => {

        const response = await request.post(
            `https://api.escuelajs.co/api/v1/files/upload`,

            {
                multipart: {
                    file: {
                        name: 'Test1.txt',
                        mimeType: 'text/plain',
                        buffer: fs.readFileSync('./uploads/Test1.txt')
                    }
                }
            });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.originalname).toBe('Test1.txt')

        uploadedTextFile = responseBody.filename;

        console.log('Uploaded Text File:', uploadedTextFile);

    });


    test('validate the file download function', async ({ request }) => {


        const response = await request.get(
            `https://api.escuelajs.co/api/v1/files/${uploadedTextFile}`

        );

        expect(response.status()).toBe(200);

        const fileContent = await response.text();

        expect(fileContent).toContain('Hi, This is file upload testing file!');

        console.log(fileContent);

    });

});