/**
 * Test Groq API directly to verify it's working
 */

require('dotenv').config();
const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function testGroq() {
  console.log('🧪 Testing Groq API...');
  console.log('API Key:', process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 10)}...` : 'NOT SET');
  
  try {
    const completion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with JSON only.'
        },
        {
          role: 'user',
          content: 'Create a simple JSON response with fields: message (string), status (string), count (number)'
        }
      ],
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;
    console.log('\n✅ Success! Groq API is working');
    console.log('Response:', response);
    console.log('\nParsed:');
    console.log(JSON.parse(response));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testGroq();
