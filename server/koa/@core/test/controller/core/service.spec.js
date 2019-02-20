const {
  Injectable
} = require('../../../common/decorators/core/component.decorator')

@Injectable()
class AppService {
  getHello() {
    return 'Hello World!'
  }
}

exports.AppService = AppService
