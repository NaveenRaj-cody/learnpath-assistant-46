
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import About from '@/pages/About';
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailsPage from '@/pages/CourseDetailsPage';
import CollegesPage from '@/pages/CollegesPage';
import CollegeDetailsPage from '@/pages/CollegeDetailsPage';
import CareersPage from '@/pages/CareersPage';
import CareerDetailsPage from '@/pages/CareerDetailsPage';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/LoginPage';
import ThreeDBackground from '@/components/ThreeDBackground';
import { ChatProvider } from '@/contexts/ChatContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { initializeDatabaseWithData } from '@/utils/dbInitializer';
import { useToast } from '@/components/ui/use-toast';
import { Toaster as Sonner } from 'sonner';

// Create a client
const queryClient = new QueryClient();

function App() {
  const { toast } = useToast();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        setIsLoading(true);
        const success = await initializeDatabaseWithData();
        setDbInitialized(success);
        
        if (success) {
          toast({
            title: "Database Connected",
            description: "MySQL database has been initialized and is ready for use.",
            duration: 3000
          });
        } else {
          toast({
            title: "Database Connection Issue",
            description: "Using fallback static data. Check console for details.",
            variant: "destructive",
            duration: 5000
          });
        }
      } catch (error) {
        console.error('Error initializing database:', error);
        toast({
          title: "Database Error",
          description: "Failed to connect to MySQL. Using fallback data.",
          variant: "destructive",
          duration: 5000
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initDb();
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <ThreeDBackground />
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
                <Route path="/colleges" element={<CollegesPage />} />
                <Route path="/colleges/:collegeName" element={<CollegeDetailsPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/careers/:careerName" element={<CareerDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
