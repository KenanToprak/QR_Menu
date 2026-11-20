import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uygulama hatası:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary" role="alert">
          <div className="error-boundary-card">
            <h1 className="error-boundary-title">Bir şeyler ters gitti</h1>
            <p className="error-boundary-desc">
              Menü yüklenirken beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.
            </p>
            <button
              type="button"
              className="error-retry-button"
              onClick={() => window.location.reload()}
            >
              Sayfayı Yenile
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
