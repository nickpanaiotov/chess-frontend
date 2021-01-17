import React from "react";
import {Row, Col} from "reactstrap";
import Game from "../../components/Game/Game";
import Widget from "../../components/Widget";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orientation: 'white',
            // history: JSON.parse("[{\"whiteMove\":\"f3\",\"blackMove\":\"e5\"},{\"whiteMove\":\"e4\",\"blackMove\":\"Nc6\"},{\"whiteMove\":\"d3\",\"blackMove\":\"h6\"},{\"whiteMove\":\"c4\",\"blackMove\":\"Bb4+\"},{\"whiteMove\":\"Bd2\",\"blackMove\":\"a5\"},{\"whiteMove\":\"Bxb4\",\"blackMove\":\"axb4\"},{\"whiteMove\":\"a3\",\"blackMove\":\"Nd4\"},{\"whiteMove\":\"axb4\",\"blackMove\":\"Rxa1\"},{\"whiteMove\":\"Ne2\",\"blackMove\":\"Qh4+\"},{\"whiteMove\":\"g3\",\"blackMove\":\"Nxf3+\"},{\"whiteMove\":\"Kf2\",\"blackMove\":\"Qf6\"},{\"whiteMove\":\"Nf4\",\"blackMove\":\"Nd4\"},{\"whiteMove\":\"Bh3\",\"blackMove\":\"Ne7\"},{\"whiteMove\":\"Qa4\",\"blackMove\":\"Rxa4\"},{\"whiteMove\":\"Nc3\",\"blackMove\":\"exf4\"},{\"whiteMove\":\"Nxa4\",\"blackMove\":\"fxg3+\"},{\"whiteMove\":\"Kxg3\",\"blackMove\":\"Qf3+\"},{\"whiteMove\":\"Kh4\",\"blackMove\":\"g5#\"}]")
            history: null,
            engine: this.getDefaultEngineState()
        };
    }

    render() {
        return (
            <Row>
                <Col lg={8}>
                    <div className="width-n-100 height-n-100"
                         style={{display: 'flex', justifyContent: 'center'}}>
                        {
                            <Game orientation={this.state.orientation}
                                  start={start => this.start = start}
                                  leave={leave => this.leave = leave}
                                  engineLevel={this.state.engine}
                                  onStateChange={this.onGameStateChange}
                            />
                        }
                    </div>
                </Col>
                <Col lg={4}>
                    <div className="width-n-100 height-n-100">
                        {
                            this.state.history ?
                                this.gameInProgress() :
                                this.newGameForm()
                        }
                    </div>
                </Col>
            </Row>
        );
    }

    onGameStateChange = (halfMoves) => {
        let history = []
        let moveNumber = 1;
        for (let i = 0; i < halfMoves.length; i++) {
            let move = halfMoves[i];
            if (i % 2 === 0) {
                history[moveNumber] = {...history[moveNumber], whiteMove: move.san}
            } else {
                history[moveNumber] = {...history[moveNumber], blackMove: move.san}
                moveNumber++;
            }

        }

        console.log(JSON.stringify(history));

        return this.setState({history: history})
    }

    componentDidUpdate() {
        if (this.newData)
            this.newData.scrollIntoView({behavior: "smooth", block: 'nearest', inline: 'start'})
    }

    gameInProgress = () => {
        return <>
            <Widget
                title={
                    <h6>
                        История на ходовете
                    </h6>
                }
                refresh
                close
            >
                <div className="widget-body undo_padding" style={{height: 400, overflowY: 'auto'}}>
                    <div className="list-group list-group-lg">
                        {
                            this.state.history.map((move, index) =>
                                <div className="list-group-item text-left" ref={(ref) => this.newData = ref}>
                                    {index}. {move.whiteMove} {move.blackMove}
                                </div>
                            )
                        }
                    </div>
                </div>

                <footer className="bg-widget-transparent mt">
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => this.leaveGame()}>
                        Напусни играта
                    </button>
                </footer>
            </Widget>
        </>
    }

    newGameForm = () => {
        return <>
            <div className="form-group col-md-12">
                <h3>Играй срещу компютър</h3>
            </div>
            <p/>

            <form>
                <div className="form-row align-items-center justify-content-center">
                    <div className="form-group col-sm-3">
                        <button type="button" className="btn btn-outline-dark" onClick={(event) => this.changeOrientation("white", event)}>
                            <i className='fas fa-chess-king fa-3x'/>
                        </button>
                    </div>
                    <div className="form-group col-sm-3">
                        <button type="button" className="btn btn-outline-light" onClick={(event) => this.changeOrientation("black", event)}>
                            <i className='fas fa-chess-king fa-3x'/>
                        </button>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12 align-middle">
                        <label htmlFor="difficulty">Трудност: {this.state.engine.difficulty}</label>
                        <div className="range">
                            <input type="range" min={1} max={20} defaultValue={10} className="form-control" id="difficulty"
                                   onChange={(event) =>
                                       this.setState({engine: {...this.state.engine, difficulty: Number.parseInt(event.target.value)}})}/>
                        </div>
                    </div>

                    <div className="form-group col-md-12 align-middle">
                        <label htmlFor="depth">Дълбочина: {this.state.engine.depth}</label>
                        <div className="range">
                            <input type="range" min={1} max={20} defaultValue={10} className="form-control" id="depth"
                                   onChange={(event) =>
                                       this.setState({engine: {...this.state.engine, depth: Number.parseInt(event.target.value)}})}/>
                        </div>
                    </div>

                    <div className="form-group col-md-12 align-middle">
                        <label htmlFor="timeForThinking">Време за мислене: {this.state.engine.time} милисекунди</label>
                        <div className="range">
                            <input type="range" min={100} max={4000} defaultValue={2000} className="form-control" id="timeForThinking"
                                   onChange={(event) =>
                                       this.setState({engine: {...this.state.engine, time: Number.parseInt(event.target.value)}})}/>
                        </div>
                    </div>

                    <div className="form-group col-md-12 align-self-end">
                        <button type="button" className="btn btn-outline-light btn-block" onClick={() => this.start()}>Започни игра</button>
                    </div>
                </div>
            </form>
        </>;
    }

    changeOrientation = (color) => {
        this.setState({orientation: color})
    }

    leaveGame = () => {
        this.setState({orientation: 'white', history: null, engine: this.getDefaultEngineState()})
        this.leave();
    }

    getDefaultEngineState() {
        return {
            difficulty: 10,
            depth: 10,
            time: 2000
        };
    }

}

export default Dashboard;
