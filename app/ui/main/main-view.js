const React = require("react")
const MainPagePresenter = require("./main-presenter")
const Rx = require("rxjs")
const { CompositeSubscription } = require("../../util")
const { Link } = require("react-router-dom")
const Media = require("react-media")

class CardView extends React.Component {
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

class MainPageView extends React.Component {
  // React necessary dancing
  constructor(props) {
    super(props)

    this.state = {
      card: {},
      isFlipped: false
    }
  }

  componentWillMount() {
    this._presenter = this.props.presenter(this)
    this._selects = []
  }

  componentDidMount() {
    this._onNextSubject = new Rx.Subject()
    this._onFlipSubject = new Rx.Subject()
    this._onPlaySubject = new Rx.Subject()
    this._cefrSubject = new Rx.Subject()

    this._bag = new CompositeSubscription(
      this._presenter.start(),
      this._onFlipSubject,
      this._onNextSubject,
      this._onPlaySubject,
      this._cefrSubject
    )
  }

  componentWillUnmount() {
    if (this._bag) {
      this._bag.unsubscribe()
      this._bag = null
    }

    // this._selects.filter(x => x != null).forEach(x => x.destroy())
    this._selects = null
  }
  
  render() {
    return <div>
      <CardView data={this.state.card} isFlipped={this.state.isFlipped} />
      <Media query="(max-width: 600px)">
      {matches => matches ? (
        <div>
          <div className="row">
            <div className="col s12">
              <button style={{width: "100%"}} className="waves-effect waves-light btn" onClick={() => this._onNextSubject.next()}>Next</button>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <button style={{width: "100%"}} className="waves-effect waves-light btn" onClick={() => this._onFlipSubject.next()}>Flip</button>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <button style={{width: "100%"}} disabled={this.state.card.sound == null} className="waves-effect waves-light btn" onClick={() => this._onPlaySubject.next()}>Pronounce</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col s12 m8 offset-m3">
            <button className="waves-effect waves-light btn" onClick={() => this._onNextSubject.next()}>Next</button>{" "}
            <button className="waves-effect waves-light btn" onClick={() => this._onFlipSubject.next()}>Flip</button>{" "}
            <button disabled={this.state.card.sound == null} className="waves-effect waves-light btn" onClick={() => this._onPlaySubject.next()}>Pronounce</button>
          </div>
        </div>
      )}
      </Media>

      <div className="row">
        <div className="col s12  m8 offset-m3">
          <Link to="/">Return to Menu</Link>
        </div>
      </div>
    </div>
  }

  // View implementation
  showCard(data) {
    this.setState({
      isFlipped: false,
      card: data
    }, () => {
      this.playSound()
    })
  }
  
  flipCard() {
    this.setState({
      isFlipped: !this.state.isFlipped
    })
  }

  playSound() {
    const { sound } = this.state.card
    if (sound) {
      const audio = new Audio("./sv/sounds/" + sound)
      audio.play()
    }
  }

  get onNextButtonClicked() {
    return this._onNextSubject
  }

  get onFlipButtonClicked() {
    return this._onFlipSubject
  }

  get onPlayButtonClicked() {
    return this._onPlaySubject
  }
}

module.exports = MainPageView