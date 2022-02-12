const http = require('http');
const fs = require('fs');

function doOnRequest(request, response) {
  // Send back a message saying "Welcome to Twitter"
  // code here...
  if (request.method === 'GET' && request.url === '/') {
    // read the index.html file and send it back to the client
    // code here...
    let homeFile = fs.readFileSync('index.html', 'utf8');
    response.write(homeFile);
    response.end('Welcome to Twitter');
  } else if (request.method === 'POST' && request.url === '/sayHi') {
    fs.appendFileSync('hi_log.txt', 'Somebody said hi.\n');
    response.write('hi back to you!');
    response.end();
  } else if (request.method === 'POST' && request.url === '/greeting') {
    // accumulate the request body in a series of chunks
    // code here...
    request.on('data', (data) => {
      let streamOutData = data.toString();
      fs.appendFileSync('hi_log.txt', `${streamOutData}\n`);
      if (streamOutData == 'hello') {
        response.end('hello there!');
      } else if (streamOutData == `what's up`) {
        response.end('the sky');
      }
    });
  } else {
    // Handle 404 error: page not found
    // code here...
    response.end('404 Not Found');
  }
}

const server = http.createServer(doOnRequest);

server.listen(3000);
