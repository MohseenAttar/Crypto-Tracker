import { Component } from "react";
import PropTypes from "prop-types";
import ErrorFallback from "./ErrorFallback";

/**
 * React Error Boundary — catches runtime errors in the component tree
 * and shows a fallback UI instead of crashing the entire app.
 *
 * Must be a class component — React doesn't support error boundaries
 * with hooks (getDerivedStateFromError + componentDidCatch are class-only).
 *
 * Usage:
 *   <ErrorBoundary>
 *     <ComponentThatMightCrash />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log error details — in production this would go to Sentry/Datadog
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
