import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { MapPin, Calendar, User, MessageSquare, Loader2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";

const statusColors = {
  NEW: "bg-[hsl(var(--status-new))]",
  ACKNOWLEDGED: "bg-[hsl(var(--status-acknowledged))]",
  IN_PROGRESS: "bg-[hsl(var(--status-in-progress))]",
  RESOLVED: "bg-[hsl(var(--status-resolved))]",
  REJECTED: "bg-[hsl(var(--status-rejected))]"
};

const ComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaint();
    fetchComments();
    checkAuth();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchComplaint = async () => {
    const { data } = await supabase
      .from("complaints")
      .select("*, categories(name), profiles(full_name)")
      .eq("id", id)
      .single();
    
    if (data) setComplaint(data);
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(full_name)")
      .eq("complaint_id", id)
      .order("created_at", { ascending: true });
    
    if (data) setComments(data);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("comments")
        .insert([
          {
            complaint_id: id,
            author_id: user.id,
            body: newComment,
          },
        ]);

      if (error) throw error;

      toast.success("Comment added!");
      setNewComment("");
      fetchComments();
    } catch (error: any) {
      toast.error(error.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p>Complaint not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Complaint Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">{complaint.title}</CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {complaint.categories && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {complaint.categories.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(complaint.created_at), "PPP")}
                  </span>
                  {complaint.profiles?.full_name && (
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {complaint.profiles.full_name}
                    </span>
                  )}
                </div>
              </div>
              <Badge className={`${statusColors[complaint.status as keyof typeof statusColors]} text-white`}>
                {complaint.status.replace("_", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{complaint.description}</p>
            </div>

            {complaint.municipality && (
              <div>
                <h3 className="font-semibold mb-2">Location Details</h3>
                <p className="text-muted-foreground">
                  {complaint.municipality}{complaint.ward && `, Ward ${complaint.ward}`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Coordinates: {complaint.location_lat.toFixed(6)}, {complaint.location_lng.toFixed(6)}
                </p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Priority</h3>
              <Badge variant="outline">{complaint.priority}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-primary pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">
                          {comment.profiles?.full_name || "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{comment.body}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="space-y-4 pt-4 border-t">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  rows={3}
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Comment"
                  )}
                </Button>
              </form>
            ) : (
              <p className="text-muted-foreground text-center py-4 border-t">
                Please sign in to comment
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplaintDetail;
