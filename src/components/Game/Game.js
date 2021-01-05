import React, {Component} from "react";

import {gameService} from "../../services/gameService";
import Chessboard from "chessboardjsx";
import * as ChessJS from "chess.js";
import wQueen from "../../images/figures/w-queen.svg";
import bQueen from "../../images/figures/b-queen.svg";
import wKing from "../../images/figures/w-king.svg";
import bKing from "../../images/figures/b-king.svg";
import wPawn from "../../images/figures/w-pawn.svg";
import bPawn from "../../images/figures/b-pawn.svg";
import wRook from "../../images/figures/w-rook.svg";
import bRook from "../../images/figures/b-rook.svg";
import wKnight from "../../images/figures/w-knight.svg";
import bKnight from "../../images/figures/b-knight.svg";
import wBishop from "../../images/figures/w-bishop.svg";
import bBishop from "../../images/figures/b-bishop.svg";

interface Props {
    orientation: string,
    start: () => void,
    leave: () => void,
    engineLevel: number,
    onStateChange: (any) => void
}

class Game extends Component<Props> {

    constructor(props) {
        super(props);

        this.start = this.start.bind(this);
        this.leave = this.leave.bind(this);
    }

    static defaultProps = {
        orientation: 'white',
        engineLevel: 9
    }

    state = {
        gameId: "",
        fen: "",
        // square styles for active drop square
        dropSquareStyle: {},
        // custom square styles
        squareStyles: {},
        // square with the currently clicked piece
        pieceSquare: "",
        // currently clicked square
        square: "",
        // array of past game moves
        history: [],
    };

    componentDidMount() {
        let gameId = localStorage.getItem("gameId")

        if (gameId) {
            gameService.getGame(gameId).then(game => {
                if (localStorage.getItem(gameId + "-orientation")) {
                    this.setState({orientation: localStorage.getItem(gameId + "-orientation")});
                } else {
                    if (game.whitePlayer['type'] === 'HUMAN') {
                        this.setState({orientation: 'white'});
                        localStorage.setItem(gameId + "-orientation", 'white')
                    } else if (game.blackPlayer['type'] === 'HUMAN') {
                        this.setState({orientation: 'black'});
                        localStorage.setItem(gameId + "-orientation", 'black')
                    }
                }

                const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
                this.game = new Chess();

                let halfMoves = game['halfMoves'];
                halfMoves.forEach(move => {
                    this.game.move({
                        from: move.from.toLowerCase(),
                        to: move.to.toLowerCase(),
                        promotion: "q"
                    })

                    this.setState(({history, pieceSquare}) => ({
                        fen: this.game.fen(),
                        history: this.game.history({verbose: true}),
                        // squareStyles: squareStyling({ pieceSquare, history })
                    }));
                })

                if (this.game.fen() !== game['boardFen']) {
                    console.error("Unable to load game!");
                }
                this.setState({fen: game['boardFen'], gameId: game['gameId'], mode: game['mode']});

                const {onStateChange} = this.props;
                onStateChange(this.state.history);
            })
        }

        this.props.start(this.start);
        this.props.leave(this.leave);
    }

    start = () => {
        const {orientation, engineLevel, onStateChange} = this.props;
        let mode = orientation === 'white' ? 'HUMAN_VS_MACHINE' : 'MACHINE_VS_HUMAN';
        let body = {mode: mode};
        body[orientation === 'white' ? 'blackPlayer' : 'whitePlayer'] = {type: 'ENGINE', elo: engineLevel};

        gameService.startGame(orientation, body)
            .then(game => {
                const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
                this.game = new Chess();
                this.setState({fen: game['boardFen'], gameId: game['gameId'], mode: game['mode']});
                onStateChange(this.state.history);
                localStorage.setItem("gameId", game['gameId']);
                localStorage.setItem(game['gameId'] + "-orientation", orientation);
                return this.move();
            })
            .catch(error => {
                console.error("Cannot connect to backend", error);
            })
    }

    leave = () => {
        localStorage.removeItem("gameId");
        localStorage.removeItem(this.state.gameId + 'orientation');


        this.setState({
            gameId: "",
            fen: "start",
            // square styles for active drop square
            dropSquareStyle: {},
            // custom square styles
            squareStyles: {},
            // square with the currently clicked piece
            pieceSquare: "",
            // currently clicked square
            square: "",
            // array of past game moves
            history: [],
        })
    }

    render() {
        const {orientation} = this.props;
        return (
            <Chessboard
                position={this.state.fen}
                onDrop={this.onDrop}
                calcWidth={this.calcWidth}
                orientation={this.state.orientation ? this.state.orientation : orientation}
                // darkSquareStyle={{backgroundColor: "#1B1E3C"}}
                darkSquareStyle={{backgroundColor: "#252745"}}
                lightSquareStyle={{backgroundColor: "#474D84"}}
                pieces={{
                    bP: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getPawnImgStyle(squareWidth)}
                                src={bPawn}
                                alt={"Black Pawn"}
                            />
                        </div>
                    ),
                    wP: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getPawnImgStyle(squareWidth)}
                                src={wPawn}
                                alt={"White Pawn"}
                            />
                        </div>
                    ),
                    bQ: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getImgStyle(squareWidth)}
                                src={bQueen}
                                alt={"Black Queen"}
                            />
                        </div>
                    ),
                    wQ: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getImgStyle(squareWidth)}
                                src={wQueen}
                                alt={"White Queen"}
                            />
                        </div>
                    ),
                    bK: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getImgStyle(squareWidth)}
                                src={bKing}
                                alt={"Black King"}
                            />
                        </div>
                    ),
                    wK: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getImgStyle(squareWidth)}
                                src={wKing}
                                alt={"White King"}
                            />
                        </div>
                    ),
                    wN: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getImgStyle(squareWidth)}
                                src={wKnight}
                                alt={"White Knight"}
                            />
                        </div>
                    ),
                    bN: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getImgStyle(squareWidth)}
                                src={bKnight}
                                alt={"Black Knight"}
                            />
                        </div>
                    ),
                    bB: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getImgStyle(squareWidth)}
                                src={bBishop}
                                alt={"Black Bishop"}
                            />
                        </div>
                    ),
                    wB: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getImgStyle(squareWidth)}
                                src={wBishop}
                                alt={"White Bishop"}
                            />
                        </div>
                    ),
                    wR: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getImgStyle(squareWidth)}
                                src={wRook}
                                alt={"White Rook"}
                            />
                        </div>
                    ),
                    bR: ({squareWidth, isDragging}) => (
                        <div style={this.getImgContainerStyle(squareWidth)}>
                            <img
                                style={this.getImgStyle(squareWidth)}
                                src={bRook}
                                alt={"Black Rook"}
                            />
                        </div>
                    )
                }}
            />
        );
    }

    calcWidth = (obj) => {
        // console.log(obj)
        return obj.screenWidth / 2;
        // return 640;
    }

    onDrop = ({sourceSquare, targetSquare}) => {
        // see if the move is legal
        let move = this.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q" // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        gameService.move(this.state.gameId, sourceSquare + targetSquare)
            .then(game => {
                this.onSuccessfulMove(game);

                return this.move()
            })
            .catch(console.error)
    };

    onSuccessfulMove(game) {
        let playerMove = game['halfMoves'][game['halfMoves'].length - 1];

        //TODO: make it returned to lower case from the API
        this.game.move({
            from: playerMove.from.toLowerCase(),
            to: playerMove.to.toLowerCase(),
            promotion: "q"
        });
        this.setState(({history, pieceSquare}) => ({
            fen: this.game.fen(),
            history: this.game.history({verbose: true}),
            // squareStyles: squareStyling({ pieceSquare, history })
        }));

        const {onStateChange} = this.props;
        onStateChange(this.state.history);

        //TODO: show win
    }

    move = () => {
        if (!this.game) {
            return;
        }

        let turn = this.game.turn() === "w" ? "white" : "black";
        if (!this.game.game_over()) {
            if ((turn === "white" && this.state.mode === 'MACHINE_VS_HUMAN')
                || (turn === "black" && this.state.mode === 'HUMAN_VS_MACHINE')) {
                return gameService.move(this.state.gameId, null)
                    .then(game => {
                        this.onSuccessfulMove(game);
                    })
                    .catch(console.error)
            }
        }
    }

    getImgContainerStyle = (squareWidth) => {
        return {
            width: squareWidth,
            height: squareWidth,
            display: 'flex',
            justifyContent: 'center'
        }
    }
    getImgStyle = (squareWidth) => {
        return {
            alignSelf: 'center',
            width: squareWidth * 0.80,
            height: squareWidth * 0.80,
        }
    }

    getPawnImgStyle = (squareWidth) => {
        return {
            alignSelf: 'center',
            width: squareWidth * 0.7,
            height: squareWidth * 0.7,
        }
    }
}


export default Game;
