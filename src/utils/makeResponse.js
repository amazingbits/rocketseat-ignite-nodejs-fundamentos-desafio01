export function send(response, data, statusCode = 200) {
  const header = {"Content-type": "application/json"};
  return response.writeHead(statusCode, header).end(JSON.stringify(data));
}