import React from "react";
import {Row, Col, Table, Badge} from "reactstrap";
import {gameService} from '../../services/gameService'
import Widget from "../../components/Widget";
import s from "./History.module.scss";

class History extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tableContent: []
        };

        this.checkAll = this.checkAll.bind(this);
    }

    componentDidMount() {
        gameService.getGames().then(games => {
            this.setState({tableContent: games})
        });
    }

    parseDate(timestamp) {
        return new Date(timestamp).toISOString();
    }

    checkAll(ev, checkbox) {
        const checkboxArr = new Array(this.state[checkbox].length).fill(
            ev.target.checked
        );
        this.setState({
            [checkbox]: checkboxArr,
        });
    }

    render() {
        return (
            <div className={s.root}>
                <h2 className="page-title">
                    Изиграни <span className="fw-semi-bold">игри</span>
                </h2>
                <Row>
                    <Col>
                        <Widget
                            settings
                            close
                            bodyClass={s.mainTableWidget}
                        >
                            <Table striped>
                                <thead>
                                <tr className="fs-sm">
                                    <th className="hidden-sm-down">id</th>
                                    <th className="hidden-sm-down">White</th>
                                    <th className="hidden-sm-down">Black</th>
                                    <th className="hidden-sm-down">Mode</th>
                                    <th className="hidden-sm-down">Дата</th>
                                    <th className="hidden-sm-down">Резултат</th>
                                </tr>
                                </thead>
                                <tbody>

                                {this.state.tableContent.map((row) => (
                                    <tr key={row.gameId}>
                                        <td>{row.gameId}</td>
                                        <td>
                                            {row.whitePlayer.type}
                                        </td>
                                        <td>
                                            {row.blackPlayer.type}
                                        </td>
                                        <td>
                                            {row.mode}
                                        </td>

                                        <td className="text-muted">{this.parseDate(row.dateStarted)}</td>
                                        <td className="width-150">

                                            <Badge color={this.parseResult(row.result, row.whitePlayer, row.blackPlayer)}
                                                   onClick={() => this.loadGame(row.gameId)}>
                                                {row.result}
                                            </Badge>

                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Widget>
                    </Col>
                </Row>
            </div>
        )
    }

    loadGame = (gameId) => {
        localStorage.setItem("gameId", gameId);
        this.props.history.push('/app/main/dashboard')
    }

    parseResult(result, whitePlayer, blackPlayer) {
        if (result === "ONGOING") {
            return "info";
        } else if ((result === "WHITE_WON" && whitePlayer['type'] === 'HUMAN') || (result === "BLACK_WON" && blackPlayer['type'] === 'HUMAN')) {
            return "success"
        } else {
            return "danger";
        }
    }
}

export default History;
