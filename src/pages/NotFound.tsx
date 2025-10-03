import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center theme-bg p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-gradient">404</h1>
          <h2 className="text-2xl font-semibold theme-text">Page Not Found</h2>
          <p className="theme-text-muted">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="theme-text-secondary text-sm">
            Redirecting to home in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/')} className="gap-2">
              <Home className="h-4 w-4" />
              Go Home Now
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
