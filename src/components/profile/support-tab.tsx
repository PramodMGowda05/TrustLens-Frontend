"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Flag, Lightbulb, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";

export function SupportTab() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Reach out to us through any of the channels below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <Mail className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Support Email</p>
              <a href="mailto:support@trustlens.com" className="text-muted-foreground hover:text-primary">
                support@trustlens.com
              </a>
            </div>
          </div>
          <Separator />
          <div className="flex items-start gap-4">
            <Phone className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Helpline</p>
              <p className="text-muted-foreground">+91-8308294278</p>
              <p className="text-muted-foreground">+91-7795511344</p>
            </div>
          </div>
           <Separator />
           <div className="flex items-start gap-4">
            <Clock className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Support Hours</p>
              <p className="text-muted-foreground">Mon–Fri, 9 AM – 7 PM IST</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Our Offices</CardTitle>
           <CardDescription>Visit us at our locations in India.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                <div>
                    <p className="font-medium">Kolkata</p>
                    <p className="text-sm text-muted-foreground">2nd Floor, Tech Park, Salt Lake, Kolkata, West Bengal 700091, India</p>
                </div>
            </div>
            <Separator />
            <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                <div>
                    <p className="font-medium">Bengaluru</p>
                    <p className="text-sm text-muted-foreground">2nd floor, Esteem Regency, #6 Richmond Road, Bangalore - 560025, India</p>
                </div>
            </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <CardDescription>Have a question or a concern? Fill out the form below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Your message..." />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">We'll get back to you within 24 hours.</p>
            <Button>Send Message</Button>
        </CardFooter>
      </Card>

      {/* Help & Feedback */}
       <Card className="md:col-span-2">
        <CardHeader>
            <CardTitle>Help & Feedback</CardTitle>
            <CardDescription>Find answers or let us know how we can improve.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2"><Flag /> Report a Problem</Button>
                <Button variant="outline" className="w-full justify-start gap-2"><Lightbulb /> Request a Feature</Button>
            </div>
            <div className="flex flex-col space-y-2 text-sm font-medium">
                 <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><ExternalLink size={14}/> Help Center / FAQs</Link>
                 <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><ExternalLink size={14}/> Privacy Policy</Link>
                 <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><ExternalLink size={14}/> Terms of Service</Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
