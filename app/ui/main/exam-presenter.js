const { CompositeSubscription } = require("../../util")
const wordList = require("./data.json")
const Rx = require("rxjs")
const { findLastIndex } = require("lodash")

class ExamPresenter {
  constructor(view, cefr) {
    this._view = view

    this.cefr = cefr || "A1"
  }

  generateList(total) {
    if (!(this.cefr.length === 2 
        && ["A", "B", "C"].includes(this.cefr.charAt(0))
        && ["1", "2"].includes(this.cefr.charAt(1)))) {
          console.log('why')
      return
    }
    
    const first = wordList.findIndex(x => x.cefr === this.cefr)
    const last = findLastIndex(wordList, x => x.cefr === this.cefr)
    const range = last - first - total
    
    const firstIndex = first + parseInt(Math.random() * range, 10)
    return wordList.slice(firstIndex, firstIndex + total)
  }

  start() {
    const view = this._view

    view.showList(this.generateList(10))

    return new CompositeSubscription(
      view.onPlaySoundClicked
        .throttle(() => Rx.Observable.interval(750))
        .subscribe(i => view.playSound(i)),
      view.onSubmitClicked.subscribe(state => {
        const { answers, words } = state
        const correct = []

        for (let i = 0; i < words.length; ++i) {
          const answer = answers[i]
          const word = words[i]

          if (answer == null) {
            correct[i] = { isCorrect: false, alts: word.b }
            continue
          }

          const isCorrect = word.b.split(",").map(x => x.trim()).find(x => x === answer.trim()) != null
          correct[i] = { isCorrect, alts: word.b }
        }

        view.showCorrections(correct)
      })
    )
    //   view.onNextButtonClicked.subscribe(() => {
    //     view.showCard(this.generateCard())
    //   }),
    //   view.onFlipButtonClicked.subscribe(() => view.flipCard()),
    //   view.onPlayButtonClicked.subscribe(() => view.playSound()),
    //   view.onCefrChanged.subscribe((cefr) => {
    //     this.cefr = cefr
    //     view.showCard(this.generateCard())
    //   })
    // )
  }
}

module.exports = ExamPresenter