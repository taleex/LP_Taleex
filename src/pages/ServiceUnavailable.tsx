import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceUnavailable = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-xl w-full shadow-lg">
        <CardHeader className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-destructive" />
          </div>
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Temporary outage
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              This project is facing some issues
            </h1>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our Supabase connection is currently unavailable. This usually
            happens when the free-tier instance wakes up from sleep. We have
            already been notified and will restore access shortly.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              Go back home
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try again now
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            If the problem persists for longer than a few minutes, feel free to
            reach out directly at{" "}
            <a
              href="mailto:matosjax@gmail.com"
              className="underline font-medium"
            >
              matosjax@gmail.com
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceUnavailable;
