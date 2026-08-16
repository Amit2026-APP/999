import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Video,
  FileText,
  UserRound,
  LogOut,
  Search,
  PlayCircle,
  Calendar,
  Clock,
  Users,
  Copy,
  ExternalLink,
  Eye,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import type { AppState, Batch, Video, Material, LiveClass } from "@/App";

type Props = {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  onLogout: () => void;
};

export function StudentDashboard({ state, updateState, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [batchCode, setBatchCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [batchTab, setBatchTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const currentUser = state.currentUser;
  if (!currentUser || currentUser.role !== "student") return null;

  const myBatches = state.batches.filter((b) => b.studentIds.includes(currentUser.id));
  const myBatchIds = new Set(myBatches.map((b) => b.id));
  const myVideos = state.videos.filter((v) => myBatchIds.has(v.batchId));
  const myMaterials = state.materials.filter((m) => myBatchIds.has(m.batchId));
  const myLiveClasses = state.liveClasses.filter((l) => myBatchIds.has(l.batchId));

  const filteredBatches = myBatches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinBatch = () => {
    if (!batchCode.trim()) {
      toast.error("Please enter a batch code");
      return;
    }

    setJoining(true);
    setTimeout(() => {
      const normalizedCode = batchCode.trim().toUpperCase();
      const batch = state.batches.find(
        (b) => b.batchCode.toUpperCase() === normalizedCode
      );

      if (!batch) {
        toast.error("Invalid or inactive batch code");
        setJoining(false);
        return;
      }

      if (batch.studentIds.includes(currentUser.id)) {
        toast.error("Already joined this batch");
        setJoining(false);
        return;
      }

      updateState((prev) => ({
        ...prev,
        batches: prev.batches.map((b) =>
          b.id === batch.id
            ? { ...b, studentIds: [...b.studentIds, currentUser.id] }
            : b
        ),
      }));

      toast.success(`Successfully joined ${batch.name}!`);
      setBatchCode("");
      setJoining(false);
      setActiveTab("batches");
    }, 800);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "batches", label: "My Batches", icon: BookOpen },
    { id: "join", label: "Join Batch", icon: PlusCircle },
    { id: "videos", label: "Videos", icon: Video },
    { id: "materials", label: "Study Material", icon: FileText },
    { id: "profile", label: "Profile", icon: UserRound },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
        <h2 className="text-2xl font-bold font-serif">
          Welcome back, {currentUser.name.split(" ")[0]}! 🎓
        </h2>
        <p className="text-emerald-100 mt-1">
          You're enrolled in {myBatches.length} batch{myBatches.length !== 1 ? "es" : ""}.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-emerald-100">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{myBatches.length}</p>
            <p className="text-xs text-slate-500">My Batches</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-emerald-100">
          <CardContent className="p-4 text-center">
            <Video className="w-6 h-6 text-rose-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{myVideos.length}</p>
            <p className="text-xs text-slate-500">Videos</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-emerald-100">
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{myMaterials.length}</p>
            <p className="text-xs text-slate-500">Materials</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-emerald-100">
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
            <BookOpen className="w-5 h-5 text-emerald-600" />
            My Batches
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myBatches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">You haven't joined any batch yet.</p>
              <Button
                className="mt-3 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setActiveTab("join")}
              >
                Join Your First Batch
              </Button>
            </div>
          ) : (
            myBatches.slice(0, 3).map((batch) => {
              const videos = state.videos.filter((v) => v.batchId === batch.id).length;
              const materials = state.materials.filter((m) => m.batchId === batch.id).length;
              const liveClasses = state.liveClasses.filter((l) => l.batchId === batch.id);
              return (
                <div key={batch.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <img src={batch.thumbnail} alt={batch.name} className="w-16 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{batch.name}</p>
                    <p className="text-xs text-slate-500">
                      {videos} videos • {materials} materials
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      setSelectedBatch(batch);
                      setBatchTab("overview");
                    }}
                  >
                    Open
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
            <p className="text-slate-500">You haven't joined any batch yet.</p>
            <Button
              className="mt-4 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setActiveTab("join")}
            >
              Join Your First Batch
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const videos = state.videos.filter((v) => v.batchId === batch.id).length;
            const materials = state.materials.filter((m) => m.batchId === batch.id).length;
            const liveClasses = state.liveClasses.filter((l) => l.batchId === batch.id);
            return (
              <Card key={batch.id} className="bg-white shadow-sm border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img src={batch.thumbnail} alt={batch.name} className="w-full h-40 object-cover" />
                  <Badge className="absolute top-3 left-3 bg-emerald-600">{batch.subject}</Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-slate-900 text-lg">{batch.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{batch.teacherName}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
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
                  <Button
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      setSelectedBatch(batch);
                      setBatchTab("overview");
                    }}
                  >
                    Open Batch
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderJoinBatch = () => (
    <div className="max-w-xl mx-auto">
      <Card className="bg-white shadow-md border-emerald-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            Join New Batch
          </CardTitle>
          <CardDescription>
            Enter the batch code provided by your teacher
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batch-code">Batch Code</Label>
            <Input
              id="batch-code"
              placeholder="e.g. GDC-2026-A7K9"
              className="font-mono text-center text-lg tracking-widest"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
            />
          </div>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-11"
            onClick={handleJoinBatch}
            disabled={joining}
          >
            {joining ? "Joining..." : "Join Batch"}
          </Button>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500">
              <strong>Demo Batch Code:</strong> GDC-2026-A7K9
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 font-serif">Recorded Videos</h2>
      {myVideos.length === 0 ? (
        <Card className="bg-white shadow-sm border-slate-100">
          <CardContent className="text-center py-12">
            <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No recorded videos available yet.</p>
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
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => window.open(video.videoUrl, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Watch Video
                  </Button>
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
      <h2 className="text-2xl font-bold text-slate-900 font-serif">Study Materials</h2>
      {myMaterials.length === 0 ? (
        <Card className="bg-white shadow-sm border-slate-100">
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No study material uploaded yet.</p>
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
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => window.open(material.fileUrl, "_blank")}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Material
                  </Button>
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
            <UserRound className="w-5 h-5 text-emerald-600" />
            Student Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{currentUser.name}</h3>
              <p className="text-sm text-emerald-600 font-medium">Student</p>
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
              <p className="text-xs text-slate-500">Joined Batches</p>
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

  const renderBatchDetail = () => {
    if (!selectedBatch) return null;
    const videos = state.videos.filter((v) => v.batchId === selectedBatch.id);
    const materials = state.materials.filter((m) => m.batchId === selectedBatch.id);
    const liveClasses = state.liveClasses.filter((l) => l.batchId === selectedBatch.id);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedBatch(null)}
          className="text-sm text-slate-500 hover:text-emerald-600 flex items-center gap-1"
        >
          ← Back to Batches
        </button>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
          <div className="relative">
            <img src={selectedBatch.thumbnail} alt={selectedBatch.name} className="w-full h-48 sm:h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge className="bg-emerald-600 mb-2">{selectedBatch.subject}</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">{selectedBatch.name}</h2>
              <p className="text-white/80 text-sm mt-1">By {selectedBatch.teacherName}</p>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-600">{selectedBatch.description}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Starts: {selectedBatch.startDate}
              </span>
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
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid sm:grid-cols-3 gap-4">
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
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 shrink-0"
                        onClick={() => window.open(lc.liveUrl, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Join Live Class
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
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
                      <Button
                        variant="outline"
                        className="w-full mt-3"
                        onClick={() => window.open(video.videoUrl, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => window.open(material.fileUrl, "_blank")}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </CardContent>
                  </Card>
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
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 hidden sm:block">GyanDeep Classes</span>
            <span className="text-xs text-emerald-600 font-medium hidden sm:block">Student Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
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
                    ? "bg-emerald-50 text-emerald-700"
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
              {activeTab === "join" && renderJoinBatch()}
              {activeTab === "videos" && renderVideos()}
              {activeTab === "materials" && renderMaterials()}
              {activeTab === "profile" && renderProfile()}
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
                activeTab === item.id ? "text-emerald-600" : "text-slate-400"
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
                Are you sure you want to logout from your student account?
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
    </div>
  );
}