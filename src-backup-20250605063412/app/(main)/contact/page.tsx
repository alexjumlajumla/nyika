import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
        <p className="text-xl text-muted-foreground">We'd love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                Have questions about our safaris or need help with your booking? Fill out the form and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your dream safari..." 
                    rows={5} 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Office</CardTitle>
              <CardDescription>Visit us or reach out through any of these channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    Nyika Safaris Ltd<br />
                    123 Safari Road, Karen<br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-sm text-muted-foreground">
                    <a href="mailto:info@nyikasafaris.com" className="hover:underline">info@nyikasafaris.com</a><br />
                    <a href="mailto:bookings@nyikasafaris.com" className="hover:underline">bookings@nyikasafaris.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Call Us</h3>
                  <p className="text-sm text-muted-foreground">
                    <a href="tel:+254700000000" className="hover:underline">+254 700 000 000</a><br />
                    <a href="tel:+254711111111" className="hover:underline">+254 711 111 111</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Working Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 8:00 AM - 5:00 PM EAT<br />
                    Saturday: 9:00 AM - 2:00 PM EAT<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Find Us on Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-200">
                {/* Replace with actual map embed */}
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Map will be embedded here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
