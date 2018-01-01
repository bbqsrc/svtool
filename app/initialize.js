const React = require("react")
const ReactDOM = require("react-dom")
const MainPageView = require("./ui/main/main-view")
const MainPagePresenter = require("./ui/main/main-presenter")
const ExamView = require("./ui/main/exam-view")
const ExamPresenter = require("./ui/main/exam-presenter")

const { HashRouter, Link } = require("react-router-dom")
const { Route } = require("react-router")


  
class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cefr: "A1"
    }

    this._selects = []
  }
  render() {
    return <div>
      <div className="row">
        <div className="input-field col s12 offset-m3 m6">
          <h1 style={{fontSize: "20pt"}}>Swedish Study Tool</h1>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12 offset-m3 m6">
          <select value={this.state.cefr} ref={x => x && this._selects.push(new M.Select(x))} onChange={evt => this.setState({ cefr: evt.target.value })}>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>
          <label>CEFR</label>
        </div>
      </div>
      <div className="row">
        <div className="col s12 m6 offset-m3">
          <Link style={{width: "100%"}} className="btn" to={`/exam/${this.state.cefr}`}>{this.state.cefr} Exam</Link>
        </div>
      </div>
      <div className="row">
        <div className="col s12 m6 offset-m3">
          <Link style={{width: "100%"}} className="btn" to={`/cards/${this.state.cefr}`}>{this.state.cefr} Cards</Link>
        </div>
      </div>

      <div className="row" style={{textAlign: "center", fontSize: "8pt", "color": "#444"}}>
        <div className="col s12 m6 offset-m3">
          <a href="https://spraakbanken.gu.se/swe/resurs/kelly">Swedish Kelly-list</a> used under CC-BY-SA 3.0/LGPL 3.0 licenses.
          <a href="http://folkets-lexikon.csc.kth.se">The People's English-Swedish Dictionary</a> XDXF datasets used under the CC BY-SA 2.5 license.
          <a href="https://github.com/bbqsrc/svtool">This tool</a> is licensed under the ISC license.
        </div>
      </div>
    </div>
  }
}

const Exam = ({ match }) => {
  return <ExamView presenter={v => new ExamPresenter(v, match.params.cefr)} />
}

const Cards = ({ match }) => {
  return <MainPageView presenter={v => new MainPagePresenter(v, match.params.cefr)} />
}

document.addEventListener('DOMContentLoaded', function() {
  const cont = document.querySelector("#container")
  
  const tree = (<HashRouter>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/exam/:cefr" component={Exam} />
      <Route path="/cards/:cefr" component={Cards} />
    </div>
  </HashRouter>)

  ReactDOM.render(tree, cont)
})