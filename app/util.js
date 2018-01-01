
class CompositeSubscription {
  constructor(...subscriptions) {
    this._subscriptions = subscriptions
    this.closed = false
  }

  unsubscribe() {
    this._subscriptions.map(x => x.unsubscribe())
    this.closed = true
  }
}

module.exports = {
  CompositeSubscription
}