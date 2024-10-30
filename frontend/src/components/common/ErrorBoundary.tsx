import React, { Component, ErrorInfo } from 'react';
import { Button, Result } from 'antd';
import { ReloadOutlined, BugOutlined } from '@ant-design/icons';

interface FallbackProps {
  error: Error | null;
  resetError: () => void;
}

type FallbackComponent = React.ComponentType<FallbackProps>;

interface Props {
  children: React.ReactNode;
  fallback?: FallbackComponent;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service
    console.error('Error caught by error boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Check for custom fallback
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.handleReset} />;
      }

      // Default error UI
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle={
            <div className="text-left">
              <p className="mb-4">
                We apologize for the inconvenience. An unexpected error has occurred.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-4">
                  <details className="cursor-pointer">
                    <summary className="text-blue-500 hover:text-blue-700">
                      Technical Details
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-48">
                      <code>
                        {this.state.error.toString()}
                        {'\n\n'}
                        {this.state.errorInfo?.componentStack}
                      </code>
                    </pre>
                  </details>
                </div>
              )}
            </div>
          }
          extra={[
            <Button
              key="reset"
              type="primary"
              icon={<ReloadOutlined />}
              onClick={this.handleReset}
            >
              Try Again
            </Button>,
            <Button
              key="reload"
              icon={<BugOutlined />}
              onClick={this.handleReload}
            >
              Reload Page
            </Button>
          ]}
        />
      );
    }

    return this.props.children;
  }
}

// HOC to wrap components with error boundary
export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};

export default ErrorBoundary;
