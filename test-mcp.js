const { spawn } = require('child_process');
const path = require('path');

// Start the MCP server process
const server = spawn('bash', [path.join(__dirname, 'start-github-mcp.sh')]);

// Debug output
server.stdout.on('data', (data) => {
  console.log(`Server stdout: ${data}`);
});

server.stderr.on('data', (data) => {
  console.log(`Server stderr: ${data}`);
});

// Prepare a request to list tools using the correct MCP method
const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "mcp.listTools",
  params: {}
};

// Send the request to the server
console.log('Sending mcp.listTools request to server...');
server.stdin.write(JSON.stringify(request) + '\n');

// Wait for a response
let responseData = '';
server.stdout.on('data', (data) => {
  responseData += data.toString();
  
  try {
    // Try to parse the response as JSON
    const response = JSON.parse(responseData);
    console.log('Received response:', JSON.stringify(response, null, 2));
    
    // Now try to create an issue with labels
    const createIssueRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "mcp.callTool",
      params: {
        name: "create_issue",
        arguments: {
          owner: "sirkitree",
          repo: "lullaibot.edu",
          title: "Test Issue from MCP Script",
          body: "Testing label functionality from our test script",
          labels: ["enhancement", "documentation"]
        }
      }
    };
    
    console.log('Sending mcp.callTool request...');
    server.stdin.write(JSON.stringify(createIssueRequest) + '\n');
    
    // Exit after processing
    setTimeout(() => {
      server.kill();
      process.exit(0);
    }, 5000);
  } catch (e) {
    // If not valid JSON yet, wait for more data
    console.log('Incomplete or invalid JSON received, waiting for more data...', e);
  }
});

// Handle server exit
server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
}); 