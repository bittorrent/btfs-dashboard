import React from 'react'
import CardWarning from "./components/Cards/CardWarning";

export const AsyncComponent = loadComponent => (
    class AsyncComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                Component: null,
            }
        }
        componentDidMount() {
            if (this.hasLoadedComponent()) {
                return;
            }
            loadComponent()
                .then(module => module.default)
                .then((Component) => {
                    this.setState({Component});
                })
                .catch((err) => {
                    console.error(`Cannot load component in <AsyncComponent />`);
                    throw err;
                });
        }
        hasLoadedComponent() {
            return this.state.Component !== null;
        }
        render() {
            const {Component} = this.state;
            return Component ? ( (window.nodeStatus || window.location.href.indexOf("/admin/settings") !== -1) ? <Component {...this.props} /> : <CardWarning color={window.theme} loading={window.loading}/>) : null;
        }
    }
);
