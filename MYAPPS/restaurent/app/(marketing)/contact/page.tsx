import { Metadata } from "next";
import { Clock3, MapPin, Phone } from "lucide-react";

import { Section } from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  const mapEmbed = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED;

  return (
    <Section
      title="Contact & Location"
      subtitle="Reach us for catering, bulk orders, and quick support."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 pt-5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> +91 99999 99999
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Hyderabad, Telangana
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary" /> 7:00 AM - 10:00 PM (All days)
            </p>
            <p>
              WhatsApp orders are available for quick checkout and customer support.
            </p>
          </CardContent>
        </Card>

        <div className="overflow-hidden rounded-xl border border-border/60">
          <iframe
            title="Chinnamma Ruchulu Location"
            src={mapEmbed}
            width="100%"
            height="350"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Section>
  );
}
