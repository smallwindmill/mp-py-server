'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // setTimeout(()=>{
        // console.log("ctx===", ctx);
        ctx.body = 'hi, egg';
    // }, 2000);
  }

  async wsCreate() {

  }
}

module.exports = HomeController;
