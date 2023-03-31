import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home.js";
import People from "./pages/people/index.js";
import PeopleDetail from "./pages/people/detail.js";


import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
            dbResponse: ""
        };
    }

    // Go to API and check testAPI route for a response
    callAPI() {
        fetch("https://media-demo.onrender.com/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    // Go to API and check testDB route for a response
    callDB() {
        fetch("https://media-demo.onrender.com/testDB")
            .then(res => res.text())
            .then(res => this.setState({ dbResponse: res }))
            .catch(err => err);
    }

    // Execute the calls when componnent mounts
    componentDidMount() {
        this.callAPI();
        this.callDB();
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        <h1 className="App-title">Welcome to the website!</h1>
                        <nav>
                            <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/people">People</Link>
                            </li>
                            </ul>
                        </nav>
                    </header>
                        <Routes>
                            <Route exact path="/" element={ <Home />} />
                            <Route path="/people" element={<People />} />
                            <Route path="/people/:encodedParentName" element={<PeopleDetail />} />                                
                        </Routes>
                </div>
            </Router>
        );
    }
}

export default App;
