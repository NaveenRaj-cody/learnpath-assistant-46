import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseIcon, BookOpen, Building, GraduationCap, LogIn, AlertCircle } from "lucide-react";
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import ChatInterface from '@/components/ChatInterface';
import { ChatProvider, useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import CoursesModal from '@/components/CoursesModal';
import { coursesData } from '@/data/coursesData';

const HeroSection = () => {
  const { sendMessage } = useChat();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'courses' | 'colleges'>('courses');
  
  // Calculate the actual counts from the data
  const coursesCount = coursesData.length;
  const collegesCount = coursesData.reduce((total, course) => total + course.topColleges.length, 0);
  
  const handleOpenCoursesModal = () => {
    setModalType('courses');
    setIsCoursesModalOpen(true);
  };
  
  const handleOpenCollegesModal = () => {
    setModalType('colleges');
    setIsCoursesModalOpen(true);
  };

  const handleChatAccess = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  };
  
  return (
    <section className="relative min-h-screen flex items-center px-4 overflow-hidden">
      <div className="container mx-auto py-16 flex flex-col items-center">
        <AnimatedTransition>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
              Find Your Perfect <span className="text-primary">Career Path</span> in India
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover the best courses, colleges, and career opportunities with personalized AI guidance.
            </p>
            
            {!isLoggedIn && (
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="mb-4 hover:bg-primary/90 hover:shadow-md active:scale-95 transition-all"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            )}
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition showDelay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full max-w-4xl">
            <div className="glass-panel p-6 rounded-xl hover:shadow-lg transition-all">
              <h2 className="text-2xl font-semibold mb-4">Education Explorer</h2>
              <p className="text-muted-foreground mb-4">
                Navigate your educational journey with our AI-powered tools.
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <Button asChild variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:text-primary hover:shadow-md active:scale-95 transition-all">
                  <Link to="/courses">
                    <BookOpen className="mr-1 h-4 w-4" />
                    Courses
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:text-primary hover:shadow-md active:scale-95 transition-all">
                  <Link to="/colleges">
                    <Building className="mr-1 h-4 w-4" />
                    Colleges
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:text-primary hover:shadow-md active:scale-95 transition-all">
                  <Link to="/careers">
                    <BriefcaseIcon className="mr-1 h-4 w-4" />
                    Careers
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl hover:shadow-lg transition-all">
              <h2 className="text-2xl font-semibold mb-4">Education Stats</h2>
              <p className="text-muted-foreground mb-4">
                Key statistics on higher education in India.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <Stat 
                  icon={<BookOpen className="h-5 w-5 text-primary" />} 
                  value={`${coursesCount}`} 
                  label="Courses" 
                />
                <Stat 
                  icon={<Building className="h-5 w-5 text-primary" />} 
                  value={`${collegesCount}`} 
                  label="Colleges" 
                />
              </div>
            </div>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition showDelay={200}>
          <div className="w-full max-w-4xl glass-panel p-6 rounded-xl mb-12 hover:shadow-lg transition-all">
            <h2 className="text-2xl font-semibold mb-6">AI Career Assistant</h2>
            
            {isLoggedIn ? (
              <ChatInterface />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Login Required</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  You need to be logged in to access the AI Career Assistant.
                  Create an account or log in to continue.
                </p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="hover:bg-primary/90 hover:shadow-md active:scale-95 transition-all"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login to Chat
                </Button>
              </div>
            )}
          </div>
        </AnimatedTransition>
        
        <CoursesModal 
          isOpen={isCoursesModalOpen} 
          onClose={() => setIsCoursesModalOpen(false)}
          type={modalType}
        />
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features-section" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <AnimatedTransition>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Help You</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform guides your educational journey
            </p>
          </div>
        </AnimatedTransition>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedTransition showDelay={100}>
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6 text-white" />}
              title="Course Discovery"
              description="Explore hundreds of courses across different fields and levels."
            />
          </AnimatedTransition>
          
          <AnimatedTransition showDelay={200}>
            <FeatureCard 
              icon={<Building className="h-6 w-6 text-white" />}
              title="College Insights"
              description="Get recommendations for top colleges based on your chosen course."
              variant="secondary"
            />
          </AnimatedTransition>
          
          <AnimatedTransition showDelay={300}>
            <FeatureCard 
              icon={<BriefcaseIcon className="h-6 w-6 text-white" />}
              title="Career Guidance"
              description="Discover potential career paths, salary expectations, and industry trends."
              variant="tertiary"
            />
          </AnimatedTransition>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="container mx-auto max-w-4xl text-center">
        <AnimatedTransition>
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Educational Path?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get personalized guidance from our AI assistant and start planning your future today.
          </p>
          <Button 
            size="lg" 
            className="glass-panel"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Start Now
          </Button>
        </AnimatedTransition>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        
        <footer className="border-t py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-medium text-sm mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/" className="hover:text-primary">Home</Link></li>
                  <li><Link to="/about" className="hover:text-primary">About</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/courses" className="hover:text-primary">Courses</Link></li>
                  <li><Link to="/colleges" className="hover:text-primary">Colleges</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-4">Careers</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/careers" className="hover:text-primary">Career Paths</Link></li>
                  <li><a href="#" className="hover:text-primary">Global Opportunities</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-4">Connect</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                  <li><a href="#" className="hover:text-primary">Support</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Career Compass. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ChatProvider>
  );
};

interface StatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  onClick?: () => void;
}

const Stat: React.FC<StatProps> = ({ icon, value, label, onClick }) => (
  <div 
    className={`flex flex-col items-center glass-panel p-3 rounded-lg ${onClick ? 'cursor-pointer hover:bg-accent/30 hover:shadow-md transition-all active:scale-95' : ''}`}
    onClick={onClick}
    role={onClick ? "button" : undefined}
  >
    <div className="mb-2">{icon}</div>
    <div className="text-xl font-bold">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description,
  variant = 'primary'
}) => {
  const getBgColor = () => {
    switch (variant) {
      case 'primary': return 'bg-blue-600';
      case 'secondary': return 'bg-indigo-600';
      case 'tertiary': return 'bg-violet-600';
      default: return 'bg-blue-600';
    }
  };
  
  return (
    <div className="glass-panel rounded-xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className={`p-6 ${getBgColor()}`}>
        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg w-fit mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      </div>
      <div className="p-6">
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Index;
