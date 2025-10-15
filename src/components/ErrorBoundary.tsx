import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Terminal from 'lucide-react/dist/esm/icons/terminal';

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
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <motion.div
            className="max-w-2xl w-full border-2 border-red-500/40 rounded-lg bg-black/80 backdrop-blur-sm p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: '0 0 30px rgba(255, 0, 0, 0.3), inset 0 0 30px rgba(255, 0, 0, 0.05)',
            }}
          >
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-500" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-red-500" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-red-500" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-500" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <Terminal className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-red-300 font-mono"
                  style={{ textShadow: '0 0 10px rgba(255, 0, 0, 0.5)' }}
                >
                  System Error
                </h1>
                <p className="text-red-400/80 font-mono text-sm">
                  ERROR CODE: EXCEPTION_CAUGHT
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded font-mono text-sm">
              <p className="text-red-300 mb-2">
                <span className="text-red-500">{'> '}</span>
                An unexpected error occurred while rendering the application.
              </p>
              {this.state.error && (
                <details className="mt-3">
                  <summary className="text-red-400 cursor-pointer hover:text-red-300 transition-colors">
                    Show error details
                  </summary>
                  <pre className="mt-2 text-xs text-red-400/60 overflow-x-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={this.handleReset}
                className="flex-1 px-6 py-3 border-2 border-green-500/60 rounded-lg bg-green-500/20 text-green-300 font-mono hover:bg-green-500/30 transition-all text-center font-bold"
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                {'> '}Return to Homepage
              </motion.button>
              <motion.button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 border-2 border-red-500/40 rounded-lg bg-red-500/10 text-red-300 font-mono hover:bg-red-500/20 transition-all text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reload Page
              </motion.button>
            </div>

            <p className="mt-6 text-center text-red-400/60 font-mono text-xs">
              If this error persists, please contact support
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
