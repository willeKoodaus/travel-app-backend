import fetch, { RequestInit as FetchRequestInit } from 'node-fetch';  // Importing RequestInit from node-fetch
import dotenv from 'dotenv';
dotenv.config();

const GPT4_API_KEY: string = process.env.GPT4_API_KEY as string;  // Your GPT-4 API key

interface Message {
  role: string;
  content: string;
}

interface RequestPayload {
  model: string;
  messages: Message[];
}

interface Choice {
  message: Message;
}

interface ResponseData {
  choices: Choice[];
}

// Function to generate text using GPT-4
async function generateText(messages: Message[]): Promise<string> {
  try {
    // Check if messages array is provided
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid input: messages array is required.');
    }

    // Construct the request payload
    const requestPayload: RequestPayload = {
      model: 'gpt-4',
      messages,
    };

    // Set up the options for the GPT-4 API request
    const requestOptions: FetchRequestInit = {  // Changed to FetchRequestInit
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GPT4_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    };

    // Use the Fetch API to make the GPT-4 API request
    const gpt4ApiResponse = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);

    // Check if the API request was successful
    if (!gpt4ApiResponse.ok) {
      const errorData = await gpt4ApiResponse.json();
      throw new Error(JSON.stringify(errorData));
    }
    
    // Process the response and return the generated text
    const responseData: ResponseData = await gpt4ApiResponse.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    // Handle errors
    console.error('Error generating text:', error);
    throw error;
  }
}

export {
  generateText,
};

