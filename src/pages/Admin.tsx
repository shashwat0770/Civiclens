import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Plus, Trash2, Settings } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchCategories();
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

    if (data?.role !== "admin") {
      toast.error("Access denied. Admin role required.");
      navigate("/");
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data);
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .insert([{ name: newCategory }]);

    if (error) {
      toast.error("Failed to add category");
    } else {
      toast.success("Category added");
      setNewCategory("");
      fetchCategories();
    }
    setLoading(false);
  };

  const deleteCategory = async (id: number) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete category");
    } else {
      toast.success("Category deleted");
      fetchCategories();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">Manage categories and system settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Complaint Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={addCategory} className="flex gap-2">
              <Input
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </form>

            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <span>{category.name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
