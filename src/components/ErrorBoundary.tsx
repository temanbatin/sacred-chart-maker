import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-6 bg-background">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-destructive" />
                    </div>
                    <div className="space-y-2 max-w-md">
                        <h1 className="text-2xl font-bold">Oops, terjadi kesalahan teknis</h1>
                        <p className="text-muted-foreground">
                            Maaf, aplikasi mengalami kendala. Tim kami sudah dinotifikasi. Silakan coba muat ulang halaman.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => window.location.assign('/')}
                        >
                            Kembali ke Beranda
                        </Button>
                        <Button
                            onClick={() => {
                                this.setState({ hasError: false });
                                window.location.reload();
                            }}
                        >
                            Muat Ulang
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
