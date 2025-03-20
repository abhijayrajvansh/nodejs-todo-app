const request = require('supertest');
const path = require('path');
const { execSync } = require('child_process');
const net = require('net');

let serverProcess;
let testTodoId;
const SERVER_START_TIMEOUT = 30000; // Increased to 30 seconds
const TEST_TIMEOUT = 10000;

// Function to check if the port is available before starting the server
const isPortAvailable = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        reject(new Error(`Port ${port} is already in use. Is another instance running?`));
      } else {
        reject(err);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve();
    });
    server.listen(port);
  });
};

// Handle graceful exit in case of server startup failure
const handleServerStartupFailure = (message) => {
  console.error(`❌ ${message}`);
  console.error('❌ Terminating tests due to server startup failure');
  // Just throw the error to let Jest handle termination
  throw new Error(`Server startup failed: ${message}`);
};

// Configure Jest to exit after tests complete
jest.setTimeout(SERVER_START_TIMEOUT);

// Use a global setup to make sure the server is properly stopped before Jest exits
beforeAll(async () => {
  try {
    console.log('🚀 Checking if port 3000 is available...');
    await isPortAvailable(3000);
    console.log('✅ Port 3000 is available');

    console.log('🚀 Running Prisma generate...');
    // Use synchronous execution for Prisma to prevent hanging processes
    try {
      execSync('npx prisma generate', { 
        cwd: path.join(__dirname, '../app'),
        stdio: 'inherit' // Show output directly
      });
      console.log('✅ Prisma generate completed');
    } catch (error) {
      throw new Error(`Prisma generate failed: ${error.message}`);
    }

    console.log('🚀 Starting server...');
    // Use spawn instead of exec for better process control
    serverProcess = require('child_process').spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '../app'),
      stdio: 'pipe',
      detached: process.platform !== 'win32' // For non-Windows, use detached for process group
    });

    // Make sure the server process doesn't keep Node.js alive
    if (process.platform !== 'win32') {
      serverProcess.unref();
    }

    let startupPromise = new Promise((resolve, reject) => {
      let started = false;
      const startTimeout = setTimeout(() => {
        if (!started) {
          reject(new Error('Server failed to start within timeout'));
        }
      }, SERVER_START_TIMEOUT - 1000);

      serverProcess.stdout.on('data', (data) => {
        const output = data.toString().trim();
        console.log(output);
        if (!started && output.includes('Server is running')) {
          started = true;
          clearTimeout(startTimeout);
          // Add a small delay to ensure server is fully ready
          setTimeout(resolve, 1000);
        }
      });

      serverProcess.stderr.on('data', (data) => {
        console.error(`❌ Server Error: ${data.toString().trim()}`);
      });

      serverProcess.on('close', (code) => {
        if (!started) {
          clearTimeout(startTimeout);
          reject(new Error(`Server process exited prematurely with code ${code}`));
        }
      });
    });

    await startupPromise;
    console.log('✅ Server started successfully');
  } catch (error) {
    // Handle any error during startup process
    handleServerStartupFailure(error.message);
  }
});

// This will run even if tests fail
afterAll(async () => {
  console.log('🛑 Stopping the server...');
  if (serverProcess) {
    try {
      // Properly kill the process and all child processes
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${serverProcess.pid} /T /F`, { stdio: 'ignore' });
      } else {
        try {
          process.kill(-serverProcess.pid, 'SIGKILL');
        } catch {
          serverProcess.kill('SIGKILL');
        }
      }
    } catch (e) {
      console.error('Error stopping server:', e.message);
    }
    console.log('✅ Server stopped');
  }
  
  // Instead of forcing process.exit, allow Jest to naturally complete
  console.log('✅ Tests completed, process will exit naturally');
}, 5000);

describe('API Tests for /api/todos', () => {
  test('POST /api/todos - Create a new todo', async () => {
    const response = await request('http://localhost:3000')
      .post('/api/todos')
      .send({
        title: 'Test Todo',
        description: 'This is a test todo created by Supertest',
        completed: false
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    testTodoId = response.body.id;
    console.log('✅ Successfully created a new todo:', response.body);
  }, TEST_TIMEOUT);

  test('GET /api/todos - Get all todos', async () => {
    const response = await request('http://localhost:3000').get('/api/todos');
    expect(response.status).toBe(200);
    console.log('✅ Successfully retrieved all todos:', response.body.length);
  });

  test('GET /api/todos/:id - Get todo by ID', async () => {
    const response = await request('http://localhost:3000').get(`/api/todos/${testTodoId}`);
    expect(response.status).toBe(200);
    console.log('✅ Successfully retrieved todo by ID:', response.body);
  });

  test('PUT /api/todos/:id - Update todo', async () => {
    const response = await request('http://localhost:3000')
      .put(`/api/todos/${testTodoId}`)
      .send({
        title: 'Updated Test Todo',
        completed: true
      });

    expect(response.status).toBe(200);
    console.log('✅ Successfully updated todo:', response.body);
  });

  test('DELETE /api/todos/:id - Delete todo', async () => {
    const response = await request('http://localhost:3000').delete(`/api/todos/${testTodoId}`);
    expect(response.status).toBe(200);
    console.log('✅ Successfully deleted todo:', response.body);

    const verifyResponse = await request('http://localhost:3000').get(`/api/todos/${testTodoId}`);
    expect(verifyResponse.status).toBe(404);
    console.log('✅ Verified todo was deleted (404 Not Found)');
  });
});