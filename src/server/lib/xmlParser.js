import { promisify } from 'util';
import xml2js from 'xml2js';

export default promisify(xml2js.parseString);
