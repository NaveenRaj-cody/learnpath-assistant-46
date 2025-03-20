import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, GraduationCap, Users, Briefcase, Award, Star } from 'lucide-react';
import { coursesData, Course } from '@/data/coursesData';
import AnimatedTransition from '@/components/AnimatedTransition';

const CollegeDetailsPage = () => {
  const { collegeName } = useParams();
  const navigate = useNavigate();
  const [collegeDetails, setCollegeDetails] = useState<{
    name: string;
    location: string;
    ranking: string;
    features: string[];
  } | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    if (collegeName) {
      const decodedCollegeName = decodeURIComponent(collegeName);
      
      const courses = coursesData.filter(course => 
        course.topColleges.some(college => college.name === decodedCollegeName)
      );
      
      if (courses.length > 0) {
        const college = courses[0].topColleges.find(col => col.name === decodedCollegeName);
        if (college) {
          setCollegeDetails(college);
        }
        
        setRelatedCourses(courses);
      }
    }
  }, [collegeName]);

  if (!collegeDetails) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <p>Loading college details...</p>
        </div>
      </div>
    );
  }

  const starRating = (4 + Math.random()).toFixed(1);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <AnimatedTransition>
          <Button 
            variant="outline" 
            onClick={() => navigate('/colleges')} 
            className="mb-6"
          >
            ← Back to Colleges
          </Button>
          
          <Card className="border-primary/20 shadow-lg animate-fade-in overflow-hidden mb-6">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{collegeDetails.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {collegeDetails.location}
                  </CardDescription>
                  <div className="flex items-center mt-2 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(Number(starRating)) ? 'fill-amber-500' : 'fill-none'}`} 
                      />
                    ))}
                    <span className="ml-1 text-sm">{starRating}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start mb-4 bg-muted/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="placement">Placement</TabsTrigger>
              <TabsTrigger value="alumni">Alumni</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    College Profile
                  </h3>
                  <Card className="bg-muted/30 border-primary/10 h-full">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">About:</h4>
                          <p>
                            {collegeDetails.name} is a prestigious institution known for 
                            excellence in education and research. The college offers a diverse 
                            range of programs with state-of-the-art facilities.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Key Features:</h4>
                          <ul className="space-y-1">
                            {collegeDetails.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Highlights
                  </h3>
                  <Card className="bg-muted/30 border-primary/10 h-full">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background rounded-lg p-3 shadow-sm">
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Established</h4>
                          <p className="font-semibold">1965</p>
                        </div>
                        
                        <div className="bg-background rounded-lg p-3 shadow-sm">
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Students</h4>
                          <p className="font-semibold">5,000+</p>
                        </div>
                        
                        <div className="bg-background rounded-lg p-3 shadow-sm">
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Faculty</h4>
                          <p className="font-semibold">300+</p>
                        </div>
                        
                        <div className="bg-background rounded-lg p-3 shadow-sm">
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Campus Size</h4>
                          <p className="font-semibold">500 acres</p>
                        </div>
                        
                        <div className="bg-background rounded-lg p-3 shadow-sm">
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Placement</h4>
                          <p className="font-semibold">95%</p>
                        </div>
                        
                        <div className="bg-background rounded-lg p-3 shadow-sm">
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Accreditation</h4>
                          <p className="font-semibold">A+ Grade</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="courses" className="mt-0">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Available Courses
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedCourses.map((course) => (
                  <Card key={course.id} className="hover:border-primary transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{course.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {course.level}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{course.duration} • {course.field}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Minimum Cut-off:</h4>
                          <div className="text-sm flex items-center">
                            <span className="font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                              {(parseInt(Math.random() * 5 + 93 + "") + "%")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="placement" className="mt-0">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Placement Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-muted hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle>Placement Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span>Placement Rate</span>
                        <span className="font-semibold text-primary">95%</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Average Package</span>
                        <span className="font-semibold text-primary">₹12 LPA</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Highest Package</span>
                        <span className="font-semibold text-primary">₹45 LPA</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Companies Visited</span>
                        <span className="font-semibold text-primary">150+</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle>Top Recruiters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>Google</li>
                      <li>Microsoft</li>
                      <li>Amazon</li>
                      <li>Adobe</li>
                      <li>Goldman Sachs</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="alumni" className="mt-0">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Notable Alumni
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-muted hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                        <img 
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop" 
                          alt="Sundar Pichai" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle>Sundar Pichai</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">CEO of Google</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&h=250&fit=crop" 
                          alt="Satya Nadella" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle>Satya Nadella</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">CEO of Microsoft</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop" 
                          alt="N. R. Narayana Murthy" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle>N. R. Narayana Murthy</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Co-founder of Infosys</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-muted hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                        <img 
                          src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&h=250&fit=crop" 
                          alt="Nandan Nilekani" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle>Nandan Nilekani</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Co-founder of Infosys</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default CollegeDetailsPage;
