import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PackSach Uncaught UI Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-[#475569]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#EAE7E0] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF1EE] border border-[#FFE1DA] flex items-center justify-center mx-auto mb-4 text-[#D11A4F]">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
              Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
              PackSach encountered an unexpected issue while rendering this food label view. Your saved scans and preferences are safe.
            </p>

            {this.state.error && (
              <div className="my-4 p-3 rounded-xl bg-[#F4F1EA] border border-[#EAE5DA] text-[11px] font-mono text-[#64748B] text-left truncate">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={this.handleReload}
                className="btn-dark h-10 px-5 text-xs font-bold gap-1.5 justify-center cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="btn-secondary h-10 px-5 text-xs font-bold gap-1.5 justify-center cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
