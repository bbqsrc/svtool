const React = require("react")
const MainPagePresenter = require("./main-presenter")
const Rx = require("rxjs")
const { CompositeSubscription } = require("../../util")
const { Link } = require("react-router-dom")

class WordRowView extends React.Component {
  render() {
    const {
      data,
      isFlipped
    } = this.props

    return <div className="row">
      <div className="col s12 m6 offset-m3">
        <div className="card blue lighten-5">
          <div className="card-content black-text">
            <span className="card-title">{isFlipped ? data.b : data.a} <small>({data.pos})</small></span>
            <div style={{ fontFamily: "serif" }}>{data.pronounce ? `/${data.pronounce}/` : "\u00a0"}</div>
            <div>{data.example || "\u00a0"}</div>
            <div>{data.cefr}</div>
          </div>
        </div>
      </div>
    </div>
  }
}

class ExamView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      words: [],
      answers: [],
      correct: []
    }
  }

  componentWillMount() {
    this._presenter = this.props.presenter(this)
  }

  componentDidMount() {
    this._soundSubject = new Rx.Subject()
    this._submitSubject = new Rx.Subject()

    this._bag = new CompositeSubscription(
      this._presenter.start(),
      this._soundSubject,
      this._submitSubject
    )
  }

  componentWillUnmount() {
    if (this._bag) {
      this._bag.unsubscribe()
      this._bag = null
    }
  }

  showList(list) {
    this.setState({
      words: list
    })
  }

  showCorrections(correct) {
    this.setState({
      correct
    })
  }
  
  playSound(i) {
    const { sound } = this.state.words[i]

    if (sound) {
      const audio = new Audio("./sv/sounds/" + sound)
      audio.play()
    }
  }

  get onPlaySoundClicked() {
    return this._soundSubject
  }

  get onSubmitClicked() {
    return this._submitSubject
  }

  handleAnswerField(index, evt) {
    const answers = this.state.answers.slice()
    answers[index] = evt.target.value
    this.setState({ answers })
  }

  handleInputClass(i) {
    if (this.state.correct.length === 0) {
      return ""
    }

    if (!this.state.correct[i]) {
      return
    }

    return this.state.correct[i].isCorrect
      ? "validate valid"
      : "validate invalid"
  }

  handleSuccess(i) {
    if (!this.state.correct[i]) {
      return
    }

    if (this.state.correct[i].alts.indexOf(",") > -1) {
      return `Correct! Also: ${this.state.correct[i].alts}`
    }

    return "Correct!"
  }

  handleError(i) {
    if (!this.state.correct[i]) {
      return
    }
    
    return `*bzzt* — ${this.state.correct[i].alts}`
  }

  render() {
    const data = this.state.words

    return <div>
      <div className="row">
        <table className="table-responsive">
          <thead>
            <tr>
              <th>Ord</th>
              <th>Betydelse</th>
            </tr>
          </thead>
          <tbody>
            {data.map((x, i) => <tr key={i}>
              <td style={{padding: "10px 5x"}}>
                <div>
                  <span style={{fontSize: "1.5em"}}>{x.a}</span>
                  {"\u00a0\u00a0\u00a0\u00a0"}
                  {this.state.words[i].sound && <button className="waves-effect waves-teal btn-floating" onClick={() => this._soundSubject.next(i)}>
                    <i className="material-icons">volume_up</i>
                  </button>}
                </div>
                <div style={{fontFamily: "Noto Serif"}}>{this.state.words[i].pronounce ? `/${this.state.words[i].pronounce}/` : ""}</div>
              </td>
              <td>
                <div className="input-field col s12">
                  <input type="text" className={this.handleInputClass(i)}
                      disabled={this.state.correct.length > 0}
                      value={this.state.answers[i]}
                      onChange={this.handleAnswerField.bind(this, i)} />
                  <span className="helper-text" data-error={this.handleError(i)} data-success={this.handleSuccess(i)}></span>
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="row">
        <button className="waves-effect waves-teal btn" onClick={() => this._submitSubject.next(this.state)}>Submit</button>
        <Link style={{marginLeft: "2em"}} to="/">Return to Menu</Link>
      </div>
    </div>
  }
}

module.exports = ExamView