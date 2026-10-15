// JSON to Jsonschema - to get schema from response

/*
Pre requisites:
Install the required packages:

npm install ajv
AJV is used for JSON schema validation
AJV stands for "Another JSON Schema Validator"

ajv.compile (schema) returns a validator function
validate (data) checks if the response matches the schema
*/

import { test, expect } from "@playwright/test";
import Ajv from 'ajv'; // ajv is class from ajv module

// Example 1:
test('validate the json schema', async ({ request }) => {

    // Step 1: send request and get the response
    const response = await request.get('https://mocktarget.apigee.net/json');
    const responseBody = await response.json();

    console.log(responseBody);

    //step 2: define the schema
    const schema = {
      
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "firstName": {
                        "type": "string"
                    },
                    "lastName": {
                        "type": "string"
                    },
                    "city": {
                        "type": "string"
                    },
                    "state": {
                        "type": "string"
                    }
                },
                "required": [
                    "city",
                    "firstName",
                    "lastName",
                    "state"
                ],
                "title": "Welcome4"
            }

    // Step 3: check response against schema
    const ajv = new Ajv(); // created oject
    const validate = ajv.compile(schema); //returns a validator function
    
    const isValid = validate(responseBody); // check if response matches the schema
    expect(isValid).toBeTruthy() //assertion

});

//Example 2:  

test.only('Validate JSON response with schema2', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const responsebody = await response.json();

    // Define the JSON schema
    const schema = {
        type: 'object',
        properties: {
            userId: { type: 'integer' },
            id: { type: 'integer' },
            title: { type: 'string' },
            body: { type: 'string' },
        },
        required: ['userId', 'id', 'title', 'body'],
        additionalProperties: false, // Disallow additional properties
    };

    const ajv = new Ajv();   // Initialize Ajv
    const validate = ajv.compile(schema); //returns a validator function
    const isValid = validate(responsebody); //checks if the response matches the schema

    expect(isValid).toBeTruthy();

});