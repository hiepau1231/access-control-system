import React from 'react';
import { Alert, Button } from 'antd';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RoleHierarchyErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Ở đây có thể log lỗi vào service logging
    console.error('Role Hierarchy Error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <Alert
            message="Đã xảy ra lỗi trong Role Hierarchy Management"
            description={
              <div>
                <p>Chi tiết lỗi: {this.state.error?.message}</p>
                <Button 
                  type="primary"
                  onClick={this.handleReset}
                  className="mt-4"
                >
                  Thử lại
                </Button>
              </div>
            }
            type="error"
            showIcon
          />
        </div>
      );
    }

    return this.props.children;
  }
}