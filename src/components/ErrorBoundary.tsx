import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Resilient Error Boundary that prevents blank page on runtime errors
export class ErrorBoundary extends (React.Component as new (props: Props) => {
  props: Props;
  state: State;
  setState: (updater: Partial<State> | ((prevState: State) => Partial<State>)) => void;
  render(): ReactNode;
}) {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught display error in UI:', error, errorInfo);
  }

  public handleGoHome = () => {
    window.location.hash = '#/';
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900">
                Balaji Communication
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                पोर्टल लोड करने में अस्थायी समस्या | Temporary display error
              </p>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-left overflow-auto max-h-24">
              {this.state.error?.message || 'Unknown render error occurred.'}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go to Home (मुख्य पृष्ठ पर जाएं)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
