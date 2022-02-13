const http = require('http');
const fs = require('fs');

function doOnRequest(request, response) {
  if (request.method === 'GET' && request.url === '/') {
    let homeFile = fs.readFileSync('index.html', 'utf8');
    response.write(homeFile);
    response.end('Welcome to Twitter');
  } else if (request.method === 'GET' && request.url === '/style.css') {
    var styles = fs.readFileSync('style.css', 'utf8');
    response.end(styles);
  } else if (request.method === 'POST' && request.url === '/sayHi') {
    fs.appendFileSync('hi_log.txt', 'Somebody said hi.\n');
    response.write('hi back to you!');
    response.end();
  } else if (request.method === 'PUT' && request.url === '/update') {
    request.on('data', function (chunk) {
      let updateContents = chunk.toString();
      fs.writeFileSync('hi_log.txt', updateContents);
      response.statusCode = 200;
      response.end();
    });
  } else if (request.method === 'DELETE' && request.url === '/delete') {
    try {
      fs.unlinkSync('hi_log.txt', (error) => {
        if (err) throw err;
        response.end('file delted successfully!');
      });
    } catch (error) {
      response.statusCode = 500;
      response.end('file deletion has issues');
    }
  } else if (request.method === 'POST' && request.url === '/greeting') {
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
    response.end('404 Not Found');
  }
}

const server = http.createServer(doOnRequest);

server.listen(3000);
