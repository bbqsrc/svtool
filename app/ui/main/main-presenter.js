const { CompositeSubscription } = require("../../util")
const wordList = require("./data.json")

class MainPagePresenter {
  constructor(view, cefr) {
    this._view = view

    this.cefr = cefr || "A1"
  }

  generateCard() {
    let word

    if (!(this.cefr.length === 2 
        && ["A", "B", "C"].includes(this.cefr.charAt(0))
        && ["1", "2"].includes(this.cefr.charAt(1)))) {
          console.log('why')
      return
    }

    while (word = wordList[parseInt(Math.random() * wordList.length, 10)]) {
      if (word.cefr === this.cefr) {
        return word
      }
    }
  }

  start() {
    const view = this._view

    view.showCard(this.generateCard())

    return new CompositeSubscription(
      view.onNextButtonClicked.subscribe(() => {
        view.showCard(this.generateCard())
      }),
      view.onFlipButtonClicked.subscribe(() => view.flipCard()),
      view.onPlayButtonClicked
        .throttle(() => Rx.Observable.interval(750))
        .subscribe(() => view.playSound())
    )
  }
}

module.exports = MainPagePresenter