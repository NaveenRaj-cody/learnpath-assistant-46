import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BriefcaseIcon, Building, LineChart, MapPin, TrendingUp, Users, GraduationCap, Award, Globe, Banknote } from 'lucide-react';
import { coursesData } from '@/data/coursesData';
import AnimatedTransition from '@/components/AnimatedTransition';
import StarRating from '@/components/StarRating';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CareerDetails {
  career: string;
  courses: {
    id: string;
    name: string;
    field: string;
  }[];
  description: string;
  skills: string[];
  jobMarket: {
    india: {
      demand: 'High' | 'Medium' | 'Low';
      locations: string[];
      companiesHiring: string[];
      salaryRange: {
        entry: string;
        mid: string;
        senior: string;
      };
    };
    global: {
      demand: 'High' | 'Medium' | 'Low';
      locations: string[];
      companiesHiring: string[];
      salaryRange: {
        entry: string;
        mid: string;
        senior: string;
      };
    };
  };
  futureOutlook: {
    shortTerm: string;
    longTerm: string;
    emergingTrends: string[];
  };
  education: {
    requiredDegrees: string[];
    certifications: string[];
    continuingEducation: string[];
  };
}

const careerDetailsData: Record<string, CareerDetails> = {
  "Software Engineer": {
    career: "Software Engineer",
    courses: [
      { id: "comp-science", name: "Computer Science", field: "engineering" },
      { id: "software-eng", name: "Software Engineering", field: "engineering" }
    ],
    description: "Software engineers design, develop, and maintain software systems and applications. They analyze user needs, write code, test software, and ensure that software performs correctly.",
    skills: ["Programming Languages (Java, Python, JavaScript)", "Data Structures & Algorithms", "Version Control", "Problem Solving", "Database Management", "Software Architecture"],
    jobMarket: {
      india: {
        demand: "High",
        locations: ["Bangalore", "Hyderabad", "Pune", "Delhi-NCR", "Chennai"],
        companiesHiring: ["TCS", "Infosys", "Wipro", "Google India", "Microsoft India", "Amazon India"],
        salaryRange: {
          entry: "₹4.5 - 8 LPA",
          mid: "₹10 - 18 LPA",
          senior: "₹25 - 40+ LPA"
        }
      },
      global: {
        demand: "High",
        locations: ["San Francisco", "Seattle", "New York", "London", "Berlin", "Singapore"],
        companiesHiring: ["Google", "Microsoft", "Amazon", "Meta", "Apple", "IBM"],
        salaryRange: {
          entry: "$70K - 120K",
          mid: "$120K - 180K",
          senior: "$180K - 300K+"
        }
      }
    },
    futureOutlook: {
      shortTerm: "Increasing demand for specialized skills in AI, cloud computing, and cybersecurity",
      longTerm: "Continued growth with focus on automation and AI integration across industries",
      emergingTrends: ["Low-code/No-code platforms", "AI-assisted development", "Edge computing", "Quantum computing"]
    },
    education: {
      requiredDegrees: ["B.Tech/B.E. in Computer Science", "BCA", "MCA", "M.Tech in Computer Science"],
      certifications: ["AWS Certified Developer", "Microsoft Certified: Azure Developer", "Google Cloud Professional Developer"],
      continuingEducation: ["Machine Learning specializations", "Cloud architecture", "Blockchain development"]
    }
  },
  "Data Scientist": {
    career: "Data Scientist",
    courses: [
      { id: "data-science", name: "Data Science", field: "science" },
      { id: "stats", name: "Statistics", field: "science" }
    ],
    description: "Data scientists analyze and interpret complex data to help organizations make better decisions. They use statistical methods, machine learning, and data visualization to extract insights from large datasets.",
    skills: ["Statistical Analysis", "Machine Learning", "Python/R Programming", "Data Visualization", "SQL", "Big Data Technologies"],
    jobMarket: {
      india: {
        demand: "High",
        locations: ["Bangalore", "Hyderabad", "Mumbai", "Delhi-NCR", "Pune"],
        companiesHiring: ["Amazon", "Flipkart", "Microsoft", "IBM", "Accenture", "MuSigma"],
        salaryRange: {
          entry: "₹6 - 12 LPA",
          mid: "₹15 - 25 LPA",
          senior: "₹30 - 50+ LPA"
        }
      },
      global: {
        demand: "High",
        locations: ["San Francisco", "New York", "Boston", "Seattle", "London", "Toronto"],
        companiesHiring: ["Google", "Amazon", "Microsoft", "Facebook", "IBM", "Netflix"],
        salaryRange: {
          entry: "$80K - 130K",
          mid: "$130K - 180K",
          senior: "$180K - 250K+"
        }
      }
    },
    futureOutlook: {
      shortTerm: "Rapid growth in demand as more companies adopt data-driven decision making",
      longTerm: "Evolution towards more specialized roles in AI ethics, machine learning operations, and domain-specific data science",
      emergingTrends: ["AutoML", "Explainable AI", "Real-time analytics", "Data ethics"]
    },
    education: {
      requiredDegrees: ["B.Tech/B.E. in Computer Science", "MSc in Statistics/Mathematics", "PhD in Computer Science/Statistics"],
      certifications: ["IBM Data Science Professional", "Microsoft Certified: Azure Data Scientist", "Google Professional Data Engineer"],
      continuingEducation: ["Deep learning specializations", "Natural language processing", "Computer vision"]
    }
  },
  "Doctor": {
    career: "Doctor",
    courses: [
      { id: "mbbs", name: "MBBS", field: "medicine" },
      { id: "md", name: "MD", field: "medicine" }
    ],
    description: "Doctors diagnose and treat illnesses, injuries, and medical conditions. They examine patients, prescribe medications, order diagnostic tests, provide preventive care, and counsel patients on health and wellness.",
    skills: ["Clinical Skills", "Diagnostic Reasoning", "Patient Communication", "Medical Knowledge", "Decision Making", "Empathy"],
    jobMarket: {
      india: {
        demand: "High",
        locations: ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Tier-II & III cities"],
        companiesHiring: ["Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "AIIMS", "Medanta", "Manipal Hospitals"],
        salaryRange: {
          entry: "₹6 - 12 LPA",
          mid: "₹15 - 30 LPA",
          senior: "₹40 - 80+ LPA"
        }
      },
      global: {
        demand: "High",
        locations: ["USA", "UK", "Canada", "Australia", "Germany", "UAE"],
        companiesHiring: ["Mayo Clinic", "Cleveland Clinic", "Johns Hopkins", "NHS (UK)", "Kaiser Permanente"],
        salaryRange: {
          entry: "$180K - 230K",
          mid: "$230K - 300K",
          senior: "$300K - 500K+"
        }
      }
    },
    futureOutlook: {
      shortTerm: "Growing demand for telemedicine and specialized services",
      longTerm: "Integration of AI in diagnostics and personalized medicine",
      emergingTrends: ["Telemedicine", "AI-assisted diagnostics", "Precision medicine", "Wearable health tech integration"]
    },
    education: {
      requiredDegrees: ["MBBS", "MD/MS", "DM/MCh (for super-specialization)"],
      certifications: ["National Board Certification", "Specialty Board Certifications"],
      continuingEducation: ["Fellowship programs", "Continuing Medical Education (CME)", "Specialized training"]
    }
  }
};

const CareerDetailsPage = () => {
  const { careerName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [careerDetails, setCareerDetails] = useState<CareerDetails | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState<'india' | 'global'>('global');
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const region = searchParams.get('region');
    setSelectedRegion(region === 'india' ? 'india' : 'global');

    if (careerName) {
      const decodedCareerName = decodeURIComponent(careerName);
      const details = careerDetailsData[decodedCareerName];
      
      if (details) {
        setCareerDetails(details);
      } else {
        const basicDetails: CareerDetails = {
          career: decodedCareerName,
          courses: coursesData
            .filter(course => course.careerProspects.includes(decodedCareerName))
            .map(course => ({ id: course.id, name: course.name, field: course.field })),
          description: `${decodedCareerName} is a professional role that requires specialized education and skills.`,
          skills: ["Technical Skills", "Communication", "Problem Solving", "Teamwork"],
          jobMarket: {
            india: {
              demand: "Medium",
              locations: ["Major Metropolitan Cities", "Tier-II Cities"],
              companiesHiring: ["Various Organizations"],
              salaryRange: {
                entry: "₹4 - 8 LPA",
                mid: "₹8 - 15 LPA",
                senior: "₹15 - 30+ LPA"
              }
            },
            global: {
              demand: "Medium",
              locations: ["Various Global Markets"],
              companiesHiring: ["International Organizations"],
              salaryRange: {
                entry: "$50K - 80K",
                mid: "$80K - 120K",
                senior: "$120K - 200K+"
              }
            }
          },
          futureOutlook: {
            shortTerm: "Steady growth in opportunities",
            longTerm: "Potential evolution with technological advancements",
            emergingTrends: ["Digital Transformation", "Remote Work", "Specialized Skills"]
          },
          education: {
            requiredDegrees: ["Bachelor's Degree", "Master's Degree (for advancement)"],
            certifications: ["Professional Certifications"],
            continuingEducation: ["Specialized Training", "Professional Development"]
          }
        };
        setCareerDetails(basicDetails);
      }
    }
  }, [careerName, location.search]);

  const handleRegionChange = (region: 'india' | 'global') => {
    setSelectedRegion(region);
    navigate(`/careers/${careerName}?region=${region}`);
  };

  if (!careerDetails) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <p>Loading career details...</p>
        </div>
      </div>
    );
  }

  const salaryDetails = {
    entry: careerDetails.jobMarket[selectedRegion].salaryRange.entry,
    mid: careerDetails.jobMarket[selectedRegion].salaryRange.mid,
    senior: careerDetails.jobMarket[selectedRegion].salaryRange.senior
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <AnimatedTransition>
          <Button 
            variant="outline" 
            onClick={() => navigate('/careers')} 
            className="mb-6"
          >
            ← Back to Careers
          </Button>
          
          <Card className="border-primary/20 shadow-lg animate-fade-in overflow-hidden mb-6">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-500/10">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{careerDetails.career}</CardTitle>
                  <CardDescription className="max-w-2xl">{careerDetails.description}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {careerDetails.courses[0]?.field || "Professional"}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 shadow-md mb-6 animate-fade-in overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-primary" />
                  Salary Insights ({selectedRegion === 'india' ? 'India' : 'Global'})
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsSalaryDialogOpen(true)}
                  className="text-xs"
                >
                  Detailed Comparison
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="text-center p-3 bg-muted/30 rounded-md">
                  <h4 className="text-xs text-muted-foreground mb-1">Entry Level</h4>
                  <p className="font-semibold text-primary">{salaryDetails.entry}</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-md">
                  <h4 className="text-xs text-muted-foreground mb-1">Mid Level</h4>
                  <p className="font-semibold text-primary">{salaryDetails.mid}</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-md">
                  <h4 className="text-xs text-muted-foreground mb-1">Senior Level</h4>
                  <p className="font-semibold text-primary">{salaryDetails.senior}</p>
                </div>
              </div>
              <div className="text-xs text-center text-muted-foreground mt-2">
                Salaries vary based on company, location, and experience
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <Tabs value={selectedRegion} onValueChange={(value) => handleRegionChange(value as 'india' | 'global')}>
              <TabsList>
                <TabsTrigger value="global" className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>Global</span>
                </TabsTrigger>
                <TabsTrigger value="india" className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>India</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-4 bg-muted/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
              <TabsTrigger value="market" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Job Market</TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Education</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BriefcaseIcon className="h-4 w-4 text-primary" />
                    Career Profile
                  </h3>
                  <Card className="bg-muted/30 border-primary/10">
                    <CardContent className="p-4">
                      <p className="mb-4">{careerDetails.description}</p>
                      <div>
                        <h4 className="font-medium mb-2">Key Skills Required:</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {careerDetails.skills.map((skill, index) => (
                            <Badge key={index} className="bg-secondary/20 text-secondary-foreground">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Related Courses:</h4>
                        <ul className="space-y-1">
                          {careerDetails.courses.map((course, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                              <span>{course.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-primary" />
                    Industry Overview
                  </h3>
                  <Card className="bg-muted/30 border-primary/10">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Demand:</h4>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-muted rounded-full">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ 
                                  width: careerDetails.jobMarket[selectedRegion].demand === 'High' 
                                    ? '90%' 
                                    : careerDetails.jobMarket[selectedRegion].demand === 'Medium' 
                                      ? '60%' 
                                      : '30%' 
                                }}
                              ></div>
                            </div>
                            <span className="font-medium text-sm">{careerDetails.jobMarket[selectedRegion].demand}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="market" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {selectedRegion === 'india' ? 'Indian' : 'Global'} Job Market
                  </h3>
                  <Card className="bg-muted/30 border-primary/10">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Top Companies Hiring:</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {careerDetails.jobMarket[selectedRegion].companiesHiring.map((company, index) => (
                              <Badge key={index} variant="outline" className="justify-start">
                                <Building className="h-3 w-3 mr-1" />
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="education" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Educational Requirements
                  </h3>
                  <Card className="bg-muted/30 border-primary/10">
                    <CardContent className="p-4">
                      <div>
                        <h4 className="font-medium mb-2">Required Degrees:</h4>
                        <ul className="space-y-1">
                          {careerDetails.education.requiredDegrees.map((degree, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                              <span>{degree}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Recommended Courses
                  </h3>
                  <Card className="bg-muted/30 border-primary/10">
                    <CardContent className="p-4">
                      <div>
                        <ul className="space-y-1">
                          {careerDetails.courses.map((course, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                              <span>{course.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </AnimatedTransition>
      </main>

      <Dialog open={isSalaryDialogOpen} onOpenChange={setIsSalaryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detailed Salary Information</DialogTitle>
            <DialogDescription>
              Salary ranges for {careerDetails.career} in different regions and experience levels
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Global Markets
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Entry Level:</p>
                    <div className="p-2 bg-muted rounded-md text-center">
                      {careerDetails.jobMarket.global.salaryRange.entry}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Mid Level:</p>
                    <div className="p-2 bg-muted rounded-md text-center">
                      {careerDetails.jobMarket.global.salaryRange.mid}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Senior Level:</p>
                  <div className="p-2 bg-muted rounded-md text-center">
                    {careerDetails.jobMarket.global.salaryRange.senior}
                  </div>
                </div>
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-1">Top Paying Locations:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {careerDetails.jobMarket.global.locations.slice(0, 3).map((location, i) => (
                      <Badge key={i} variant="outline" className="bg-green-500/10">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Indian Market
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Entry Level:</p>
                    <div className="p-2 bg-muted rounded-md text-center">
                      {careerDetails.jobMarket.india.salaryRange.entry}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Mid Level:</p>
                    <div className="p-2 bg-muted rounded-md text-center">
                      {careerDetails.jobMarket.india.salaryRange.mid}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Senior Level:</p>
                  <div className="p-2 bg-muted rounded-md text-center">
                    {careerDetails.jobMarket.india.salaryRange.senior}
                  </div>
                </div>
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-1">Top Paying Cities:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {careerDetails.jobMarket.india.locations.slice(0, 3).map((location, i) => (
                      <Badge key={i} variant="outline" className="bg-green-500/10">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium mb-1">Salary Growth Factors:</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Specialization in high-demand areas</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Advanced certifications and degrees</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Leadership and management experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Industry shifts and market demand</span>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareerDetailsPage;
