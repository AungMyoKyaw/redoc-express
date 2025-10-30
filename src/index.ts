import { Request, Response } from 'express';
import { redocHtml, Ioption } from './redoc-html-template';

function redocExpressMiddleware(
  options: Ioption = {
    title: 'ReDoc',
    specUrl: 'http://petstore.swagger.io/v2/swagger.json'
  }
): (req: Request, res: Response) => void {
  return function middleware(_req: Request, res: Response): void {
    res.type('html');
    res.send(redocHtml(options));
  };
}

export default redocExpressMiddleware;

module.exports = redocExpressMiddleware;
module.exports.default = redocExpressMiddleware;
