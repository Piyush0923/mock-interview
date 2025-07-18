import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Plus, Sparkles, TrendingUp, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    setLoading(true);
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );
    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) => {
          const id = doc.id;
          return { id, ...doc.data() };
        }) as Interview[];
        setInterviews(interviewList);
        setLoading(false);
      },
      (error) => {
        console.log("Error on fetching : ", error);
        toast.error("Error..", {
          description: "Something went wrong.. Try again later..",
        });
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <Headings 
              title="Dashboard" 
              description="Create and start your AI Mock interview" 
            />
            
            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 shadow-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">{interviews.length} Total</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 shadow-sm">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Recent Activity</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 shadow-sm">
                <User className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">AI Powered</span>
              </div>
            </div>
          </div>
          
          <Link to={"/generate/create"}>
            <Button 
              size={"lg"} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              <Sparkles className="w-4 h-4 mr-2" />
              Create New Interview
            </Button>
          </Link>
        </div>

        <Separator className="my-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="group">
                <Skeleton className="h-32 md:h-40 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-lg" />
              </div>
            ))
          ) : interviews.length > 0 ? (
            interviews.map((interview) => (
              <div key={interview.id} className="group transform transition-all duration-300 hover:scale-105">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/20 overflow-hidden">
                  <InterviewPin interview={interview} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-96 p-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <img 
                  src="/assets/svg/not-found.svg" 
                  className="relative z-10 w-48 h-48 object-contain mb-6" 
                  alt="No interviews found" 
                />
              </div>
              
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-4">
                  No Interviews Yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Ready to ace your next interview? Create your first AI-powered mock interview and start practicing with intelligent feedback.
                </p>
                
                <Link to={"/generate/create"}>
                  <Button 
                    size={"lg"} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Your First Interview
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
