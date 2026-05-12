"use client"



import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Globe, 
  BookOpen, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  MessageCircle,
  Lightbulb
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("mission")

  const stats = [
    { number: "50,000+", label: "Active Learners", icon: Users },
    { number: "25+", label: "Languages", icon: Globe },
    { number: "500+", label: "Courses", icon: BookOpen },
    { number: "98%", label: "Success Rate", icon: Award }
  ]

  const values = [
    {
      icon: Heart,
      title: "Passion for Learning",
      description: "We believe everyone deserves access to quality language education that's engaging and effective."
    },
    {
      icon: Target,
      title: "Results-Driven",
      description: "Our methods are backed by research and designed to help you achieve your language goals faster."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Learning is better together. We foster a supportive community where learners help each other grow."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We constantly evolve our platform with cutting-edge technology to enhance your learning experience."
    }
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former language teacher with 10+ years of experience in educational technology.",
      avatar: "SC",
      expertise: ["Educational Technology", "Language Learning", "Product Strategy"]
    },
    {
      name: "Marcus Johnson",
      role: "CTO & Co-Founder",
      bio: "Full-stack developer passionate about creating scalable learning platforms.",
      avatar: "MJ",
      expertise: ["Software Engineering", "AI/ML", "Platform Architecture"]
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Content",
      bio: "Linguist and curriculum designer with expertise in multiple languages.",
      avatar: "ER",
      expertise: ["Linguistics", "Curriculum Design", "Content Strategy"]
    },
    {
      name: "David Kim",
      role: "Head of Community",
      bio: "Community builder focused on creating meaningful learning connections.",
      avatar: "DK",
      expertise: ["Community Management", "User Experience", "Social Learning"]
    }
  ]

  const timeline = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Founded with a vision to make language learning accessible to everyone worldwide."
    },
    {
      year: "2021",
      title: "First 1,000 Users",
      description: "Launched our beta platform and welcomed our first community of language learners."
    },
    {
      year: "2022",
      title: "AI Integration",
      description: "Introduced AI-powered personalized learning paths and adaptive assessments."
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Expanded to 25+ languages and reached learners in 50+ countries."
    },
    {
      year: "2024",
      title: "Next Generation",
      description: "Launched advanced features including 1-on-1 tutoring and team management."
    }
  ]

  const tabs = [
    { id: "mission", label: "Our Mission", icon: Target },
    { id: "story", label: "Our Story", icon: BookOpen },
    { id: "team", label: "Our Team", icon: Users },
    { id: "impact", label: "Our Impact", icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About Step by Step English
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're on a mission to break down language barriers and connect people through the power of learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6">
                Explore Our Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="btn-outline-primary text-lg px-8 py-6">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Know Your Instructor Section */}
      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animation-delay-2000"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2rem] rotate-6 opacity-40 group-hover:rotate-12 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-pink-500 to-indigo-500 rounded-[2rem] -rotate-3 opacity-40 group-hover:-rotate-6 transition-all duration-500"></div>
              <img 
                src="/about-us-image.jpg" 
                alt="Meet your guide" 
                className="relative z-10 w-full h-auto object-cover rounded-[2rem] shadow-2xl border-4 border-white transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <Badge className="px-4 py-2 text-sm border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 bg-white">
                <Star className="h-4 w-4 mr-2" />
                Meet Your Guide
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Know Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Instructor</span>
              </h2>
              <div className="space-y-4">
                <p className="text-xl text-gray-900 font-medium leading-relaxed">
                  Labas, aš Evelina — anglų kalbos mokytoja ir nuotolinės anglų kalbos mokyklos kūrėja. 👋
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Padedu suaugusiems mokytis anglų kalbos aiškiai, praktiškai ir be baimės kalbėti.
                  Tikiu, kad kiekvienas gali išmokti kalbėti angliškai, kai mokymasis tampa suprantamas, pritaikytas žmogui ir paremtas realiu naudojimu, o ne vien teorija.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Pamokose orientuojuosi ne tik į gramatiką ar taisykles, bet ir į pasitikėjimą savimi kalbant. Man svarbu, kad mokiniai jaustųsi jaukiai, nebijotų klysti ir matytų realų progresą kasdienėje anglų kalboje.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Dirbdama su mokiniais pastebėjau, kad daugeliui trūksta ne gebėjimų, o aiškios sistemos, praktikos ir palaikymo. Todėl kuriu mokymosi erdvę, kur anglų kalba tampa paprastesnė, artimesnė ir lengviau pritaikoma gyvenime.
                </p>
                <div className="text-lg text-gray-600 leading-relaxed">
                  <p className="mb-2 text-gray-900 font-medium">Čia rasi:</p>
                  <ul className="space-y-1">
                    <li>✨ individualias anglų kalbos pamokas,</li>
                    <li>✨ praktišką ir šiuolaikišką mokymosi metodą,</li>
                    <li>✨ palaikančią aplinką augti,</li>
                    <li>✨ bei turinį, kuris padeda mokytis natūraliai.</li>
                  </ul>
                </div>
                <p className="text-lg font-medium text-indigo-700 leading-relaxed pt-2">
                  Mano tikslas — padėti tau ne tik mokytis anglų kalbos, bet ir ja naudotis užtikrintai. 
                </p>
              </div>
              <div className="pt-6">
                <Link href="/courses">
                  <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-6 text-lg">
                    Start Learning with Me
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabbed Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "mission" && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                  <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                    To democratize language learning by providing accessible, effective, and engaging educational experiences that empower people to connect across cultures and achieve their personal and professional goals.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">What We Believe</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Learning Should Be Accessible</p>
                          <p className="text-gray-600">Everyone deserves quality education regardless of their background or location.</p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Technology Enhances Learning</p>
                          <p className="text-gray-600">Smart tools and AI can personalize education and accelerate progress.</p>
                        </div>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Community Drives Success</p>
                          <p className="text-gray-600">Learning together creates stronger outcomes and lasting connections.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
                    <div className="space-y-6">
                      {values.map((value, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <value.icon className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                            <p className="text-gray-600">{value.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "story" && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                  <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                    From a small team with big dreams to a global platform transforming language education.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
                  <div className="space-y-8">
                    {timeline.map((item, index) => (
                      <div key={index} className="relative flex items-start space-x-6">
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {item.year}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
                  <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                    Passionate educators, engineers, and innovators working together to revolutionize language learning.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {team.map((member, index) => (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-indigo-600">{member.avatar}</span>
                        </div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription className="font-semibold text-indigo-600">{member.role}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                        <div className="space-y-2">
                          {member.expertise.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "impact" && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Impact</h2>
                  <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                    Real stories from real learners who've transformed their lives through language learning.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Career Growth</h3>
                        <p className="text-gray-600">85% of learners report career advancement</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">
                      "Learning Spanish through Step by Step English helped me land my dream job at an international company."
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <Globe className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Global Connections</h3>
                        <p className="text-gray-600">Connect with learners in 50+ countries</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">
                      "I've made friends from around the world while learning French. It's amazing!"
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Confidence Boost</h3>
                        <p className="text-gray-600">98% feel more confident speaking</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">
                      "I went from being afraid to speak to giving presentations in English at work."
                    </p>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Be part of a global movement that's breaking down language barriers and building bridges between cultures.
                  </p>
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Us?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your language learning journey today and become part of our global community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="btn-outline-white text-lg px-8 py-6">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
