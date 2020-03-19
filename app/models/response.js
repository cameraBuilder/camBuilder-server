class Response {
    constructor(status, data, message) {
        this.status = status;
        this.data = data;
        this.message = message;
    }
    set status(status) {
      this._status = status;
    }
    get status() {
      return this._status;
    }

    set data(data) {
        this._data = data;
      }
    get data() {
        return this._data;
    }
    set message(message) {
        this._message = message;
    }
    get message() {
        return this._message;
    }
  
    get JSON() {
      if(this._data == null) {
        return {
          status: this._status,
          message: this._message
        };
      }
      return {
        status: this._status,
        data: this._data,
        message: this._message
      };
    }
  }

  module.exports = Response