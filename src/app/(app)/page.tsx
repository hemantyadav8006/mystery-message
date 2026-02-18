"use client";

import { Mail, MessageSquare, Shield, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const SAMPLE_MESSAGES = [
  {
    title: "Message from Guest",
    content: "Hey, how are you doing today?",
    received: "1 day ago",
  },
  {
    title: "Message from SecretAdmirer",
    content: "I really liked your recent post!",
    received: "2 hours ago",
  },
  {
    title: "Message from MysteryGuest",
    content: "Do you have any book recommendations?",
    received: "10 hours ago",
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: "100% Anonymous",
    description: "Your identity stays hidden. Always.",
  },
  {
    icon: MessageSquare,
    title: "Real Feedback",
    description: "Get honest messages from people around you.",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description: "Stuck? Let AI suggest engaging questions.",
  },
];

export default function Home() {
  return (
    <>
      <main className="flex-grow">
        <section className="flex flex-col items-center justify-center px-4 py-20 md:py-28 bg-gradient-to-b from-background to-muted">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Explore the World of{" "}
              <span className="text-primary">Anonymous Feedback</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Mystery Message — where you get honest, unfiltered feedback
              without anyone revealing who they are.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-16">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="text-center border-border">
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-lg md:max-w-xl"
          >
            <CarouselContent>
              {SAMPLE_MESSAGES.map((message, index) => (
                <CarouselItem key={index} className="p-2">
                  <Card className="border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-start gap-3">
                      <Mail className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-foreground">{message.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Mystery Message | True Feedback. All
        rights reserved.
      </footer>
    </>
  );
}
