import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ServiceUnavailable = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Page Unavailable
            </h1>
            <p className="text-muted-foreground">
              We're currently working on fixes. Please check back soon!
            </p>
          </div>
          <Button onClick={() => navigate("/")} className="w-full">
            Return Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceUnavailable;
