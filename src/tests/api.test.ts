import axios from 'axios';

const API_URL = 'http://localhost:3000/api/todos';
let testTodoId: number;

// Function to run tests in sequence
async function runTests() {
  console.log('🚀 Starting API tests...');
  
  try {
    // Test 1: Create a new todo
    console.log('\n📝 Testing POST /api/todos - Create a new todo');
    const createResponse = await axios.post(API_URL, {
      title: 'Test Todo',
      description: 'This is a test todo created by the API test script',
      completed: false
    });
    
    if (createResponse.status === 201) {
      console.log('✅ Successfully created a new todo');
      console.log('📄 Todo data:', createResponse.data);
      testTodoId = createResponse.data.id;
    } else {
      console.log('❌ Failed to create todo');
      console.log('🔍 Response:', createResponse.status, createResponse.data);
    }
    
    // Test 2: Get all todos
    console.log('\n📝 Testing GET /api/todos - Get all todos');
    const getAllResponse = await axios.get(API_URL);
    
    if (getAllResponse.status === 200) {
      console.log('✅ Successfully retrieved all todos');
      console.log(`📄 Found ${getAllResponse.data.length} todos`);
    } else {
      console.log('❌ Failed to retrieve todos');
      console.log('🔍 Response:', getAllResponse.status, getAllResponse.data);
    }
    
    // Test 3: Get todo by id
    console.log(`\n📝 Testing GET /api/todos/${testTodoId} - Get todo by ID`);
    const getByIdResponse = await axios.get(`${API_URL}/${testTodoId}`);
    
    if (getByIdResponse.status === 200) {
      console.log('✅ Successfully retrieved todo by ID');
      console.log('📄 Todo data:', getByIdResponse.data);
    } else {
      console.log('❌ Failed to retrieve todo by ID');
      console.log('🔍 Response:', getByIdResponse.status, getByIdResponse.data);
    }
    
    // Test 4: Update todo
    console.log(`\n📝 Testing PUT /api/todos/${testTodoId} - Update todo`);
    const updateResponse = await axios.put(`${API_URL}/${testTodoId}`, {
      title: 'Updated Test Todo',
      completed: true
    });
    
    if (updateResponse.status === 200) {
      console.log('✅ Successfully updated todo');
      console.log('📄 Updated data:', updateResponse.data);
    } else {
      console.log('❌ Failed to update todo');
      console.log('🔍 Response:', updateResponse.status, updateResponse.data);
    }
    
    // Test 5: Delete todo
    console.log(`\n📝 Testing DELETE /api/todos/${testTodoId} - Delete todo`);
    const deleteResponse = await axios.delete(`${API_URL}/${testTodoId}`);
    
    if (deleteResponse.status === 200) {
      console.log('✅ Successfully deleted todo');
      console.log('📄 Response:', deleteResponse.data);
    } else {
      console.log('❌ Failed to delete todo');
      console.log('🔍 Response:', deleteResponse.status, deleteResponse.data);
    }
    
    // Test 6: Verify todo was deleted
    console.log(`\n📝 Testing GET /api/todos/${testTodoId} - Verify todo was deleted`);
    try {
      const verifyDeleteResponse = await axios.get(`${API_URL}/${testTodoId}`);
      console.log('❌ Todo still exists:', verifyDeleteResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log('✅ Todo was successfully deleted (404 Not Found response)');
      } else {
        console.log('❓ Unexpected error when verifying deletion:', error);
      }
    }
    
    console.log('\n✨ All API tests completed!');
  } catch (error) {
    console.error('❌ Error running tests:', error);
  }
}

// Check if the server is running before starting tests
async function checkServerAndRunTests() {
  try {
    console.log('🔍 Checking if the server is running...');
    await axios.get('http://localhost:3000');
    console.log('✅ Server is running. Starting tests...');
    await runTests();
  } catch (error) {
    console.error('❌ Server is not running. Please start the server with "npm run dev" first.');
  }
}

// Run the tests
checkServerAndRunTests();