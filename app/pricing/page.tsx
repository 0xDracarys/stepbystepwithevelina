"use client"



import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Users, BookOpen, Award, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started",
      icon: BookOpen,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      features: [
        "Access to 3 basic courses",
        "Community support",
        "Basic progress tracking",
        "Mobile app access",
        "Email support"
      ],
      limitations: [
        "Limited to 1 language",
        "No certificates",
        "Basic analytics"
      ],
      cta: "Get Started Free",
      href: "/auth/register",
      popular: false
    },
    {
      name: "Pro",
      price: { monthly: 19, annual: 15 },
      description: "Most popular for serious learners",
      icon: Zap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      features: [
        "Unlimited courses",
        "All languages available",
        "Advanced progress tracking",
        "Downloadable certificates",
        "Priority support",
        "Advanced analytics",
        "Offline mode",
        "Personal study plans"
      ],
      limitations: [],
      cta: "Start Pro Trial",
      href: "/auth/register?plan=pro",
      popular: true
    },
    {
      name: "Premium",
      price: { monthly: 39, annual: 29 },
      description: "For professionals and educators",
      icon: Crown,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: [
        "Everything in Pro",
        "1-on-1 tutoring sessions",
        "Custom learning paths",
        "Team management",
        "API access",
        "White-label options",
        "Advanced reporting",
        "Dedicated success manager"
      ],
      limitations: [],
      cta: "Go Premium",
      href: "/auth/register?plan=premium",
      popular: false
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content: "Step by Step English helped me learn Lithuanian in just 3 months! The interactive lessons are amazing.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "Language Teacher",
      content: "As a teacher, I love the course creation tools. My students are more engaged than ever.",
      rating: 5,
      avatar: "MJ"
    },
    {
      name: "Elena Rodriguez",
      role: "Business Owner",
      content: "The premium features saved me months of learning time. Worth every penny!",
      rating: 5,
      avatar: "ER"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h1 className="heading-1 mb-6">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="body-large mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your language learning journey. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${!isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAnnual ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Save 20%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl ${plan.popular ? 'ring-2 ring-indigo-500 shadow-lg' : ''
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${plan.bgColor} flex items-center justify-center`}>
                    <plan.icon className={`w-8 h-8 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-gray-600">/month</span>
                    {isAnnual && plan.price.annual !== plan.price.monthly && (
                      <div className="text-sm text-green-600 font-medium">
                        Billed annually (${plan.price.annual * 12}/year)
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-center space-x-3">
                            <span className="w-5 h-5 text-gray-400 flex-shrink-0">•</span>
                            <span className="text-gray-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Link href={plan.href} className="w-full">
                    <Button
                      className={`w-full ${plan.popular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Compare Features</h2>
          <div className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">Features</th>
                    <th className="text-center py-4 px-4 font-semibold">Free</th>
                    <th className="text-center py-4 px-4 font-semibold">Pro</th>
                    <th className="text-center py-4 px-4 font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Course Access", free: "3 courses", pro: "Unlimited", premium: "Unlimited" },
                    { feature: "Languages", free: "1 language", pro: "All languages", premium: "All languages" },
                    { feature: "Certificates", free: "❌", pro: "✅", premium: "✅" },
                    { feature: "Offline Mode", free: "❌", pro: "✅", premium: "✅" },
                    { feature: "1-on-1 Tutoring", free: "❌", pro: "❌", premium: "✅" },
                    { feature: "API Access", free: "❌", pro: "❌", premium: "✅" },
                    { feature: "Support", free: "Email", pro: "Priority", premium: "Dedicated" }
                  ].map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{row.feature}</td>
                      <td className="py-4 px-4 text-center">{row.free}</td>
                      <td className="py-4 px-4 text-center">{row.pro}</td>
                      <td className="py-4 px-4 text-center">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "Can I change my plan anytime?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Absolutely! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners who are already mastering new languages with Step by Step English.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" className="btn-outline-white text-lg px-8 py-6">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
