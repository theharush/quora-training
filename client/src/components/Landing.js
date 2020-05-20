import React, { Component } from "react";
import axios from "axios";

import QuestionList from "./questions/QuestionList";

export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
        }
    }
    render() {
        const name = (this.props.user) ? this.props.user.name : "undefined";
        return (
            <div>
                <p>Hello {name} </p>
                <QuestionList questions={this.state.questions} />
            </div>
        )
    }

    componentDidMount() {
        axios.get("http://localhost:8000/api/questions")
            .then(req => this.setState({ questions: req.data }))
    }
} 