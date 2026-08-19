import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { SystemPage } from './SystemPage';

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
    window.location.assign('/#work');
  };

  public render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <SystemPage
        eyebrow="Rendering interrupted"
        title="This page stopped before it was ready."
        description="Reload this page, or return to the work archive and continue browsing."
        icon={<AlertTriangle />}
        actions={(
          <>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={17} aria-hidden="true" />
              Reload page
            </button>
            <button
              type="button"
              onClick={this.handleReset}
            >
              <Home size={17} aria-hidden="true" />
              Work archive
            </button>
          </>
        )}
        details={import.meta.env.DEV && this.state.error ? (
          <details className="portfolio-system-details">
            <summary>Developer details</summary>
            <pre>{this.state.error.message}</pre>
          </details>
        ) : undefined}
      />
    );
  }
}
