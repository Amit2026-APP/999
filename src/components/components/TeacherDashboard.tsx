import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  Video,
  FileText,
  Calendar,
  UserRound,
  Settings,
  LogOut,
  Search,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  Eye,
  Menu,
  X,
  ChevronRight,
  Clock,
  PlayCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import type { AppState, Batch, Video, Material, LiveClass } from "@/App";

type Props = {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  onLogout: () => void;
};

export function TeacherDashboard({ state, updateState, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateBatch, setShowCreateBatch] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deletingBatch, setDeletingBatch] = useState<Batch | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [batchTab, setBatchTab] = useState("overview");
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddLiveClass, setShowAddLiveClass] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingLiveClass, setEditingLiveClass] = useState<LiveClass | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [batchForm, setBatchForm] = useState({
    name: "",
    subject: "",
    description: "",
    thumbnail: "",
    startDate: "",
    endDate: "",
    timing: "",
  });
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
  });
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileType: "pdf",
  });
  const [liveClassForm, setLiveClassForm] = useState({
    title: "",
    description: "",
    classDate: "",
    startTime: "",
    endTime: "",
    liveUrl: "",
  });
  const [saving, setSaving] = useState(false);

  const currentUser = state.currentUser;
  if (!currentUser || currentUser.role !== "teacher") return null;

  const myBatches = state.batches.filter((b) => b.teacherId === currentUser.id);
  const myBatchIds = new Set(myBatches.map((b) => b.id));
  const myVideos = state.videos.filter((v) => myBatchIds.has(v.batchId));
  const myMaterials = state.materials.filter((m) => myBatchIds.has(m.batchId));
  const myLiveClasses = state.liveClasses.filter((l) => myBatchIds.has(l.batchId));
  const totalStudents = myBatches.reduce((sum, b) => sum + b.studentIds.length, 0);

  const filteredBatches = myBatches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateBatchCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const year = new Date().getFullYear();
    return `GDC-${year}-${code}`;
  };

  const handleCreateBatch = () => {
    if (!batchForm.name || !batchForm.subject || !batchForm.description || !batchForm.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const newBatch: Batch = {
        id: `batch-${Date.now()}`,
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        name: batchForm.name,
        subject: batchForm.subject,
        description: batchForm.description,
        thumbnail:
          batchForm.thumbnail ||
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
        batchCode: generateBatchCode(),
        startDate: batchForm.startDate,
        endDate: batchForm.endDate || undefined,
        timing: batchForm.timing || undefined,
        studentIds: [],
        createdAt: new Date().toISOString().split("T")[0],
      };

      updateState((prev) => ({
        ...prev,
        batches: [...prev.batches, newBatch],
      }));

      toast.success(`Batch created! Code: ${newBatch.batchCode}`);
      setBatchForm({
        name: "",
        subject: "",
        description: "",
        thumbnail: "",
        startDate: "",
        endDate: "",
        timing: "",
      });
      setShowCreateBatch(false);
      setSaving(false);
    }, 800);
  };

  const handleUpdateBatch = () => {
    if (!editingBatch) return;
    setSaving(true);

    setTimeout(() => {
      updateState((prev) => ({
        ...prev,
        batches: prev.batches.map((b) =>
          b.id === editingBatch.id
            ? {
                ...b,
                name: batchForm.name || b.name,
                subject: batchForm.subject || b.subject,
                description: batchForm.description || b.description,
                thumbnail: batchForm.thumbnail || b.thumbnail,
                startDate: batchForm.startDate || b.startDate,
                endDate: batchForm.endDate || b.endDate,
                timing: batchForm.timing || b.timing,
              }
            : b
        ),
      }));

      toast.success("Batch updated successfully");
      setEditingBatch(null);
      setBatchForm({
        name: "",
        subject: "",
        description: "",
        thumbnail: "",
        startDate: "",
        endDate: "",
        timing: "",
      });
      setSaving(false);
    }, 800);
  };

  const handleDeleteBatch = () => {
    if (!deletingBatch) return;
    setSaving(true);

    setTimeout(() => {
      updateState((prev) => ({
        ...prev,
        batches: prev.batches.filter((b) => b.id !== deletingBatch.id),
        videos: prev.videos.filter((v) => v.batchId !== deletingBatch.id),
        materials: prev.materials.filter((m) => m.batchId !== deletingBatch.id),
        liveClasses: prev.liveClasses.filter((l) => l.batchId !== deletingBatch.id),
      }));

      toast.success("Batch deleted successfully");
      setDeletingBatch(null);
      setSaving(false);
    }, 800);
  };

  const handleAddVideo = () => {
    if (!selectedBatch) return;
    if (!videoForm.title || !videoForm.videoUrl) {
      toast.error("Please fill in video title and URL");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const newVideo: Video = {
        id: `video-${Date.now()}`,
        batchId: selectedBatch.id,
        title: videoForm.title,
        description: videoForm.description,
        videoUrl: videoForm.videoUrl,
        thumbnail:
          videoForm.thumbnail ||
          "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
        createdAt: new Date().toISOString().split("T")[0],
      };

      updateState((prev) => ({
        ...prev,
        videos: [...prev.videos, newVideo],
      }));

      toast.success("Video added successfully");
      setVideoForm({ title: "", description: "", videoUrl: "", thumbnail: "" });
      setShowAddVideo(false);
      setSaving(false);
    }, 800);
  };

  const handleUpdateVideo = () => {
    if (!editingVideo) return;
    setSaving(true);

    setTimeout(() => {
      updateState((prev) => ({
        ...prev,
        videos: prev.videos.map((v) =>
          v.id === editingVideo.id
            ? {
                ...v,
                title: videoForm.title || v.title,
                description: videoForm.description || v.description,
                videoUrl: videoForm.videoUrl || v.videoUrl,
                thumbnail: videoForm.thumbnail || v.thumbnail,
              }
            : v
        ),
      }));

      toast.success("Video updated successfully");
      setEditingVideo(null);
      setVideoForm({ title: "", description: "", videoUrl: "", thumbnail: "" });
      setSaving(false);
    }, 800);
  };

  const handleDeleteVideo = (videoId: string) => {
    updateState((prev) => ({
      ...prev,
      videos: prev.videos.filter((v) => v.id !== videoId),
    }));
    toast.success("Video deleted successfully");
  };

  const handleAddMaterial = () => {
    if (!selectedBatch) return;
    if (!materialForm.title) {
      toast.error("Please fill in material title");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const newMaterial: Material = {
        id: `material-${Date.now()}`,
        batchId: selectedBatch.id,
        title: materialForm.title,
        description: materialForm.description,
        fileUrl: materialForm.fileUrl || "#",
        fileType: materialForm.fileType,
        createdAt: new Date().toISOString().split("T")[0],
      };

      updateState((prev) => ({
        ...prev,
        materials: [...prev.materials, newMaterial],
      }));

      toast.success("Study material uploaded successfully");
      setMaterialForm({ title: "", description: "", fileUrl: "", fileType: "pdf" });
      setShowAddMaterial(false);
      setSaving(false);
    }, 800);
  };

  const handleUpdateMaterial = () => {
    if (!editingMaterial) return;
    setSaving(true);

    setTimeout(() => {
      updateState((prev) => ({
        ...prev,
        materials: prev.materials.map((m) =>
          m.id === editingMaterial.id
            ? {
                ...m,
                title: materialForm.title || m.title,
                description: materialForm.description || m.description,
                fileUrl: materialForm.fileUrl || m.fileUrl,
                fileType: materialForm.fileType || m.fileType,
              }
            : m
        ),
      }));

      toast.success("Material updated successfully");
      setEditingMaterial(null);
      setMaterialForm({ title: "", description: "", fileUrl: "", fileType: "pdf" });
      setSaving(false);
    }, 800);
  };

  const handleDeleteMaterial = (materialId: string) => {
    updateState((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== materialId),
    }));
    toast.success("Material deleted successfully");
  };

  const handleAddLiveClass = () => {
    if (!selectedBatch) return;
    if (!liveClassForm.title || !liveClassForm.classDate || !liveClassForm.startTime) {
      toast.error("Please fill in class title, date, and time");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const newLiveClass: LiveClass = {
        id: `live-${Date.now()}`,
        batchId: selectedBatch.id,
        title: liveClassForm.title,
        description: liveClassForm.description,
        classDate: liveClassForm.classDate,
        startTime: liveClassForm.startTime,
        endTime: liveClassForm.endTime,
        liveUrl: liveClassForm.liveUrl || "https://meet.google.com/",
        createdAt: new Date().toISOString().split("T")[0],
      };

      updateState((prev) => ({
        ...prev,
        liveClasses: [...prev.liveClasses, newLiveClass],
      }));

      toast.success("Live class scheduled successfully");
      setLiveClassForm({
        title: "",
        description: "",
        classDate: "",
        startTime: "",
        endTime: "",
        liveUrl: "",
      });
      setShowAddLiveClass(false);
      setSaving(false);
    }, 800);
  };

  const handleUpdateLiveClass = () => {
    if (!editingLiveClass) return;
    setSaving(true);

    setTimeout(() => {
      updateState((prev) => ({
        ...prev,
        liveClasses: prev.liveClasses.map((l) =>
          l.id === editingLiveClass.id
            ? {
                ...l,
                title: liveClassForm.title || l.title,
                description: liveClassForm.description || l.description,
                classDate: liveClassForm.classDate || l.classDate,
                startTime: liveClassForm.startTime || l.startTime,
                endTime: liveClassForm.endTime || l.endTime,
                liveUrl: liveClassForm.liveUrl || l.liveUrl,
              }
            : l
        ),
      }));

      toast.success("Live class updated successfully");
      setEditingLiveClass(null);
      setLiveClassForm({
        title: "",
        description: "",
        classDate: "",
        startTime: "",
        endTime: "",
        liveUrl: "",
      });
      setSaving(false);
    }, 800);
  };

  const handleDeleteLiveClass = (liveClassId: string) => {
    updateState((prev) => ({
      ...prev,
      liveClasses: prev.liveClasses.filter((l) => l.id !== liveClassId),
    }));
    toast.success("Live class deleted successfully");
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Batch code copied to clipboard");
  };

  const handleRemoveStudent = (batchId: string, studentId: string) => {
    updateState((prev) => ({
      ...prev,
      batches: prev.batches.map((b) =>
        b.id === batchId
          ? { ...b, studentIds: b.studentIds.filter((id) => id !== studentId) }
          : b
      ),
    }));
    toast.success("Student removed from batch");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "batches", label: "My Batches", icon: BookOpen },
    { id: "create", label: "Create Batch", icon: PlusCircle },
    { id: "students", label: "Students", icon: Users },
    { id: "videos", label: "Videos", icon: Video },
    { id: "materials", label: "Study Material", icon: FileText },
    { id: "profile", label: "Profile", icon: UserRound },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
        <h2 className="text-2xl font-bold font-serif">
          Welcome back, {currentUser.name.split(" ")[0]}! 📚
        </h2>
        <p className="text-indigo-100 mt-1">
          You're managing {myBatches.length} batches with {totalStudents} total students.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white shadow-sm border-indigo-100">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{myBatches.length}</p>
            <p className="text-xs text-slate-500">Total Batches</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-indigo-100">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
            <p className="text-xs text-slate-500">Total Students</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-indigo-100">
          <CardContent className="p-4 text-center">
            <Video className="w-6 h-6 text-rose-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{myVideos.length}</p>
            <p className="text-xs text-slate-500">Total Videos</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-indigo-100">
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{myMaterials.length}</p>
            <p className="text-xs text-slate-500">Materials</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-indigo-100">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{myLiveClasses.length}</p>
            <p className="text-xs text-slate-500">Live Classes</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            My Batches
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myBatches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">You haven't created any batches yet.</p>
              <Button
                className="mt-3 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setActiveTab("create")}
              >
                Create Your First Batch
              </Button>
            </div>
          ) : (
            myBatches.slice(0, 3).map((batch) => {
              const students = batch.studentIds.length;
              const videos = state.videos.filter((v) => v.batchId === batch.id).length;
              const materials = state.materials.filter((m) => m.batchId === batch.id).length;
              return (
                <div key={batch.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <img src={batch.thumbnail} alt={batch.name} className="w-16 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{batch.name}</p>
                    <p className="text-xs text-slate-500">
                      {students} students • {videos} videos • {materials} materials
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedBatch(batch);
                      setBatchTab("overview");
                    }}
                  >
                    Manage
                  </Button>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderBatches = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">My Batches</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search batches..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredBatches.length === 0 ? (
        <Card className="bg-white shadow-sm border-slate-100">
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">You haven't created any batches yet.</p>
            <Button
              className="mt-4 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setActiveTab("create")}
            >
              Create Your First Batch
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const students = batch.studentIds.length;
            const videos = state.videos.filter((v) => v.batchId === batch.id).length;
            const materials = state.materials.filter((m) => m.batchId === batch.id).length;
            const liveClasses = state.liveClasses.filter((l) => l.batchId === batch.id);
            return (
              <Card key={batch.id} className="bg-white shadow-sm border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img src={batch.thumbnail} alt={batch.name} className="w-full h-40 object-cover" />
                  <Badge className="absolute top-3 left-3 bg-indigo-600">{batch.subject}</Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-slate-900 text-lg">{batch.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {batch.batchCode}
                    </Badge>
                    <button
                      onClick={() => handleCopyCode(batch.batchCode)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {students} students
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" /> {videos} videos
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> {materials} materials
                    </span>
                  </div>
                  {liveClasses.length > 0 && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Next: {liveClasses[0].classDate} at {liveClasses[0].startTime}
                    </p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => {
                        setSelectedBatch(batch);
                        setBatchTab("overview");
                      }}
                    >
                      Manage
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingBatch(batch);
                        setBatchForm({
                          name: batch.name,
                          subject: batch.subject,
                          description: batch.description,
                          thumbnail: batch.thumbnail,
                          startDate: batch.startDate,
                          endDate: batch.endDate || "",
                          timing: batch.timing || "",
                        });
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => setDeletingBatch(batch)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCreateBatch = () => (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-md border-indigo-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            Create New Batch
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new batch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batch-name">Batch Name *</Label>
            <Input
              id="batch-name"
              placeholder="e.g. JEE Foundation 2026"
              value={batchForm.name}
              onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch-subject">Subject / Course *</Label>
            <Input
              id="batch-subject"
              placeholder="e.g. Mathematics"
              value={batchForm.subject}
              onChange={(e) => setBatchForm({ ...batchForm, subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch-desc">Description *</Label>
            <Textarea
              id="batch-desc"
              placeholder="Describe the batch, topics covered, target audience..."
              value={batchForm.description}
              onChange={(e) => setBatchForm({ ...batchForm, description: e.target.value })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch-thumb">Thumbnail URL</Label>
            <Input
              id="batch-thumb"
              placeholder="https://example.com/thumbnail.jpg"
              value={batchForm.thumbnail}
              onChange={(e) => setBatchForm({ ...batchForm, thumbnail: e.target.value })}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch-start">Start Date *</Label>
              <Input
                id="batch-start"
                type="date"
                value={batchForm.startDate}
                onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-end">End Date</Label>
              <Input
                id="batch-end"
                type="date"
                value={batchForm.endDate}
                onChange={(e) => setBatchForm({ ...batchForm, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch-timing">Batch Timing</Label>
            <Input
              id="batch-timing"
              placeholder="e.g. Mon-Fri, 7:00 PM - 8:30 PM"
              value={batchForm.timing}
              onChange={(e) => setBatchForm({ ...batchForm, timing: e.target.value })}
            />
          </div>
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-11"
            onClick={handleCreateBatch}
            disabled={saving}
          >
            {saving ? "Creating batch..." : "Create Batch"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 font-serif">Student Management</h2>
      {myBatches.length === 0 ? (
        <Card className="bg-white shadow-sm border-slate-100">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Create a batch first to manage students.</p>
          </CardContent>
        </Card>
      ) : (
        myBatches.map((batch) => {
          const students = batch.studentIds
            .map((id) => state.users.find((u) => u.id === id))
            .filter(Boolean);
          return (
            <Card key={batch.id} className="bg-white shadow-sm border-slate-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{batch.name}</CardTitle>
                <CardDescription>
                  {students.length} student{students.length !== 1 ? "s" : ""} enrolled
                </CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">
                    No students have joined this batch yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div
                        key={student!.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {student!.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 text-sm truncate">{student!.name}</p>
                            <p className="text-xs text-slate-500 truncate">{student!.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-400 hidden sm:block">{student!.mobile}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-600 hover:text-rose-700"
                            onClick={() => handleRemoveStudent(batch.id, student!.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">Video Management</h2>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => {
            setSelectedBatch(myBatches[0] || null);
            setShowAddVideo(true);
          }}
          disabled={myBatches.length === 0}
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Add Video
        </Button>
      </div>

      {myVideos.length === 0 ? (
        <Card className="bg-white shadow-sm border-slate-100">
          <CardContent className="text-center py-12">
            <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No videos added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myVideos.map((video) => {
            const batch = state.batches.find((b) => b.id === video.batchId);
            return (
              <Card key={video.id} className="bg-white shadow-sm border-slate-100 overflow-hidden">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white opacity-90" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-slate-900">{video.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{batch?.name}</p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{video.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingVideo(video);
                        setVideoForm({
                          title: video.title,
                          description: video.description,
                          videoUrl: video.videoUrl,
                          thumbnail: video.thumbnail,
                        });
                      }}
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderMaterials = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">Study Materials</h2>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => {
            setSelectedBatch(myBatches[0] || null);
            setShowAddMaterial(true);
          }}
          disabled={myBatches.length === 0}
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Upload Material
        </Button>
      </div>

      {myMaterials.length === 0 ? (
        <Card className="bg-white shadow-sm border-slate-100">
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No study materials uploaded yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myMaterials.map((material) => {
            const batch = state.batches.find((b) => b.id === material.batchId);
            return (
              <Card key={material.id} className="bg-white shadow-sm border-slate-100">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-rose-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900">{material.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{batch?.name}</p>
                      <Badge variant="outline" className="mt-2 text-xs uppercase">
                        {material.fileType}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-3 line-clamp-2">{material.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingMaterial(material);
                        setMaterialForm({
                          title: material.title,
                          description: material.description,
                          fileUrl: material.fileUrl,
                          fileType: material.fileType,
                        });
                      }}
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-md border-slate-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <UserRound className="w-5 h-5 text-indigo-600" />
            Teacher Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{currentUser.name}</h3>
              <p className="text-sm text-indigo-600 font-medium">Teacher</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium text-slate-900">{currentUser.email}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Mobile</p>
              <p className="font-medium text-slate-900">{currentUser.mobile || "Not provided"}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Total Batches</p>
              <p className="font-medium text-slate-900">{myBatches.length}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">Account Created</p>
              <p className="font-medium text-slate-900">{currentUser.joinedAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-md border-slate-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Settings
          </CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Change Password</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => toast.success("Password updated successfully")}
              >
                Update Password
              </Button>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Notifications</h3>
            <p className="text-sm text-slate-500">
              Email notifications for new student joins, content uploads, and live class schedules.
            </p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => toast.success("Notification settings saved")}
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBatchDetail = () => {
    if (!selectedBatch) return null;
    const videos = state.videos.filter((v) => v.batchId === selectedBatch.id);
    const materials = state.materials.filter((m) => m.batchId === selectedBatch.id);
    const liveClasses = state.liveClasses.filter((l) => l.batchId === selectedBatch.id);
    const students = selectedBatch.studentIds
      .map((id) => state.users.find((u) => u.id === id))
      .filter(Boolean);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedBatch(null)}
          className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"
        >
          ← Back to Batches
        </button>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
          <div className="relative">
            <img src={selectedBatch.thumbnail} alt={selectedBatch.name} className="w-full h-48 sm:h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge className="bg-indigo-600 mb-2">{selectedBatch.subject}</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">{selectedBatch.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-white/20 text-white border-white/30 font-mono">
                  {selectedBatch.batchCode}
                </Badge>
                <button
                  onClick={() => handleCopyCode(selectedBatch.batchCode)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-600">{selectedBatch.description}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Starts: {selectedBatch.startDate}
              </span>
              {selectedBatch.endDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Ends: {selectedBatch.endDate}
                </span>
              )}
              {selectedBatch.timing && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {selectedBatch.timing}
                </span>
              )}
            </div>
          </div>
        </div>

        <Tabs value={batchTab} onValueChange={setBatchTab}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="live">Live Classes</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="materials">Study Material</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid sm:grid-cols-4 gap-4">
              <Card className="bg-white shadow-sm border-slate-100">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{students.length}</p>
                  <p className="text-sm text-slate-500">Students</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm border-slate-100">
                <CardContent className="p-4 text-center">
                  <Video className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{videos.length}</p>
                  <p className="text-sm text-slate-500">Videos</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm border-slate-100">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{materials.length}</p>
                  <p className="text-sm text-slate-500">Materials</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm border-slate-100">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{liveClasses.length}</p>
                  <p className="text-sm text-slate-500">Live Classes</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="live" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setShowAddLiveClass(true)}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Live Class
              </Button>
            </div>
            {liveClasses.length === 0 ? (
              <Card className="bg-white shadow-sm border-slate-100">
                <CardContent className="text-center py-8">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No live classes scheduled yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {liveClasses.map((lc) => (
                  <Card key={lc.id} className="bg-white shadow-sm border-slate-100">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-900">{lc.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{lc.description}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {lc.classDate} • {lc.startTime} - {lc.endTime}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingLiveClass(lc);
                            setLiveClassForm({
                              title: lc.title,
                              description: lc.description,
                              classDate: lc.classDate,
                              startTime: lc.startTime,
                              endTime: lc.endTime,
                              liveUrl: lc.liveUrl,
                            });
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 hover:text-rose-700"
                          onClick={() => handleDeleteLiveClass(lc.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setShowAddVideo(true)}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Video
              </Button>
            </div>
            {videos.length === 0 ? (
              <Card className="bg-white shadow-sm border-slate-100">
                <CardContent className="text-center py-8">
                  <Video className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No videos added yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <Card key={video.id} className="bg-white shadow-sm border-slate-100 overflow-hidden">
                    <div className="relative">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-36 object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <PlayCircle className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-slate-900">{video.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{video.description}</p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingVideo(video);
                            setVideoForm({
                              title: video.title,
                              description: video.description,
                              videoUrl: video.videoUrl,
                              thumbnail: video.thumbnail,
                            });
                          }}
                        >
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 hover:text-rose-700"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setShowAddMaterial(true)}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Upload Material
              </Button>
            </div>
            {materials.length === 0 ? (
              <Card className="bg-white shadow-sm border-slate-100">
                <CardContent className="text-center py-8">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No study materials uploaded yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {materials.map((material) => (
                  <Card key={material.id} className="bg-white shadow-sm border-slate-100">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-rose-600" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 truncate">{material.title}</h4>
                          <p className="text-xs text-slate-500">{material.fileType.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingMaterial(material);
                            setMaterialForm({
                              title: material.title,
                              description: material.description,
                              fileUrl: material.fileUrl,
                              fileType: material.fileType,
                            });
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 hover:text-rose-700"
                          onClick={() => handleDeleteMaterial(material.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            {students.length === 0 ? (
              <Card className="bg-white shadow-sm border-slate-100">
                <CardContent className="text-center py-8">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No students have joined this batch yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student!.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {student!.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{student!.name}</p>
                        <p className="text-xs text-slate-500 truncate">{student!.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 hidden sm:block">{student!.mobile}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700"
                        onClick={() => handleRemoveStudent(selectedBatch.id, student!.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header Bar with Logout */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 hidden sm:block">GyanDeep Classes</span>
            <span className="text-xs text-indigo-600 font-medium hidden sm:block">Teacher Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-700">{currentUser.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-rose-600 hover:text-rose-700 hover:border-rose-200"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 min-h-screen flex-col sticky top-[57px]">
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {selectedBatch ? (
            renderBatchDetail()
          ) : (
            <>
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "batches" && renderBatches()}
              {activeTab === "create" && renderCreateBatch()}
              {activeTab === "students" && renderStudents()}
              {activeTab === "videos" && renderVideos()}
              {activeTab === "materials" && renderMaterials()}
              {activeTab === "profile" && renderProfile()}
              {activeTab === "settings" && renderSettings()}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center px-3 py-1 rounded-lg ${
                activeTab === item.id ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">{item.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile bottom padding */}
      <div className="lg:hidden h-16" />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Logout</h3>
              </div>
              <p className="text-sm text-slate-600">
                Are you sure you want to logout from your teacher account?
              </p>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-rose-600 hover:bg-rose-700"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Batch Modal */}
      {showCreateBatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Create New Batch</h3>
                <button
                  onClick={() => setShowCreateBatch(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Batch Name *</Label>
                  <Input
                    placeholder="e.g. JEE Foundation 2026"
                    value={batchForm.name}
                    onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject / Course *</Label>
                  <Input
                    placeholder="e.g. Mathematics"
                    value={batchForm.subject}
                    onChange={(e) => setBatchForm({ ...batchForm, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    placeholder="Describe the batch..."
                    value={batchForm.description}
                    onChange={(e) => setBatchForm({ ...batchForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail URL</Label>
                  <Input
                    placeholder="https://example.com/thumbnail.jpg"
                    value={batchForm.thumbnail}
                    onChange={(e) => setBatchForm({ ...batchForm, thumbnail: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Input
                      type="date"
                      value={batchForm.startDate}
                      onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={batchForm.endDate}
                      onChange={(e) => setBatchForm({ ...batchForm, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Batch Timing</Label>
                  <Input
                    placeholder="e.g. Mon-Fri, 7:00 PM - 8:30 PM"
                    value={batchForm.timing}
                    onChange={(e) => setBatchForm({ ...batchForm, timing: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleCreateBatch}
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Batch"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {editingBatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Edit Batch</h3>
                <button
                  onClick={() => setEditingBatch(null)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Batch Name</Label>
                  <Input
                    value={batchForm.name}
                    onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={batchForm.subject}
                    onChange={(e) => setBatchForm({ ...batchForm, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={batchForm.description}
                    onChange={(e) => setBatchForm({ ...batchForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail URL</Label>
                  <Input
                    value={batchForm.thumbnail}
                    onChange={(e) => setBatchForm({ ...batchForm, thumbnail: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={batchForm.startDate}
                      onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={batchForm.endDate}
                      onChange={(e) => setBatchForm({ ...batchForm, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Timing</Label>
                  <Input
                    value={batchForm.timing}
                    onChange={(e) => setBatchForm({ ...batchForm, timing: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleUpdateBatch}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Batch Confirmation */}
      {deletingBatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Delete Batch</h3>
              </div>
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this batch? This action will remove the batch and its
                associated content.
              </p>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeletingBatch(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-rose-600 hover:bg-rose-700"
                  onClick={handleDeleteBatch}
                  disabled={saving}
                >
                  {saving ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {showAddVideo && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Add Video</h3>
                <button
                  onClick={() => setShowAddVideo(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Video Title *</Label>
                  <Input
                    placeholder="e.g. Quadratic Equations — Lecture 1"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the video content..."
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Video URL *</Label>
                  <Input
                    placeholder="https://youtube.com/embed/..."
                    value={videoForm.videoUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail URL</Label>
                  <Input
                    placeholder="https://example.com/thumbnail.jpg"
                    value={videoForm.thumbnail}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleAddVideo}
                  disabled={saving}
                >
                  {saving ? "Adding..." : "Add Video"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Edit Video</h3>
                <button
                  onClick={() => setEditingVideo(null)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Video Title</Label>
                  <Input
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input
                    value={videoForm.videoUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail URL</Label>
                  <Input
                    value={videoForm.thumbnail}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleUpdateVideo}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {showAddMaterial && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Upload Study Material</h3>
                <button
                  onClick={() => setShowAddMaterial(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Material Title *</Label>
                  <Input
                    placeholder="e.g. Quadratic Equations — Formula Sheet"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the material..."
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>File Type</Label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
                    value={materialForm.fileType}
                    onChange={(e) => setMaterialForm({ ...materialForm, fileType: e.target.value })}
                  >
                    <option value="pdf">PDF</option>
                    <option value="ppt">PPT</option>
                    <option value="pptx">PPTX</option>
                    <option value="doc">DOC</option>
                    <option value="docx">DOCX</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>File URL</Label>
                  <Input
                    placeholder="https://example.com/material.pdf"
                    value={materialForm.fileUrl}
                    onChange={(e) => setMaterialForm({ ...materialForm, fileUrl: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleAddMaterial}
                  disabled={saving}
                >
                  {saving ? "Uploading..." : "Upload Material"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {editingMaterial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Edit Material</h3>
                <button
                  onClick={() => setEditingMaterial(null)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Material Title</Label>
                  <Input
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>File Type</Label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
                    value={materialForm.fileType}
                    onChange={(e) => setMaterialForm({ ...materialForm, fileType: e.target.value })}
                  >
                    <option value="pdf">PDF</option>
                    <option value="ppt">PPT</option>
                    <option value="pptx">PPTX</option>
                    <option value="doc">DOC</option>
                    <option value="docx">DOCX</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>File URL</Label>
                  <Input
                    value={materialForm.fileUrl}
                    onChange={(e) => setMaterialForm({ ...materialForm, fileUrl: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleUpdateMaterial}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Live Class Modal */}
      {showAddLiveClass && selectedBatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Schedule Live Class</h3>
                <button
                  onClick={() => setShowAddLiveClass(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Class Title *</Label>
                  <Input
                    placeholder="e.g. Mathematics — Quadratic Equations"
                    value={liveClassForm.title}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the class..."
                    value={liveClassForm.description}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={liveClassForm.classDate}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, classDate: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time *</Label>
                    <Input
                      type="time"
                      value={liveClassForm.startTime}
                      onChange={(e) => setLiveClassForm({ ...liveClassForm, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={liveClassForm.endTime}
                      onChange={(e) => setLiveClassForm({ ...liveClassForm, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Live Class Link</Label>
                  <Input
                    placeholder="https://meet.google.com/..."
                    value={liveClassForm.liveUrl}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, liveUrl: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleAddLiveClass}
                  disabled={saving}
                >
                  {saving ? "Scheduling..." : "Schedule Live Class"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Live Class Modal */}
      {editingLiveClass && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Edit Live Class</h3>
                <button
                  onClick={() => setEditingLiveClass(null)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Class Title</Label>
                  <Input
                    value={liveClassForm.title}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={liveClassForm.description}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={liveClassForm.classDate}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, classDate: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={liveClassForm.startTime}
                      onChange={(e) => setLiveClassForm({ ...liveClassForm, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={liveClassForm.endTime}
                      onChange={(e) => setLiveClassForm({ ...liveClassForm, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Live Class Link</Label>
                  <Input
                    value={liveClassForm.liveUrl}
                    onChange={(e) => setLiveClassForm({ ...liveClassForm, liveUrl: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleUpdateLiveClass}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}