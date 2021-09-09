import chai from 'chai';
import asPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

chai.use(asPromised);
chai.use(sinonChai);
global.expect = chai.expect;
global.sinon = sinon;
