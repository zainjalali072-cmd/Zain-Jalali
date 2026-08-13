import React from "react";

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  props: Readonly<Props>;
  state: State = {
    hasError: false
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07080b] text-[#f3ecd8] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#12141b] border border-[#d9b45c]/30 rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#d9b45c]/10 border border-[#d9b45c]/40 flex items-center justify-center mx-auto text-[#d9b45c] text-2xl font-bold">
              ✦
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#f2d98a]">
              Truth Quran Academy
            </h1>
            <p className="text-xs text-[#c9c2ab] leading-relaxed">
              We encountered a temporary display update. Please refresh to load the virtual classroom.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#f2d98a] to-[#d9b45c] text-[#07080b] font-sans font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              Refresh Classroom
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
