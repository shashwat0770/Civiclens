import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, Shield, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-primary py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Your Voice Matters in<br />Building Better Communities
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            CivicLens makes it easy to report civic issues, track their progress, and see real change happen in your neighborhood.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/complaints/new">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
                Report an Issue <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/complaints">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                Browse Complaints <MapPin className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How CivicLens Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                <FileText className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Issues</h3>
              <p className="text-muted-foreground">
                Easily submit complaints with photos and location details. Your reports help identify problem areas.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                <MapPin className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Follow your complaint's journey from submission to resolution with real-time status updates.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
                <Users className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">See Impact</h3>
              <p className="text-muted-foreground">
                View resolved issues on the map and see how your community is improving together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">For Government Authorities</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Manage complaints efficiently, prioritize issues, and respond to citizens transparently.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Sign In to Console <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 CivicLens. Empowering communities through transparency.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
