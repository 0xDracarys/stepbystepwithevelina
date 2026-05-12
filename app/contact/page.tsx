"use client"



import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  ArrowRight,
  CheckCircle,
  Users,
  Headphones,
  BookOpen,
  Zap
} from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiryType: "general"
      })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      value: "hello@stepbystepenglish.com",
      action: "mailto:hello@stepbystepenglish.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our support team",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      value: "123 Learning Street, Education City, EC 12345",
      action: "https://maps.google.com"
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "We're here to help during these times",
      value: "Mon-Fri: 9AM-6PM PST\nSat: 10AM-4PM PST",
      action: null
    }
  ]

  const supportTopics = [
    {
      icon: BookOpen,
      title: "Course Support",
      description: "Help with courses, lessons, and learning materials",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      title: "Account Help",
      description: "Billing, subscriptions, and account management",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Zap,
      title: "Technical Issues",
      description: "App problems, bugs, and technical support",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Headphones,
      title: "General Inquiry",
      description: "Questions, feedback, and general information",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  const faqs = [
    {
      question: "How quickly do you respond to inquiries?",
      answer: "We typically respond to all inquiries within 24 hours during business days. For urgent technical issues, we have priority support available."
    },
    {
      question: "Do you offer phone support?",
      answer: "Yes! We offer phone support for Pro and Premium users. Free users can reach us via email and live chat."
    },
    {
      question: "Can I schedule a call with your team?",
      answer: "Absolutely! You can schedule a call with our team through our booking system. We offer 15-minute discovery calls and 30-minute consultation sessions."
    },
    {
      question: "What languages do you support for customer service?",
      answer: "We provide customer support in English, Spanish, French, German, and Portuguese. We're working on adding more languages!"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-12">
      {/* Hero Section */}
      <section className="pt-8 pb-4 px-4">
        <div className="container-custom max-w-6xl">
          <div className="flex flex-col md:flex-row items-stretch gap-8 bg-white/60 p-6 rounded-3xl shadow-sm border border-indigo-50">
            <div className="md:w-1/2 flex flex-col justify-between space-y-6">
              <div>
                <h1 className="heading-1 mb-4">
                  Get in <span className="gradient-text">Touch</span>
                </h1>
                <p className="body-large">
                  We'd love to hear from you! Whether you have questions, feedback, or need support, we're here to help.
                </p>
              </div>
              
              <div className="bg-white/80 p-5 rounded-2xl shadow-sm border border-indigo-50/50 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">How can we help?</h3>
                <div className="grid gap-3">
                  {supportTopics.map((topic, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className={`w-10 h-10 ${topic.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <topic.icon className={`w-5 h-5 ${topic.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{topic.title}</h4>
                        <p className="text-xs text-gray-500">{topic.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:w-1/2 w-full relative rounded-2xl overflow-hidden shadow-md">
              <img src="/contact-us.jpg" alt="Contact Us" className="absolute inset-0 w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-4">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="card-interactive text-center group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium group-hover:scale-110 transition-transform">
                    <info.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="heading-4 mb-2">{info.title}</CardTitle>
                  <CardDescription className="body-medium">{info.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {info.action ? (
                    <a 
                      href={info.action} 
                      className="text-indigo-600 hover:text-indigo-800 font-medium break-all body-medium"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 whitespace-pre-line body-medium">{info.value}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4">
        <div className="container-custom max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <h2 className="heading-2 mb-6">Send us a Message</h2>
              <p className="body-large mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {isSubmitted ? (
                <Card className="card-elevated p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="heading-3 mb-2">Message Sent!</h3>
                  <p className="body-medium">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </Card>
              ) : (
                <Card className="card-elevated p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="body-medium font-medium text-gray-700">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-2 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="body-medium font-medium text-gray-700">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-2 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="inquiryType" className="body-medium font-medium text-gray-700">Inquiry Type</Label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="mt-2 w-full h-12 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Question</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="body-medium font-medium text-gray-700">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="body-medium font-medium text-gray-700">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="mt-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              )}
            </div>

            {/* Support Topics & FAQ */}
            <div className="space-y-8">
              {/* Support Topics Moved to Hero */}

              {/* FAQ */}
              <div>
                <h3 className="heading-3 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index} className="card p-4">
                      <h4 className="heading-4 mb-2">{faq.question}</h4>
                      <p className="body-small">{faq.answer}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="gradient-primary rounded-2xl p-6 text-white shadow-strong">
                <h3 className="heading-3 mb-4">Need immediate help?</h3>
                <p className="body-medium text-indigo-100 mb-6">
                  Check out our help center for instant answers to common questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/help">
                                                 <Button className="btn-outline-white">
                               Help Center
                               <ArrowRight className="ml-2 h-4 w-4" />
                             </Button>
                  </Link>
                  <Link href="/courses">
                    <Button className="btn-outline-white">
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat CTA */}
      <section className="py-8 bg-white/50 mx-4 rounded-3xl mt-8">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="heading-2 mb-4">Prefer to chat?</h2>
            <p className="body-large mb-8">
              Our live chat support is available 24/7 for Pro and Premium users. 
              Get instant help with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary">
                Start Live Chat
                <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/pricing">
                                         <Button size="lg" className="btn-outline-primary">
                           Upgrade for Live Chat
                         </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
