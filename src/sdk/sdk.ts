import { Session } from './modules';
import { Config } from './interfaces';

export class CrPayment {
  session: Session;

  constructor(options: Config) {
    this.session = new Session(options.network, options);
  }
}
