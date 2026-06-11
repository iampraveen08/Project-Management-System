import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="errorPage">
          <section className="panel narrow">
            <span className="eyebrow">Frontend error</span>
            <h1>Something went wrong</h1>
            <p>{this.state.error.message}</p>
            <button
              className="primary"
              onClick={() => {
                localStorage.removeItem("pms_auth");
                window.location.href = "/login";
              }}
            >
              Reset and open login
            </button>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}
