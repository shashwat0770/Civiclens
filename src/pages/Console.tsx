import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const statusColors = {
  NEW: "bg-[hsl(var(--status-new))]",
  ACKNOWLEDGED: "bg-[hsl(var(--status-acknowledged))]",
  IN_PROGRESS: "bg-[hsl(var(--status-in-progress))]",
  RESOLVED: "bg-[hsl(var(--status-resolved))]",
  REJECTED: "bg-[hsl(var(--status-rejected))]"
};

const Console = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("user");

  useEffect(() => {
    checkAuth();
    fetchComplaints();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in");
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (data && (data.role === "authority" || data.role === "admin")) {
      setUserRole(data.role);
    } else {
      toast.error("Access denied. Authority role required.");
      navigate("/");
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("complaints")
      .select("*, categories(name)")
      .neq("status", "RESOLVED")
      .order("created_at", { ascending: false });

    if (data) setComplaints(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("complaints")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      fetchComplaints();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Authority Console</h1>
          </div>
          <p className="text-muted-foreground">Manage and respond to civic complaints</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No pending complaints</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="mb-2">
                        <Link to={`/complaints/${complaint.id}`} className="hover:underline">
                          {complaint.title}
                        </Link>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {complaint.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Badge className={`${statusColors[complaint.status as keyof typeof statusColors]} text-white w-fit`}>
                        {complaint.status.replace("_", " ")}
                      </Badge>
                      <Select
                        value={complaint.status}
                        onValueChange={(value) => updateStatus(complaint.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;
