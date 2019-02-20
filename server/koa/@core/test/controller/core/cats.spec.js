const {
  Controller
} = require('../../../common/decorators/core/controller.decorator')

@Controller('cats')
class CatsController {
  find() {
    this.appServer.get
  }
}

exports.CatsController = CatsController
