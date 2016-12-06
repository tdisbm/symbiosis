'use strict';

class Feedback {
  constructor(data, status) {
    this.status = typeof status === 'string'
      ? status
      : Feedback.FEEDBACK_STATUS_SUCCESS;
    this.data = typeof data === 'object'
      ? data
      : {};
  }

  setStatus(status) {
    this.status = status;

    return this;
  }

  getStatus() {
    return this.status;
  }

  setData(data) {
    this.data = data;

    return this;
  }

  getData() {
    return this.data;
  }
}

Feedback.FEEDBACK_STATUS_SUCCESS = 'success';
Feedback.FEEDBACK_STATUS_FAILURE = 'failure';
Feedback.FEEDBACK_STATUS_MALFORMATED = 'malformated';

module.exports = Feedback;