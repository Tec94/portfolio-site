import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign('/');
  };

  public render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main id="main-content" className="v2-system-page">
        <section className="v2-system-panel" aria-labelledby="error-title">
          <span className="v2-system-icon is-error" aria-hidden="true">
            <AlertTriangle />
          </span>
          <p className="v2-eyebrow">Rendering interrupted</p>
          <h1 id="error-title">This view did not load cleanly.</h1>
          <p>
            The portfolio recovered as far as it could. Reload this view, or return to
            the project archive.
          </p>
          <div className="v2-system-actions">
            <button
              type="button"
              className="v2-button v2-button-primary"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={17} aria-hidden="true" />
              Reload view
            </button>
            <button
              type="button"
              className="v2-button v2-button-secondary"
              onClick={this.handleReset}
            >
              <Home size={17} aria-hidden="true" />
              Project archive
            </button>
          </div>
          {import.meta.env.DEV && this.state.error ? (
            <details className="v2-system-details">
              <summary>Developer details</summary>
              <pre>{this.state.error.message}</pre>
            </details>
          ) : null}
        </section>
      </main>
    );
  }
}
