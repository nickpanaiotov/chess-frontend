import React from "react";
import {Redirect, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {oauth} from "../../actions/user";

class OAuth extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

    static isAuthenticated(token) {
        if (token) return true;
    }

    componentDidMount() {
        this.props.dispatch(oauth());
    }

    render() {
        const {from} = this.props.location.state || {from: {pathname: '/app'}}; // eslint-disable-line

        // cant access login page while logged in
        if (OAuth.isAuthenticated(localStorage.getItem('id_token'))) {
            return (
                <Redirect to={from}/>
            );
        }

        return (
            <div className="oauth-page">
                <p>Kur</p>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        isFetching: state.auth.isFetching,
        isAuthenticated: state.auth.isAuthenticated,
        errorMessage: state.auth.errorMessage,
    };
}

export default withRouter(connect(mapStateToProps)(OAuth));

